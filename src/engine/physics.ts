import type { Turbine, TurbineStatus } from './types';

/**
 * Calculates power output for a single turbine based on environmental and mechanical factors.
 * Ideal wind speed is ~12-14 m/s.
 * Blade angle (0-90°): 0° is full exposure, 90° is feathered (no power).
 */
export const calculatePower = (
  windSpeed: number,
  bladeAngle: number,
  stress: number,
  isShutDown: boolean,
  maintenanceMode: boolean
): number => {
  if (isShutDown || maintenanceMode || windSpeed < 3) return 0;

  // Power curve approximation: P = 0.5 * rho * A * v^3 * Cp
  // We'll use a simplified model for the dashboard.
  
  // Blade angle efficiency factor (0 at 90°, 1 at 0°)
  const angleEffect = Math.cos((bladeAngle * Math.PI) / 180);
  
  // Wind speed efficiency (cut-in: 3, rated: 12, cut-out: 25)
  let windEffect = 0;
  if (windSpeed >= 3 && windSpeed <= 12) {
    windEffect = (windSpeed - 3) / (12 - 3);
  } else if (windSpeed > 12 && windSpeed <= 25) {
    windEffect = 1.0; // Rated power
  } else if (windSpeed > 25) {
    windEffect = Math.max(0, 1 - (windSpeed - 25) / 5); // Rapid drop after cut-out
  }

  // Stress penalty (reduces power as turbine approaches failure)
  const stressPenalty = Math.max(0.2, 1 - stress / 200);

  const baseMaxPower = 2.5; // MW per turbine
  const power = baseMaxPower * windEffect * angleEffect * stressPenalty;
  
  return Math.max(0, Number(power.toFixed(2)));
};

/**
 * Calculates mechanical stress delta.
 * Stress increases with high wind speed and low blade angle (more force).
 */
export const calculateStress = (
  windSpeed: number,
  bladeAngle: number,
  currentStress: number,
  isShutDown: boolean
): number => {
  if (isShutDown) return -0.5; // Gradual cooling/recovery

  // Force is proportional to windSpeed^2
  const force = Math.pow(windSpeed, 2) * Math.cos((bladeAngle * Math.PI) / 180);
  
  // Stress increases if force is above a threshold (increased rate for visibility)
  const stressDelta = (force - 100) / 50;
  
  // Natural recovery if force is low (increased rate for visibility)
  const recovery = currentStress > 0 ? -0.5 : 0;

  return stressDelta + recovery;
};

/**
 * Derives status from mechanical stress and other flags.
 */
export const deriveStatus = (
  stress: number,
  isShutDown: boolean,
  maintenanceMode: boolean
): TurbineStatus => {
  if (maintenanceMode) return 'maintenance';
  if (isShutDown) return 'offline';
  if (stress > 90) return 'critical';
  if (stress > 70) return 'warning';
  return 'optimal';
};

/**
 * Calculates overall grid stability (0-100%).
 */
export const calculateGridStability = (turbines: Turbine[]): number => {
  const activeTurbines = turbines.filter(t => !t.isShutDown && !t.maintenanceMode);
  if (activeTurbines.length === 0) return 0;

  const totalStress = activeTurbines.reduce((acc, t) => acc + t.mechanicalStress, 0);
  const avgStress = totalStress / activeTurbines.length;
  
  // Stability drops as average stress increases
  const stability = 100 - (avgStress * 0.8);
  
  // Penalty for offline turbines
  const availabilityPenalty = (turbines.length - activeTurbines.length) * 5;
  
  return Math.max(0, Math.min(100, Math.round(stability - availabilityPenalty)));
};
