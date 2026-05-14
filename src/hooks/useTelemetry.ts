import { useGridStore } from '../store/useGridStore';

export const useTelemetry = () => {
  const powerHistory = useGridStore((state) => state.powerHistory);
  const gridState = useGridStore((state) => state.gridState);

  // Calculate some derived metrics for the UI
  const peakPower = Math.max(...powerHistory.map((d) => d.totalMW), 0);
  const avgPower = powerHistory.length > 0 
    ? powerHistory.reduce((acc, d) => acc + d.totalMW, 0) / powerHistory.length 
    : 0;

  return {
    powerHistory,
    peakPower: Number(peakPower.toFixed(2)),
    avgPower: Number(avgPower.toFixed(2)),
    currentPower: gridState.totalMW,
    gridStability: gridState.gridStability,
  };
};
