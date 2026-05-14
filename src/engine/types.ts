export type TurbineStatus = 'optimal' | 'warning' | 'critical' | 'offline' | 'maintenance';

export interface Turbine {
  id: string;
  name: string;
  status: TurbineStatus;
  powerOutput: number; // In MW
  mechanicalStress: number; // 0-100%
  rpm: number;
  temperature: number; // In °C
  isShutDown: boolean;
  maintenanceMode: boolean;
}

export interface GridState {
  turbines: Turbine[];
  windSpeed: number; // In m/s
  bladeAngle: number; // In degrees (0-90)
  totalMW: number;
  gridStability: number; // 0-100%
  timestamp: number;
}

export interface DataPoint {
  timestamp: number;
  totalMW: number;
  gridStability: number;
}
