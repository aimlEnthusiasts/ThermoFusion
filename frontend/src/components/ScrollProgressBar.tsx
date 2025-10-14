import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      className="fixed top-16 left-0 right-0 h-1 bg-gradient-to-r from-white via-white/80 to-white origin-left z-50 shadow-[0_0_10px_rgba(255,255,255,0.5)]"
      style={{ scaleX }}
    />
  );
}
