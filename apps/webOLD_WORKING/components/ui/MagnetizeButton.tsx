"use client";

import React, { useCallback, useEffect, useState } from "react";
import { cn } from "../../lib/utils";

interface MagnetizeButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  particleCount?: number;
  attractRadius?: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  char: "Ø" | "1";
}

export function MagnetizeButton({
  className,
  particleCount = 12,
  attractRadius = 50, // kept for API compatibility
  children,
  ...props
}: MagnetizeButtonProps) {
  const [isAttracting, setIsAttracting] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles: Particle[] = Array.from(
      { length: particleCount },
      (_, i: number) => ({
        id: i,
        x: Math.random() * 360 - 180,
        y: Math.random() * 360 - 180,
        char: Math.random() > 0.5 ? "Ø" : "1",
      }),
    );
    setParticles(newParticles);
  }, [particleCount]);

  // Randomly flip some particles between Ø and 1 to mimic digital rain
  useEffect(() => {
    if (!particles.length) return;
    const interval = setInterval(() => {
      setParticles((prev) =>
        prev.map((p) =>
          Math.random() > 0.7
            ? { ...p, char: p.char === "Ø" ? "1" : "Ø" }
            : p,
        ),
      );
    }, 700);

    return () => clearInterval(interval);
  }, [particles.length]);

  const handleInteractionStart = useCallback(() => {
    setIsAttracting(true);
  }, []);

  const handleInteractionEnd = useCallback(() => {
    setIsAttracting(false);
  }, []);

  // When attracting, pull particles a bit closer; when idle, keep them far out for a large halo
  const distanceDivisor = isAttracting ? 10 : 5;

  return (
    <button
      className={cn(
        "relative min-w-40 touch-none",
        className,
      )}
      onMouseEnter={handleInteractionStart}
      onMouseLeave={handleInteractionEnd}
      onTouchStart={handleInteractionStart}
      onTouchEnd={handleInteractionEnd}
      {...props}
    >
      {isAttracting ? (
        // Single central Ø when attracting
        <span
          className={cn(
            "pointer-events-none absolute z-0 select-none magnet-orbit",
            "text-[11px] font-mono text-human-primary/90",
            "opacity-100",
          )}
          style={{
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          Ø
        </span>
      ) : (
        // Multiple dispersed particles when idle
        particles.map((particle) => (
          <span
            key={particle.id}
            className={cn(
              "pointer-events-none absolute z-0 select-none magnet-orbit",
              "text-[9px] font-mono text-human-primary/80",
              "transition-all duration-300",
              "opacity-50",
            )}
            style={{
              left: `calc(50% + ${particle.x / distanceDivisor}px)`,
              top: `calc(50% + ${particle.y / distanceDivisor}px)`,
            }}
          >
            {particle.char}
          </span>
        ))
      )}
      <span
        className={cn(
          "relative z-10 w-full flex items-center justify-center gap-2",
          "transition-transform duration-300",
          isAttracting && "scale-[1.02]",
        )}
      >
        {children}
      </span>
    </button>
  );
}
