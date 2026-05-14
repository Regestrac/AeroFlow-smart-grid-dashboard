import React from 'react';
import { useGridStore } from '../../store/useGridStore';
import { TurbineCard } from './TurbineCard';
import { EnergyFlowCanvas } from './EnergyFlowCanvas';

export const GridView: React.FC = () => {
  const turbines = useGridStore((state) => state.gridState.turbines);

  return (
    <div className="relative flex-1 overflow-y-auto">
      <div className="p-4 md:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
          <div>
            <h2 className="text-lg md:text-xl font-bold">Turbine Array</h2>
            <p className="text-[10px] md:text-sm text-text-secondary font-medium">Real-time mechanical & electrical telemetry</p>
          </div>
          <div className="flex gap-4">
            <div className="px-3 py-1.5 mb-2 md:px-4 md:py-2 rounded-lg bg-surface-color border border-surface-border flex items-center gap-2">
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-optimal-color" />
              <span className="text-[9px] md:text-[10px] font-bold uppercase text-text-secondary tracking-wider">Optimal Sync</span>
            </div>
          </div>
        </div>

        {/* Background Flow */}
        <div className="relative">
          <EnergyFlowCanvas turbines={turbines} />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 relative z-10">
            {turbines.map((turbine) => (
              <TurbineCard key={turbine.id} turbine={turbine} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
