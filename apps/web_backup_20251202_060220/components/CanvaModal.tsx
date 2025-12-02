'use client';

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Platform,
} from 'react-native';
import { X, ExternalLink } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeProvider';
import { useTranslation } from '@human-0/i18n';

interface CanvaModalProps {
  visible: boolean;
  onClose: () => void;
}

// English URLs
const EN_CANVA_EMBED_URL = 'https://www.canva.com/design/DAG6U0DxBrk/KlI63lxiGkAcJS0JoPSlyg/view?embed';
const EN_CANVA_VIEW_URL = 'https://www.canva.com/design/DAG6U0DxBrk/KlI63lxiGkAcJS0JoPSlyg/view?utm_content=DAG6U0DxBrk&utm_campaign=designshare&utm_medium=embeds&utm_source=link';

// Spanish URLs
const ES_CANVA_EMBED_URL = 'https://www.canva.com/design/DAG6QLZOVls/NPq4ifQhQMSn_tmDbrubmw/view?embed';
const ES_CANVA_VIEW_URL = 'https://www.canva.com/design/DAG6QLZOVls/NPq4ifQhQMSn_tmDbrubmw/view?utm_content=DAG6QLZOVls&utm_campaign=designshare&utm_medium=embeds&utm_source=link';

// German URLs
const DE_CANVA_EMBED_URL = 'https://www.canva.com/design/DAG6VYun2pE/LLCZDFsitDkSicRuPYog8Q/view?embed';
const DE_CANVA_VIEW_URL = 'https://www.canva.com/design/DAG6VYun2pE/LLCZDFsitDkSicRuPYog8Q/view?utm_content=DAG6VYun2pE&utm_campaign=designshare&utm_medium=embeds&utm_source=link';

export function CanvaModal({ visible, onClose }: CanvaModalProps) {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const { t, i18n } = useTranslation();
  
  // Determine language and URLs
  const isSpanish = i18n.language === 'es' || i18n.language.startsWith('es');
  const isGerman = i18n.language === 'de' || i18n.language.startsWith('de');
  
  let embedUrl, viewUrl;
  
  if (isSpanish) {
    embedUrl = ES_CANVA_EMBED_URL;
    viewUrl = ES_CANVA_VIEW_URL;
  } else if (isGerman) {
    embedUrl = DE_CANVA_EMBED_URL;
    viewUrl = DE_CANVA_VIEW_URL;
  } else {
    embedUrl = EN_CANVA_EMBED_URL;
    viewUrl = EN_CANVA_VIEW_URL;
  }

  const handleOpenInNewTab = () => {
    if (Platform.OS === 'web') {
      window.open(viewUrl, '_blank');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View
        className={`flex-1 justify-center items-center p-4 ${
          isDark ? 'bg-black/90' : 'bg-black/40'
        }`}
      >
        <View
          className={`border rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl ${
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
                {t('canvas.modal.title')}
              </Text>
              <Text
                className={`text-sm mt-1 ${
                  isDark ? 'text-emerald-300/70' : 'text-emerald-600/80'
                }`}
              >
                {t('canvas.modal.subtitle')}
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              {Platform.OS === 'web' && (
                <TouchableOpacity
                  onPress={handleOpenInNewTab}
                  className={`p-2 rounded-full border shrink-0 ${
                    isDark
                      ? 'bg-emerald-500/10 border-emerald-500/30'
                      : 'bg-emerald-100 border-emerald-400/70'
                  }`}
                >
                  <ExternalLink size={20} color={isDark ? '#10b981' : '#047857'} />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={onClose}
                className={`p-2 rounded-full border shrink-0 ${
                  isDark
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : 'bg-emerald-100 border-emerald-400/70'
                }`}
              >
                <X size={24} color={isDark ? '#10b981' : '#047857'} />
              </TouchableOpacity>
            </View>
          </View>

          {/* iframe Container */}
          <View className="flex-1 p-4" style={{ minHeight: 500 }}>
            {Platform.OS === 'web' ? (
              <>
                <div style={{
                  position: 'relative',
                  width: '100%',
                  height: 0,
                  paddingTop: '56.2500%',
                  paddingBottom: 0,
                  boxShadow: '0 2px 8px 0 rgba(63,69,81,0.16)',
                  marginTop: '1.6em',
                  marginBottom: '0.9em',
                  overflow: 'hidden',
                  borderRadius: '8px',
                  willChange: 'transform'
                }}>
                  <iframe
                    loading="lazy"
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      top: 0,
                      left: 0,
                      border: 'none',
                      padding: 0,
                      margin: 0
                    }}
                    src={embedUrl}
                    allowFullScreen={true}
                    allow="fullscreen"
                  />
                </div>
                {/* Attribution link */}
                <div className="mt-4 text-center">
                  <span
                    className={`text-sm ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    {t('canvas.modal.attribution')} -{' '}
                    <a 
                      href={`mailto:${isSpanish ? 'contacto@human0.me' : 'contact@human-0.com'}`} 
                      className="underline hover:text-blue-500 transition-colors"
                    >
                      {isSpanish ? 'contacto@human0.me' : 'contact@human0.me'}
                    </a>
                  </span>
                </div>
              </>
            ) : (
              <View className="flex-1 justify-center items-center p-8">
                <Text
                  className={`text-center text-lg mb-4 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}
                >
                  {t('canvas.modal.browserOnly')}
                </Text>
                <TouchableOpacity
                  onPress={handleOpenInNewTab}
                  className="bg-emerald-500 py-3 px-6 rounded-xl items-center flex-row gap-2"
                >
                  <ExternalLink size={20} color="white" />
                  <Text className="text-white font-bold text-base">
                    {t('canvas.modal.openInBrowser')}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default CanvaModal;
