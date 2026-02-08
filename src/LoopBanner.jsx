import React from 'react';
import { motion } from 'framer-motion';

const TEXT_CONTENT = "THANK YOU FOR VISITING  ✦  OPEN TO WORK  ✦  LETS CONNECT  ✦  ";

export default function LoopBanner() {
  return (
    // 1. Removed 'bg-black'. 
    // 2. Added 'pointer-events-none' so it doesn't block clicks on things behind it.
    <section className="relative w-full py-24 overflow-hidden z-10 pointer-events-none select-none">
      
      {/* Side Fades (Gradient Mask) to soften edges smoothly */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black z-20" />

      
      <div className="flex relative z-10 mix-blend-screen">
        
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: "-100%" }}
          transition={{ 
            duration: 250, 
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
                // THE GLOW EFFECT
                color: "rgba(255, 255, 255, 0.8)", // Semi-transparent white
                textShadow: "0 0 20px rgba(255, 255, 255, 0.5), 0 0 40px rgba(255, 255, 255, 0.3)", // The Glow
              }}
            >
              {TEXT_CONTENT}
            </span>
          ))}
        </motion.div>

        {/* Duplicate Track for seamless loop */}
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: "-100%" }}
          transition={{ 
            duration: 40, 
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