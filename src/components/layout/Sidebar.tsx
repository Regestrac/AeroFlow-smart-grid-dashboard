import React from 'react';
import { Zap, Settings, BarChart3, Home } from 'lucide-react';
import { clsx } from 'clsx';

interface SidebarProps {
  currentView?: 'grid' | 'telemetry' | 'settings';
  onViewChange?: (view: 'grid' | 'telemetry' | 'settings') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView = 'grid', onViewChange }) => {
  const menuItems = [
    { id: 'grid' as const, icon: Home, label: 'Grid View' },
    { id: 'telemetry' as const, icon: BarChart3, label: 'Telemetry' },
    { id: 'settings' as const, icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="w-16 md:w-20 flex flex-col items-center py-6 border-r border-surface-border glass">
      {/* Logo */}
      <div className="p-3 bg-accent-color/10 rounded-xl mb-8">
        <Zap className="w-6 h-6 md:w-8 md:h-8 text-accent-color" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-4 w-full px-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange?.(item.id)}
              className={clsx(
                "relative flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200 group",
                isActive
                  ? "bg-accent-color/20 text-accent-color"
                  : "text-text-secondary hover:text-white hover:bg-surface-color"
              )}
            >
              <Icon className="w-5 h-5 md:w-6 md:h-6 mb-1" />
              <span className="text-[9px] md:text-[10px] font-medium uppercase tracking-wider">
                {item.label}
              </span>
              
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-accent-color rounded-r-full" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Status Indicator */}
      <div className="mt-auto flex flex-col items-center gap-2">
        <div className="relative">
          <div className="w-3 h-3 bg-optimal-color rounded-full animate-pulse" />
          <div className="absolute inset-0 w-3 h-3 bg-optimal-color rounded-full animate-ping opacity-50" />
        </div>
        <span className="text-[9px] text-text-secondary font-medium uppercase tracking-wider">
          Online
        </span>
      </div>
    </aside>
  );
};
