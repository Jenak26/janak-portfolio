import { motion } from 'framer-motion';
import { experience } from './data';
import { fadeUp, viewportOnce } from './motion';

// Back on ink. Tabular rhythm: period left, role big, detail small.
export default function Experience() {
  return (
    <section id="experience" className="bg-ink px-4 pb-20 pt-20 text-paper md:px-6 md:pb-28">
      <div className="flex items-baseline justify-between border-b border-paper/30 pb-3 font-mono text-[11px] uppercase tracking-[0.2em]">
        <h2>02 — Experience</h2>
        <span aria-hidden className="text-paper/50">2025 — Present</span>
      </div>

      <ol>
        {experience.map((job, i) => (
          <motion.li
            key={job.company + job.period}
            custom={i}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={fadeUp}
            className="grid grid-cols-12 gap-x-4 gap-y-3 border-b border-paper/10 py-8 md:py-12"
          >
            <p className="col-span-12 font-mono text-[11px] uppercase tracking-[0.2em] text-paper/50 md:col-span-3">
              {job.period}
              <span className="mt-1 block text-paper/30">{job.meta}</span>
            </p>

            <div className="col-span-12 md:col-span-9">
              <h3
                className="font-extrabold uppercase leading-none tracking-[-0.02em]"
                style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.75rem)' }}
              >
                {job.role}
                <span className="text-accent"> @ {job.company}</span>
              </h3>

              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-paper/65 md:text-base">
                {job.summary}
              </p>

              <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.15em] text-paper/40">
                {job.skills.join(' · ')}
              </p>
            </div>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
