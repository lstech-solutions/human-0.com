'use client';

import React, { useState, MouseEvent } from 'react';
import { motion, type Variants } from 'motion/react';
import { GripHorizontal } from 'lucide-react-native';
import { cn } from '@/lib/utils';

type BlurSize = 'sm' | 'md' | 'lg' | 'xl';
type ShadowSize = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type GlowSize = ShadowSize;

export interface LiquidGlassCardProps {
  children: React.ReactNode;
  className?: string;
  draggable?: boolean;
  expandable?: boolean;
  width?: string;
  height?: string;
  expandedWidth?: string;
  expandedHeight?: string;
  blurIntensity?: BlurSize;
  shadowIntensity?: ShadowSize;
  borderRadius?: string;
  glowIntensity?: GlowSize;
  showDragHandle?: boolean;
}

const blurClasses: Record<BlurSize, string> = {
  sm: 'backdrop-blur-sm',
  md: 'backdrop-blur-md',
  lg: 'backdrop-blur-lg',
  xl: 'backdrop-blur-xl',
};

const shadowStyles: Record<ShadowSize, string> = {
  none: 'inset 0 0 0 0 rgba(255, 255, 255, 0)',
  xs: 'inset 1px 1px 1px 0 rgba(255, 255, 255, 0.3), inset -1px -1px 1px 0 rgba(255, 255, 255, 0.3)',
  sm: 'inset 2px 2px 2px 0 rgba(255, 255, 255, 0.35), inset -2px -2px 2px 0 rgba(255, 255, 255, 0.35)',
  md: 'inset 3px 3px 3px 0 rgba(255, 255, 255, 0.45), inset -3px -3px 3px 0 rgba(255, 255, 255, 0.45)',
  lg: 'inset 4px 4px 4px 0 rgba(255, 255, 255, 0.5), inset -4px -4px 4px 0 rgba(255, 255, 255, 0.5)',
  xl: 'inset 6px 6px 6px 0 rgba(255, 255, 255, 0.55), inset -6px -6px 6px 0 rgba(255, 255, 255, 0.55)',
  '2xl':
    'inset 8px 8px 8px 0 rgba(255, 255, 255, 0.6), inset -8px -8px 8px 0 rgba(255, 255, 255, 0.6)',
};

const glowStyles: Record<GlowSize, string> = {
  none: '0 4px 4px rgba(0, 0, 0, 0.05), 0 0 12px rgba(0, 0, 0, 0.05)',
  xs: '0 4px 4px rgba(0, 0, 0, 0.15), 0 0 12px rgba(0, 0, 0, 0.08), 0 0 16px rgba(255, 255, 255, 0.05)',
  sm: '0 4px 4px rgba(0, 0, 0, 0.15), 0 0 12px rgba(0, 0, 0, 0.08), 0 0 24px rgba(255, 255, 255, 0.1)',
  md: '0 4px 4px rgba(0, 0, 0, 0.15), 0 0 12px rgba(0, 0, 0, 0.08), 0 0 32px rgba(255, 255, 255, 0.15)',
  lg: '0 4px 4px rgba(0, 0, 0, 0.15), 0 0 12px rgba(0, 0, 0, 0.08), 0 0 40px rgba(255, 255, 255, 0.2)',
  xl: '0 4px 4px rgba(0, 0, 0, 0.15), 0 0 12px rgba(0, 0, 0, 0.08), 0 0 48px rgba(255, 255, 255, 0.25)',
  '2xl':
    '0 4px 4px rgba(0, 0, 0, 0.15), 0 0 12px rgba(0, 0, 0, 0.08), 0 0 60px rgba(255, 255, 255, 0.3)',
};

export const LiquidGlassCard = ({
  children,
  className = '',
  draggable = true,
  expandable = false,
  width,
  height,
  expandedWidth,
  expandedHeight,
  blurIntensity = 'xl',
  borderRadius = '32px',
  glowIntensity = 'sm',
  shadowIntensity = 'md',
  showDragHandle = true,
  ...props
}: LiquidGlassCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpansion = (e: MouseEvent<HTMLElement>) => {
    if (!expandable) return;
    if ((e.target as HTMLElement).closest('a, button, input, select, textarea')) return;
    setIsExpanded((prev) => !prev);
  };

  const containerVariants: Variants | undefined = expandable
    ? {
        collapsed: {
          width: width || 'auto',
          height: height || 'auto',
          transition: { duration: 0.4, ease: [0.5, 1.5, 0.5, 1] },
        },
        expanded: {
          width: expandedWidth || 'auto',
          height: expandedHeight || 'auto',
          transition: { duration: 0.4, ease: [0.5, 1.5, 0.5, 1] },
        },
      }
    : undefined;

  const MotionComponent: any = draggable || expandable ? motion.div : 'div';

  const motionProps =
    draggable || expandable
      ? {
          variants: containerVariants,
          animate: expandable ? (isExpanded ? 'expanded' : 'collapsed') : undefined,
          onClick: expandable ? handleToggleExpansion : undefined,
          drag: draggable,
          dragConstraints: draggable ? { left: 0, right: 0, top: 0, bottom: 0 } : undefined,
          dragElastic: draggable ? 0.3 : undefined,
          dragTransition: draggable
            ? { bounceStiffness: 300, bounceDamping: 10, power: 0.3 }
            : undefined,
          whileDrag: draggable ? { scale: 1.02 } : undefined,
          whileHover: { scale: 1.01 },
          whileTap: { scale: 0.98 },
        }
      : {};

  return (
    <>
      {/* Hidden SVG Filter */}
      <svg className="hidden">
        <defs>
          <filter id="glass-blur" x="0" y="0" width="100%" height="100%" filterUnits="objectBoundingBox">
            <feTurbulence type="fractalNoise" baseFrequency="0.003 0.007" numOctaves="1" result="turbulence" />
            <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="200" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      <MotionComponent
        className={cn(
          `relative ${draggable ? 'cursor-grab active:cursor-grabbing' : ''} ${
            expandable ? 'cursor-pointer' : ''
          }`,
          className
        )}
        style={{
          borderRadius,
          ...(width && !expandable && { width }),
          ...(height && !expandable && { height }),
        }}
        {...motionProps}
        {...props}
      >
        {draggable && showDragHandle && (
          <>
            <div className="pointer-events-none absolute -top-2 -right-2 z-40 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
              <GripHorizontal className="h-4 w-4 text-white/70" />
            </div>
            <div className="pointer-events-none absolute -bottom-1 -left-1 h-3 w-3 rounded-sm bg-white/30 shadow-[0_0_10px_rgba(255,255,255,0.35)]" />
            <div className="pointer-events-none absolute -top-1 -right-1 h-3 w-3 rounded-sm bg-white/30 shadow-[0_0_10px_rgba(255,255,255,0.35)]" />
          </>
        )}

        {/* Bend Layer (Backdrop blur with distortion) */}
        <div
          className={`absolute inset-0 ${blurClasses[blurIntensity]} z-0`}
          style={{ borderRadius, filter: 'url(#glass-blur)' }}
        />

        {/* Face Layer (Main shadow and glow) */}
        <div className="absolute inset-0 z-10" style={{ borderRadius, boxShadow: glowStyles[glowIntensity] }} />

        {/* Edge Layer (Inner highlights) */}
        <div className="absolute inset-0 z-20" style={{ borderRadius, boxShadow: shadowStyles[shadowIntensity] }} />

        {/* Content */}
        <div className={cn('relative z-30')}>{children}</div>
      </MotionComponent>
    </>
  );
};
