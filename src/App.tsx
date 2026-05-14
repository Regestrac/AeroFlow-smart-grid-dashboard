import { useState } from 'react';
import { Header } from './components/layout/Header';
import { ControlPanel } from './components/controls/ControlPanel';
import { GridView } from './components/grid/GridView';
import { TelemetryPanel } from './components/telemetry/TelemetryPanel';
import { useSimulation } from './hooks/useSimulation';

function App() {
  const [isControlsOpen, setIsControlsOpen] = useState(false);
  
  // Drive the simulation loop
  useSimulation();

  return (
    <div className="min-h-screen flex flex-col">
      <Header onToggleControls={() => setIsControlsOpen(!isControlsOpen)} />
      
      <div className="flex flex-1 relative overflow-hidden">
        <ControlPanel isOpen={isControlsOpen} onClose={() => setIsControlsOpen(false)} />
        
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <GridView />
            <TelemetryPanel />
          </div>
        </main>
      </div>
      
      <footer className="px-4 md:px-8 py-4 border-t border-surface-border bg-black/40 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-text-secondary font-medium tracking-widest uppercase">
        <span>System Status: Online</span>
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          <span>Simulation Delta: 500ms</span>
          <span>Hardware Sync: Active</span>
          <span className="text-accent-color">© 2026 AeroFlow Systems</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
