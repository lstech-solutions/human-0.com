'use client';

import { LiquidGlassCard } from '@/components/ui/liquid-notification';
import { Bell } from 'lucide-react-native';

export function LiquidNotificationDemo() {
  return (
    <div
      className="p-6 lg:p-8 w-full max-w-xl mx-auto gap-3 h-[34rem] flex flex-col justify-end pb-10 rounded-xl border border-white/10 bg-gradient-to-br from-slate-900/60 via-slate-800/50 to-black/60 shadow-2xl"
      style={{
        background:
          'url("https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80") center / cover no-repeat',
      }}
    >
      <LiquidGlassCard
        shadowIntensity="md"
        blurIntensity="lg"
        borderRadius="18px"
        glowIntensity="xl"
        draggable={false}
        expandable
        expandedWidth="100%"
        expandedHeight="320px"
        width="100%"
        height="110px"
        className="z-10 flex items-start relative overflow-hidden"
      >
        <div className="relative flex items-center p-4 text-white h-full z-10 gap-3 w-full">
          <div className="flex-shrink-0 mr-2">
            <img
              src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=200&q=80"
              alt="App icon"
              width={56}
              height={56}
              className="rounded-xl"
            />
          </div>
          <div className="flex-grow pr-4 space-y-1">
            <div className="font-semibold text-lg flex items-center gap-2">
              <Bell className="w-5 h-5 text-emerald-200" /> HUMAN-0 Updates
            </div>
            <div className="text-sm text-slate-100/90">New components are available for you.</div>
            <div className="text-sm text-emerald-200">Liquid Glass notifications</div>
          </div>
          <div className="flex-shrink-0 ml-auto text-sm text-slate-200 self-start pt-1">12:34</div>
        </div>
        <img
          src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"
          alt="Hero"
          width={800}
          height={800}
          className="rounded-xl w-[92%] mx-auto h-full object-cover z-20"
        />
      </LiquidGlassCard>

      <LiquidGlassCard
        width="100%"
        height="110px"
        shadowIntensity="md"
        blurIntensity="lg"
        borderRadius="18px"
        glowIntensity="xl"
        className="z-10 flex items-start relative"
      >
        <div className="relative flex items-center p-4 text-white z-10 gap-3 w-full">
          <div className="flex-shrink-0 mr-2">
            <img
              src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=200&q=80"
              alt="Avatar"
              width={56}
              height={56}
              className="rounded-xl"
            />
          </div>
          <div className="flex-grow pr-4">
            <div className="font-semibold text-lg flex items-center gap-2">
              <Bell className="w-5 h-5 text-cyan-200" /> UI Lab
            </div>
            <div className="text-sm text-slate-100/90">Fresh layouts are ready to preview.</div>
          </div>
          <div className="flex-shrink-0 ml-auto text-sm text-slate-200 self-start pt-1">09:20</div>
        </div>
      </LiquidGlassCard>
    </div>
  );
}
