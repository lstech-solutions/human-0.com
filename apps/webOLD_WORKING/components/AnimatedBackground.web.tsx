import React from "react";
import { PulsarGridBackground } from "./PulsarGridBackground";

interface AnimatedBackgroundProps {
  children: React.ReactNode;
  isDark: boolean;
}

export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ children, isDark }) => {
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
