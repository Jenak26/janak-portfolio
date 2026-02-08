import React from 'react';
import { motion } from 'framer-motion';
import Typewriter from './Typewriter'; 

// --- RAW SVGS (No Install Needed) ---
const Icons = {
  LinkedIn: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>,
  GitHub: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>,
  X: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
  Telegram: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 11.944 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>,
  Email: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z"/><path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z"/></svg>,
};


const BentoItem = ({ children, className = "", delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.02 }}
    transition={{ duration: 0.5, delay }}
    className={`relative overflow-hidden bg-zinc-900/40 border border-white/10 p-6 rounded-2xl backdrop-blur-md hover:bg-zinc-800/60 hover:border-white/20 transition-all cursor-default group flex flex-col justify-between ${className}`}
  >
    {children}
  </motion.div>
);

export default function Hero() {
  return (
    <section id="home" className="min-h-screen flex flex-col justify-start px-6 pt-48 pb-20 max-w-6xl mx-auto">

      {/* 1. HEADER */}
      <div className="mb-12 pl-1">
        <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-6xl font-bold text-white tracking-tighter"
          >
            Janak Kabra
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.4 }}
            className="text-2xl md:text-3xl font-bold text-[#ff4d4d] flex items-center"
          >
             <span className="text-zinc-600 mr-2 font-normal text-lg">is a</span>
             <Typewriter />
          </motion.div>
        </div>
      </div>

      {/* 2. BENTO GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:auto-rows-[180px]">
        
        {/* CARD 1: MISSION */}
        <BentoItem delay={0.1} className="md:col-span-2 md:row-span-2 group">
           <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-red-500/10 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2 group-hover:bg-red-500/20 transition-colors duration-700 pointer-events-none" />
           
           <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="flex justify-between items-start">
                 <div className="text-[10px] font-mono text-red-400 px-2 py-1 bg-red-500/10 rounded border border-red-500/20 uppercase tracking-widest">
                   Vision
                 </div>
                 <span className="text-2xl grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500">🚀</span>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Digital Lenses</h3>
                <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
                   I like to think of myself as a man of perspectives. To me, fields like video editing, web development, and marketing are all different lenses through which we view the world. I enjoy the challenge of craft and communication, but I’m most at home when I’m solving complex problems, which is what led me to pursue computer science.

                </p>
              </div>
           </div>
        </BentoItem>

        {/* student here hai */}
        <BentoItem delay={0.2} className="md:col-span-1 md:row-span-1">
           <div className="flex justify-between items-start mb-2">
              <span className="text-xl opacity-50 group-hover:opacity-100 transition-opacity">🎓</span>
              <span className="text-[10px] font-mono text-zinc-500">2024-28</span>
           </div>
           <div>
              <h3 className="text-lg font-bold text-white">CSE Undergrad</h3>
              <p className="text-zinc-500 text-xs mb-3">VIT Vellore</p>
              <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                 <div className="bg-red-500 h-full w-[45%]"></div>     {/* Eduction percent here */}
              </div>
           </div>
        </BentoItem>

        {/* CARD 3: STRATEGIST */}
        <BentoItem delay={0.3} className="md:col-span-1 md:row-span-1">
           <div className="flex justify-between items-start mb-2">
              <span className="text-xl opacity-50 group-hover:opacity-100 transition-opacity">♟️</span>
           </div>
           <div>
              <h3 className="text-lg font-bold text-white mb-1">Explorer</h3>
              <p className="text-zinc-400 text-xs leading-relaxed">
                 Jack of all trades, master of "What’s Next?"
              </p>
           </div>
        </BentoItem>

        {/* CARD 4: COLLABORATION (UPDATED) */}
        <BentoItem delay={0.4} className="md:col-span-2 md:row-span-1 group">
           <div className="flex flex-col justify-between h-full w-full">
              
              {/* Row 1: Social Icons */}
              <div className="flex justify-between md:justify-start md:gap-6 items-center">
                 {[
                   { icon: Icons.LinkedIn, href: "https://www.linkedin.com/in/janak-kabra-553b4b377?" },
                   { icon: Icons.GitHub, href: "https://github.com/Jenak26" },
                   { icon: Icons.Email, href: "mailto:connect.janak@gmail.com" },
                   { icon: Icons.X, href: "https://x.com/janak484457?s=21&t=MM-x4ZLnu0R6uFySuQFBRA" }
                   
                 ].map((item, i) => (
                   <a 
                     key={i} 
                     href={item.href} 
                     target="_blank"
                     rel="noopener noreferrer"
                     className="w-10 h-10 rounded-full border border-red-500/30 bg-red-500/5 flex items-center justify-center text-white hover:bg-red-500 hover:text-white transition-all duration-300 transform hover:scale-110"
                   >
                     {item.icon}
                   </a>
                 ))}
              </div>

              
              <div className="flex gap-3 mt-4 w-full">
                 <a href="https://drive.google.com/drive/folders/1eNBseAOjnxuiU9hefC6dSERh77-oDRaG" target="_blank" className="flex-1 py-2 rounded-full border border-red-500/30 bg-red-500/5 text-red-100 font-mono text-xs md:text-sm text-center hover:bg-red-500 hover:text-white transition-all duration-300 flex items-center justify-center">
                  Resume
                 </a>
                 <a href="https://drive.google.com/drive/folders/1881yDm9ivvIPZotRoeupUiaa5d8pm1eK" className="flex-[1.5] py-2 rounded-full border border-red-500/30 bg-red-500/5 text-red-100 font-mono text-xs md:text-sm text-center hover:bg-red-500 hover:text-white transition-all duration-300 flex items-center justify-center">
                   Certificates
                 </a>
              </div>

           </div>
        </BentoItem>

      </div>
    </section>
  );
}