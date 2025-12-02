import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { TrendingUp, ChevronRight, Target, Award, FileText, Download, Eye } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeProvider';
import { useTranslation } from '@human-0/i18n';

export interface SummaryItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  items: {
    id: string;
    title: string;
    description?: string;
    action?: {
      type: 'navigate' | 'download' | 'view';
      target?: string;
      label?: string;
    };
  }[];
}

interface MultiSummarySectionProps {
  summaries: SummaryItem[];
  className?: string;
  onAction?: (action: SummaryItem['items'][0]['action']) => void;
}

export default function MultiSummarySection({ summaries, className = '', onAction }: MultiSummarySectionProps) {
  const { colorScheme } = useTheme();
  const { t } = useTranslation();
  const isDark = colorScheme === 'dark';
  const [expandedSummary, setExpandedSummary] = useState<string | null>(null);

  const handleSummaryPress = (summaryId: string) => {
    setExpandedSummary(expandedSummary === summaryId ? null : summaryId);
  };

  const handleItemAction = (item: any) => {
    if (!item.action) return;
    
    if (onAction) {
      onAction(item.action);
      return;
    }
    
    // Fallback handling if onAction not provided
    switch (item.action.type) {
      case 'navigate':
        console.log('Navigate to:', item.action.target);
        break;
      case 'download':
        console.log('Download:', item.action.target);
        break;
      case 'view':
        console.log('View:', item.action.target);
        break;
    }
  };

  const getActionIcon = (actionType?: string) => {
    switch (actionType) {
      case 'navigate':
        return <Eye size={14} color="#00FF9C" />;
      case 'download':
        return <Download size={14} color="#00FF9C" />;
      default:
        return null;
    }
  };

  const summaryTitleColorClass = isDark ? 'text-human-primary' : 'text-emerald-800';

  return (
    <View className={`px-4 pb-4 ${className}`}>
      {summaries.map((summary) => (
        <View key={summary.id} className="mb-3">
          <TouchableOpacity
            onPress={() => handleSummaryPress(summary.id)}
            className="bg-gradient-to-br from-space-dark to-space-darker border-2 border-neon-green/40 rounded-3xl p-4"
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                <View className="bg-neon-green/10 p-2 rounded-2xl border border-neon-green/30">
                  {summary.icon}
                </View>
                <Text className={`${summaryTitleColorClass} text-lg font-bold ml-3 flex-1`}>
                  {summary.title}
                </Text>
              </View>
              <ChevronRight 
                size={20} 
                color="#00FF9C" 
                style={{ 
                  transform: [{ rotate: expandedSummary === summary.id ? '90deg' : '0deg' }] 
                }} 
              />
            </View>
            
            {expandedSummary === summary.id && (
              <View className="bg-neon-green/10 p-4 rounded-xl border border-neon-green/30 w-full max-w-md mt-4">
                <ScrollView showsVerticalScrollIndicator={false}>
                  <View className="space-y-3">
                    {summary.items.map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        onPress={() => handleItemAction(item)}
                        className="flex-row items-center"
                        disabled={!item.action}
                      >
                        <View className="flex-row items-center flex-1">
                          <Target size={16} color="#00FF9C" className="mr-3" />
                          <View className="flex-1">
                            <Text className={`${isDark ? 'text-human-primary' : 'text-human-text-light'} text-sm font-inter`}>
                              {item.title}
                            </Text>
                            {item.description && (
                              <Text className={`${isDark ? 'text-gray-400' : 'text-gray-600'} text-xs font-inter mt-1`}>
                                {item.description}
                              </Text>
                            )}
                          </View>
                        </View>
                        {item.action && (
                          <View className="ml-2">
                            {getActionIcon(item.action.type)}
                          </View>
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>
            )}
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}
