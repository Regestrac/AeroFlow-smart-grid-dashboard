import React from 'react';
import { clsx } from 'clsx';
import { Activity, Thermometer, RotateCcw, Power } from 'lucide-react';
import { useGridStore } from '../../store/useGridStore';
import type { Turbine } from '../../engine/types';
import { GlassCard } from '../ui/GlassCard';
import { StatusBadge } from './StatusBadge';
import AnimatedValue from '../ui/AnimatedValue';

interface TurbineIconProps {
  rpm: number;
  status: string;
}

const TurbineIcon: React.FC<TurbineIconProps> = ({ rpm }) => {
  const rotationRef = React.useRef(0);
  const iconRef = React.useRef<HTMLDivElement>(null);
  const lastTimeRef = React.useRef<number>(0);
  const requestRef = React.useRef<number>(null);

  const targetSpeed = (rpm * 360) / 3600;
  const speedRef = React.useRef(0);

  React.useEffect(() => {
    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
      }

      const deltaTime = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      // Smoothly interpolate towards the target speed with delta time for consistency
      const lerpFactor = Math.min(0.1, deltaTime / 16.67);
      speedRef.current += (targetSpeed - speedRef.current) * lerpFactor;

      rotationRef.current = (rotationRef.current + speedRef.current * (deltaTime / 16.67)) % 360;
      if (iconRef.current) {
        iconRef.current.style.transform = `rotate(${rotationRef.current}deg)`;
      }
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      lastTimeRef.current = 0;
    };
  }, [targetSpeed]);

  return (
    <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
      {/* Tower */}
      <div className="absolute bottom-0 w-3 h-20 bg-linear-to-t from-surface-border to-white/10 rounded-full left-1/2 -translate-x-1/2" />

      {/* Blades */}
      <div ref={iconRef} className="relative z-10 will-change-transform">
        <svg width="100" height="100" viewBox="0 0 100 100" className="drop-shadow-[0_0_15px_rgba(0,212,255,0.4)]">
          <defs>
            <linearGradient id="bladeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
              <stop offset="100%" stopColor="#94A3B8" stopOpacity="0.6" />
            </linearGradient>
          </defs>
          {/* Central Hub */}
          <circle cx="50" cy="50" r="10" fill="#1E293B" stroke="var(--accent-color)" strokeWidth="1" />
          <circle cx="50" cy="50" r="4" fill="var(--accent-color)" />

          {/* Modern Fan Blades */}
          {[0, 120, 240].map((angle) => (
            <g key={angle} transform={`rotate(${angle} 50 50)`}>
              <path
                d="M50 50 C50 20 65 15 50 5 C35 15 50 20 50 50"
                fill="url(#bladeGrad)"
                stroke="white"
                strokeWidth="0.5"
                strokeOpacity="0.2"
              />
            </g>
          ))}
        </svg>
      </div>

      {/* Hub Glow */}
      {rpm > 0 && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-accent-color rounded-full blur-2xl opacity-20 animate-pulse" />
      )}
    </div>
  );
};

interface TurbineCardProps {
  turbine: Turbine;
}

export const TurbineCard: React.FC<TurbineCardProps> = ({ turbine }) => {
  const toggleShutdown = useGridStore((state) => state.toggleTurbineShutdown);

  return (
    <GlassCard
      data-turbine-id={turbine.id}
      className={clsx(
        "relative flex flex-col gap-4 overflow-hidden group border-2",
        turbine.status === 'critical' ? 'border-critical-color/40 pulse-critical' : 'border-transparent'
      )}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold">{turbine.name}</h3>
          <p className="text-[10px] text-text-secondary font-mono">{turbine.id}</p>
        </div>
        <StatusBadge status={turbine.status} />
      </div>

      <div className="flex items-center justify-between py-2">
        <TurbineIcon
          rpm={turbine.rpm}
          status={turbine.status}
        />

        <div className="flex-1 pl-4 md:pl-6 space-y-2 md:space-y-3">
          <div className="flex justify-between items-end">
            <span className="text-[10px] text-text-secondary uppercase font-bold">Power</span>
            <span className="text-xl font-bold font-mono">
              <AnimatedValue value={turbine.powerOutput} decimals={2} />
              <span className="text-[10px] ml-1 text-text-secondary font-normal">MW</span>
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-bold">
              <span className="text-text-secondary uppercase">Stress</span>
              <span className={clsx(
                turbine.mechanicalStress > 80 ? 'text-critical-color' :
                  turbine.mechanicalStress > 60 ? 'text-warning-color' : 'text-text-secondary'
              )}>
                {turbine.mechanicalStress?.toFixed(2)}%
              </span>
            </div>
            <div className="h-1.5 w-full bg-surface-border rounded-full overflow-hidden">
              <div
                className={clsx(
                  "h-full transition-all duration-500 rounded-full",
                  turbine.mechanicalStress > 80 ? 'bg-critical-color' :
                    turbine.mechanicalStress > 60 ? 'bg-warning-color' : 'bg-optimal-color'
                )}
                style={{ width: `${turbine.mechanicalStress?.toFixed(2)}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-1">
            <div className="flex items-center gap-1.5">
              <RotateCcw className="w-3 h-3 text-text-secondary" />
              <span className="text-[10px] font-mono text-text-secondary">{turbine.rpm} RPM</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Thermometer className="w-3 h-3 text-text-secondary" />
              <span className="text-[10px] font-mono text-text-secondary">{turbine.temperature?.toFixed(2)}°C</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 pt-3 border-t border-surface-border mt-2">
        <button
          onClick={() => toggleShutdown(turbine.id)}
          className={clsx(
            "flex items-center justify-center gap-2 p-1 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-200 border",
            turbine.isShutDown
              ? "bg-critical-color text-white border-critical-color shadow-[0_0_15px_rgba(239,68,68,0.4)]"
              : "bg-surface-color text-text-secondary border-surface-border hover:border-critical-color/50 hover:text-critical-color"
          )}
        >
          {turbine.isShutDown ? <RotateCcw className="w-4 h-4" /> : <Power className="w-4 h-4" />}
          {turbine.isShutDown ? 'Restart' : 'Shutdown'}
        </button>
      </div>

      {/* Background Decor */}
      <div className="absolute -right-4 -bottom-4 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-700">
        <Activity size={120} />
      </div>
    </GlassCard>
  );
};
