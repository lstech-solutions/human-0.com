"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { TrendingUp, Target, FileText, Download, Eye, ExternalLink } from 'lucide-react-native';

export interface SummaryAction {
  id: string;
  title: string;
  icon: React.ReactNode;
  action: {
    type: 'navigate' | 'download' | 'view' | 'manifesto' | 'canvas';
    target?: string;
    label?: string;
  };
}

interface AnimatedSummaryRowProps {
  actions: SummaryAction[];
  onAction: (action: SummaryAction['action']) => void;
  className?: string;
}

export default function AnimatedSummaryRow({ actions, onAction, className = '' }: AnimatedSummaryRowProps) {
  const handlePress = (action: SummaryAction) => {
    // Prevent event propagation
    onAction(action.action);
  };

  return (
    <View className={`px-4 pb-4 relative z-20 ${className}`}>
      <View className="flex-row flex-wrap justify-center gap-3">
        {actions.map((action) => (
          <AnimatedButton
            key={action.id}
            title={action.title}
            icon={action.icon}
            onPress={() => handlePress(action)}
          />
        ))}
      </View>
    </View>
  );
}

interface AnimatedButtonProps {
  title: string;
  icon: React.ReactNode;
  onPress: () => void;
}

function AnimatedButton({ title, icon, onPress }: AnimatedButtonProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  // For React Native, we'll use a simpler animation since framer-motion is web-focused
  if (Platform.OS !== 'web') {
    return (
      <TouchableOpacity
        onPress={onPress}
        className="relative z-30"
        activeOpacity={0.8}
      >
        <View 
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-3 flex-row items-center shadow-lg shadow-black/20"
          style={{ minWidth: 120 }}
        >
          <View className="mr-2">{icon}</View>
          <Text className="text-human-primary text-sm font-semibold flex-1 text-center drop-shadow-md">
            {title}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  // Web version with framer-motion animations
  return (
    <motion.div
      initial={{ width: 64, height: 64 }}
      whileHover={{ width: 200 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center overflow-hidden relative cursor-pointer shadow-lg shadow-black/20 relative z-30"
      style={{ borderRadius: 32 }}
      onClick={(e) => {
        e.stopPropagation();
        onPress();
      }}
    >
      {/* Icon - fades out on hover */}
      <motion.div
        className="absolute"
        animate={{ 
          opacity: isHovered ? 0 : 1,
          scale: isHovered ? 0.8 : 1
        }}
        transition={{ duration: 0.2 }}
      >
        {icon}
      </motion.div>

      {/* Title - fades in on hover */}
      <motion.div
        className="w-full flex justify-center items-center px-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.2, delay: isHovered ? 0.1 : 0 }}
      >
        <span className="text-human-primary text-sm font-bold whitespace-nowrap text-center drop-shadow-md">
          {title}
        </span>
      </motion.div>
    </motion.div>
  );
}
