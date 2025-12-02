import React from 'react';
import { Platform } from 'react-native';
import UnicornStudioBackground from './unicorn-studio-background';
import RetroGrid from './RetroGrid';

export type BackgroundType = 'unicorn' | 'retro-grid' | 'none';

interface AnimatedBackgroundProps {
  type?: BackgroundType;
  projectId?: string;
  gridColor?: string;
  showScanlines?: boolean;
  glowEffect?: boolean;
  className?: string;
  style?: React.CSSProperties;
  zIndex?: number;
  pointerEvents?: 'none' | 'auto';
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  type = 'unicorn',
  projectId = 'c3b0a4d0-6f7a-4e8b-9b2a-1a2b3c4d5e6f',
  gridColor = '#00FF9C',
  showScanlines = true,
  glowEffect = true,
  className = '',
  style = {},
  zIndex = 1,
  pointerEvents = 'none'
}) => {
  // If no background type, render nothing
  if (type === 'none') {
    return null;
  }

  // For web platform, we can use both types
  if (Platform.OS === 'web') {
    switch (type) {
      case 'retro-grid':
        return (
          <RetroGrid
            gridColor={gridColor}
            showScanlines={showScanlines}
            glowEffect={glowEffect}
            className={className}
          />
        );
      case 'unicorn':
      default:
        return (
          <UnicornStudioBackground
            projectId={projectId}
            className={className}
            style={style}
            zIndex={zIndex}
            pointerEvents={pointerEvents}
          />
        );
    }
  }

  // For native platforms, only unicorn studio is supported
  if (type === 'unicorn') {
    return (
      <UnicornStudioBackground
        projectId={projectId}
        className={className}
        style={style}
        zIndex={zIndex}
        pointerEvents={pointerEvents}
      />
    );
  }

  // For native platforms with retro-grid, we'd need a different implementation
  // For now, fallback to none
  return null;
};

export default AnimatedBackground;
