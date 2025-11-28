"use client";

import * as React from "react";
import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { CommitsGrid } from "./CommitsGrid";

export type HumanStats = {
  verifiedHumans: number;
  totalHumans: number;
  baselinePopulation: number;
  baselineTimestamp: string;
  netChangePerSecond: number;
  baselineYear: number | null;
  sources: { name: string; url: string; indicator?: string }[];
};

type HumanProofStatsProps = {
  fetchStats: () => Promise<HumanStats>;
  refreshMs?: number;
  className?: string;
};

const formatNumber = (value: number) => {
  return new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 0,
  }).format(value);
};

// Compact formatter for the grid text (e.g. 8.26B) so it fits nicely
const formatCompact = (value: number) => {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(2)}B`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return `${Math.floor(value)}`;
};

export function HumanProofStats({ fetchStats, refreshMs = 30000, className }: HumanProofStatsProps) {
  const [stats, setStats] = useState<HumanStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [estimated, setEstimated] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [dragPos, setDragPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [dragOrigin, setDragOrigin] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const detailsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const next = await fetchStats();
        if (!cancelled) {
          setStats(next);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError("Failed to load stats");
        }
      }
    };

    load();

    const id = setInterval(load, refreshMs);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [fetchStats, refreshMs]);

  useEffect(() => {
    if (!stats) {
      setEstimated(null);
      return;
    }

    const start = Date.now();
    const base = stats.baselinePopulation;
    const rate = stats.netChangePerSecond;

    setEstimated(base);

    const id = setInterval(() => {
      const elapsedSeconds = (Date.now() - start) / 1000;
      setEstimated(base + rate * elapsedSeconds);
    }, 1000);

    return () => {
      clearInterval(id);
    };
  }, [stats]);

  const verified = stats?.verifiedHumans ?? 0;
  const total = stats?.totalHumans ?? 0;
  const ratio = total > 0 ? (verified / total) * 100 : 0;

  const gridText = stats
    ? `${formatCompact(verified)}/${formatCompact(total || 8_260_000_000)}`
    : "HUMAN 0";

  const handlePointerDown = (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (expanded) return;
    const point = "touches" in event ? event.touches[0] : event;
    setDragStart({ x: point.clientX, y: point.clientY });
    setDragOrigin(dragPos);
    setIsDragging(true);
  };

  const handlePointerMove = (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (expanded || !isDragging || !dragStart) return;
    const point = "touches" in event ? event.touches[0] : event;
    const dx = point.clientX - dragStart.x;
    const dy = point.clientY - dragStart.y;
    setDragPos({ x: dragOrigin.x + dx, y: dragOrigin.y + dy });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    setDragStart(null);
  };

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (!expanded || !detailsRef.current) return;
    event.preventDefault();
    detailsRef.current.scrollTop += event.deltaY;
  };

  return (
    <div
      className="relative w-full max-w-xl mx-auto"
      style={{
        transform: `translate3d(${dragPos.x}px, ${dragPos.y}px, 0)` ,
        transition: isDragging ? "none" : "transform 160ms ease-out",
        cursor: expanded ? "default" : isDragging ? "grabbing" : "grab",
      }}
      onMouseDown={!expanded ? handlePointerDown : undefined}
      onMouseMove={!expanded ? handlePointerMove : undefined}
      onMouseUp={!expanded ? handlePointerUp : undefined}
      onMouseLeave={!expanded ? handlePointerUp : undefined}
      onTouchStart={!expanded ? handlePointerDown : undefined}
      onTouchMove={!expanded ? handlePointerMove : undefined}
      onTouchEnd={!expanded ? handlePointerUp : undefined}
      onWheel={handleWheel}
    >
      <div
        className={cn(
          "bg-card rounded-[10px] sm:rounded-[15px] p-4 sm:p-6 flex flex-col gap-3 sm:gap-4 shadow-sm",
          isDragging && "shadow-lg",
          className
        )}
      >
      <div className="relative w-full overflow-hidden rounded-[8px] sm:rounded-[10px] border border-emerald-500/30 bg-card/80 mb-2 sm:mb-3">
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <CommitsGrid text={gridText} />
        </div>
        <div className="relative flex flex-col sm:flex-row sm:flex-nowrap flex-wrap items-start sm:items-center justify-between gap-3 p-2 sm:p-3">
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] sm:text-xs font-mono tracking-widest uppercase opacity-60 break-words">
              HUMAN-Ø PROVED
            </span>
            <div className="flex items-baseline gap-2 flex-wrap min-w-0">
              <span className="text-2xl sm:text-3xl font-semibold text-emerald-400">
                {formatNumber(verified)}
              </span>
              <span className="text-xs sm:text-sm font-mono opacity-90 break-words">
                / {formatNumber(total || 8_260_000_000)}
              </span>
            </div>
          </div>
          <div className="text-right sm:text-right text-left max-w-full sm:max-w-[45%]">
            <span className="text-[10px] sm:text-xs font-mono tracking-widest uppercase opacity-90 break-words">
              VERIFIED RATIO
            </span>
            <div className="text-2xl sm:text-3xl font-semibold text-cyan-400">
              {ratio.toFixed(2)}%
            </div>
          </div>
        </div>
      </div>
      <button
        type="button"
        className="mt-1 inline-flex items-center gap-1 self-start text-[10px] sm:text-[11px] font-mono uppercase tracking-widest opacity-80 hover:opacity-100 transition-opacity"
        onClick={() => setExpanded((prev) => !prev)}
      >
        <span>{expanded ? "Hide details" : "Show details"}</span>
        <span>{expanded ? "−" : "+"}</span>
      </button>

      {expanded && (
        <div
          ref={detailsRef}
          className="mt-3 max-h-64 sm:max-h-80 overflow-y-auto pr-1 space-y-3"
        >
          <div className="flex flex-col gap-1">
            <span className="text-[10px] sm:text-xs font-mono tracking-widest uppercase opacity-90">
              ESTIMATED GLOBAL POPULATION
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-lg sm:text-xl font-semibold text-emerald-300">
                {formatNumber(estimated ?? (total || 8_260_000_000))}
              </span>
              <span className="text-[10px] sm:text-xs font-mono opacity-70">
                Estimate, not real-time official data
              </span>
            </div>
            {stats && stats.baselineYear && (
              <span className="text-[10px] sm:text-xs font-mono opacity-80">
                Baseline year: {stats.baselineYear} — refreshed periodically from open datasets
              </span>
            )}
          </div>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] sm:text-xs font-mono tracking-widest uppercase opacity-90">
                LIVE STATUS
              </span>
              {error ? (
                <span className="text-[11px] sm:text-xs text-red-400 font-mono">
                  {error}
                </span>
              ) : (
                <span className="text-[11px] sm:text-xs text-emerald-300 font-mono">
                  {stats ? "STREAM.ACTIVE / DATA.SYNC" : "AWAITING.DATA / ..."}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-[10px] sm:text-xs font-mono tracking-widest uppercase opacity-90">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>
                {stats ? "HUMAN-Ø PROOF FEED" : "INITIALIZING FEED"}
              </span>
            </div>
          </div>

          {stats && stats.sources && stats.sources.length > 0 && (
            <div className="mt-2 flex flex-col gap-1 text-[9px] sm:text-[10px] font-mono opacity-90">
              <span>Data sources:</span>
              {stats.sources.map((source, index) => (
                <a
                  key={`${source.url}-${index}`}
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  className="underline decoration-dotted underline-offset-2 hover:opacity-100 opacity-80"
                >
                  {source.name}
                  {source.indicator ? ` (${source.indicator})` : ""}
                </a>
              ))}
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
}
