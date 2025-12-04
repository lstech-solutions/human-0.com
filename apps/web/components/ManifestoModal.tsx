'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Platform,
} from 'react-native';
import { X, Play, Pause, Square, Volume2, Gauge } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeProvider';
import { useTranslation } from '@human-0/i18n';
import { useTextToSpeech } from '../hooks/useTextToSpeech';

const STORAGE_KEY = 'human0_manifesto_dismissed';

interface ManifestoModalProps {
  onClose: () => void;
}

export function ManifestoModal({ onClose }: ManifestoModalProps) {
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState<number | null>(null);
  const [localSpeechRate, setLocalSpeechRate] = useState(1.0);
  const [localSpeechPitch, setLocalSpeechPitch] = useState(1.0);
  const [showSpeedControl, setShowSpeedControl] = useState(false);
  const speedOptions = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
  
  const cycleSpeed = () => {
    const currentIndex = speedOptions.indexOf(localSpeechRate);
    const nextIndex = (currentIndex + 1) % speedOptions.length;
    const newSpeed = speedOptions[nextIndex];
    setLocalSpeechRate(newSpeed);
    setSpeechRate(newSpeed);
  };
  const scrollViewRef = useRef<ScrollView>(null);
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const { t } = useTranslation();
  
  const {
    isSupported,
    isSpeaking,
    isPaused,
    isLoading,
    error,
    voices,
    currentWord,
    totalWords,
    speak,
    pause,
    resume,
    cancel,
    getHawkingStyleVoice,
    setSpeechRate,
    setSpeechPitch,
  } = useTextToSpeech();

  const handleClose = () => {
    cancel(); // Stop any ongoing speech
    if (dontShowAgain && Platform.OS === 'web') {
      try {
        localStorage.setItem(STORAGE_KEY, 'true');
      } catch (e) {
        // localStorage not available
      }
    }
    onClose();
  };

  // Get full manifesto text for continuous reading
  const getFullManifestoText = () => {
    const sections = [0, 1, 2, 3, 4, 5, 6, 7].map((index) => ({
      title: t(`manifesto.sections.${index}.title`),
      content: t(`manifesto.sections.${index}.content`),
    }));

    const fullText = [
      t('manifesto.header.title'),
      t('manifesto.header.tagline'),
      t('manifesto.header.subtitle'),
      ...sections.map(section => `${section.title}. ${section.content}`),
      t('manifesto.conclusion.title'),
      t('manifesto.conclusion.body'),
    ].join('\n\n');

    return fullText;
  };

  // Get section text for individual section reading
  const getSectionText = (index: number) => {
    const section = {
      title: t(`manifesto.sections.${index}.title`),
      content: t(`manifesto.sections.${index}.content`),
    };
    return `${section.title}. ${section.content}`;
  };

  // Auto-scroll to current section and highlighted word (disabled for full manifesto)
  const scrollToCurrentSection = useCallback(() => {
    // Only scroll for individual sections, not full manifesto
    if (scrollViewRef.current && currentSectionIndex !== null && currentSectionIndex !== -1 && isSpeaking) {
      // Individual section - more precise word-based scrolling
      const headerHeight = 200;
      const sectionHeight = 300;
      const wordsInSection = 90; // Approximate words in a section
      const wordProgress = Math.min(currentWord / wordsInSection, 1.0);
      const scrollPosition = headerHeight + (currentSectionIndex * sectionHeight) + (wordProgress * 150);
      
      scrollViewRef.current.scrollTo({
        x: 0,
        y: scrollPosition,
        animated: true,
      });
    }
  }, [currentSectionIndex, currentWord, isSpeaking]);

  // Auto-scroll when section or word changes (only for individual sections)
  useEffect(() => {
    if (isSpeaking && currentWord > 0 && currentSectionIndex !== -1) {
      const timeoutId = setTimeout(() => {
        scrollToCurrentSection();
      }, 100); // Faster response to word changes
      
      return () => clearTimeout(timeoutId);
    }
  }, [currentSectionIndex, currentWord, isSpeaking, scrollToCurrentSection]);

  // Speech control handlers
  const handleSpeakFullManifesto = async () => {
    const fullText = getFullManifestoText();
    setSpeechRate(localSpeechRate);
    setSpeechPitch(localSpeechPitch);
    await speak(fullText, { lang: t('common.language') });
    setCurrentSectionIndex(-1); // -1 indicates full manifesto
  };

  const handleSpeakSection = async (index: number) => {
    const sectionText = getSectionText(index); // Use title + content for full highlighting
    setSpeechRate(localSpeechRate);
    setSpeechPitch(localSpeechPitch);
    await speak(sectionText, { lang: t('common.language') });
    setCurrentSectionIndex(index);
  };

  const handleUnifiedButton = () => {
    if (!isSpeaking) {
      // Start speaking full manifesto
      handleSpeakFullManifesto();
    } else if (isPaused) {
      // Resume from pause
      resume();
    } else {
      // When playing, cycle speed instead of stopping
      cycleSpeed();
    }
  };

  const handleLongPress = () => {
    if (isSpeaking || isPaused) {
      handleStopSpeech();
    }
  };

  const handleStopSpeech = () => {
    // Cancel speech multiple times aggressively
    cancel();
    cancel();
    cancel();
    
    // Reset section index immediately
    setCurrentSectionIndex(null);
    
    // Force additional cancel attempts with delays
    setTimeout(() => {
      cancel();
      cancel();
    }, 10);
    setTimeout(() => {
      cancel();
      cancel();
    }, 50);
    setTimeout(() => {
      cancel();
      cancel();
    }, 100);
    setTimeout(() => {
      cancel();
    }, 200);
    setTimeout(() => {
      cancel();
    }, 500);
  };

  // Get the starting word position for each section in the full manifesto
  const getSectionTextStartWord = (sectionIndex: number) => {
    let startWord = 1;
    // Add header words (title, tagline, subtitle)
    startWord += t('manifesto.header.title').split(/\s+/).length;
    startWord += t('manifesto.header.tagline').split(/\s+/).length;
    startWord += t('manifesto.header.subtitle').split(/\s+/).length;
    
    // Add previous sections' words
    for (let i = 0; i < sectionIndex; i++) {
      startWord += getSectionText(i).split(/\s+/).length;
    }
    return startWord;
  };

  // Get current word position for display - context aware
  const getCurrentWordDisplay = () => {
    if (currentSectionIndex === -1) {
      // Full manifesto mode - show global position
      return `Word ${currentWord} of ${totalWords}`;
    } else if (currentSectionIndex !== null) {
      // Section mode - show position within current section
      const sectionText = manifestoSections[currentSectionIndex].content;
      const sectionWords = sectionText.split(/\s+/).length;
      const sectionCurrentWord = Math.max(1, currentWord - (manifestoSections[currentSectionIndex].title.split(/\s+/).length));
      return `Word ${sectionCurrentWord} of ${sectionWords}`;
    }
    return '';
  };
  const getCurrentReadingWords = (text: string) => {
    if (!isSpeaking || currentWord === 0 || totalWords === 0) {
      return '';
    }
    
    const textString = typeof text === 'string' ? text : String(text);
    const words = textString.split(/\s+/);
    const currentWordIndex = Math.min(currentWord - 1, words.length - 1);
    
    // Get current word + next 2 words
    const readingWords = words.slice(currentWordIndex, currentWordIndex + 3).join(' ');
    return readingWords;
  };

  // Word tracking function to highlight current word
  const renderTextWithWordTracking = (text: string, textOffset: number = 0) => {
    if (!isSpeaking || currentWord === 0 || totalWords === 0) {
      return <Text className={isDark ? 'text-gray-300' : 'text-slate-700'}>{text}</Text>;
    }

    // Ensure text is a string
    const textString = typeof text === 'string' ? text : String(text);
    const words = textString.split(/\s+/);
    
    // Calculate which word in this specific text should be highlighted
    const currentWordIndex = currentWord - textOffset - 1; // -1 for 0-based array, -textOffset for position in this text
    
    // Only highlight if the current word is within this text
    if (currentWordIndex < 0 || currentWordIndex >= words.length) {
      return <Text className={isDark ? 'text-gray-300' : 'text-slate-700'}>{text}</Text>;
    }
    
    return (
      <Text className={isDark ? 'text-gray-300' : 'text-slate-700'}>
        {words.map((word, index) => (
          <Text key={index}>
            {index === currentWordIndex ? (
              <Text className={`font-bold text-lg bg-emerald-500/20 px-1 rounded ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>
                {word}
              </Text>
            ) : (
              <Text>{word}</Text>
            )}
            {index < words.length - 1 ? ' ' : ''}
          </Text>
        ))}
      </Text>
    );
  };

  const manifestoSections = [0, 1, 2, 3, 4, 5, 6, 7].map((index) => ({
    title: t(`manifesto.sections.${index}.title`),
    content: t(`manifesto.sections.${index}.content`),
  }));

  return (
    <Modal
      visible={true}
      animationType="fade"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View
        className={`flex-1 justify-center items-center p-4 ${
          isDark ? 'bg-black/90' : 'bg-black/40'
        }`}
      >
        <View
          className={`border rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl ${
            isDark
              ? 'bg-gradient-to-b from-[#0a0a0a] to-[#111] border-emerald-500/30'
              : 'bg-white border-emerald-500/20'
          }`}
        >
          {/* Header */}
          <View
            className={`flex-row items-center justify-between p-6 border-b ${
              isDark ? 'border-emerald-500/20' : 'border-emerald-500/10'
            }`}
          >
            <View className="flex-1 pr-4">
              <Text
                className={`text-2xl font-bold ${
                  isDark ? 'text-emerald-400' : 'text-emerald-700'
                }`}
              >
                {currentSectionIndex === -1 ? renderTextWithWordTracking(t('manifesto.header.title'), 0) : t('manifesto.header.title')}
              </Text>
              <Text
                className={`text-sm mt-1 ${
                  isDark ? 'text-emerald-300/70' : 'text-emerald-600/80'
                }`}
              >
                {currentSectionIndex === -1 ? renderTextWithWordTracking(t('manifesto.header.tagline'), t('manifesto.header.title').split(/\s+/).length) : t('manifesto.header.tagline')}
              </Text>
            </View>
            
            {/* Speech Controls */}
            {isSupported && (
              <View className="flex-row items-center justify-center space-x-3">
                {/* Unified Play/Pause/Speed Button */}
                <TouchableOpacity
                  onPress={handleUnifiedButton}
                  onPressIn={() => {}}
                  disabled={isLoading}
                  accessibilityLabel={!isSpeaking ? t('common.speech.playFull') : isPaused ? t('common.speech.resume') : t('common.speech.speedControl')}
                  accessibilityRole="button"
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  activeOpacity={0.6}
                  delayPressIn={0}
                  delayPressOut={0}
                  delayLongPress={0}
                  className={`px-3 py-2 rounded-full border flex-row items-center justify-center ${
                    !isSpeaking 
                      ? isDark
                        ? 'bg-emerald-500/20 border-emerald-500'
                        : 'bg-emerald-200 border-emerald-500'
                      : isPaused
                      ? isDark
                        ? 'bg-yellow-500/20 border-yellow-500'
                        : 'bg-yellow-200 border-yellow-500'
                      : isDark
                        ? 'bg-blue-500/20 border-blue-500'
                        : 'bg-blue-200 border-blue-500'
                  } ${isLoading ? 'opacity-50' : ''}`}
                >
                  {!isSpeaking ? (
                    <>
                      <Play size={16} color={isDark ? '#10b981' : '#047857'} />
                      <Text className={`ml-2 text-sm font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                        {localSpeechRate}x
                      </Text>
                    </>
                  ) : isPaused ? (
                    <>
                      <Play size={16} color={isDark ? '#eab308' : '#ca8a04'} />
                      <Text className={`ml-2 text-sm font-bold ${isDark ? 'text-yellow-400' : 'text-yellow-700'}`}>
                        {localSpeechRate}x
                      </Text>
                    </>
                  ) : (
                    <>
                      <Gauge size={16} color={isDark ? '#3b82f6' : '#2563eb'} />
                      <Text className={`ml-2 text-sm font-bold ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>
                        {localSpeechRate}x
                      </Text>
                    </>
                  )}
                </TouchableOpacity>

                {/* Stop Button - Only show when speaking or paused */}
                {(isSpeaking || isPaused) && (
                  <TouchableOpacity
                    onPress={handleStopSpeech}
                    onPressIn={() => {}}
                    accessibilityLabel={t('common.speech.stop')}
                    accessibilityRole="button"
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    activeOpacity={0.6}
                    delayPressIn={0}
                    delayPressOut={0}
                    delayLongPress={0}
                    className={`p-2 rounded-full border ${
                      isDark
                        ? 'bg-red-500/20 border-red-500'
                        : 'bg-red-200 border-red-500'
                    }`}
                  >
                    <Square size={16} color={isDark ? '#ef4444' : '#dc2626'} />
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>

          {/* Subtitle */}
          <View
            className={`px-6 py-4 ${
              isDark ? 'bg-emerald-500/5' : 'bg-emerald-50'
            }`}
          >
            <Text
              className={`text-center italic ${
                isDark ? 'text-emerald-200/80' : 'text-emerald-700'
              }`}
            >
              {currentSectionIndex === -1 ? renderTextWithWordTracking(t('manifesto.header.subtitle'), t('manifesto.header.title').split(/\s+/).length + t('manifesto.header.tagline').split(/\s+/).length) : t('manifesto.header.subtitle')}
            </Text>
          </View>

          {/* Content */}
          <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
            {/* Speech Status Indicator */}
            {isSupported && (isSpeaking || isPaused || isLoading) && (
              <View
                className={`mb-4 p-3 rounded-lg border ${
                  isDark
                    ? 'bg-emerald-500/10 border-emerald-500/20'
                    : 'bg-emerald-50 border-emerald-200'
                }`}
              >
                <View className="flex-row items-center">
                  {isLoading && (
                    <Text className={`text-sm ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                      🔄 Loading speech...
                    </Text>
                  )}
                  {isSpeaking && !isPaused && (
                    <View className="flex-1">
                      <Text className={`text-sm ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                        🔊 {currentSectionIndex === -1 ? 'Reading full manifesto' : currentSectionIndex !== null ? `Reading section ${currentSectionIndex + 1}` : 'Reading...'}
                      </Text>
                      {currentWord > 0 && totalWords > 0 && (
                        <Text className={`text-xs mt-1 ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>
                          {getCurrentWordDisplay()}
                        </Text>
                      )}
                    </View>
                  )}
                  {isPaused && (
                    <Text className={`text-sm ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>
                      ⏸️ Speech paused
                    </Text>
                  )}
                </View>
              </View>
            )}

            {/* Real-time reading display for full manifesto */}
            {currentSectionIndex === -1 && isSpeaking && (
              <View className={`mb-4 p-2 rounded-lg border ${
                isDark
                  ? 'bg-emerald-500/10 border-emerald-500/20'
                  : 'bg-emerald-50 border-emerald-200'
              }`}>
                <Text className={`text-sm font-medium ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                  📖 Reading: "{getCurrentReadingWords(getFullManifestoText())}"
                </Text>
              </View>
            )}

            {manifestoSections.map((section, index) => (
              <View
                key={index}
                className={`py-4 border-b ${
                  isDark ? 'border-emerald-500/10' : 'border-emerald-100'
                }`}
              >
                <View className="flex-row items-start justify-between mb-3">
                  <Text
                    className={`font-bold text-lg flex-1 mr-3 ${
                      isDark ? 'text-emerald-400' : 'text-emerald-800'
                    }`}
                  >
                    {currentSectionIndex === index ? renderTextWithWordTracking(section.title, 0) : currentSectionIndex === -1 ? renderTextWithWordTracking(section.title, getSectionTextStartWord(index)) : section.title}
                  </Text>
                  
                  {/* Section Speech Control */}
                  {isSupported && (
                    <TouchableOpacity
                      onPress={() => handleSpeakSection(index)}
                      disabled={isLoading}
                      accessibilityLabel={`${t('common.speech.playSection')} ${index + 1}`}
                      accessibilityRole="button"
                      className={`p-2 rounded-full border shrink-0 ${
                        currentSectionIndex === index
                          ? isDark
                            ? 'bg-emerald-500/20 border-emerald-500'
                            : 'bg-emerald-200 border-emerald-500'
                          : isDark
                          ? 'bg-emerald-500/10 border-emerald-500/30'
                          : 'bg-emerald-100 border-emerald-400/70'
                      } ${isLoading ? 'opacity-50' : ''}`}
                    >
                      <Volume2 
                        size={16} 
                        color={
                          currentSectionIndex === index
                            ? '#047857'
                            : isDark ? '#10b981' : '#047857'
                        } 
                      />
                    </TouchableOpacity>
                  )}
                </View>
                
                {/* Real-time reading display */}
                {currentSectionIndex === index && isSpeaking && (
                  <View className={`mb-2 p-2 rounded-lg border ${
                    isDark
                      ? 'bg-emerald-500/10 border-emerald-500/20'
                      : 'bg-emerald-50 border-emerald-200'
                  }`}>
                    <Text className={`text-sm font-medium ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                      📖 Reading: "{getCurrentReadingWords(getSectionText(index))}"
                    </Text>
                  </View>
                )}
                <Text
                  className={`leading-6 whitespace-pre-line font-inter ${
                    isDark ? 'text-gray-300' : 'text-slate-700'
                  }`}
                >
                  {(() => {
                    const titleWordCount = section.title.split(/\s+/).length;
                    const sectionStartWord = getSectionTextStartWord(index);
                    if (currentSectionIndex === index) {
                      return renderTextWithWordTracking(section.content, titleWordCount);
                    } else if (currentSectionIndex === -1) {
                      return renderTextWithWordTracking(section.content, sectionStartWord + titleWordCount);
                    } else {
                      return section.content;
                    }
                  })()}
                </Text>
              </View>
            ))}

            {/* Conclusion */}
            <View className="py-6 mb-4">
              <Text
                className={`font-bold text-xl mb-4 text-center ${
                  isDark ? 'text-emerald-400' : 'text-emerald-800'
                }`}
              >
                {t('manifesto.conclusion.title')}
              </Text>
              <View
                className={`p-4 rounded-xl border ${
                  isDark
                    ? 'bg-emerald-500/10 border-emerald-500/20'
                    : 'bg-emerald-50 border-emerald-200'
                }`}
              >
                <Text
                  className={`text-center leading-7 font-inter ${
                    isDark ? 'text-gray-200' : 'text-slate-800'
                  }`}
                >
                  {currentSectionIndex === -1 ? renderTextWithWordTracking(t('manifesto.conclusion.body')) : t('manifesto.conclusion.body')}
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Footer with checkbox */}
          <View
            className={`p-6 border-t ${
              isDark
                ? 'border-emerald-500/20 bg-[#0a0a0a]'
                : 'border-emerald-100 bg-slate-50'
            }`}
          >
            <TouchableOpacity
              onPress={() => setDontShowAgain(!dontShowAgain)}
              className="flex-row items-center justify-center mb-4"
            >
              <View
                className={`w-5 h-5 rounded border mr-3 items-center justify-center ${
                  dontShowAgain
                    ? 'bg-emerald-500 border-emerald-500'
                    : 'border-emerald-500/50'
                }`}
              >
                {dontShowAgain && (
                  <Text className="text-white text-xs font-bold">✓</Text>
                )}
              </View>
              <Text
                className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-slate-600'
                }`}
              >
                {t('manifesto.footer.dontShowAgain')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleClose}
              className="bg-emerald-500 py-3 px-6 rounded-xl items-center"
            >
              <Text className="text-white font-bold text-base">
                {t('manifesto.footer.enterCanvas')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export function useManifestoModal() {
  const [showModal, setShowModal] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'web') {
      try {
        const dismissed = localStorage.getItem(STORAGE_KEY);
        if (dismissed !== 'true') {
          setShowModal(true);
        }
        setChecked(true);
      } catch (e) {
        // localStorage not available, show modal
        setShowModal(true);
        setChecked(true);
      }
    } else {
      // On native, always show (or implement AsyncStorage)
      setShowModal(true);
      setChecked(true);
    }
  }, []);

  const closeModal = () => setShowModal(false);
  const openModal = () => setShowModal(true);

  return { showModal, closeModal, openModal, checked };
}

export default ManifestoModal;
