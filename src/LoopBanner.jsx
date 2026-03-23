import React from 'react';
import { motion } from 'framer-motion';

const TEXT_CONTENT = "THANK YOU FOR VISITING  ✦  OPEN TO WORK  ✦  LETS CONNECT  ✦  ";

// Both tracks use the SAME duration so they stay in sync and the
// seamless loop never visually breaks. 40s is fast enough to feel
// alive without being distracting.
const LOOP_DURATION = 40;

export default function LoopBanner() {
  return (
    <section className="relative w-full py-24 overflow-hidden z-10 pointer-events-none select-none">
      
      {/* Side fades to soften edges */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black z-20" />

      <div className="flex relative z-10 mix-blend-screen">
        
        {/* Track 1 */}
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: "-100%" }}
          transition={{ 
            duration: LOOP_DURATION, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="flex whitespace-nowrap"
        >
          {[...Array(8)].map((_, i) => (
            <span 
              key={i}
              className="text-4xl md:text-6xl font-black mr-12 tracking-tighter"
              style={{
                color: "rgba(255, 255, 255, 0.8)",
                textShadow: "0 0 20px rgba(255, 255, 255, 0.5), 0 0 40px rgba(255, 255, 255, 0.3)",
              }}
            >
              {TEXT_CONTENT}
            </span>
          ))}
        </motion.div>

        {/* Track 2 — duplicate for seamless loop, must match Track 1 duration exactly */}
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: "-100%" }}
          transition={{ 
            duration: LOOP_DURATION, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="flex whitespace-nowrap"
        >
          {[...Array(8)].map((_, i) => (
            <span 
              key={i}
              className="text-4xl md:text-6xl font-black mr-12 tracking-tighter"
              style={{
                color: "rgba(255, 255, 255, 0.8)",
                textShadow: "0 0 20px rgba(255, 255, 255, 0.5), 0 0 40px rgba(255, 255, 255, 0.3)",
              }}
            >
              {TEXT_CONTENT}
            </span>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
