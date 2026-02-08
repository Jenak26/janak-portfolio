import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// components here :) 
import IntroSequence from './IntroSequence';
import BubbleMenu from './BubbleMenu';
import Hero from './Hero';
import Beams from './Beams';
import TechTicker from './TechTicker';
import Skills from './Skills';
import Projects from './Projects';
import Experience from './Experience';
import LoopBanner from './LoopBanner';
export default function App() {
  const [introComplete, setIntroComplete] = useState(false);

  return (
    <div className="min-h-screen w-full text-white overflow-x-hidden selection:bg-red-500/30">
      
      {/* BG here :) */}
      <div className="fixed inset-0 z-0">
        <Beams 
          beamWidth={2}
          beamHeight={40}
          beamNumber={30}
          lightColor="#ffffff"
          speed={1.5}
          rotation={30}
        />
        {/* Radial Fade to make text readable */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/80 pointer-events-none" />
      </div>

      <AnimatePresence mode='wait'>
        {/* intro seq here :)  */}
        {!introComplete && (
          <IntroSequence key="intro" onComplete={() => setIntroComplete(true)} />
        )}

        {/* main content here :) */}
        {introComplete && (
          <motion.div 
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="relative z-10 min-h-screen w-full"
          >
            {/* Navigation */}
            <BubbleMenu />

            <main className="flex flex-col gap-0">
               {/* Sections */}
               <Hero />
               
               <TechTicker />
               
               <Skills />
               
               <Projects />

               <Experience />

               <LoopBanner />
            </main>

            {/*Footder here :) */}
            <footer className="py-12 text-center text-zinc-600 text-sm font-mono">
              <p>Designed & Engineered by Janak Kabra</p>
            </footer>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}