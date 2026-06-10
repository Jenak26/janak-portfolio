import { useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';

import Intro from './Intro';
import TopBar from './TopBar';
import Hero from './Hero';
import Work from './Work';
import Experience from './Experience';
import About from './About';
import Contact from './Contact';
import NotFound from './NotFound';

function Portfolio() {
  const [introDone, setIntroDone] = useState(false);
  const handleIntroComplete = useCallback(() => setIntroDone(true), []);

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-ink text-paper">
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <Intro onComplete={handleIntroComplete} />
      <TopBar />

      <main id="main">
        <Hero start={introDone} />
        <Work />
        <Experience />
        <About />
        <Contact />
      </main>
    </div>
  );
}

export default function App() {
  return (
    // reducedMotion="user" disables all framer-motion transforms for
    // visitors with the OS-level reduce-motion setting enabled.
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Portfolio />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </MotionConfig>
  );
}
