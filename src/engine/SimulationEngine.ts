import type { GridState } from './types';
import { calculatePower, calculateStress, deriveStatus, calculateGridStability } from './physics';

export class SimulationEngine {
  private state: GridState;

  constructor(initialWindSpeed: number = 10, initialBladeAngle: number = 30) {
    this.state = {
      turbines: Array.from({ length: 6 }).map((_, i) => ({
        id: `t-${i + 1}`,
        name: `Turbine ${i + 1}`,
        status: 'optimal',
        powerOutput: 0,
        mechanicalStress: 10 + Math.random() * 10,
        rpm: 0,
        temperature: 35 + Math.random() * 5,
        isShutDown: false,
        maintenanceMode: false,
      })),
      windSpeed: initialWindSpeed,
      bladeAngle: initialBladeAngle,
      totalMW: 0,
      gridStability: 100,
      timestamp: Date.now(),
    };
    
    // Initial calculation
    this.updateCalculations();
  }

  public tick(windSpeed?: number, bladeAngle?: number): GridState {
    if (windSpeed !== undefined) this.state.windSpeed = windSpeed;
    if (bladeAngle !== undefined) this.state.bladeAngle = bladeAngle;
    
    this.state.timestamp = Date.now();

    // Update each turbine
    this.state.turbines = this.state.turbines.map(turbine => {
      const stressDelta = calculateStress(
        this.state.windSpeed,
        this.state.bladeAngle,
        turbine.mechanicalStress,
        turbine.isShutDown
      );
      
      const newStress = Math.max(0, Math.min(100, turbine.mechanicalStress + stressDelta));
      const newStatus = deriveStatus(newStress, turbine.isShutDown, turbine.maintenanceMode);
      
      const newPower = calculatePower(
        this.state.windSpeed,
        this.state.bladeAngle,
        newStress,
        turbine.isShutDown,
        turbine.maintenanceMode
      );

      // RPM scales with power output
      const newRPM = turbine.isShutDown ? 0 : (newPower / 2.5) * 15 + (Math.random() * 0.5);
      
      // Temperature scales with stress and power
      const tempDelta = (newPower * 2 + newStress / 10 - (turbine.temperature - 25) / 5) * 0.1;
      const newTemp = Math.max(25, turbine.temperature + tempDelta);

      return {
        ...turbine,
        mechanicalStress: Number(newStress.toFixed(2)),
        status: newStatus,
        powerOutput: newPower,
        rpm: Number(newRPM.toFixed(1)),
        temperature: Number(newTemp.toFixed(1)),
      };
    });

    this.updateCalculations();
    return { ...this.state };
  }

  private updateCalculations() {
    this.state.totalMW = Number(
      this.state.turbines.reduce((acc, t) => acc + t.powerOutput, 0).toFixed(2)
    );
    this.state.gridStability = calculateGridStability(this.state.turbines);
  }

  public toggleShutdown(id: string) {
    this.state.turbines = this.state.turbines.map(t => 
      t.id === id ? { ...t, isShutDown: !t.isShutDown } : t
    );
  }

  public toggleMaintenance(id: string) {
    this.state.turbines = this.state.turbines.map(t => 
      t.id === id ? { ...t, maintenanceMode: !t.maintenanceMode } : t
    );
  }

  public getState(): GridState {
    return { ...this.state };
  }
}
