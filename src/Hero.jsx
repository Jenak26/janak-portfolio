import { motion } from 'framer-motion';
import { profile } from './data';
import { EASE } from './motion';

// One idea per fold: the name, as big as the canvas allows.
// Each line slides out of an overflow mask once the intro hands off.
const Line = ({ children, delay, start, className = '' }) => (
  <span className={`block overflow-hidden ${className}`}>
    <motion.span
      className="block"
      initial={{ y: '110%' }}
      animate={start ? { y: 0 } : { y: '110%' }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </motion.span>
  </span>
);

export default function Hero({ start = true }) {
  return (
    <section
      id="home"
      className="relative flex min-h-screen flex-col justify-between gap-10 px-4 pb-6 pt-24 md:px-6"
    >
      <motion.p
        initial={{ opacity: 0 }}
        animate={start ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-paper/60"
      >
        <span aria-hidden className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
        </span>
        {profile.status}
      </motion.p>

      <h1
        className="w-full font-black uppercase leading-[0.82] tracking-[-0.03em] text-paper"
        style={{ fontSize: 'clamp(4.5rem, 17.5vw, 19rem)' }}
      >
        <Line delay={0.1} start={start}>
          Janak
        </Line>
        <Line delay={0.22} start={start} className="text-right">
          Kabra<span className="text-accent">.</span>
        </Line>
      </h1>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={start ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: EASE, delay: 0.8 }}
        className="flex flex-col gap-6 border-t border-paper/15 pt-5 md:flex-row md:items-end md:justify-between"
      >
        <div>
          <p className="max-w-md text-base leading-relaxed text-paper/80 md:text-lg">
            {profile.role}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-1 font-mono text-[11px] uppercase tracking-[0.2em]">
            {profile.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                {...(s.href.startsWith('http')
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
                className="flex h-11 items-center text-paper/70 underline-offset-4 transition-colors duration-300 hover:text-accent hover:underline"
              >
                {s.label} ↗
              </a>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-1 font-mono text-[11px] uppercase tracking-[0.2em] text-paper/50 md:text-right">
          <span>CSE @ VIT Vellore — class of 2028</span>
          <span>India — IST</span>
        </div>
      </motion.div>
    </section>
  );
}
