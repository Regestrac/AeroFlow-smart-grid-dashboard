import React from 'react';
import { useGridStore } from '../../store/useGridStore';

export const WindSpeedSlider: React.FC = () => {
  const windSpeed = useGridStore((state) => state.gridState.windSpeed);
  const setWindSpeed = useGridStore((state) => state.setWindSpeed);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <label className="text-sm font-medium text-text-secondary uppercase tracking-wider">
          Wind Speed
        </label>
        <span className="text-2xl font-bold text-accent-color">
          {windSpeed.toFixed(1)} <span className="text-sm font-normal text-text-secondary">m/s</span>
        </span>
      </div>
      <input
        type="range"
        min="0"
        max="30"
        step="0.1"
        value={windSpeed}
        onChange={(e) => setWindSpeed(parseFloat(e.target.value))}
        className="w-full h-2 bg-surface-border rounded-lg appearance-none cursor-pointer accent-accent-color"
        style={{
          background: `linear-gradient(to right, var(--optimal-color) 0%, var(--warning-color) 60%, var(--critical-color) 100%)`,
        }}
      />
      <div className="flex justify-between text-[10px] text-text-secondary font-medium px-1">
        <span>0</span>
        <span>10</span>
        <span>20</span>
        <span>30</span>
      </div>
    </div>
  );
};
