import React from "react";
import { PulsarGridBackground } from "./PulsarGridBackground";
import RetroGrid from "./ui/RetroGrid";

export type BackgroundType = 'pulsar-grid' | 'retro-grid' | 'none';

export interface AnimatedBackgroundProps {
  children: React.ReactNode;
  isDark: boolean;
  type?: BackgroundType;
  gridColor?: string;
  showScanlines?: boolean;
  glowEffect?: boolean;
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ 
  children, 
  isDark, 
  type = 'pulsar-grid',
  gridColor = '#00FF9C',
  showScanlines = true,
  glowEffect = true
}) => {
  // If no background type, render children without background
  if (type === 'none') {
    return <>{children}</>;
  }

  if (type === 'retro-grid') {
    return (
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <RetroGrid
          gridColor={gridColor}
          showScanlines={showScanlines}
          glowEffect={glowEffect}
          className="absolute inset-0"
        />
        <div style={{ position: 'relative', zIndex: 10 }}>
          {children}
        </div>
      </div>
    );
  }

  // Default to pulsar grid
  return (
    <PulsarGridBackground
      backgroundColor={isDark ? "#050B10" : "#ffffff"}
      dotColor={isDark ? "rgba(0, 255, 156, 1)" : "rgba(10, 22, 40, 0.3)"}
      gridSpacing={40}
    >
      {children}
    </PulsarGridBackground>
  );
};
