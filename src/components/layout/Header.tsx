import React from 'react';
import { Wind, ShieldCheck, Activity, Menu } from 'lucide-react';
import { useGridStore } from '../../store/useGridStore';

interface HeaderProps {
  onToggleControls: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleControls }) => {
  const stability = useGridStore((state) => state.gridState.gridStability);

  return (
    <header className="flex items-center justify-between px-4 md:px-8 py-4 border-b border-surface-border glass sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <button 
          onClick={onToggleControls}
          className="p-2 md:hidden bg-surface-color rounded-lg border border-surface-border text-text-secondary hover:text-white transition-colors"
          aria-label="Toggle Controls"
        >
          <Menu className="w-5 h-5" />
        </button>
        
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent-color/10 rounded-lg">
            <Wind className="w-6 h-6 md:w-8 md:h-8 text-accent-color" />
          </div>
          <div>
            <h1 className="text-lg md:text-2xl font-bold tracking-tight">AeroFlow</h1>
            <p className="text-[10px] md:text-xs text-text-secondary uppercase tracking-widest font-medium">Smart Grid</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-8">
        <div className="flex items-center gap-2 md:gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] md:text-xs text-text-secondary font-medium">Stability</p>
            <p className={`text-xs md:text-sm font-bold ${stability > 80 ? 'text-optimal-color' : stability > 50 ? 'text-warning-color' : 'text-critical-color'}`}>
              {stability}%
            </p>
          </div>
          <div className="p-1.5 md:p-2 bg-surface-color rounded-full">
            <ShieldCheck className={`w-4 h-4 md:w-5 md:h-5 ${stability > 80 ? 'text-optimal-color' : 'text-warning-color'}`} />
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3 bg-accent-color/10 px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-accent-color/20">
          <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-accent-color animate-pulse" />
          <span className="text-[10px] md:text-xs font-bold text-accent-color uppercase tracking-wider hidden xs:inline">Live</span>
          <Activity className="w-3.5 h-3.5 md:w-4 md:h-4 text-accent-color" />
        </div>
      </div>
    </header>
  );
};
