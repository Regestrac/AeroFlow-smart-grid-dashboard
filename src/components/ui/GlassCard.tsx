import React from 'react';
import { clsx, type ClassValue } from 'clsx';

interface GlassCardProps {
  children: React.ReactNode;
  className?: ClassValue;
  hoverable?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className, 
  hoverable = false 
}) => {
  return (
    <div className={clsx(
      'glass p-6 transition-all duration-300',
      hoverable && 'glass-hover cursor-default',
      className
    )}>
      {children}
    </div>
  );
};
