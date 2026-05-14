import React from 'react';
import { useGridStore } from '../../store/useGridStore';
import { GlassCard } from '../ui/GlassCard';
import { Zap, Shield, CheckCircle } from 'lucide-react';
import AnimatedValue from '../ui/AnimatedValue';

export const GridStatsBar: React.FC = () => {
  const { turbines, totalMW, gridStability } = useGridStore((state) => state.gridState);
  const activeCount = turbines.filter(t => t.powerOutput > 0).length;

  const stats = [
    {
      label: 'Total Output',
      value: totalMW,
      suffix: ' MW',
      icon: Zap,
      color: 'text-accent-color',
      decimals: 2
    },
    {
      label: 'Grid Stability',
      value: gridStability,
      suffix: '%',
      icon: Shield,
      color: gridStability > 80 ? 'text-optimal-color' : 'text-warning-color',
      decimals: 0
    },
    {
      label: 'Active Turbines',
      value: activeCount,
      suffix: ` / ${turbines.length}`,
      icon: CheckCircle,
      color: 'text-text-primary',
      decimals: 0
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      {stats.map((stat, i) => (
        <GlassCard key={i} className="flex items-center gap-3 md:gap-4 py-3 md:py-4 px-4 md:px-6 border-accent-color/10 bg-accent-color/2">
          <div className={`p-2.5 md:p-3 rounded-xl bg-surface-color border border-surface-border ${stat.color}`}>
            <stat.icon className="w-4 h-4 md:w-5 md:h-5" />
          </div>
          <div>
            <p className="text-[9px] md:text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-0.5 md:mb-1">{stat.label}</p>
            <div className="text-xl md:text-2xl font-bold tracking-tight">
              <AnimatedValue value={stat.value} decimals={stat.decimals} />
              <span className="text-xs md:text-sm font-medium text-text-secondary ml-1">{stat.suffix}</span>
            </div>
          </div>
        </GlassCard>
      ))}
    </div>
  );
};
