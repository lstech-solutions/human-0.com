import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { X, ChevronRight, Users, Target, Lightbulb, Activity, DollarSign, MessageSquare, Building2, TrendingUp, BarChart3, PieChart, ArrowUpRight, Clock, Award, Zap } from 'lucide-react-native';
import { BarChart, LineChart as CustomLineChart, PieChart as CustomPieChart, ProgressRing, Sparkline } from './BeautifulCharts';

const { width, height } = Dimensions.get('window');

interface CanvasSection {
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
  icon: React.ReactNode;
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
  const handlePress = () => {
    onPress(section);
  };

  return (
    <View className="flex-1 m-2">
      <TouchableOpacity
        onPress={() => onPress(section)}
        className={`flex-1 m-2 bg-gradient-to-br from-space-dark to-space-darker border-2 ${section.borderColor} rounded-2xl p-4 justify-between`}
      >
        <View className="flex-1">
          <View className="flex-row items-start mb-2">
            <View className="mr-2">
              {React.cloneElement(section.icon as React.ReactElement, { 
                size: 20, 
                color: '#00FF9C' 
              })}
            </View>
            <View className="flex-1">
              <Text className={`${section.color} font-bold text-sm mb-1`}>
                {section.title}
              </Text>
            </View>
            <ChevronRight size={16} color="#00FF9C" className="opacity-60" />
          </View>
          
          <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={false} className="flex-1">
            <View className="flex-row items-start">
              <View className="w-2 h-2 bg-neon-green rounded-full mt-1 mr-2 flex-shrink-0" />
              <Text className="text-gray-300 text-xs leading-tight flex-1">
                {section.content.slice(0, 2).join(', ')}
                {section.content.length > 2 && '...'}
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
  if (!visible || !section) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, backgroundColor: '#0F172A' }}>
        <View style={{ flex: 1, marginTop: 0 }}>
          {/* Header */}
          <View className="flex-row justify-between items-center p-4 border-b border-neon-green/20">
            <View className="flex-1">
              <View className="flex-row items-center mb-1">
                {React.cloneElement(section?.icon || <View />, { 
                  size: 24, 
                  color: '#00FF9C',
                  className: 'mr-2' 
                })}
                <Text className="text-neon-green font-bold text-lg">
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
            <Text className="text-neon-green font-bold text-sm mb-3">Componentes Detallados</Text>
            {section.content.map((item, itemIndex) => (
              <View key={itemIndex} className="mb-4">
                <View className="flex-row items-start mb-2">
                  <View className="w-2 h-2 bg-neon-green rounded-full mt-2 mr-3" />
                  <Text className="text-gray-300 text-sm leading-relaxed flex-1">
                    {item}
                  </Text>
                </View>
                {itemIndex % 2 === 0 && (
                  <View className="ml-5 bg-neon-green/5 p-3 rounded-lg border-l-2 border-neon-green/50">
                    <Text className="text-gray-400 text-xs leading-relaxed">
                      💡 Insight: Este componente genera el {15 + itemIndex * 5}% del impacto total del área
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </ScrollView>

          {/* Metrics Dashboard */}
          <View className="p-4 border-b border-neon-green/20">
            <Text className="text-neon-green font-bold text-sm mb-3">Métricas Clave</Text>
            <View className="grid grid-cols-2 gap-3">
              <View className="bg-neon-green/10 p-3 rounded-xl border border-neon-green/30">
                <View className="flex-row items-center mb-1">
                  <TrendingUp size={16} color="#00FF9C" className="mr-1" />
                  <Text className="text-gray-400 text-xs">KPI Principal</Text>
                </View>
                <Text className="text-neon-green font-bold text-sm">{section.metrics.kpi}</Text>
              </View>
              <View className="bg-neon-green/10 p-3 rounded-xl border border-neon-green/30">
                <View className="flex-row items-center mb-1">
                  <ArrowUpRight size={16} color="#00FF9C" className="mr-1" />
                  <Text className="text-gray-400 text-xs">Crecimiento</Text>
                </View>
                <Text className="text-neon-green font-bold text-sm">{section.metrics.growth}</Text>
              </View>
              <View className="bg-neon-green/10 p-3 rounded-xl border border-neon-green/30">
                <View className="flex-row items-center mb-1">
                  <Zap size={16} color="#00FF9C" className="mr-1" />
                  <Text className="text-gray-400 text-xs">Eficiencia</Text>
                </View>
                <Text className="text-neon-green font-bold text-sm">{section.metrics.efficiency}</Text>
              </View>
              <View className="bg-neon-green/10 p-3 rounded-xl border border-neon-green/30">
                <View className="flex-row items-center mb-1">
                  <Target size={16} color="#00FF9C" className="mr-1" />
                  <Text className="text-gray-400 text-xs">Objetivo</Text>
                </View>
                <Text className="text-neon-green font-bold text-sm">{section.metrics.target}</Text>
              </View>
            </View>
          </View>

          </View>

      </View>
    </Modal>
  );
};

export { ExpandableCanvasSection, SectionModal };
