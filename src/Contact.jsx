import { useState } from 'react';
import { motion } from 'framer-motion';
import { track } from '@vercel/analytics';
import { profile } from './data';
import { fadeUp, viewportOnce, EASE } from './motion';

// The drench. Full-canvas red, ink type, one message.
export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    track('email_copy');
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };

  return (
    <section id="contact" className="flex min-h-screen flex-col justify-between gap-10 bg-accent px-4 pb-6 pt-20 text-ink md:px-6">
      <div className="flex items-baseline justify-between border-b border-ink/40 pb-3 font-mono text-[11px] uppercase tracking-[0.2em]">
        <h2>04 — Contact</h2>
        <span aria-hidden>Open to internships</span>
      </div>

      <div>
        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          className="w-full font-black uppercase leading-[0.82] tracking-[-0.03em]"
          style={{ fontSize: 'clamp(4rem, 16vw, 17rem)' }}
        >
          Let's
          <span className="block text-right">talk.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
          className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4"
        >
          <a
            href={`mailto:${profile.email}`}
            className="break-all text-xl font-bold underline decoration-2 underline-offset-8 transition-opacity hover:opacity-60 md:text-4xl"
          >
            {profile.email}
          </a>
          <button
            type="button"
            onClick={copyEmail}
            className="flex h-11 items-center border border-ink px-5 font-mono text-xs uppercase tracking-[0.2em] transition-colors duration-300 hover:bg-ink hover:text-accent"
          >
            {copied ? 'Copied ✓' : 'Copy'}
          </button>
        </motion.div>
      </div>

      <footer className="border-t border-ink/40 pt-4">
        <div className="flex flex-col gap-4 font-mono text-[11px] uppercase tracking-[0.2em] md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {profile.socials
              .filter((s) => s.icon !== 'mail')
              .map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 items-center underline-offset-4 hover:underline"
                >
                  {s.label} ↗
                </a>
              ))}
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {profile.resumes.map((r) => (
              <a
                key={r.href}
                href={r.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track('resume_click', { source: 'contact', file: r.href })}
                className="flex h-11 items-center underline-offset-4 hover:underline"
              >
                {r.label} ↗
              </a>
            ))}
          </div>
          <p className="text-ink/70">© 2026 Janak Kabra</p>
        </div>
      </footer>
    </section>
  );
}
