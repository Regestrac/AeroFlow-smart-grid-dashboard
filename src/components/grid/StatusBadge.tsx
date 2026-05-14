import React from 'react';
import type { TurbineStatus } from '../../engine/types';
import { clsx } from 'clsx';

interface StatusBadgeProps {
  status: TurbineStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = {
    optimal: { color: 'text-optimal-color', bg: 'bg-optimal-color/10', label: 'Optimal' },
    warning: { color: 'text-warning-color', bg: 'bg-warning-color/10', label: 'Warning' },
    critical: { color: 'text-critical-color', bg: 'bg-critical-color/10', label: 'Critical' },
    offline: { color: 'text-text-secondary', bg: 'bg-surface-border', label: 'Offline' },
    maintenance: { color: 'text-accent-color', bg: 'bg-accent-color/10', label: 'Maintenance' },
  };

  const { color, bg, label } = config[status];

  return (
    <div className={clsx(
      "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
      bg, color
    )}>
      <div className={clsx("w-1.5 h-1.5 rounded-full", color.replace('text-', 'bg-'))} />
      {label}
    </div>
  );
};
