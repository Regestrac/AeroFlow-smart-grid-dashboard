import { create } from 'zustand';
import type { GridState, DataPoint } from '../engine/types';
import { SimulationEngine } from '../engine/SimulationEngine';

interface GridStore {
  gridState: GridState;
  powerHistory: DataPoint[];
  engine: SimulationEngine;
  setWindSpeed: (speed: number) => void;
  setBladeAngle: (angle: number) => void;
  toggleTurbineShutdown: (id: string) => void;
  applyPreset: (preset: 'calm' | 'storm' | 'peak') => void;
  tick: () => void;
}

const initialEngine = new SimulationEngine(12, 25);

export const useGridStore = create<GridStore>((set, get) => ({
  gridState: initialEngine.getState(),
  powerHistory: [],
  engine: initialEngine,

  setWindSpeed: (speed) => {
    const { engine, gridState } = get();
    const newState = engine.tick(speed, gridState.bladeAngle);
    set({ gridState: newState });
  },

  setBladeAngle: (angle) => {
    const { engine, gridState } = get();
    const newState = engine.tick(gridState.windSpeed, angle);
    set({ gridState: newState });
  },

  toggleTurbineShutdown: (id) => {
    const { engine } = get();
    engine.toggleShutdown(id);
    const newState = engine.tick();
    set({ gridState: newState });
  },

  applyPreset: (preset) => {
    const { engine } = get();
    let wind = 12;
    let angle = 25;

    switch (preset) {
      case 'calm':
        wind = 8;
        angle = 45;
        break;
      case 'storm':
        wind = 22;
        angle = 10;
        break;
      case 'peak':
        wind = 14;
        angle = 15;
        break;
    }

    const newState = engine.tick(wind, angle);
    set({ gridState: newState });
  },

  tick: () => {
    const { engine, powerHistory } = get();
    const newState = engine.tick();
    
    const newDataPoint: DataPoint = {
      timestamp: newState.timestamp,
      totalMW: newState.totalMW,
      gridStability: newState.gridStability,
    };

    // Keep last 120 points (60 seconds at 500ms intervals)
    const newHistory = [...powerHistory, newDataPoint].slice(-120);

    set({ 
      gridState: newState,
      powerHistory: newHistory
    });
  },
}));
