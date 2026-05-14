import React, { useRef, useEffect } from 'react';
import type { Turbine } from '../../engine/types';

interface EnergyFlowCanvasProps {
  turbines: Turbine[];
}

export const EnergyFlowCanvas: React.FC<EnergyFlowCanvasProps> = ({ turbines }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<Array<{ x: number; y: number; progress: number; speed: number; opacity: number }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles for each turbine
    const initParticles = () => {
      particlesRef.current = turbines.map((turbine) => ({
        x: 0,
        y: 0,
        progress: Math.random(),
        speed: turbine.powerOutput > 0 ? 0.005 + (turbine.powerOutput / 2.5) * 0.01 : 0,
        opacity: turbine.powerOutput > 0 ? 0.3 + (turbine.powerOutput / 2.5) * 0.5 : 0,
      }));
    };

    initParticles();

    // Calculate turbine positions (grid layout)
    const getTurbinePositions = () => {
      const positions: Array<{ x: number; y: number }> = [];
      const gridCols = window.innerWidth >= 1280 ? 3 : window.innerWidth >= 768 ? 2 : 1;
      const cardWidth = canvas.width / gridCols - 24;
      const cardHeight = 200;
      
      turbines.forEach((_, index) => {
        const col = index % gridCols;
        const row = Math.floor(index / gridCols);
        const x = col * (cardWidth + 24) + cardWidth / 2 + 12;
        const y = row * (cardHeight + 24) + cardHeight / 2 + 12;
        positions.push({ x, y });
      });
      
      return positions;
    };

    // Grid hub position (center of canvas)
    const getHubPosition = () => ({
      x: canvas.width / 2,
      y: canvas.height / 2,
    });

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const turbinePositions = getTurbinePositions();
      const hubPosition = getHubPosition();

      // Draw energy flow lines
      turbines.forEach((turbine, index) => {
        if (turbine.isShutDown || turbine.maintenanceMode || turbine.powerOutput <= 0) return;

        const startPos = turbinePositions[index];
        const particle = particlesRef.current[index];

        if (!particle || !startPos) return;

        // Update particle speed based on current power output
        particle.speed = turbine.powerOutput > 0 ? 0.005 + (turbine.powerOutput / 2.5) * 0.01 : 0;
        particle.opacity = turbine.powerOutput > 0 ? 0.3 + (turbine.powerOutput / 2.5) * 0.5 : 0;

        // Update progress
        particle.progress += particle.speed;
        if (particle.progress > 1) particle.progress = 0;

        // Calculate current position along the line
        const currentX = startPos.x + (hubPosition.x - startPos.x) * particle.progress;
        const currentY = startPos.y + (hubPosition.y - startPos.y) * particle.progress;

        // Draw the line
        ctx.beginPath();
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(hubPosition.x, hubPosition.y);
        ctx.strokeStyle = `rgba(0, 212, 255, ${particle.opacity * 0.3})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw the particle
        ctx.beginPath();
        ctx.arc(currentX, currentY, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 212, 255, ${particle.opacity})`;
        ctx.fill();

        // Draw glow effect
        ctx.beginPath();
        ctx.arc(currentX, currentY, 6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 212, 255, ${particle.opacity * 0.3})`;
        ctx.fill();
      });

      // Draw grid hub
      ctx.beginPath();
      ctx.arc(hubPosition.x, hubPosition.y, 15, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 212, 255, 0.2)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(0, 212, 255, 0.5)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Hub center
      ctx.beginPath();
      ctx.arc(hubPosition.x, hubPosition.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 212, 255, 0.8)';
      ctx.fill();

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [turbines]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
      style={{ opacity: 0.6 }}
    />
  );
};
