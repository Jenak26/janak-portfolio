import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import IntroSequence from './IntroSequence';
import BubbleMenu from './BubbleMenu';
import Hero from './Hero';
import Beams from './Beams';
import TechTicker from './TechTicker';
import Skills from './Skills';
import Projects from './Projects';
import Experience from './Experience';
import LoopBanner from './LoopBanner';
import NotFound from './NotFound';

// The main portfolio page — extracted so the router stays clean
function Portfolio() {
  const [introComplete, setIntroComplete] = useState(false);

  return (
    <div className="min-h-screen w-full text-white overflow-x-hidden selection:bg-red-500/30">

      {/* Background beams — fixed layer behind everything */}
      <div className="fixed inset-0 z-0">
        <Beams
          beamWidth={2}
          beamHeight={40}
          beamNumber={30}
          lightColor="#ffffff"
          speed={1.5}
          rotation={30}
        />
        {/* Radial fade so text stays readable over the beams */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/80 pointer-events-none" />
      </div>

      <AnimatePresence mode="wait">
        {/* Intro sequence — shown once on first load */}
        {!introComplete && (
          <IntroSequence key="intro" onComplete={() => setIntroComplete(true)} />
        )}

        {/* Main content — fades in after intro completes */}
        {introComplete && (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="relative z-10 min-h-screen w-full"
          >
            <BubbleMenu />

            <main className="flex flex-col gap-0">
              <Hero />
              <TechTicker />
              <Skills />
              <Projects />
              <Experience />
              <LoopBanner />
            </main>

            <footer className="py-12 text-center text-zinc-600 text-sm font-mono">
              <p>Designed & Engineered by Janak Kabra</p>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// BrowserRouter wraps the whole app so all child components can use
// hooks like useNavigate, useLocation etc. if needed later.
// Routes renders only the FIRST <Route> that matches the current URL.
// The path="*" wildcard catches every URL that doesn't match "/" and
// renders the 404 page.
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
