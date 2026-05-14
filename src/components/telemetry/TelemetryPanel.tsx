import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import { PowerLineChart } from './PowerLineChart';
import { GridStatsBar } from './GridStatsBar';
import { BarChart3, Info } from 'lucide-react';

export const TelemetryPanel: React.FC = () => {
  return (
    <section className="p-4 m-8 md:p-8 space-y-6 md:space-y-8 border-t border-surface-border glass bg-white/[0.01]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-surface-color rounded-lg border border-surface-border">
            <BarChart3 className="w-4 h-4 md:w-5 md:h-5 text-accent-color" />
          </div>
          <div>
            <h2 className="text-base md:text-lg font-bold">Grid Telemetry</h2>
            <p className="text-[10px] md:text-xs text-text-secondary font-medium">Aggregate power generation and stability history</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[9px] md:text-[10px] font-bold text-text-secondary uppercase tracking-widest bg-surface-color px-2.5 py-1.5 rounded-full border border-surface-border">
          <Info className="w-3 h-3" />
          Rolling 60s Window
        </div>
      </div>

      <GridStatsBar />

      <GlassCard className="bg-black/20 border-white/5 p-4 md:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
          <span className="text-[10px] md:text-xs font-bold text-text-secondary uppercase tracking-widest">Total Power Output (MW)</span>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-accent-color" />
              <span className="text-[9px] md:text-[10px] font-medium text-text-secondary">Combined Array</span>
            </div>
          </div>
        </div>
        <div style={{ width: '100%', height: '256px' }}>
          <PowerLineChart />
        </div>
      </GlassCard>
    </section>
  );
};
