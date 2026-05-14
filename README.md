# AeroFlow Smart Grid Dashboard

A high-performance, real-time wind farm simulation and telemetry dashboard. Engineered with React, TypeScript, and a custom physics-driven simulation engine.

## 🚀 Overview

AeroFlow is a sophisticated digital twin of a wind farm, providing deep insights into mechanical stress, power generation efficiency, and grid stability. It features a real-time simulation loop (500ms) that calculates turbine behavior based on environmental variables and operator inputs.

### Key Features

- **Real-time Physics Engine**: Simulates mechanical stress, power curves, RPM, and temperature.
- **Interactive Controls**: Dynamic wind speed adjustment and blade pitch control.
- **Visual Telemetry**: Live power generation charts using Recharts.
- **Energy Flow Visualization**: Custom HTML5 Canvas animation showing power transmission from turbines to the grid hub.
- **Turbine Management**: Individual controls for shutdown and maintenance modes.
- **Scenario Presets**: One-click application of environmental conditions (Calm, Storm, Peak).
- **Responsive Premium Design**: Sleek glassmorphism interface with custom micro-animations.

## � Project Architecture

The project follows a clean, modular architecture with clear separation of concerns:

```
src/
├── engine/                  # Core simulation logic (React-agnostic)
│   ├── SimulationEngine.ts  # Class managing all turbine state + time-steps
│   ├── physics.ts           # Pure functions: power calc, stress calc, failure logic
│   └── types.ts             # All domain TypeScript types/interfaces
├── hooks/                   # Custom React hooks
│   ├── useSimulation.ts     # Drives the 500ms tick via useEffect + setInterval
│   └── useTelemetry.ts      # Accumulates the last 60s power history
├── components/
│   ├── layout/
│   │   ├── Header.tsx       # Top navigation bar with controls toggle
│   │   └── Sidebar.tsx      # Collapsible sidebar component
│   ├── controls/
│   │   ├── ControlPanel.tsx         # Global wind + blade angle + presets
│   │   ├── WindSpeedSlider.tsx      # 0-25 m/s range slider with gradient
│   │   ├── BladeAngleDial.tsx       # SVG-based rotary dial (0-90°)
│   │   └── PresetButtons.tsx        # Calm, Storm, Peak scenario buttons
│   ├── grid/
│   │   ├── GridView.tsx             # 2×3 turbine grid layout
│   │   ├── TurbineCard.tsx          # Individual turbine + status + controls
│   │   ├── EnergyFlowCanvas.tsx     # Canvas animated energy flow lines
│   │   └── StatusBadge.tsx          # Color-coded status indicators
│   ├── telemetry/
│   │   ├── TelemetryPanel.tsx       # Container for charts and stats
│   │   ├── PowerLineChart.tsx       # Recharts line chart (last 60s)
│   │   └── GridStatsBar.tsx         # Total MW, stability %, turbines online
│   └── ui/                          # Shared UI primitives
│       ├── GlassCard.tsx            # Glassmorphism card component
│       ├── AnimatedValue.tsx        # Number counter animation
│       └── Toggle.tsx               # Custom toggle switch
├── App.tsx                  # Main application component
├── main.tsx                 # Application entry point
└── index.css                # Global styles and design tokens
```

## �🛠 Tech Stack

- **Frontend Framework**: React 19.2.6 with TypeScript 6.0.2
- **State Management**: Zustand 5.0.13 (lightweight, performant state store)
- **Animations**: Framer Motion 12.38.0 (smooth transitions, micro-animations)
- **Charts**: Recharts 3.8.1 (declarative charting library)
- **Icons**: Lucide React 1.14.0 (consistent icon set)
- **Build Tool**: Vite 8.0.12 (fast HMR, optimized builds)
- **Styling**: Vanilla CSS with CSS custom properties (design tokens)
- **Utilities**: clsx 2.1.1 (conditional className utility)

## 🧬 Simulation Model

The simulation follows a physics-based model that calculates turbine behavior in real-time:

### Power Calculation
Power output is calculated using a simplified wind turbine power curve:
- **Cut-in speed**: 3 m/s (minimum wind to generate power)
- **Rated speed**: 12 m/s (optimal power generation)
- **Cut-out speed**: 25 m/s (safety shutdown)
- **Blade angle efficiency**: $\cos(\theta)$ where $\theta$ is blade pitch (0° = full exposure, 90° = feathered)
- **Stress penalty**: Reduces power as mechanical stress approaches failure
- **Formula**: $P = P_{max} \times \eta_{wind} \times \eta_{angle} \times \eta_{stress}$
- **Max power per turbine**: 2.5 MW

### Mechanical Stress
Stress accumulates based on environmental conditions:
- **Force calculation**: $F \propto v^2 \times \cos(\theta)$
- **Stress increases**: When high wind speed combines with low blade angle (maximum force)
- **Stress decreases**: During shutdown or low-force conditions (gradual recovery)
- **Failure threshold**: Stress > 90% triggers critical status, >95% causes failure

### Status Derivation
Turbine status is derived from stress and operational flags:
- **Optimal**: Stress ≤ 70%, turbine operational
- **Warning**: Stress 70-90%, requires attention
- **Critical**: Stress > 90%, imminent failure risk
- **Offline**: Manually shut down by operator
- **Maintenance**: Under scheduled maintenance

### Grid Stability
Overall grid stability (0-100%) is calculated from:
- Average mechanical stress of active turbines
- Availability penalty for offline turbines (5% per turbine)
- Formula: $Stability = 100 - (avgStress \times 0.8) - (offlineTurbines \times 5)$

### Temperature Simulation
Temperature responds to power output and stress:
- Increases with power generation and mechanical stress
- Gradual cooling toward ambient temperature (25°C)
- Simulates thermal inertia with delayed response

## 🎮 User Interface Walkthrough

### Header
- Displays project branding and status indicators
- Toggle button to open/close the Control Panel
- Shows system status: "Online", simulation delta, and hardware sync status

### Control Panel (Collapsible Sidebar)
- **Wind Speed Slider**: Adjust wind speed from 0-25 m/s with visual gradient
- **Blade Angle Dial**: Rotary control for blade pitch (0-90°)
- **Preset Buttons**:
  - **Calm Day**: 8 m/s wind, 45° blade angle (safe, low power)
  - **Storm Warning**: 22 m/s wind, 15° blade angle (high stress, high power)
  - **Grid Peak**: 18 m/s wind, 60° blade angle (balanced, optimal power)

### Grid View
- 2×3 grid layout displaying 6 turbines
- Each **Turbine Card** shows:
  - Animated spinning turbine icon (speed proportional to RPM)
  - Status badge with color coding (green/yellow/red/gray)
  - Real-time metrics: Power output (MW), RPM, Temperature (°C)
  - Mechanical stress progress bar (red when >80%)
  - Shutdown toggle button
  - Maintenance mode toggle
- **Energy Flow Canvas**: Animated dashed lines showing power transmission from each turbine to a central grid hub, with opacity and speed scaling with turbine output

### Telemetry Panel
- **Grid Stats Bar**: Large animated counters showing:
  - Total MW output (sum of all active turbines)
  - Grid Stability percentage
  - Number of active turbines
- **Power Line Chart**: Real-time line chart displaying:
  - Total MW over the last 60 seconds
  - Auto-scrolling x-axis
  - Smooth monotone curve interpolation
  - Grid stability overlay

## 🔧 Implementation Details

### Simulation Engine (`src/engine/SimulationEngine.ts`)
- Pure TypeScript class, independent of React
- Manages complete grid state for 6 turbines
- Exposes `tick()` method called every 500ms
- Methods for toggling shutdown and maintenance modes
- Initial state with randomized baseline stress and temperature

### Physics Functions (`src/engine/physics.ts`)
Pure, testable functions for calculations:
- `calculatePower()`: Wind speed, blade angle, stress → MW output
- `calculateStress()`: Wind speed, blade angle, current stress → stress delta
- `deriveStatus()`: Stress, flags → turbine status
- `calculateGridStability()`: All turbines → stability percentage

### Custom Hooks
- **useSimulation()**: Sets up 500ms interval, drives simulation loop, handles cleanup
- **useTelemetry()**: Subscribes to power output, maintains rolling 120-point history (60s @ 500ms)

### Performance Optimizations
- React-agnostic simulation engine prevents unnecessary re-renders
- Canvas-based energy flow animation (performant for continuous animation)
- Memoized components where appropriate
- Efficient state updates via Zustand
- CSS animations for smooth UI transitions

### Design System
- **Background**: `#080C14` (near-black navy)
- **Surface**: `rgba(255,255,255,0.04)` glassmorphism with backdrop blur
- **Accent**: `#00D4FF` (electric cyan)
- **Warning**: `#F59E0B` (amber)
- **Critical**: `#EF4444` (red)
- **Optimal**: `#10B981` (emerald)
- **Typography**: System fonts with optimized legibility

### Micro-Animations
- Turbine blade spin (CSS animation, speed bound to RPM)
- Energy flow particles (Canvas requestAnimationFrame)
- Number transitions (Framer Motion spring animations)
- Card pulse on critical state (CSS keyframes)
- Smooth panel transitions (Framer Motion)

## 🏁 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Regestrac/AeroFlow-smart-grid-dashboard.git
   cd "AeroFlow-smart-grid-dashboard"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

4. **Build for production**:
   ```bash
   npm run build
   ```

5. **Preview production build**:
   ```bash
   npm run preview
   ```

6. **Lint code**:
   ```bash
   npm run lint
   ```

## 🎯 Usage Guide

### Basic Operation
1. Open the Control Panel using the toggle in the Header
2. Adjust wind speed and blade angle using the slider and dial
3. Observe real-time changes in turbine metrics and grid stability
4. Use preset buttons to quickly apply common scenarios
5. Monitor the telemetry chart for power generation trends

### Stress Testing
1. Set wind speed to maximum (25 m/s)
2. Set blade angle to minimum (0°)
3. Watch mechanical stress build up on turbines
4. Observe status transitions: Optimal → Warning → Critical
5. Use shutdown toggle to prevent turbine failure

### Maintenance Mode
1. Toggle maintenance mode on any turbine
2. Turbine goes offline and stops generating power
3. Grid stability decreases due to reduced availability
4. Toggle off to return turbine to service

## 📈 Future Roadmap

### Planned Enhancements
- [ ] Individual turbine history view with detailed metrics
- [ ] Predictive failure alerts using ML-based stress analysis
- [ ] Exportable telemetry logs (CSV/JSON formats)
- [ ] Multi-site wind farm management dashboard
- [ ] Historical data persistence and replay
- [ ] Advanced analytics and reporting
- [ ] Mobile-responsive optimizations
- [ ] Dark/light theme toggle
- [ ] Customizable alert thresholds
- [ ] Integration with real weather APIs

### Technical Improvements
- [ ] Unit tests for physics functions
- [ ] Integration tests for simulation engine
- [ ] E2E tests with Playwright
- [ ] Performance profiling and optimization
- [ ] Web Workers for off-main-thread calculations
- [ ] Service Worker for offline capability

## 🤝 Contributing

This project demonstrates modern React architecture patterns:
- Clean separation of business logic and UI
- Type-safe development with TypeScript
- Performance-conscious design
- Scalable component architecture

## 📄 License

Developed as a demonstration of high-performance React application architecture and interactive data visualization.

---

**AeroFlow Smart Grid Dashboard** © 2026
