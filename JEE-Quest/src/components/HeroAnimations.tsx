import React, { useRef, useEffect, useState } from 'react';
import { motion, useAnimation, useTransform, useScroll } from 'framer-motion';

interface AnimatedPastPapersProps {
  children: React.ReactNode;
}

// Highlight sweep animation as a pseudo-underline
const HighlightSweep: React.FC<{ color: string; }> = ({ color }) => (
  <motion.span
    aria-hidden
    initial={{ scaleX: 0, boxShadow: '0 0 2px 1px #B7EACB, 0 0 4px 2px #5BB98C22' }}
    animate={{
      scaleX: 1,
      boxShadow: [
        '0 0 8px 2px #B7EACB, 0 0 16px 4px #5BB98C33',
        '0 0 2px 1px #B7EACB, 0 0 4px 2px #5BB98C22',
        '0 0 8px 2px #B7EACB, 0 0 16px 4px #5BB98C33',
      ],
      transition: {
        scaleX: { duration: 0.7, ease: 'easeInOut', delay: 0.2 },
        boxShadow: {
          duration: 1.5,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'reverse',
        },
      },
    }}
    style={{
      position: 'absolute',
      left: 0,
      bottom: 0,
      width: '100%',
      height: 2,
      background: color,
      borderRadius: 6,
      transformOrigin: 'left',
      zIndex: 0,
      pointerEvents: 'none',
    }}
  />
);

export const AnimatedPastPapers: React.FC<AnimatedPastPapersProps> = ({ children }) => {
  // Color reveal: animate color from gray to green
  const controls = useAnimation();
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  // Parallax effect
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 400], [0, 30]);

  useEffect(() => {
    if (!hasAnimated) {
      controls.start({ color: '#5BB98C' });
      setHasAnimated(true);
    }
  }, [controls, hasAnimated]);

  return (
    <motion.span
      ref={ref}
      style={{
        display: 'inline-block',
        position: 'relative',
        y,
        fontFamily: 'Inter, sans-serif',
      }}
      initial={{ color: '#B0C4B1' }}
      animate={controls}
      transition={{ duration: 0.9, ease: 'easeInOut' }}
    >
      <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
      <HighlightSweep color={'#B7EACB'} />
    </motion.span>
  );
};
