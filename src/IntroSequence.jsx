import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import DecryptText from './DecryptText';

const IntroSequence = ({ onComplete }) => {
  const containerRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    // 1. FADE OUT TIMER (3.5 Seconds)
    const timer = setTimeout(() => {
      setOpacity(0);
      setTimeout(onComplete, 1000);
    }, 3500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  // 2. MOUSE TRACKING
  const handleMouseMove = (e) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  };

  return (
    <motion.div 
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: opacity }}
      transition={{ duration: 1 }}
      className="fixed inset-0 z-50 bg-[#050505] cursor-none overflow-hidden flex items-center justify-center"
      onMouseMove={handleMouseMove}
    >
      {/* CROSSHAIR UI */}
      <div className="absolute top-0 bottom-0 w-[1px] bg-white/10" style={{ left: position.x }} />
      <div className="absolute left-0 right-0 h-[1px] bg-white/10" style={{ top: position.y }} />
      <div className="absolute w-8 h-8 border border-white/50 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center" style={{ left: position.x, top: position.y }}>
        <div className="w-0.5 h-0.5 bg-red-500"></div>
      </div>
      <div className="absolute text-[8px] font-mono text-red-500 ml-4 mt-4 pointer-events-none" style={{ left: position.x, top: position.y }}>
        {Math.floor(position.x)} : {Math.floor(position.y)}
      </div>

      {/* DECRYPT TEXT CENTER */}
      <div className="relative z-10 text-center mix-blend-difference pointer-events-none">
         <h1 className="text-4xl md:text-6xl font-bold text-white tracking-widest font-mono">
           <DecryptText text="HELLO" speed={30} delay={500} />
         </h1>
         <div className="text-zinc-500 text-xs mt-4 tracking-[0.5em]">
           <DecryptText text=" Try to Hover Over :) " speed={20} delay={1500} />
         </div>
      </div>

    </motion.div>
  );
};

export default IntroSequence;