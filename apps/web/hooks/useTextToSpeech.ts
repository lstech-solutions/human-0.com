'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Platform } from 'react-native';

// Types for speech synthesis
export interface SpeechVoice {
  name: string;
  lang: string;
  localService: boolean;
  voiceURI: string;
}

export interface SpeechOptions {
  voice?: SpeechVoice | null;
  volume?: number;
  rate?: number;
  pitch?: number;
  lang?: string;
}

export interface UseTextToSpeechReturn {
  isSupported: boolean;
  isSpeaking: boolean;
  isPaused: boolean;
  isLoading: boolean;
  error: string | null;
  voices: SpeechVoice[];
  currentWord: number;
  totalWords: number;
  speak: (text: string, options?: SpeechOptions) => Promise<void>;
  pause: () => void;
  resume: () => void;
  cancel: () => void;
  getHawkingStyleVoice: (lang: string) => SpeechVoice | null;
  setSpeechRate: (rate: number) => void;
  setSpeechPitch: (pitch: number) => void;
}

// Enhanced voice parameters with customizable settings
const DEFAULT_VOICE_SETTINGS = {
  rate: 0.8, // Moderate speech rate
  pitch: 1.0, // Normal pitch
  volume: 0.9, // Clear volume
};

const HAWKING_VOICE_SETTINGS = {
  rate: 0.7, // Slower speech rate
  pitch: 0.8, // Lower pitch
  volume: 0.9, // Clear volume
};

const VOICE_PRESETS = {
  hawking: HAWKING_VOICE_SETTINGS,
  normal: DEFAULT_VOICE_SETTINGS,
  slow: { rate: 0.5, pitch: 1.0, volume: 0.9 },
  fast: { rate: 1.2, pitch: 1.1, volume: 0.9 },
  deep: { rate: 0.8, pitch: 0.7, volume: 0.9 },
  high: { rate: 0.9, pitch: 1.3, volume: 0.9 },
};

// Language mappings for Hawking-style voices
const HAWKING_VOICE_PREFERENCES = {
  'en': 'en-US',
  'en-US': 'en-US', 
  'en-GB': 'en-GB',
  'es': 'es-ES',
  'es-ES': 'es-ES',
  'es-MX': 'es-MX',
  'fr': 'fr-FR',
  'fr-FR': 'fr-FR',
  'de': 'de-DE',
  'de-DE': 'de-DE',
  'it': 'it-IT',
  'it-IT': 'it-IT',
  'pt': 'pt-BR',
  'pt-BR': 'pt-BR',
  'pt-PT': 'pt-PT',
  'zh': 'zh-CN',
  'zh-CN': 'zh-CN',
  'ja': 'ja-JP',
  'ja-JP': 'ja-JP',
  'ko': 'ko-KR',
  'ko-KR': 'ko-KR',
  'ar': 'ar-SA',
  'ar-SA': 'ar-SA',
};

export function useTextToSpeech(): UseTextToSpeechReturn {
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [voices, setVoices] = useState<SpeechVoice[]>([]);
  const [currentWord, setCurrentWord] = useState(0);
  const [totalWords, setTotalWords] = useState(0);
  
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const currentTextRef = useRef<string>('');
  const wordsRef = useRef<string[]>([]);
  const speechSettingsRef = useRef(DEFAULT_VOICE_SETTINGS);
  const timeIntervalRef = useRef<number | null>(null);

  // Initialize speech synthesis
  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const SpeechSynthesis = window.speechSynthesis;
      const SpeechSynthesisUtterance = window.SpeechSynthesisUtterance;
      
      if (SpeechSynthesis && SpeechSynthesisUtterance) {
        setIsSupported(true);
        synthRef.current = SpeechSynthesis;
        
        // Load available voices
        const loadVoices = () => {
          const availableVoices = SpeechSynthesis.getVoices().map(voice => ({
            name: voice.name,
            lang: voice.lang,
            localService: voice.localService,
            voiceURI: voice.voiceURI,
          }));
          setVoices(availableVoices);
        };

        // Voices load asynchronously
        if (SpeechSynthesis.getVoices().length > 0) {
          loadVoices();
        } else {
          SpeechSynthesis.addEventListener('voiceschanged', loadVoices);
        }

        return () => {
          SpeechSynthesis.removeEventListener('voiceschanged', loadVoices);
        };
      }
    }
  }, []);

  // Get Stephen Hawking style voice for a language
  const getHawkingStyleVoice = useCallback((lang: string): SpeechVoice | null => {
    const preferredLang = HAWKING_VOICE_PREFERENCES[lang as keyof typeof HAWKING_VOICE_PREFERENCES] || 'en-US';
    
    // Try to find a system voice that matches the language
    const systemVoice = voices.find(voice => 
      voice.lang.startsWith(preferredLang.split('-')[0]) ||
      voice.lang === preferredLang
    );
    
    if (systemVoice) {
      return systemVoice;
    }

    // Fallback to any available voice
    return voices.length > 0 ? voices[0] : null;
  }, [voices]);

  // Enhanced speak text with word tracking
  const speak = useCallback(async (text: string, options: SpeechOptions = {}) => {
    if (!isSupported || !synthRef.current) {
      setError('Speech synthesis not supported');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Cancel any ongoing speech
      synthRef.current.cancel();

      // Ensure text is a string and handle translation system
      const textString = typeof text === 'string' ? text : String(text);
      
      // Clean text for better word counting - simpler approach
      const cleanedText = textString
        .replace(/[^\w\s]/g, ' ') // Replace non-word, non-space chars with space
        .replace(/\s+/g, ' ')     // Replace multiple spaces with single space
        .trim();                  // Remove leading/trailing spaces
      
      // Store current text and prepare word tracking
      currentTextRef.current = textString; // Keep original for speech
      wordsRef.current = cleanedText.split(/\s+/).filter(word => word.length > 0);
      setTotalWords(wordsRef.current.length);
      setCurrentWord(1); // Start at word 1, not 0
      

      // Create new utterance
      const utterance = new window.SpeechSynthesisUtterance(textString);
      
      // Apply enhanced settings with better defaults
      const settings = speechSettingsRef.current;
      utterance.rate = options.rate ?? settings.rate;
      utterance.pitch = options.pitch ?? settings.pitch;
      utterance.volume = options.volume ?? settings.volume;
      
      // Set language
      const targetLang = options.lang || 'en-US';
      utterance.lang = targetLang;

      // Set voice
      const selectedVoice = options.voice || getHawkingStyleVoice(targetLang);
      if (selectedVoice) {
        const systemVoice = synthRef.current.getVoices().find(
          v => v.voiceURI === selectedVoice.voiceURI
        );
        if (systemVoice) {
          utterance.voice = systemVoice;
        }
      }

      // Enhanced event handlers with word tracking
      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
        setIsLoading(false);
        setCurrentWord(1); // Start at word 1, not 0
        
        // Start time-based fallback highlighting - synchronized with speech speed
        let wordIndex = 1; // Start from 1 to match setCurrentWord
        const speechRateMultiplier = utterance.rate || 1.0;
        // Use speech rate directly - no base multiplier needed for perfect sync
        const adjustedWordsPerSecond = speechRateMultiplier * 2.0; // Base 2.0 wps at 1x speed
        const intervalMs = 1000 / adjustedWordsPerSecond;
        
        timeIntervalRef.current = setInterval(() => {
          if (wordIndex <= wordsRef.current.length) {
            setCurrentWord(wordIndex);
            wordIndex++;
          } else {
            if (timeIntervalRef.current) {
              clearInterval(timeIntervalRef.current);
              timeIntervalRef.current = null;
            }
          }
        }, intervalMs);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
        // Don't reset currentWord on end - preserve position for potential resume
        speechRef.current = null;
        if (timeIntervalRef.current) {
          clearInterval(timeIntervalRef.current);
        }
      };

      utterance.onerror = (event) => {
        setError(`Speech error: ${event.error}`);
        setIsSpeaking(false);
        setIsPaused(false);
        setIsLoading(false);
        // Don't reset currentWord on error - preserve position for potential resume
        speechRef.current = null;
        if (timeIntervalRef.current) {
          clearInterval(timeIntervalRef.current);
        }
      };

      utterance.onpause = () => {
        setIsPaused(true);
        if (timeIntervalRef.current) {
          clearInterval(timeIntervalRef.current);
          timeIntervalRef.current = null;
        }
      };

      utterance.onresume = () => {
        setIsPaused(false);
        // Restart time-based highlighting when resumed - synchronized with speech speed
        let wordIndex = currentWord; // Resume from current position
        const speechRateMultiplier = utterance.rate || 1.0;
        // Use speech rate directly - no base multiplier needed for perfect sync
        const adjustedWordsPerSecond = speechRateMultiplier * 2.0; // Base 2.0 wps at 1x speed
        const intervalMs = 1000 / adjustedWordsPerSecond;
        
        timeIntervalRef.current = setInterval(() => {
          if (wordIndex < wordsRef.current.length) {
            wordIndex++;
            setCurrentWord(wordIndex);
          } else {
            if (timeIntervalRef.current) {
              clearInterval(timeIntervalRef.current);
              timeIntervalRef.current = null;
            }
          }
        }, intervalMs);
      };

      // Word boundary tracking for progress
      utterance.onboundary = (event) => {
        if (event.name === 'word') {
          const charIndex = event.charIndex;
          const textUpToChar = cleanedText.substring(0, charIndex);
          const wordCount = textUpToChar.split(/\s+/).filter(word => word.length > 0).length;
          const newWordIndex = Math.max(1, wordCount);
          
          // Update current word if different
          if (newWordIndex !== currentWord) {
            setCurrentWord(newWordIndex);
          }
        }
      };

      speechRef.current = utterance;
      synthRef.current.speak(utterance);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown speech error');
      setIsLoading(false);
    }
  }, [isSupported, getHawkingStyleVoice]);

  // Pause speech
  const pause = useCallback(() => {
    if (synthRef.current && isSpeaking && !isPaused) {
      synthRef.current.pause();
    }
  }, [isSpeaking, isPaused]);

  // Resume speech
  const resume = useCallback(() => {
    if (synthRef.current && isSpeaking && isPaused) {
      synthRef.current.resume();
    }
  }, [isSpeaking, isPaused]);

  // Cancel speech
  const cancel = useCallback(() => {
    console.log('CANCEL FUNCTION CALLED - aggressive stop');
    
    if (synthRef.current) {
      try {
        // Cancel immediately
        synthRef.current.cancel();
        
        // Force cancel repeatedly
        for (let i = 0; i < 5; i++) {
          setTimeout(() => {
            if (synthRef.current) {
              synthRef.current.cancel();
            }
          }, i * 10);
        }
      } catch (error) {
        console.error('Error canceling speech:', error);
      }
    }
    
    // Reset all state immediately and aggressively
    setIsSpeaking(false);
    setIsPaused(false);
    setCurrentWord(0);
    setTotalWords(0);
    speechRef.current = null;
    
    // Clear interval multiple times
    if (timeIntervalRef.current) {
      clearInterval(timeIntervalRef.current);
      timeIntervalRef.current = null;
    }
    
    // Force state reset again after delay
    setTimeout(() => {
      setIsSpeaking(false);
      setIsPaused(false);
      setCurrentWord(0);
      setTotalWords(0);
    }, 50);
  }, []);

  // Enhanced speech control functions
  const setSpeechRate = useCallback((rate: number) => {
    speechSettingsRef.current = { ...speechSettingsRef.current, rate };
  }, []);

  const setSpeechPitch = useCallback((pitch: number) => {
    speechSettingsRef.current = { ...speechSettingsRef.current, pitch };
  }, []);

  return {
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
  };
}

// Type declarations for Web Speech API
declare global {
  interface Window {
    SpeechSynthesisUtterance: typeof SpeechSynthesisUtterance;
  }
}

// Export the type for external use
export type SpeechSynthesisType = SpeechSynthesis;
export type SpeechSynthesisUtteranceType = SpeechSynthesisUtterance;
