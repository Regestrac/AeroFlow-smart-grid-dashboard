import React, { useEffect, useRef, useState } from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { useGridStore } from '../../store/useGridStore';

export const PowerLineChart: React.FC = () => {
  const history = useGridStore((state) => state.powerHistory);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  // Format time for X-axis (HH:mm:ss)
  const chartData = history.map(d => ({
    ...d,
    time: new Date(d.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
  }));

  useEffect(() => {
    if (containerRef.current) {
      const timer = setTimeout(() => setIsReady(true), 100);
      return () => clearTimeout(timer);
    }
  }, []);

  if (chartData.length === 0 || !isReady) {
    return <div ref={containerRef} style={{ width: '100%', height: '256px' }} />;
  }

  return (
    <div ref={containerRef} style={{ width: '100%', height: '256px' }}>
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <AreaChart data={chartData} width="100%" height="100%">
          <defs>
            <linearGradient id="colorPower" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--accent-color)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--accent-color)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis
            dataKey="time"
            stroke="rgba(255,255,255,0.3)"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
            minTickGap={50}
          />
          <YAxis
            stroke="rgba(255,255,255,0.3)"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value} MW`}
            domain={[0, 'auto']}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(8, 12, 20, 0.9)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              fontSize: '12px'
            }}
            itemStyle={{ color: 'var(--accent-color)' }}
            labelStyle={{ color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}
          />
          <Area
            type="monotone"
            dataKey="totalMW"
            stroke="var(--accent-color)"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorPower)"
            isAnimationActive={false} // Faster updates
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
