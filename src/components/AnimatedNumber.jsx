import React, { useEffect } from 'react';
import { motion, useSpring, useTransform, animate, useMotionValue } from 'framer-motion';

/**
 * A smooth, spring-based animated counter component.
 * @param {number} value - The target value to animate to.
 * @param {number} duration - Speed of the initial animation in seconds.
 * @param {boolean} format - Whether to format with .toLocaleString().
 * @param {string} className - Optional CSS classes.
 */
export default function AnimatedNumber({ value, duration = 2, format = true, className = "" }) {
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    stiffness: 100,
    damping: 30,
  });

  const displayValue = useTransform(springValue, (latest) => {
    const rounded = Math.round(latest);
    return format ? rounded.toLocaleString() : rounded;
  });

  useEffect(() => {
    const controls = animate(motionValue, value, { 
      duration: duration,
      ease: "easeOut"
    });
    return () => controls.stop();
  }, [value, duration, motionValue]);

  return (
    <motion.span className={className}>
      {displayValue}
    </motion.span>
  );
}
