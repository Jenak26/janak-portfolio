import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EASE } from './motion';

// Target-acquisition boot sequence. Crosshair brackets converge on the
// name while it decrypts, then the overlay wipes away and hands off to
// the hero (whose particles assemble on cue).
//
// Rules learned the hard way:
//  - plays once per session (sessionStorage), never on return visits
//  - skippable instantly: click, any key, or the Skip button
//  - reduced-motion visitors never see it

const CHARS = '-_~`!@#$%^&*()+=[]{}|;:,.<>?/';
const NAME = 'JANAK KABRA';
const DURATION = 2200;

function useDecrypt(text, active, speed = 45) {
  const [display, setDisplay] = useState('');
  useEffect(() => {
    if (!active) return;
    let counter = 0;
    const interval = setInterval(() => {
      setDisplay(
        text
          .split('')
          .map((char, i) => {
            if (char === ' ') return ' ';
            if (i < counter) return char;
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join('')
      );
      counter += text.length / (DURATION / speed / 1.4);
      if (counter >= text.length + 1) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, active, speed]);
  return display;
}

const BRACKETS = [
  { cls: 'top-0 left-0 border-t-2 border-l-2', x: '-46vw', y: '-46vh' },
  { cls: 'top-0 right-0 border-t-2 border-r-2', x: '46vw', y: '-46vh' },
  { cls: 'bottom-0 left-0 border-b-2 border-l-2', x: '-46vw', y: '46vh' },
  { cls: 'bottom-0 right-0 border-b-2 border-r-2', x: '46vw', y: '46vh' },
];

export default function Intro({ onComplete }) {
  const [show, setShow] = useState(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    return !sessionStorage.getItem('introSeen');
  });
  const doneRef = useRef(false);
  const display = useDecrypt(NAME, show);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    sessionStorage.setItem('introSeen', '1');
    setShow(false);
    onComplete?.();
  }, [onComplete]);

  useEffect(() => {
    // If the intro never mounts, hand off immediately
    if (!show && !doneRef.current) {
      doneRef.current = true;
      onComplete?.();
    }
  }, [show, onComplete]);

  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(finish, DURATION);
    const onKey = () => finish();
    window.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', onKey);
    };
  }, [show, finish]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          role="presentation"
          onClick={finish}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0c0a09]"
          exit={{ y: '-100%' }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <p
            aria-hidden
            className="absolute left-6 top-6 font-mono text-[10px] uppercase tracking-[0.3em] text-stone-500"
          >
            Acquiring target
          </p>
          <p
            aria-hidden
            className="absolute right-6 top-6 font-mono text-[10px] uppercase tracking-[0.3em] text-stone-500"
          >
            janakkabra.in
          </p>

          <div className="relative px-10 py-8 sm:px-16 sm:py-10">
            {BRACKETS.map((b, i) => (
              <motion.span
                key={i}
                aria-hidden
                className={`absolute h-5 w-5 border-accent ${b.cls}`}
                initial={{ x: b.x, y: b.y, opacity: 0 }}
                animate={{ x: 0, y: 0, opacity: 1 }}
                transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
              />
            ))}

            <p
              aria-label={NAME}
              className="font-mono text-2xl font-bold tracking-[0.2em] text-stone-100 sm:text-4xl md:text-5xl"
            >
              {display || ' '}
            </p>

            <motion.div
              aria-hidden
              className="absolute -bottom-1 left-0 h-px bg-accent"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: DURATION / 1000, ease: 'linear' }}
            />
          </div>

          <button
            type="button"
            onClick={finish}
            className="absolute bottom-8 font-mono text-xs uppercase tracking-[0.3em] text-stone-500 transition-colors hover:text-accent"
          >
            Skip
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
