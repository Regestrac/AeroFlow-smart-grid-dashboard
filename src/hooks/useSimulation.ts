import { useEffect, useRef } from 'react';
import { useGridStore } from '../store/useGridStore';

export const useSimulation = () => {
  const tick = useGridStore((state) => state.tick);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    // 500ms simulation interval
    intervalRef.current = window.setInterval(() => {
      tick();
    }, 500);

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [tick]);

  return null;
};
