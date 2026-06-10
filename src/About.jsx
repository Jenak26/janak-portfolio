import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { skills, facts } from './data';
import { fadeUp, viewportOnce, EASE } from './motion';

// The statement heading's last word rolls through the loop that actually
// describes the process. Same masked-reveal motion as the hero name.
const WORDS = ['shipping', 'breaking', 'rebuilding'];

function RollingWord() {
  const [index, setIndex] = useState(0);
  const [reduced] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    if (reduced) return;
    const interval = setInterval(
      () => setIndex((i) => (i + 1) % WORDS.length),
      2200
    );
    return () => clearInterval(interval);
  }, [reduced]);

  if (reduced) {
    return <span className="text-accent">shipping.</span>;
  }

  return (
    <span className="relative inline-block overflow-hidden align-bottom">
      {/* Widest word reserves the box so the layout never jumps */}
      <span aria-hidden className="invisible">rebuilding.</span>
      <AnimatePresence initial={false}>
        <motion.span
          key={index}
          className="absolute inset-0 text-accent"
          initial={{ y: '105%' }}
          animate={{ y: 0 }}
          exit={{ y: '-105%' }}
          transition={{ duration: 0.55, ease: EASE }}
        >
          {WORDS[index]}.
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

const BIO = [
  `I'm a CS undergrad at VIT Vellore. In the last year I shipped an AI agent
   that orders food from a photo, a job-alert bot polling 53 companies around
   the clock, and a debugger that makes algorithms visible instead of abstract.`,
  `I'm drawn to the seam between software and markets: pricing engines,
   screeners, tools that turn raw data into decisions. Right now I'm on the
   AI track at Infosys Springboard, looking for an internship where I can
   ship production code alongside experienced engineers.`,
];

// Paper again. One big statement, small supporting text, the polaroid.
export default function About() {
  return (
    <section id="about" className="bg-paper px-4 pb-20 pt-20 text-ink md:px-6 md:pb-28">
      <div className="border-b border-ink pb-3 font-mono text-[11px] uppercase tracking-[0.2em]">
        <h2>03 — About</h2>
      </div>

      <motion.p
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={fadeUp}
        className="max-w-5xl pt-10 font-extrabold leading-[1.1] tracking-[-0.02em]"
        style={{ fontSize: 'clamp(2rem, 6vw, 5rem)' }}
      >
        <span className="sr-only">I learn by shipping.</span>
        <span aria-hidden>I learn by <RollingWord /></span>
      </motion.p>

      <div className="mt-14 grid grid-cols-12 gap-x-4 gap-y-12">
        <div className="col-span-12 space-y-5 md:col-span-5">
          {BIO.map((para, i) => (
            <motion.p
              key={i}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={fadeUp}
              className="text-sm leading-relaxed text-ink/65 md:text-base"
            >
              {para}
            </motion.p>
          ))}

          <motion.dl
            custom={2}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeUp}
            className="space-y-2 border-t border-ink/15 pt-5 font-mono text-[11px] uppercase tracking-[0.15em]"
          >
            {facts.map((fact) => (
              <div key={fact.label} className="flex gap-4">
                <dt className="w-24 shrink-0 text-ink/40">{fact.label}</dt>
                <dd className="text-ink/80">{fact.value}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <div className="col-span-12 md:col-span-4 md:col-start-7">
          <motion.div
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeUp}
            className="space-y-4"
          >
            <h3 className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/40">
              Capabilities
            </h3>
            {skills.map((row) => (
              <div key={row.group} className="border-b border-ink/10 pb-3">
                <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink/40">
                  {row.group}
                </p>
                <p className="mt-1 text-sm font-medium leading-relaxed text-ink/80">
                  {row.items.join(', ')}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.figure
          initial={{ opacity: 0, rotate: 4, y: 24 }}
          whileInView={{ opacity: 1, rotate: 2, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.6, ease: EASE }}
          className="col-span-8 col-start-3 md:col-span-2 md:col-start-11"
        >
          <img
            src="/janaksomething.jpg"
            alt="Illustrated portrait of Janak Kabra in a polaroid frame"
            loading="lazy"
            width="678"
            height="1024"
            className="w-full max-w-[180px] shadow-xl md:max-w-none"
          />
        </motion.figure>
      </div>
    </section>
  );
}
