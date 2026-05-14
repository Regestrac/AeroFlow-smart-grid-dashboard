import React, { useEffect } from 'react';
import { animate, useMotionValue, useTransform, motion } from 'framer-motion';

interface AnimatedValueProps {
  value: number;
  decimals?: number;
  suffix?: string;
  className?: string;
}

const AnimatedValue: React.FC<AnimatedValueProps> = ({
  value,
  decimals = 1,
  suffix = '',
  className
}) => {
  const count = useMotionValue(value);
  const rounded = useTransform(count, (latest) => {
    return latest.toFixed(decimals) + suffix;
  });

  useEffect(() => {
    const controls = animate(count, value, { duration: 0.5 });
    return controls.stop;
  }, [count, value]);

  return <motion.span className={className}>{rounded}</motion.span>;
};

export default AnimatedValue;
