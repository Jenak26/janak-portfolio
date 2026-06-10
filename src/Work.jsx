import { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { track } from '@vercel/analytics';
import { projects } from './data';
import { fadeUp, viewportOnce } from './motion';

// Editorial project index on paper. Titles are the interface: hovering a
// row floats its live screenshot under the cursor (fine pointers only);
// phones get inline thumbnails instead.

function HoverPreview({ active }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 25 });
  const sy = useSpring(y, { stiffness: 200, damping: 25 });

  useEffect(() => {
    const onMove = (e) => {
      x.set(e.clientX + 24);
      y.set(e.clientY - 120);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [x, y]);

  return (
    <motion.div
      aria-hidden
      style={{ x: sx, y: sy }}
      className="pointer-events-none fixed left-0 top-0 z-40 hidden lg:block"
    >
      {projects
        .filter((p) => p.image)
        .map((p) => (
          <img
            key={p.title}
            src={p.image}
            alt=""
            width="1280"
            height="853"
            className={`absolute left-0 top-0 w-[26rem] border border-ink/20 shadow-2xl transition-opacity duration-300 ${
              active === p.title ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
    </motion.div>
  );
}

const Row = ({ project, index, onHover }) => {
  const primary = project.live || project.github;
  return (
    <motion.li
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={fadeUp}
      onPointerEnter={() => onHover(project.title)}
      onPointerLeave={() => onHover(null)}
      className="group border-b border-ink/15"
    >
      <div className="grid grid-cols-12 items-baseline gap-x-4 py-8 md:py-12">
        <span aria-hidden className="col-span-2 font-mono text-[11px] text-ink/40 md:col-span-1">
          {String(index + 1).padStart(2, '0')}
        </span>

        <div className="col-span-10 md:col-span-8">
          <a
            href={primary}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track('project_click', { project: project.title, kind: 'title' })}
            className="block font-extrabold uppercase leading-[0.95] tracking-[-0.02em] text-ink transition-colors duration-300 group-hover:text-accent"
            style={{ fontSize: 'clamp(1.75rem, 5.5vw, 4.5rem)' }}
          >
            {project.title}
          </a>

          {project.image && (
            <img
              src={project.image}
              alt={`Screenshot of ${project.title}`}
              loading="lazy"
              width="1280"
              height="853"
              className="mt-5 w-full max-w-md border border-ink/15 lg:hidden"
            />
          )}

          <div className="mt-4 max-w-xl space-y-3">
            {project.story.map((para, i) => (
              <p key={i} className="text-sm leading-relaxed text-ink/60 md:text-base">
                {para}
              </p>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.15em]">
            <span className="text-ink/40">{project.tech.join(' · ')}</span>
          </div>

          <div className="mt-3 flex gap-6 font-mono text-xs uppercase tracking-[0.15em]">
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track('project_click', { project: project.title, kind: 'code' })}
              className="flex h-11 items-center text-ink underline-offset-4 hover:text-accent hover:underline"
            >
              Code ↗
            </a>
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track('project_click', { project: project.title, kind: 'live' })}
                className="flex h-11 items-center text-ink underline-offset-4 hover:text-accent hover:underline"
              >
                Live ↗
              </a>
            )}
          </div>
        </div>

        <span className="col-span-3 hidden text-right font-mono text-[11px] uppercase tracking-[0.15em] text-ink/40 md:block">
          {project.year}
        </span>
      </div>
    </motion.li>
  );
};

export default function Work() {
  const [active, setActive] = useState(null);
  const [hasFine] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches
  );

  return (
    <section id="work" className="bg-paper px-4 pb-20 pt-20 text-ink md:px-6 md:pb-28">
      <div className="flex items-baseline justify-between border-b border-ink pb-3 font-mono text-[11px] uppercase tracking-[0.2em]">
        <h2>01 — Selected Work</h2>
        <span aria-hidden className="text-ink/50">{projects.length} projects / 2025–26</span>
      </div>

      <ul>
        {projects.map((project, i) => (
          <Row key={project.title} project={project} index={i} onHover={setActive} />
        ))}
      </ul>

      {hasFine && <HoverPreview active={active} />}
    </section>
  );
}
