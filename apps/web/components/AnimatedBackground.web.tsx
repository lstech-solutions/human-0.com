import React from "react";
import { PulsarGridBackground } from "./PulsarGridBackground";
import RetroGrid from "./ui/RetroGrid";

export type BackgroundType = 'pulsar-grid' | 'retro-grid' | 'none';

export interface AnimatedBackgroundProps {
  children?: React.ReactNode;
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
    return <>{children || null}</>;
  }

  if (type === 'retro-grid') {
    return (
      <>
        <RetroGrid
          gridColor={gridColor}
          showScanlines={showScanlines}
          glowEffect={glowEffect}
          isDark={isDark}
          className="fixed inset-0"
          style={{ zIndex: 0 }}
        />
        <div style={{ position: 'relative', zIndex: 10, backgroundColor: 'transparent' }}>
          {children || null}
        </div>
      </>
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
