import React from 'react';
import { useGridStore } from '../../store/useGridStore';

export const BladeAngleDial: React.FC = () => {
  const bladeAngle = useGridStore((state) => state.gridState.bladeAngle);
  const setBladeAngle = useGridStore((state) => state.setBladeAngle);

  // SVG Dial constants
  const size = 120;
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (bladeAngle / 90) * circumference;

  return (
    <div className="flex flex-col items-center gap-4">
      <label className="text-sm font-medium text-text-secondary uppercase tracking-wider self-start">
        Blade Angle
      </label>
      
      <div className="relative group cursor-pointer" onClick={(e) => {
        // Simple click-to-set logic for the dial
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        let angle = (Math.atan2(y, x) * 180) / Math.PI + 90;
        if (angle < 0) angle += 360;
        if (angle <= 90) setBladeAngle(Math.min(90, Math.max(0, angle)));
      }}>
        <svg width={size} height={size} className="transform -rotate-90 drop-shadow-[0_0_15px_rgba(0,212,255,0.15)]">
          <defs>
            <radialGradient id="dialGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.05)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="url(#dialGradient)"
            stroke="var(--surface-border)"
            strokeWidth={stroke}
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="var(--accent-color)"
            strokeWidth={stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-300"
          />
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold tracking-tighter">{Math.round(bladeAngle)}°</span>
          <span className="text-[10px] text-accent-color uppercase font-bold tracking-widest opacity-80">Pitch</span>
        </div>

        {/* Rotatable needle */}
        <div 
          className="absolute top-1/2 left-1/2 w-1.5 h-[45%] bg-linear-to-t from-accent-color to-white origin-bottom transition-transform duration-300 rounded-full shadow-[0_0_8px_rgba(0,212,255,0.5)]"
          style={{ transform: `translate(-50%, -100%) rotate(${bladeAngle}deg)` }}
        />
      </div>

      <div className="w-full flex justify-between gap-2">
        <button 
          onClick={() => setBladeAngle(Math.max(0, bladeAngle - 5))}
          className="flex-1 py-1 bg-surface-color hover:bg-surface-border rounded text-xs font-bold transition-colors"
        >
          -5°
        </button>
        <button 
          onClick={() => setBladeAngle(Math.min(90, bladeAngle + 5))}
          className="flex-1 py-1 bg-surface-color hover:bg-surface-border rounded text-xs font-bold transition-colors"
        >
          +5°
        </button>
      </div>
    </div>
  );
};
