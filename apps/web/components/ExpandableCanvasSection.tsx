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
    ? `bg-gradient-to-br from-space-dark to-space-darker border-2 ${section.borderColor}`
    : 'bg-human-surface-light border border-human-border';

  const cardHoverClass = isDark
    ? 'hover:border-human-primary hover:bg-human-surface-dark hover:-translate-y-0.5 hover:shadow-human-soft'
    : 'hover:border-human-primary hover:bg-white hover:-translate-y-0.5 hover:shadow-human-soft';

  const previewTextColorClass = isDark ? 'text-gray-300' : 'text-human-text-light';
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
        className={`flex-1 rounded-2xl p-4 justify-between transition-all duration-200 ease-out ${cardBaseClass} ${cardHoverClass}`}
      >
        <View className="flex-1">
          <View className="flex-row items-start mb-2">

            <View className="flex-1">
              <Text
                className={`${section.color} font-bold text-sm mb-1`}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {section.title}
              </Text>
            </View>
            <ChevronRight size={16} color="#00FF9C" className="opacity-60" />
          </View>
          
          <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={false} className="flex-1">
            <View className="flex-row items-start">
              <View className="w-2 h-2 bg-neon-green rounded-full mt-1 mr-2 flex-shrink-0" />
              <Text
                className={`${previewTextColorClass} text-xs leading-tight flex-1 font-inter`}
                numberOfLines={3}
                ellipsizeMode="tail"
              >
                {previewContent.slice(0, 2).join(', ')}
                {previewContent.length > 2 && '...'}
              </Text>
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
                    isDark ? 'text-human-primary' : 'text-emerald-900'
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
                    isDark ? 'text-human-primary' : 'text-emerald-900'
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
                    isDark ? 'text-human-primary' : 'text-emerald-900'
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
                    isDark ? 'text-human-primary' : 'text-emerald-900'
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
                    isDark ? 'text-human-primary' : 'text-emerald-900'
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
