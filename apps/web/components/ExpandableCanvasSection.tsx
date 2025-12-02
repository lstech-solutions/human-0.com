import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  useColorScheme,
} from 'react-native';
import { X, ChevronRight, Users, Target, Lightbulb, Activity, DollarSign, MessageSquare, Building2, TrendingUp, BarChart3, PieChart, ArrowUpRight, Clock, Award, Zap } from 'lucide-react-native';
import { BarChart, LineChart as CustomLineChart, PieChart as CustomPieChart, ProgressRing, Sparkline } from './BeautifulCharts';
import { useTheme } from '../theme/ThemeProvider';
import { useTranslation } from '@human-0/i18n';

const { width, height } = Dimensions.get('window');

export interface CanvasSection {
  id: string;
  title: string;
  subtitle: string;
  content: string[];
  metrics: {
    kpi: string;
    growth: string;
    efficiency: string;
    target: string;
  };
  chartData: {
    bar: number[];
    line: number[];
    pie: { name: string; value: number; color: string }[];
    sparklines: {
      adoption: number[];
      costs: number[];
    };
  };
  icon: React.ReactElement<{
    size?: number;
    color?: string;
    className?: string;
  }>;
  color: string;
  bgColor: string;
  borderColor: string;
}

interface ExpandableCanvasSectionProps {
  section: CanvasSection;
  index: number;
  onPress: (section: CanvasSection) => void;
}

const ExpandableCanvasSection: React.FC<ExpandableCanvasSectionProps> = ({ 
  section, 
  index, 
  onPress 
}) => {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';

  const cardBaseClass = isDark
    ? `bg-white/25 backdrop-blur-md border-2 border-white/30 shadow-lg shadow-black/20`
    : 'bg-white/40 backdrop-blur-md border border-white/40 shadow-lg shadow-black/10';

  const cardHoverClass = isDark
    ? 'hover:border-white/50 hover:bg-white/35 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30'
    : 'hover:border-white/60 hover:bg-white/50 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20';

  const downloadButtonClass = isDark
    ? 'hover:border-white/50 hover:bg-white/35 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/30'
    : 'hover:border-white/60 hover:bg-white/50 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20';

  const previewTextColorClass = isDark ? 'text-gray-100' : 'text-gray-900';
  const handlePress = () => {
    onPress(section);
  };

  // Ensure section.content is always a string[] for preview purposes
  const previewContent: string[] = Array.isArray(section.content)
    ? section.content
    : section.content
      ? (Object.values(section.content as Record<string, string>) as string[])
      : [];

  return (
    <View className="flex-1 m-2" style={{ minWidth: 150 }}>
      <TouchableOpacity
        onPress={() => onPress(section)}
        className={`flex-1 rounded-2xl p-4 justify-between transition-all duration-200 ease-out ${cardBaseClass}`}
      >
        <View className="flex-1">
          <View className="flex-row items-start justify-between mb-2">
            <View className="flex-row items-center flex-1">
              <View className="mr-2 opacity-70">
                {React.cloneElement(section.icon, { size: 16, color: isDark ? '#FFFFFF' : '#1F2937' })}
              </View>
              <Text
                className={`${isDark ? 'text-white' : 'text-black'} font-bold text-sm flex-1 drop-shadow-sm`}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {section.title}
              </Text>
            </View>
            <ChevronRight size={16} color={isDark ? "#FFFFFF" : "#1F2937"} className="opacity-80 ml-2" />
          </View>
          
          <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={false} className="flex-1 mt-2">
            <View style={{ gap: section.id === 'partners' ? 6 : 8 }}>
              {previewContent.slice(0, section.id === 'partners' ? 6 : 3).map((item, idx) => (
                <View key={idx} className="flex-row items-start">
                  <Text className={`${isDark ? 'text-white' : 'text-black'} text-base mr-2 flex-shrink-0 font-bold leading-tight drop-shadow-sm`}>•</Text>
                  <Text
                    className={`${previewTextColorClass} text-xs leading-snug flex-1 font-inter`}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {item}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </TouchableOpacity>
    </View>
  );
};

interface SectionModalProps {
  visible: boolean;
  section: CanvasSection | null;
  onClose: () => void;
}

const SectionModal: React.FC<SectionModalProps> = ({ visible, section, onClose }) => {
  const { colorScheme } = useTheme();
  const isDark = colorScheme === 'dark';
  const { t } = useTranslation();

  if (!visible || !section) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View
        style={{ flex: 1 }}
        className={isDark ? 'bg-human-bg-dark' : 'bg-human-bg-light'}
      >
        <View style={{ flex: 1, marginTop: 0 }}>
          {/* Header */}
          <View className="flex-row justify-between items-center p-4 border-b border-neon-green/20">
            <View className="flex-1">
              <View className="flex-row items-center mb-1">
                {React.cloneElement(section.icon, { 
                  size: 24, 
                  color: '#00FF9C',
                  className: 'mr-2' 
                })}
                <Text
                  className={`${
                    isDark ? 'text-human-primary' : 'text-black'
                  } font-bold text-lg`}
                >
                  {section?.title}
                </Text>
              </View>
              <Text className="text-gray-400 text-sm">
                {section?.subtitle}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} className="p-2">
              <X size={24} color="#00FF9C" />
            </TouchableOpacity>
          </View>

          {/* Detailed Content - First Section */}
          <ScrollView showsVerticalScrollIndicator={false} className="p-4">
            <Text
              className={`font-bold text-sm mb-3 ${
                isDark ? 'text-human-primary' : 'text-human-text-light'
              }`}
            >
              {t('canvas.modal.detailedComponents')}
            </Text>
            {(Array.isArray(section.content)
              ? section.content
              : section.content
                ? (Object.values(section.content as Record<string, string>) as string[])
                : []
            ).map((item, itemIndex) => (
              <View key={itemIndex} className="mb-4">
                <View className="flex-row items-start mb-2">
                  <View className="w-2 h-2 bg-neon-green rounded-full mt-2 mr-3" />
                  <Text
                    className={`text-sm leading-relaxed flex-1 font-inter ${
                      isDark ? 'text-human-text-dark' : 'text-human-text-light'
                    }`}
                  >
                    {item}
                  </Text>
                </View>
                {itemIndex % 2 === 0 && (
                  <View
                    className={`ml-5 bg-neon-green/10 p-3 rounded-2xl border border-neon-green/40 ${
                      isDark ? 'shadow-human-soft' : 'shadow-sm'
                    }`}
                    style={isDark ? { shadowColor: '#00FF9C' } : undefined}
                  >
                    <Text
                      className={`text-xs leading-relaxed font-inter ${
                        isDark ? 'text-human-muted-dark' : 'text-human-muted-light'
                      }`}
                    >
                      {t('canvas.modal.insight', {
                        percentage: 15 + itemIndex * 5,
                      })}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </ScrollView>

          {/* Metrics Dashboard */}
          <View className="p-4 border-b border-neon-green/20">
            <Text
              className={`font-bold text-sm mb-3 ${
                isDark ? 'text-human-primary' : 'text-human-text-light'
              }`}
            >
              {t('canvas.modal.metrics.title')}
            </Text>
            <View className="grid grid-cols-2 gap-3">
              <View className="bg-neon-green/10 p-3 rounded-xl border border-neon-green/30">
                <View className="flex-row items-center mb-1">
                  <TrendingUp size={16} color="#00FF9C" className="mr-1" />
                  <Text className="text-gray-400 text-xs">{t('canvas.modal.metrics.kpi')}</Text>
                </View>
                <Text
                  className={`font-bold text-sm ${
                    isDark ? 'text-human-primary' : 'text-black'
                  }`}
                >
                  {section.metrics.kpi}
                </Text>
              </View>
              <View className="bg-neon-green/10 p-3 rounded-xl border border-neon-green/30">
                <View className="flex-row items-center mb-1">
                  <ArrowUpRight size={16} color="#00FF9C" className="mr-1" />
                  <Text className="text-gray-400 text-xs">{t('canvas.modal.metrics.growth')}</Text>
                </View>
                <Text
                  className={`font-bold text-sm ${
                    isDark ? 'text-human-primary' : 'text-black'
                  }`}
                >
                  {section.metrics.growth}
                </Text>
              </View>
              <View className="bg-neon-green/10 p-3 rounded-xl border border-neon-green/30">
                <View className="flex-row items-center mb-1">
                  <Zap size={16} color="#00FF9C" className="mr-1" />
                  <Text className="text-gray-400 text-xs">{t('canvas.modal.metrics.efficiency')}</Text>
                </View>
                <Text
                  className={`font-bold text-sm ${
                    isDark ? 'text-human-primary' : 'text-black'
                  }`}
                >
                  {section.metrics.efficiency}
                </Text>
              </View>
              <View className="bg-neon-green/10 p-3 rounded-xl border border-neon-green/30">
                <View className="flex-row items-center mb-1">
                  <Target size={16} color="#00FF9C" className="mr-1" />
                  <Text className="text-gray-400 text-xs">{t('canvas.modal.metrics.target')}</Text>
                </View>
                <Text
                  className={`font-bold text-sm ${
                    isDark ? 'text-human-primary' : 'text-black'
                  }`}
                >
                  {section.metrics.target}
                </Text>
              </View>
            </View>
          </View>

          </View>

      </View>
    </Modal>
  );
};

export { ExpandableCanvasSection, SectionModal };
