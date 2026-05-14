import React from 'react';
import { GlassCard } from '../ui/GlassCard';
import { WindSpeedSlider } from './WindSpeedSlider';
import { BladeAngleDial } from './BladeAngleDial';
import { PresetButtons } from './PresetButtons';
import { Settings, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ControlPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ isOpen, onClose }) => {
  const panelContent = (
    <aside className={`w-80 flex flex-col gap-6 m-2 p-6 h-full md:h-[calc(100vh-88px)] md:sticky md:top-[88px] overflow-y-auto border-r border-surface-border glass ${!isOpen ? 'hidden md:flex' : 'flex'}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-text-secondary" />
          <h2 className="text-sm font-bold uppercase tracking-widest text-text-secondary">
            Environment Controls
          </h2>
        </div>
        <button 
          onClick={onClose}
          className="p-1.5 md:hidden text-text-secondary hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <GlassCard className="bg-white/[0.02]">
        <WindSpeedSlider />
      </GlassCard>

      <GlassCard className="bg-white/[0.02]">
        <BladeAngleDial />
      </GlassCard>

      <div className="pt-6 border-t border-surface-border">
        <PresetButtons />
      </div>

      <div className="p-4 rounded-xl bg-accent-color/5 border border-accent-color/10">
        <p className="text-[10px] leading-relaxed text-text-secondary italic">
          Tip: High wind speed (&gt;20m/s) with low blade angle increases mechanical stress significantly. Adjust pitch to mitigate damage.
        </p>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop View */}
      <div className="hidden md:block">
        {panelContent}
      </div>

      {/* Mobile View with Transitions */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="mobile-overlay md:hidden"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="mobile-sidebar md:hidden"
            >
              {panelContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
