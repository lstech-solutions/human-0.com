"use client";

import React, { ReactNode, useEffect, useRef, useState } from "react";

interface ParticleHeroProps {
  title?: string;
  subtitle?: string;
  description?: string;
  primaryButton?: {
    text: string;
    onClick: () => void;
  };
  secondaryButton?: {
    text: string;
    onClick: () => void;
  };
  interactiveHint?: string;
  className?: string;
  backgroundClassName?: string;
  particleCount?: number;
  children?: ReactNode;
  showContent?: boolean;
  colorScheme?: "light" | "dark";
}

export const ParticleHero: React.FC<ParticleHeroProps> = ({
  title = "FLUX",
  subtitle = "Digital Inferno",
  description = "Experience the mesmerizing dance of light and motion.",
  primaryButton,
  secondaryButton,
  interactiveHint = "Move to Create",
  className = "",
  backgroundClassName = "bg-transparent",
  particleCount = 15,
  children,
  showContent = true,
  colorScheme = "dark",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);
  const animationFrameRef = useRef<number>();
  const timeoutRef = useRef<NodeJS.Timeout>();
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [staticCursor, setStaticCursor] = useState({ x: 0, y: 0 });
  const [isAutoMode, setIsAutoMode] = useState(true);
  const [isStaticAnimation, setIsStaticAnimation] = useState(false);
  const startTimeRef = useRef(Date.now());
  const lastMouseMoveRef = useRef(Date.now());

  const rows = particleCount;
  const totalParticles = rows * rows;
  const spacing = 1.4; // tighter spacing for smaller particles

  // Initialize particles
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    container.innerHTML = "";
    particlesRef.current = [];

    for (let i = 0; i < totalParticles; i++) {
      const particle = document.createElement("div");
      particle.className = "particle absolute will-change-transform";

      const row = Math.floor(i / rows);
      const col = i % rows;
      const centerRow = Math.floor(rows / 2);
      const centerCol = Math.floor(rows / 2);
      const distanceFromCenter = Math.sqrt(
        Math.pow(row - centerRow, 2) + Math.pow(col - centerCol, 2),
      );
      const scale = Math.max(0.1, 1.2 - distanceFromCenter * 0.12);
      const opacity = Math.max(0.05, 1 - distanceFromCenter * 0.1);
      const lightness = Math.max(15, 75 - distanceFromCenter * 6);
      const glowSize = Math.max(0.5, 6 - distanceFromCenter * 0.5);

      const isDark = colorScheme === "dark";
      const hue = 140;
      const darkGlow = "0 0 10px rgba(0,255,156,0.45)";
      const lightGlow = "0 0 8px rgba(0,0,0,0.4)";
      const digitColor = isDark ? `hsl(${hue}, 95%, ${Math.min(92, lightness + 15)}%)` : "rgba(0,0,0,0.88)";
      const blendMode = "normal";
      const clampedOpacity = isDark ? Math.max(0.65, opacity) : Math.max(0.45, opacity);

      particle.textContent = Math.random() > 0.5 ? "0" : "1";
      particle.style.cssText = `
        width: 0.6rem;
        height: 0.6rem;
        left: ${col * spacing}rem;
        top: ${row * spacing}rem;
        transform: scale(${scale});
        opacity: ${clampedOpacity};
        color: ${digitColor};
        font-size: 0.6rem;
        font-family: "Space Mono", "Courier New", monospace;
        font-weight: 600;
        text-shadow: ${isDark ? darkGlow : lightGlow};
        line-height: 1;
        mix-blend-mode: ${blendMode};
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: ${Math.round(totalParticles - distanceFromCenter * 5)};
        transition: transform 0.05s linear, opacity 0.08s linear;
      `;

      container.appendChild(particle);
      particlesRef.current.push(particle);
    }
  }, [rows, totalParticles]);

  // Continuous animation
  useEffect(() => {
    const animate = () => {
      const currentTime = (Date.now() - startTimeRef.current) * 0.001;

      if (isAutoMode) {
        const x = Math.sin(currentTime * 0.35) * 60 + Math.sin(currentTime * 0.18) * 30;
        const y = Math.cos(currentTime * 0.32) * 50 + Math.cos(currentTime * 0.2) * 25;
        setCursor({ x, y });
      } else if (isStaticAnimation) {
        const timeSinceLastMove = Date.now() - lastMouseMoveRef.current;

        if (timeSinceLastMove > 200) {
          const animationStrength = Math.min((timeSinceLastMove - 200) / 1000, 1);
          const subtleX = Math.sin(currentTime * 1.5) * 20 * animationStrength;
          const subtleY = Math.cos(currentTime * 1.2) * 16 * animationStrength;

          setCursor({
            x: staticCursor.x + subtleX,
            y: staticCursor.y + subtleY,
          });
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isAutoMode, isStaticAnimation, staticCursor]);

  // Update particle positions and random digit flips
  useEffect(() => {
    particlesRef.current.forEach((particle, i) => {
      const row = Math.floor(i / rows);
      const col = i % rows;
      const centerRow = Math.floor(rows / 2);
      const centerCol = Math.floor(rows / 2);
      const distanceFromCenter = Math.sqrt(
        Math.pow(row - centerRow, 2) + Math.pow(col - centerCol, 2),
      );

      const delay = distanceFromCenter * 1.2; // faster response
      const originalScale = Math.max(0.1, 1.2 - distanceFromCenter * 0.12);
      const dampening = Math.max(0.7, 1 - distanceFromCenter * 0.04); // tighter follow to cursor

      setTimeout(() => {
        const moveX = cursor.x * dampening;
        const moveY = cursor.y * dampening;

        particle.style.transform = `translate(${moveX}px, ${moveY}px) scale(${originalScale})`;
        particle.style.transition = `transform ${120 + distanceFromCenter * 20}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
      }, delay);
    });
  }, [cursor, rows]);

  // Periodic digit randomization
  useEffect(() => {
    const interval = setInterval(() => {
      particlesRef.current.forEach((particle) => {
        if (Math.random() > 0.5) {
          particle.textContent = Math.random() > 0.5 ? "0" : "1";
        }
      });
    }, 700);

    return () => clearInterval(interval);
  }, []);

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    const event = "touches" in e ? e.touches[0] : e;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const newCursor = {
      x: (event.clientX - centerX) * 0.6,
      y: (event.clientY - centerY) * 0.6,
    };

    setCursor(newCursor);
    setStaticCursor(newCursor);
    setIsAutoMode(false);
    setIsStaticAnimation(false);
    lastMouseMoveRef.current = Date.now();

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setIsStaticAnimation(true);
    }, 500);

    setTimeout(() => {
      if (Date.now() - lastMouseMoveRef.current >= 4000) {
        setIsAutoMode(true);
        setIsStaticAnimation(false);
        startTimeRef.current = Date.now();
      }
    }, 4000);
  };

  useEffect(() => {
    const handleWindowMove = (e: MouseEvent | TouchEvent) => {
      const point = "touches" in e ? e.touches[0] : e;
      if (!point) return;
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const newCursor = {
        x: (point.clientX - centerX) * 0.6,
        y: (point.clientY - centerY) * 0.6,
      };
      setCursor((prev) => ({
        x: prev.x * 0.65 + newCursor.x * 0.35,
        y: prev.y * 0.65 + newCursor.y * 0.35,
      }));
      setStaticCursor(newCursor);
      setIsAutoMode(false);
      setIsStaticAnimation(false);
      lastMouseMoveRef.current = Date.now();
    };

    window.addEventListener("mousemove", handleWindowMove, { passive: true });
    window.addEventListener("touchmove", handleWindowMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleWindowMove);
      window.removeEventListener("touchmove", handleWindowMove);
    };
  }, []);

  return (
    <section
      className={`relative w-full min-h-screen overflow-hidden ${backgroundClassName} ${className}`}
      onMouseMove={handlePointerMove}
      onTouchMove={handlePointerMove}
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          ref={containerRef}
          className="relative"
          style={{
            width: "100vw",
            height: "100vh",
          }}
        />
      </div>

      {showContent && (
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
          {children ? (
            children
          ) : (
            <div className="text-center max-w-6xl mx-auto">
              <div className="mb-16">
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9] mb-6">
                  <span className="bg-gradient-to-b from-emerald-200 via-emerald-400 to-emerald-700 bg-clip-text text-transparent drop-shadow-2xl">
                    {title}
                  </span>
                </h1>

                <div className="space-y-4">
                  <h2 className="text-xl md:text-3xl lg:text-4xl font-semibold text-emerald-100/90 tracking-[0.2em] uppercase">
                    {subtitle}
                  </h2>
                  <div className="w-24 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent mx-auto"></div>
                </div>
              </div>

              {description && (
                <div className="mb-14">
                  <p className="text-lg md:text-xl text-emerald-50/75 font-light max-w-3xl mx-auto leading-relaxed">
                    {description}
                  </p>
                </div>
              )}

              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  {primaryButton && (
                    <button
                      onClick={primaryButton.onClick}
                      className="group relative px-10 py-4 bg-transparent border border-emerald-400/60 hover:border-emerald-300 text-emerald-100 hover:text-black font-medium text-sm tracking-[0.2em] uppercase transition-all duration-500 overflow-hidden"
                    >
                      <span className="relative z-10">{primaryButton.text}</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-400/30 to-emerald-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    </button>
                  )}

                  {secondaryButton && (
                    <button
                      onClick={secondaryButton.onClick}
                      className="px-8 py-3 border border-emerald-200/30 hover:border-emerald-300 text-emerald-100 hover:text-emerald-50 font-semibold rounded-full transition-all duration-300 backdrop-blur-sm text-sm tracking-wide"
                    >
                      {secondaryButton.text}
                    </button>
                  )}
                </div>

                {interactiveHint && (
                  <div className="flex items-center justify-center gap-6 text-emerald-300/50 text-xs uppercase tracking-[0.3em]">
                    <div className="w-12 h-px bg-gradient-to-r from-transparent to-emerald-400/30"></div>
                    <span className="animate-pulse">{interactiveHint}</span>
                    <div className="w-12 h-px bg-gradient-to-l from-transparent to-emerald-400/30"></div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-20 w-64 h-64 bg-emerald-500/8 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-teal-500/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90vh] h-[90vh] bg-gradient-radial from-emerald-900/15 to-transparent rounded-full"></div>
      </div>
    </section>
  );
};
