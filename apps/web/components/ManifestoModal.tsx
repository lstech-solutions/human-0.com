'use client';

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Platform,
} from 'react-native';
import { X } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeProvider';
import { useTranslation } from '@human-0/i18n';

const STORAGE_KEY = 'human0_manifesto_dismissed';

interface ManifestoModalProps {
  onClose: () => void;
}

export function ManifestoModal({ onClose }: ManifestoModalProps) {
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const { t } = useTranslation();

  const handleClose = () => {
    if (dontShowAgain && Platform.OS === 'web') {
      try {
        localStorage.setItem(STORAGE_KEY, 'true');
      } catch (e) {
        // localStorage not available
      }
    }
    onClose();
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
                {t('manifesto.header.title')}
              </Text>
              <Text
                className={`text-sm mt-1 ${
                  isDark ? 'text-emerald-300/70' : 'text-emerald-600/80'
                }`}
              >
                {t('manifesto.header.tagline')}
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleClose}
              className={`ml-2 p-2 rounded-full border shrink-0 ${
                isDark
                  ? 'bg-emerald-500/10 border-emerald-500/30'
                  : 'bg-emerald-100 border-emerald-400/70'
              }`}
            >
              <X size={24} color={isDark ? '#10b981' : '#047857'} />
            </TouchableOpacity>
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
              {t('manifesto.header.subtitle')}
            </Text>
          </View>

          {/* Content */}
          <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
            {manifestoSections.map((section, index) => (
              <View
                key={index}
                className={`py-4 border-b ${
                  isDark ? 'border-emerald-500/10' : 'border-emerald-100'
                }`}
              >
                <Text
                  className={`font-bold text-lg mb-3 ${
                    isDark ? 'text-emerald-400' : 'text-emerald-800'
                  }`}
                >
                  {section.title}
                </Text>
                <Text
                  className={`leading-6 whitespace-pre-line font-inter ${
                    isDark ? 'text-gray-300' : 'text-slate-700'
                  }`}
                >
                  {section.content}
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
                  {t('manifesto.conclusion.body')}
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

  return { showModal, closeModal, checked };
}

export default ManifestoModal;
