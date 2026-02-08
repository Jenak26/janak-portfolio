import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

const NotFound = () => {
  const containerRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Update mouse position for the spotlight effect
  const handleMouseMove = (e) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative h-screen w-full bg-[#050505] flex flex-col items-center justify-center overflow-hidden text-white cursor-none" // cursor-none hides normal mouse
    >
      {/* 1. BACKGROUND GRID (Hidden by default, revealed by flashlight) */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none"
      />

      {/* 2. THE FLASHLIGHT (Follows Mouse) */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(29, 78, 216, 0.15), transparent 80%)`,
        }}
      />
      
      {/* 3. GLITCH 404 TEXT */}
      <div className="relative z-10 text-center">
        <p className="font-sans text-sm md:text-base text-gray-500 tracking-[0.5em] uppercase mb-4">
          Error Code
        </p>

        <div className="relative">
          {/* Main 404 */}
          <h1 className="font-display text-[10rem] md:text-[15rem] font-bold leading-none tracking-tighter text-white select-none">
            404
          </h1>

          {/* Red Ghost Layer (Jitters randomly) */}
          <motion.h1
            className="absolute inset-0 font-display text-[10rem] md:text-[15rem] font-bold leading-none tracking-tighter text-red-500 opacity-50 mix-blend-screen select-none pointer-events-none"
            animate={{ 
              x: [-2, 3, -1, 4, 0], 
              y: [1, -2, 2, -1, 0],
              opacity: [0.5, 0.3, 0.6, 0.2, 0.5]
            }}
            transition={{ repeat: Infinity, duration: 0.15, repeatType: "mirror" }}
          >
            404
          </motion.h1>

          {/* Blue Ghost Layer (Jitters randomly) */}
          <motion.h1
            className="absolute inset-0 font-display text-[10rem] md:text-[15rem] font-bold leading-none tracking-tighter text-cyan-500 opacity-50 mix-blend-screen select-none pointer-events-none"
            animate={{ 
              x: [2, -3, 1, -4, 0], 
              y: [-1, 2, -2, 1, 0],
              opacity: [0.4, 0.7, 0.3, 0.6, 0.4]
            }}
            transition={{ repeat: Infinity, duration: 0.2, repeatType: "mirror" }}
          >
            404
          </motion.h1>
        </div>

        <p className="font-display text-2xl md:text-3xl text-gray-400 mt-2 mb-12">
          Page Not Found
        </p>

        {/* 4. RETURN BUTTON */}
        <a
          href="/"
          className="relative inline-flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 rounded-full hover:bg-white hover:text-black transition-all duration-300 backdrop-blur-md group"
        >
          <span className="font-bold text-sm tracking-widest uppercase">Return to Base</span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={2} 
            stroke="currentColor" 
            className="w-4 h-4 group-hover:translate-x-1 transition-transform"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </a>
      </div>

      {/* Custom Cursor Ring */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border border-white rounded-full pointer-events-none z-50 mix-blend-difference"
        animate={{ x: mousePosition.x - 16, y: mousePosition.y - 16 }}
        transition={{ type: "tween", ease: "backOut", duration: 0.1 }}
      />
    </div>
  );
};

export default NotFound;