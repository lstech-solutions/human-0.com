'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import FlickeringGrid from '../components/FlickeringGrid';
import { H1, Body } from '../components/typography';
import { ParticleHero } from '../components/ui/animated-hero';
import VideoBackground from '../components/ui/video-background';
import appPkg from '../package.json';
import { useTheme } from '../theme/ThemeProvider';
import { MagnetizeButton } from '../components/ui/MagnetizeButton';
import VersionDrawer from '../components/VersionDrawer';

function randomizeZeroGlyphs(value: string): string {
  return value.replace(/[01]/g, (digit) => (Math.random() < 0.5 ? digit : 'Ø'));
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const { colorScheme, theme } = useTheme();
  const APP_VERSION = appPkg.version || "0.0.0";
  const [frameRate, setFrameRate] = useState(60);
  const lastPointer = useRef<{ x: number; y: number; t: number } | null>(null);
  const lastScroll = useRef<{ y: number; t: number } | null>(null);
  const meterBaseHeights = useMemo(() => [8, 12, 10, 14, 9, 11, 13, 7], []);
  const [meterOffsets, setMeterOffsets] = useState<number[]>(meterBaseHeights.map(() => 0));
  const meterIntervalRef = useRef<number | null>(null);
  const [isVersionDrawerOpen, setIsVersionDrawerOpen] = useState(false);

  // Simulated frame indicator based on pointer/scroll velocity
  useEffect(() => {
    const updateFromSpeed = (speed: number) => {
      const fps = Math.min(144, Math.max(24, 24 + speed * 0.25));
      setFrameRate((prev) => Math.round(prev * 0.8 + fps * 0.2));
    };

    const handlePointer = (ev: MouseEvent | TouchEvent) => {
      const point = "touches" in ev ? ev.touches[0] : ev;
      if (!point) return;
      const now = performance.now();
      const last = lastPointer.current;
      if (last) {
        const dt = Math.max(1, now - last.t);
        const dx = point.clientX - last.x;
        const dy = point.clientY - last.y;
        const speed = Math.hypot(dx, dy) / dt * 100; // normalize
        updateFromSpeed(speed);
      }
      lastPointer.current = { x: point.clientX, y: point.clientY, t: now };
    };

    const handleScroll = () => {
      const now = performance.now();
      const last = lastScroll.current;
      const y = window.scrollY;
      if (last) {
        const dy = y - last.y;
        const dt = Math.max(1, now - last.t);
        const speed = Math.abs(dy) / dt * 150;
        updateFromSpeed(speed);
      }
      lastScroll.current = { y, t: now };
    };

    const decay = setInterval(() => {
      setFrameRate((prev) => Math.max(24, Math.round(prev * 0.95)));
    }, 500);

    window.addEventListener("mousemove", handlePointer, { passive: true });
    window.addEventListener("touchmove", handlePointer, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      clearInterval(decay);
      window.removeEventListener("mousemove", handlePointer);
      window.removeEventListener("touchmove", handlePointer);
      window.removeEventListener("scroll", handleScroll);
      if (meterIntervalRef.current) clearInterval(meterIntervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (meterIntervalRef.current) clearInterval(meterIntervalRef.current);
    meterIntervalRef.current = setInterval(() => {
      setMeterOffsets((prev) => {
        // If no recent pointer movement, keep bars steady
        const now = performance.now();
        const idle = lastPointer.current ? now - lastPointer.current.t > 800 : true;
        if (idle) return prev;
        return meterBaseHeights.map(() => Math.random() * 6 - 3);
      });
    }, 120);
  }, [meterBaseHeights]);

  useEffect(() => {
    const swing = Math.max(-6, Math.min(6, (frameRate - 60) * 0.1));
    setMeterOffsets((prev) => {
      const now = performance.now();
      const idle = lastPointer.current ? now - lastPointer.current.t > 800 : true;
      if (idle) return prev;
      return meterBaseHeights.map(() => Math.random() * 6 - 3 + swing);
    });
  }, [frameRate, meterBaseHeights]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');

    const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setIsDesktop(event.matches);
    };

    handleChange(mediaQuery);

    const listener = (event: MediaQueryListEvent) => handleChange(event);
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', listener);
    } else {
      mediaQuery.addListener(listener);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', listener);
      } else {
        mediaQuery.removeListener(listener);
      }
    };
  }, []);

  useEffect(() => {
    setMounted(true);

    // Add CSS for Vitruvian man image styling
    const style = document.createElement('style');
    style.textContent = `
      /* Vitruvian Man Container */
      .vitruvian-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 1;
        pointer-events: none;
        overflow: hidden;
        background: transparent;
        display: flex;
        justify-content: center;
        align-items: center;
        perspective: 1000px;
      }
      
      /* Wrapper for frames and image - positioned as unit */
      .vitruvian-wrapper {
        position: absolute;
        right: 10%;
        top: 50%;
        transform: translateY(-50%);
        width: 650px;
        height: 650px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      
      /* Vitruvian Man Image - Clean SVG version */
      .vitruvian-image {
        width: 600px;
        height: auto;
        max-height: 90vh;
        object-fit: contain;
        position: relative;
        z-index: 2;
      }
      
      @keyframes float {
        0%, 100% { transform: translateY(0px) rotateY(0deg); }
        50% { transform: translateY(-20px) rotateY(5deg); }
      }
      
      @keyframes glow {
        0% { filter: drop-shadow(0 0 20px rgba(0, 255, 156, 0.2)); }
        100% { filter: drop-shadow(0 0 40px rgba(0, 255, 156, 0.6)); }
      }
      
      /* ASCII Animation for mobile */
      .ascii-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
        pointer-events: none;
        overflow: hidden;
        background: transparent;
      }
      
      .ascii-vitruvian {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-family: 'Courier New', monospace;
        font-size: 4px;
        line-height: 1;
        color: #00FF9C;
        white-space: pre;
        text-align: center;
        animation: glow 2s ease-in-out infinite alternate;
      }
      
      /* Mobile ASCII Orbitals */
      .mobile-orbitals {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-family: 'Courier New', monospace;
        font-size: 3px;
        line-height: 1;
        color: rgba(0, 255, 156, 0.5);
        white-space: pre;
        text-align: center;
        z-index: 2;
      }
      
      .orbital-1 {
        animation: rotate-mobile 15s linear infinite;
      }
      
      .orbital-2 {
        animation: rotate-mobile 20s linear infinite reverse;
      }
      
      @keyframes rotate-mobile {
        0% { transform: translate(-50%, -50%) rotate(0deg); }
        100% { transform: translate(-50%, -50%) rotate(360deg); }
      }
      
      @keyframes glow {
        0% { opacity: 0.3; text-shadow: 0 0 5px #00FF9C; }
        100% { opacity: 0.8; text-shadow: 0 0 20px #00FF9C, 0 0 30px #00FF9C; }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const orbitPalette = colorScheme === 'dark'
    ? { primary: '#22c55e', secondary: '#16a34a', electron: '#22c55e', shadow: '0 0 12px rgba(34, 197, 94, 0.75)' }
    : { primary: '#0f172a', secondary: '#111827', electron: '#0f172a', shadow: '0 0 8px rgba(15, 23, 42, 0.35)' };

  const baseA = isDesktop ? 229 : 80;
  const baseB = isDesktop ? 120 : 40; // +20% height
  const containerSize = baseA * 2;

  const orbitConfig = isDesktop
    ? [
      { dots: 180, a: baseA, b: baseB * 0.8, color: orbitPalette.primary, opacityBase: 0.98, opacityStep: 0.03, modulo: 8, size: containerSize, duration: 10.4, reverse: false, dotSize: 3 },
      { dots: 150, a: baseA, b: baseB * 0.8, color: orbitPalette.secondary, opacityBase: 0.95, opacityStep: 0.04, modulo: 7, size: containerSize, duration: 13, reverse: true, dotSize: 3 },
    ]
    : [
      { dots: 90, a: baseA, b: baseB * 0.8, color: orbitPalette.primary, opacityBase: 0.98, opacityStep: 0.03, modulo: 8, size: containerSize, duration: 8, reverse: false, dotSize: 1.5 },
      { dots: 75, a: baseA, b: baseB * 0.8, color: orbitPalette.secondary, opacityBase: 0.95, opacityStep: 0.04, modulo: 7, size: containerSize, duration: 10, reverse: true, dotSize: 1.5 },
    ];

  const renderOrbitRing = (cfg: (typeof orbitConfig)[number], key: number) => (
    <div
      key={`${cfg.color}-${key}`}
      className="absolute animate-spin z-20"
      style={{
        width: `${cfg.size}px`,
        height: `${cfg.size}px`,
        animationDuration: `${cfg.duration}s`,
        animationDirection: cfg.reverse ? 'reverse' : 'normal',
        left: '50%',
        top: '50%',
        marginLeft: `-${cfg.size / 2}px`,
        marginTop: `-${cfg.size / 2}px`,
      }}
    >
      {Array.from({ length: cfg.dots }).map((_, i) => {
        const angle = (i / cfg.dots) * 360;
        const ellipseAngle = (angle * Math.PI) / 180;
        const x = cfg.a * Math.cos(ellipseAngle);
        const y = cfg.b * Math.sin(ellipseAngle);

        return (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: '50%',
              top: '50%',
              width: `${cfg.dotSize}px`,
              height: `${cfg.dotSize}px`,
              backgroundColor: cfg.color,
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              opacity: cfg.opacityBase - (i % cfg.modulo) * cfg.opacityStep,
            }}
          />
        );
      })}
    </div>
  );

  const renderElectrons = () =>
    Array.from({ length: 2 }).map((_, idx) => {
      const axis = ['xz', 'yz'][idx];
      const orbitRadius = baseA;
      const size = isDesktop ? 12 : 8;
      const duration = isDesktop ? '8s' : '6s';
      const glyph = idx === 0 ? '1' : randomizeZeroGlyphs('Ø');

      return (
        <div
          key={axis}
          className="absolute rounded-full flex items-center justify-center"
          style={{
            left: '50%',
            top: '50%',
            width: `${size}px`,
            height: `${size}px`,
            transform: 'translate(-50%, -50%)',
            backgroundColor: orbitPalette.electron,
            boxShadow: orbitPalette.shadow,
            animation: `orbit-${axis} ${duration} linear infinite`,
            ['--orbit-radius' as any]: `${orbitRadius}px`,
          }}
        >
          <span
            className="text-[8px] font-mono text-white select-none"
            style={{ lineHeight: 1 }}
          >
            {glyph}
          </span>
        </div>
      );
    });

  const renderVitruvian = () => {
    const vitruvianFilter =
      colorScheme === 'dark'
        ? 'drop-shadow(0 0 18px rgba(34, 197, 94, 0.4))'
        : 'drop-shadow(0 0 12px rgba(15, 23, 42, 0.35)) brightness(0.85)';
    const vitruvianSrc =
      colorScheme === 'dark'
        ? '/images/vitruvian01-dark.svg'
        : '/images/vitruvian01-light.svg';

    const wrapperStyle = isDesktop
      ? undefined
      : {
        width: '320px',
        height: '320px',
        right: 'auto',
        left: '78%',
        top: '64%',
        transform: 'translate(-50%, -50%)',
      };

    return (
      <div className="fixed inset-0 w-full h-full vitruvian-container z-10">
        <div className="vitruvian-wrapper" style={wrapperStyle}>
          <VideoBackground
            videoSrc="/videos/unicorn-1764193723316.webm"
            style={{
              position: 'absolute',
              top: '50%',
              left: '49.6%',
              transform: 'translate(-50%, -50%)',
              width: isDesktop ? '60px' : '22px',
              height: isDesktop ? '60px' : '22px',
              borderRadius: '50%',
              overflow: 'hidden',
              zIndex: 1,
              objectFit: 'cover'
            }}
          />

          <div className="absolute inset-0 flex items-center justify-center">
            {orbitConfig.map((cfg, idx) => renderOrbitRing(cfg, idx))}
            {renderElectrons()}
          </div>

          <img
            src={vitruvianSrc}
            alt="Vitruvian Man"
            className={isDesktop ? 'vitruvian-image' : 'w-[220px] h-auto max-h-[50vh] object-contain opacity-90'}
            style={
              isDesktop
                ? { filter: vitruvianFilter }
                : { position: 'relative', zIndex: 2, filter: vitruvianFilter }
            }
          />
        </div>
      </div>
    );
  };

  if (!mounted) return null;

  const gridColor =
    colorScheme === 'dark' ? 'rgba(255, 247, 247, 1)' : 'rgba(70, 70, 70, 1)';
  const gradientClass =
    colorScheme === 'dark'
      ? 'from-black/70 via-black/55 to-black/70'
      : 'from-white/70 via-white/55 to-white/70';

  return (
    <main className="relative min-h-screen overflow-hidden bg-human-bg-light dark:bg-human-bg-dark">
      {/* Global background dots */}
      <FlickeringGrid
        className="absolute inset-0 pointer-events-none opacity-25 mix-blend-screen"
        color={gridColor}
        maxOpacity={0.08}
      />
      <div
        className={`absolute inset-0 bg-gradient-to-b ${gradientClass} pointer-events-none`}
      />

      {/* Particle overlay tracking full screen */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 15 }}>
        <ParticleHero
          particleCount={12}
          backgroundClassName="bg-transparent"
          className="pointer-events-none"
          colorScheme={colorScheme}
          showContent={false}
        />
      </div>

      {renderVitruvian()}


      {/* Corner Frame Accents */}
      <div className="absolute top-0 left-0 w-8 h-8 lg:w-12 lg:h-12 border-t-2 border-l-2 border-white/30 z-20"></div>
      <div className="absolute top-0 right-0 w-8 h-8 lg:w-12 lg:h-12 border-t-2 border-r-2 border-white/30 z-20"></div>
      <div className="absolute left-0 w-8 h-8 lg:w-12 lg:h-12 border-b-2 border-l-2 border-white/30 z-20" style={{ bottom: '5vh' }}></div>
      <div className="absolute right-0 w-8 h-8 lg:w-12 lg:h-12 border-b-2 border-r-2 border-white/30 z-20" style={{ bottom: '5vh' }}></div>

      {/* Hero content with Vitruvian backdrop */}
      <div className="fixed z-20 flex min-h-screen items-center pt-16 lg:pt-0" style={{ marginTop: '5vh', left: '0', top: '0' }}>
        <div className="container mx-auto px-6 lg:px-16 lg:ml-[10%] text-human-text-light dark:text-human-text-dark w-full">
          <div className="max-w-lg relative">
            <div className="flex items-center gap-2 mb-3 opacity-60">
              <div className="w-8 h-px bg-human-text-light dark:bg-human-text-dark/70"></div>
              <span className="text-[10px] font-mono tracking-wider">{randomizeZeroGlyphs('00') + '1'}</span>
              <div className="flex-1 h-px bg-human-text-light dark:bg-human-text-dark/70"></div>
            </div>

            <div className="relative">
              <div className="hidden lg:block absolute -left-3 top-0 bottom-0 w-1 dither-pattern opacity-40"></div>

              <H1 className="mb-3 lg:mb-4 tracking-widest leading-tight font-digitaldivine">
                <span className="bg-gradient-to-r from-emerald-300 via-emerald-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(0,255,156,0.25)]">
                  PROOF OF
                </span>
                <span className="block mt-1 lg:mt-2 bg-gradient-to-r from-cyan-300 via-emerald-400 to-emerald-200 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(0,255,156,0.25)]">
                  SUSTAINABLE HUMANITY
                </span>
              </H1>
            </div>

            <div className="hidden lg:flex gap-1 mb-3 opacity-40">
              {Array.from({ length: 40 }).map((_, i) => (
                <div key={i} className="w-0.5 h-0.5 bg-human-text-light dark:bg-human-text-dark rounded-full"></div>
              ))}
            </div>

            <div className="relative">
              <Body className="text-xs lg:text-base mb-5 lg:mb-6 leading-relaxed text-human-text-light/90 dark:text-human-text-dark/90">
                Where environmental impact meets digital transparency — Carbon neutrality through Web3 innovation
              </Body>

              <div className="hidden lg:block absolute -right-4 top-1/2 w-3 h-3 border border-white opacity-30" style={{ transform: 'translateY(-50%)' }}>
                <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-human-text-light dark:bg-human-text-dark" style={{ transform: 'translate(-50%, -50%)' }}></div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-3 lg:gap-4">
              <MagnetizeButton
                onClick={() => window.location.href = '/canvas'}
                className="px-5 lg:px-6 py-2 lg:py-2.5 bg-white/85 dark:bg-transparent text-human-text-light dark:text-human-text-dark font-mono text-xs lg:text-sm border border-human-border/80 dark:border-human-border hover:text-white dark:hover:text-white transition-all duration-200 group magnet-btn-gradient"
              >
                <span className="hidden lg:block absolute -top-1 -left-1 w-2 h-2 border-t border-l border-human-border opacity-0 group-hover:opacity-100 transition-opacity"></span>
                <span className="hidden lg:block absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-human-border opacity-0 group-hover:opacity-100 transition-opacity"></span>
                <span>EXPLORE CANVAS</span>
              </MagnetizeButton>

              <MagnetizeButton
                onClick={() => window.location.href = '/pdf-download'}
                className="px-5 lg:px-6 py-2 lg:py-2.5 bg-white/85 dark:bg-transparent border border-human-border/80 dark:border-human-border text-human-text-light dark:text-human-text-dark font-mono text-xs lg:text-sm hover:text-white dark:hover:text-white transition-all duration-200 magnet-btn-gradient"
                style={{ borderWidth: '1px' }}
              >
                <span>DOWNLOAD PDF</span>
              </MagnetizeButton>
            </div>

            <div className="hidden lg:flex items-center gap-2 mt-6 opacity-40">
              <span className="text-white text-[9px] font-mono">∞</span>
              <div className="flex-1 h-px bg-white"></div>
              <span className="text-white text-[9px] font-mono">WEB3</span>
            </div>
          </div>
        </div>
      </div>

      <VersionDrawer
        isOpen={isVersionDrawerOpen}
        appVersion={APP_VERSION}
        onClose={() => setIsVersionDrawerOpen(false)}
      />

      {/* Bottom Footer - light in light mode, GitHub-like dark bar in dark mode */}
      <div className="fixed left-0 right-0 bottom-0 z-30 border-t border-[#d0d7de] bg-white/90 text-[#24292f] dark:border-[#30363d] dark:bg-[#0d1117] dark:text-[#8b949e]">
        <div className="container mx-auto px-4 lg:px-8 py-2 lg:py-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-[9px] lg:text-[10px] font-mono">
          <div className="flex items-center gap-3 lg:gap-6">
            <span className="hidden lg:inline tracking-[0.18em] uppercase text-[#57606a] dark:text-[#c9d1d9]">SYSTEM.ACTIVE</span>
            <span className="lg:hidden tracking-[0.18em] uppercase text-[#57606a] dark:text-[#c9d1d9]">SYS.ACT</span>
            <div className="hidden lg:flex gap-1">
              {meterBaseHeights.map((base, i) => {
                const height = base + (meterOffsets[i] || 0);
                return (
                  <div
                    key={i}
                    className="w-1 bg-[#d0d7de] dark:bg-[#30363d]"
                    style={{ height: `${height}px`, minHeight: `${base - 3}px`, maxHeight: `${base + 3}px`, transition: "height 120ms ease-out" }}
                  ></div>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => setIsVersionDrawerOpen(true)}
              className="text-purple-600 hover:text-purple-500 dark:text-purple-300 dark:hover:text-purple-200 underline decoration-dotted underline-offset-2 transition-colors"
            >
              v{APP_VERSION}
            </button>
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
            <span className="hidden lg:inline text-[#57606a] dark:text-[#8b949e]">◐ RENDERING</span>
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-[#57606a] dark:bg-[#8b949e] rounded-full animate-pulse"></div>
              <div className="w-1 h-1 bg-[#8b949e] dark:bg-[#6e7681] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-1 h-1 bg-[#d0d7de] dark:bg-[#484f58] rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
            <span className="hidden lg:inline text-[#57606a] dark:text-[#8b949e]">FRAMES: {frameRate}</span>
          </div>
        </div>
      </div>

      <style>{`
        .dither-pattern {
          background-image:
            repeating-linear-gradient(0deg, rgba(255,255,255,0.12) 0px, rgba(255,255,255,0.12) 1px, transparent 1px, transparent 2px),
            repeating-linear-gradient(90deg, rgba(255,255,255,0.12) 0px, rgba(255,255,255,0.12) 1px, transparent 1px, transparent 2px);
          background-size: 3px 3px;
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }

        @keyframes orbit-xz {
          0% { transform: translate(-50%, -50%) translateX(var(--orbit-radius, 200px)); }
          25% { transform: translate(-50%, -50%) translateX(0px) translateY(0px); }
          50% { transform: translate(-50%, -50%) translateX(calc(var(--orbit-radius, 200px) * -1)); }
          75% { transform: translate(-50%, -50%) translateX(0px) translateY(0px); }
          100% { transform: translate(-50%, -50%) translateX(var(--orbit-radius, 200px)); }
        }

        @keyframes orbit-yz {
          0% { transform: translate(-50%, -50%) translateY(var(--orbit-radius, 200px)); }
          25% { transform: translate(-50%, -50%) translateY(0px) translateX(0px); }
          50% { transform: translate(-50%, -50%) translateY(calc(var(--orbit-radius, 200px) * -1)); }
          75% { transform: translate(-50%, -50%) translateY(0px) translateX(0px); }
          100% { transform: translate(-50%, -50%) translateY(var(--orbit-radius, 200px)); }
        }

        @keyframes orbit-xy {
          0% { transform: translate(-50%, -50%) translateX(var(--orbit-radius, 200px)); }
          25% { transform: translate(-50%, -50%) translateX(0px) translateY(var(--orbit-radius, 200px)); }
          50% { transform: translate(-50%, -50%) translateX(calc(var(--orbit-radius, 200px) * -1)); }
          75% { transform: translate(-50%, -50%) translateX(0px) translateY(calc(var(--orbit-radius, 200px) * -1)); }
          100% { transform: translate(-50%, -50%) translateX(var(--orbit-radius, 200px)); }
        }
      `}</style>
    </main>
  );
}
