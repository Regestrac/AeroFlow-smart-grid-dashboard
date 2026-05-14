# AeroFlow Smart Grid Dashboard - Architecture Map

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           USER INTERFACE LAYER                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Header     │  │   Sidebar    │  │  GridView    │  │  Telemetry   │     │
│  │              │  │ (Controls)   │  │              │  │   Panel      │     │
│  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            REACT HOOKS LAYER                                │
│  ┌──────────────────────────┐  ┌──────────────────────────┐                 │
│  │    useSimulation()       │  │    useTelemetry()        │                 │
│  │  - 500ms tick loop       │  │  - Power history (60s)   │                 │
│  │  - Drives engine.tick()  │  │  - Rolling window data   │                 │
│  └──────────────────────────┘  └──────────────────────────┘                 │
└─────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            STATE MANAGEMENT LAYER                           │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                      Zustand Store (useGridStore)                    │   │
│  │  - Grid state (6 turbines)                                           │   │
│  │  - Global controls (wind speed, blade angle)                         │   │
│  │  - Telemetry data (power history)                                    │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SIMULATION ENGINE LAYER                           │
│  ┌──────────────────────────┐  ┌──────────────────────────┐                 │
│  │   SimulationEngine.ts    │  │       physics.ts         │                 │
│  │  - State management      │  │  - calculatePower()      │                 │
│  │  - tick() method         │  │  - calculateStress()     │                 │
│  │  - Turbine operations    │  │  - deriveStatus()        │                 │
│  └──────────────────────────┘  └──────────────────────────┘                 │
│                                   │                                         │
│                                   ▼                                         │
│                          ┌──────────────────┐                               │
│                          │     types.ts     │                               │
│                          │  - Domain types  │                               │
│                          └──────────────────┘                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Component Hierarchy

```
App.tsx
├── Header.tsx (layout)
│   └── Toggle (for Sidebar)
├── Sidebar.tsx (layout)
│   └── ControlPanel.tsx (controls)
│       ├── WindSpeedSlider.tsx
│       ├── BladeAngleDial.tsx
│       └── PresetButtons.tsx
├── GridView.tsx (grid)
│   ├── TurbineCard.tsx (×6)
│   │   ├── StatusBadge.tsx
│   │   ├── AnimatedValue.tsx (ui)
│   │   └── Toggle.tsx (ui)
│   └── EnergyFlowCanvas.tsx
└── TelemetryPanel.tsx (telemetry)
    ├── GridStatsBar.tsx
    │   └── AnimatedValue.tsx (ui)
    └── PowerLineChart.tsx
```

## Data Flow Diagram

```
┌─────────────┐
│   USER      │
│   INPUT     │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────┐
│                    React Components                         │
│  (Header, Sidebar, GridView, TelemetryPanel)                │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   Custom React Hooks                        │
│  useSimulation() → useTelemetry()                           │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   Zustand Store                             │
│  useGridStore (state management & subscriptions)            │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              SimulationEngine.tick() (every 500ms)          │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   Physics Functions                         │
│  calculatePower() → calculateStress() → deriveStatus()      │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   Updated State                             │
│  (Power, Stress, RPM, Temperature, Status)                  │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   UI Re-render                              │
│  (Real-time updates to charts, cards, animations)           │
└─────────────────────────────────────────────────────────────┘
```

## Module Responsibilities

### Engine Layer (React-Agnostic)
- **SimulationEngine.ts**: Core simulation class managing turbine state and time-stepping
- **physics.ts**: Pure functions for physics calculations (power, stress, status, stability)
- **types.ts**: Domain types and interfaces (Turbine, GridState, etc.)

### Hooks Layer (React Integration)
- **useSimulation.ts**: Drives the 500ms simulation loop via useEffect + setInterval
- **useTelemetry.ts**: Maintains rolling 60-second power history for charts

### Components Layer (UI)
- **layout/**: Navigation and structural components (Header, Sidebar)
- **controls/**: User input controls (sliders, dials, presets)
- **grid/**: Turbine visualization and energy flow animation
- **telemetry/**: Charts and statistics display
- **ui/**: Reusable UI primitives (GlassCard, AnimatedValue, Toggle)

### State Management
- **useGridStore.ts**: Zustand store for global state (turbines, controls, telemetry)

## Technology Stack

```
┌─────────────────────────────────────────────────────────────┐
│                     BUILD & DEV TOOLS                       │
│  Vite 8.0.12 │ TypeScript 6.0.2 │ ESLint                    │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND FRAMEWORK                      │
│  React 19.2.6 │ React DOM 19.2.6                            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     STATE & DATA                            │
│  Zustand 5.0.13 │ Recharts 3.8.1                            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     UI & ANIMATION                          │
│  Framer Motion 12.38.0 │ Lucide React 1.14.0 │ clsx 2.1.1   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                     STYLING                                 │
│  Vanilla CSS │ CSS Custom Properties │ Glassmorphism        │
└─────────────────────────────────────────────────────────────┘
```

## Key Design Patterns

### 1. Separation of Concerns
- **Business Logic**: Engine layer (React-agnostic)
- **UI Logic**: Components and hooks
- **State**: Zustand store
- **Presentation**: React components

### 2. Pure Functions
- Physics calculations are pure, testable functions
- No side effects in `physics.ts`
- Easy to unit test

### 3. React-Agnostic Core
- SimulationEngine can be used outside React
- Enables testing without React context
- Portable to other frameworks if needed

### 4. Custom Hooks for Side Effects
- `useSimulation`: Manages interval lifecycle
- `useTelemetry`: Handles data accumulation
- Clean separation of effect logic from components

### 5. Component Composition
- Reusable UI primitives in `components/ui/`
- Feature-specific components in subdirectories
- Clear hierarchy from App to leaf components

## Performance Optimizations

1. **React-Agnostic Engine**: Prevents unnecessary re-renders of simulation logic
2. **Canvas Animation**: Energy flow uses HTML5 Canvas for performant continuous animation
3. **Memoization**: Components memoized where appropriate
4. **Efficient State Updates**: Zustand's selector-based subscriptions prevent unnecessary updates
5. **CSS Animations**: UI transitions use CSS for GPU acceleration

## Simulation Physics Model

```
┌─────────────────────────────────────────────────────────────┐
│                    INPUT PARAMETERS                         │
│  Wind Speed (0-25 m/s) │ Blade Angle (0-90°)                │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                    POWER CALCULATION                        │
│  P = Pmax × η_wind × η_angle × η_stress                     │
│  - Cut-in: 3 m/s                                            │
│  - Rated: 12 m/s                                            │
│  - Cut-out: 25 m/s                                          │
│  - Max: 2.5 MW per turbine                                  │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                    STRESS CALCULATION                       │
│  F ∝ v² × cos(θ)                                            │
│  - Increases with high wind + low angle                     │
│  - Decreases during shutdown/low force                      │
│  - Failure threshold: >95%                                  │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                    STATUS DERIVATION                        │
│  - Optimal: Stress ≤ 70%                                    │
│  - Warning: Stress 70-90%                                   │
│  - Critical: Stress > 90%                                   │
│  - Offline: Manual shutdown                                 │
│  - Maintenance: Scheduled maintenance                       │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                    GRID STABILITY                           │
│  Stability = 100 - (avgStress × 0.8) - (offline × 5)        │
└─────────────────────────────────────────────────────────────┘
```

## File Structure Reference

```
aeroflow-smart-grid-dashboard/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── controls/
│   │   │   ├── BladeAngleDial.tsx
│   │   │   ├── ControlPanel.tsx
│   │   │   ├── PresetButtons.tsx
│   │   │   └── WindSpeedSlider.tsx
│   │   ├── grid/
│   │   │   ├── EnergyFlowCanvas.tsx
│   │   │   ├── GridView.tsx
│   │   │   ├── StatusBadge.tsx
│   │   │   └── TurbineCard.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── telemetry/
│   │   │   ├── GridStatsBar.tsx
│   │   │   ├── PowerLineChart.tsx
│   │   │   └── TelemetryPanel.tsx
│   │   └── ui/
│   │       ├── AnimatedValue.tsx
│   │       ├── GlassCard.tsx
│   │       └── Toggle.tsx
│   ├── engine/
│   │   ├── SimulationEngine.ts
│   │   ├── physics.ts
│   │   └── types.ts
│   ├── hooks/
│   │   ├── useSimulation.ts
│   │   └── useTelemetry.ts
│   ├── store/
│   │   └── useGridStore.ts
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── .gitignore
├── ARCHITECTURE.md
├── eslint.config.js
├── index.html
├── package.json
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## Integration Points

### External Dependencies
- **Recharts**: For power line chart visualization
- **Framer Motion**: For smooth UI transitions and animations
- **Lucide React**: For consistent iconography
- **Zustand**: For state management

### Internal Dependencies
- **Components → Store**: All components subscribe to useGridStore
- **Hooks → Engine**: useSimulation calls SimulationEngine.tick()
- **Hooks → Store**: useTelemetry subscribes to power output
- **Engine → Physics**: SimulationEngine uses physics functions
- **All → Types**: Shared types.ts for type safety

## Extension Points

### Adding New Physics Calculations
1. Add pure function to `src/engine/physics.ts`
2. Add type to `src/engine/types.ts` if needed
3. Call from `SimulationEngine.tick()`

### Adding New UI Components
1. Create component in appropriate `src/components/` subdirectory
2. Use shared UI primitives from `src/components/ui/`
3. Subscribe to store via useGridStore

### Adding New Telemetry
1. Extend state in `src/store/useGridStore.ts`
2. Create hook in `src/hooks/` if needed
3. Build visualization component in `src/components/telemetry/`

### Adding New Controls
1. Add control state to `src/store/useGridStore.ts`
2. Create control component in `src/components/controls/`
3. Wire up to SimulationEngine if it affects physics
