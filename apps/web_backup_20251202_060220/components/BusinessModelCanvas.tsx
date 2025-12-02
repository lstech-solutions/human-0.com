import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { X, Users, Target, Lightbulb, Activity, DollarSign, MessageSquare, Building2 } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface CanvasBlock {
  id: string;
  title: string;
  content: string[];
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const BusinessModelCanvas: React.FC<{
  visible: boolean;
  onClose: () => void;
}> = ({ visible, onClose }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(height));
  const [blockAnimations, setBlockAnimations] = useState<{ [key: string]: Animated.Value }>({});

  const canvasBlocks: CanvasBlock[] = [
    {
      id: 'partners',
      title: 'Key Partners',
      content: [
        'Environmental NGOs',
        'Carbon Offset Projects',
        'Blockchain Validators',
        'Green Energy Providers',
        'Sustainability Consultants'
      ],
      icon: <Building2 size={20} color="#00FF9C" />,
      color: 'text-neon-green',
      bgColor: 'bg-space-dark'
    },
    {
      id: 'activities',
      title: 'Key Activities',
      content: [
        'Impact Verification',
        'NFT Minting & Trading',
        'Smart Contract Development',
        'Community Management',
        'Carbon Credit Management'
      ],
      icon: <Activity size={20} color="#00FF9C" />,
      color: 'text-neon-green',
      bgColor: 'bg-space-dark'
    },
    {
      id: 'proposition',
      title: 'Value Proposition',
      content: [
        'Transparent Impact Tracking',
        'Web3-Based Carbon Credits',
        'Gamified Sustainability',
        'NFT Achievement System',
        'Decentralized Verification'
      ],
      icon: <Target size={20} color="#00FF9C" />,
      color: 'text-neon-green',
      bgColor: 'bg-space-dark'
    },
    {
      id: 'relationships',
      title: 'Customer Relationships',
      content: [
        'Community Building',
        'Impact Analytics Dashboard',
        'Personalized Recommendations',
        'Achievement System',
        'Social Sharing Features'
      ],
      icon: <Users size={20} color="#00FF9C" />,
      color: 'text-neon-green',
      bgColor: 'bg-space-dark'
    },
    {
      id: 'segments',
      title: 'Customer Segments',
      content: [
        'Eco-Conscious Individuals',
        'Corporate Sustainability Teams',
        'Environmental Organizations',
        'Web3 Enthusiasts',
        'Impact Investors'
      ],
      icon: <Users size={20} color="#00FF9C" />,
      color: 'text-neon-green',
      bgColor: 'bg-space-dark'
    },
    {
      id: 'resources',
      title: 'Key Resources',
      content: [
        'Blockchain Infrastructure',
        'Smart Contract Codebase',
        'Carbon Offset Partnerships',
        'Community Platform',
        'Data Analytics Systems'
      ],
      icon: <Lightbulb size={20} color="#00FF9C" />,
      color: 'text-neon-green',
      bgColor: 'bg-space-dark'
    },
    {
      id: 'channels',
      title: 'Channels',
      content: [
        'Mobile App (iOS/Android)',
        'Web Platform',
        'Social Media Campaigns',
        'Partner Networks',
        'Community Events'
      ],
      icon: <MessageSquare size={20} color="#00FF9C" />,
      color: 'text-neon-green',
      bgColor: 'bg-space-dark'
    },
    {
      id: 'costs',
      title: 'Cost Structure',
      content: [
        'Blockchain Gas Fees',
        'Platform Development',
        'Marketing & Community',
        'Partnership Management',
        'Compliance & Auditing'
      ],
      icon: <DollarSign size={20} color="#00FF9C" />,
      color: 'text-neon-green',
      bgColor: 'bg-space-dark'
    },
    {
      id: 'revenue',
      title: 'Revenue Streams',
      content: [
        'NFT Minting Fees',
        'Transaction Commissions',
        'Premium Analytics',
        'Corporate Partnerships',
        'Carbon Credit Trading'
      ],
      icon: <DollarSign size={20} color="#00FF9C" />,
      color: 'text-neon-green',
      bgColor: 'bg-space-dark'
    }
  ];

  useEffect(() => {
    if (visible) {
      // Initialize block animations
      const animations: { [key: string]: Animated.Value } = {};
      canvasBlocks.forEach((block, index) => {
        animations[block.id] = new Animated.Value(0);
      });
      setBlockAnimations(animations);

      // Fade in background
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Slide up modal
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start();

      // Animate blocks in sequence
      canvasBlocks.forEach((block, index) => {
        if (animations[block.id]) {
          setTimeout(() => {
            Animated.timing(animations[block.id], {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }).start();
          }, index * 100);
        }
      });
    } else {
      // Reset animations
      fadeAnim.setValue(0);
      slideAnim.setValue(height);
      Object.values(blockAnimations).forEach(anim => anim.setValue(0));
    }
  }, [visible]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const renderCanvasBlock = (block: CanvasBlock, index: number) => {
    const animValue = blockAnimations[block.id];
    if (!animValue) return null;

    const translateY = animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [30, 0],
    });

    const opacity = animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

    return (
      <Animated.View
        key={block.id}
        style={{
          transform: [{ translateY }],
          opacity,
        }}
        className={`${block.bgColor} border border-neon-green/30 rounded-xl p-4 m-1 flex-1 min-h-[120px]`}
      >
        <View className="flex-row items-center mb-3">
          {block.icon}
          <Text className={`${block.color} font-bold text-sm ml-2`}>
            {block.title}
          </Text>
        </View>
        <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={false}>
          {block.content.map((item, itemIndex) => (
            <Text key={itemIndex} className="text-gray-300 text-xs mb-1">
              • {item}
            </Text>
          ))}
        </ScrollView>
      </Animated.View>
    );
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
    >
      <Animated.View
        style={{
          opacity: fadeAnim,
          backgroundColor: 'rgba(5, 11, 16, 0.95)',
        }}
        className="flex-1 justify-center items-center"
      >
        <Animated.View
          style={{
            transform: [{ translateY: slideAnim }],
            width: width * 0.95,
            maxHeight: height * 0.9,
          }}
          className="bg-deep-space rounded-2xl border border-neon-green/50"
        >
          {/* Header */}
          <View className="flex-row justify-between items-center p-4 border-b border-neon-green/30">
            <Text className="text-neon-green text-xl font-bold">
              Business Model Canvas
            </Text>
            <TouchableOpacity onPress={handleClose} className="p-2">
              <X size={24} color="#00FF9C" />
            </TouchableOpacity>
          </View>

          {/* Canvas Content */}
          <ScrollView showsVerticalScrollIndicator={false} className="p-4">
            {/* Top Row */}
            <View className="flex-row mb-2">
              <View className="flex-1 mr-1">
                {renderCanvasBlock(canvasBlocks[0], 0)}
              </View>
              <View className="flex-1 mr-1">
                {renderCanvasBlock(canvasBlocks[1], 1)}
              </View>
              <View className="flex-1">
                {renderCanvasBlock(canvasBlocks[2], 2)}
              </View>
            </View>

            {/* Middle Row */}
            <View className="flex-row mb-2">
              <View className="flex-1 mr-1">
                {renderCanvasBlock(canvasBlocks[3], 3)}
              </View>
              <View className="flex-1 mr-1">
                {renderCanvasBlock(canvasBlocks[4], 4)}
              </View>
              <View className="flex-1">
                {renderCanvasBlock(canvasBlocks[5], 5)}
              </View>
            </View>

            {/* Bottom Row */}
            <View className="flex-row">
              <View className="flex-1 mr-1">
                {renderCanvasBlock(canvasBlocks[6], 6)}
              </View>
              <View className="flex-1 mr-1">
                {renderCanvasBlock(canvasBlocks[7], 7)}
              </View>
              <View className="flex-1">
                {renderCanvasBlock(canvasBlocks[8], 8)}
              </View>
            </View>
          </ScrollView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default BusinessModelCanvas;
