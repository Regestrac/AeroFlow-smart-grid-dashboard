import React from 'react';
import { Sun, CloudLightning, Zap } from 'lucide-react';
import { useGridStore } from '../../store/useGridStore';
import { clsx } from 'clsx';

export const PresetButtons: React.FC = () => {
  const applyPreset = useGridStore((state) => state.applyPreset);

  const presets = [
    { id: 'calm', name: 'Calm Day', icon: Sun, color: 'text-optimal-color', bg: 'bg-optimal-color/10' },
    { id: 'storm', name: 'Storm', icon: CloudLightning, color: 'text-critical-color', bg: 'bg-critical-color/10' },
    { id: 'peak', name: 'Peak Load', icon: Zap, color: 'text-warning-color', bg: 'bg-warning-color/10' },
  ] as const;

  return (
    <div className="space-y-3">
      <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">
        Scenario Presets
      </label>
      <div className="grid grid-cols-1 gap-2">
        {presets.map((preset) => (
          <button
            key={preset.id}
            onClick={() => applyPreset(preset.id)}
            className={clsx(
              "flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 group",
              "bg-surface-color border-surface-border hover:border-accent-color/50 hover:bg-surface-border"
            )}
          >
            <div className={clsx("p-2 rounded-lg transition-colors", preset.bg)}>
              <preset.icon className={clsx("w-4 h-4", preset.color)} />
            </div>
            <span className="text-sm font-semibold group-hover:text-white transition-colors">
              {preset.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
