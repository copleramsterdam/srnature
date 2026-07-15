import React from 'react';
import { motion } from 'motion/react';

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
  duration?: number;
  className?: string;
  distance?: number;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  delay = 0,
  direction = 'up',
  duration = 0.8,
  className = '',
  distance = 30,
}) => {
  const getVariants = () => {
    const x = direction === 'left' ? -distance : direction === 'right' ? distance : 0;
    const y = direction === 'up' ? distance : direction === 'down' ? -distance : 0;
    return {
      hidden: { 
        opacity: 0, 
        x, 
        y,
      },
      visible: { 
        opacity: 1, 
        x: 0, 
        y: 0,
      },
    };
  };

  return (
    <motion.div
      className={className}
      variants={getVariants()}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ 
        duration, 
        delay, 
        ease: [0.21, 1.02, 0.43, 1.01] // Beautiful custom cubic-bezier for a luxury feel
      }}
    >
      {children}
    </motion.div>
  );
};
