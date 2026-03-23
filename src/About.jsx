import React, { useRef } from 'react';
import { motion } from 'framer-motion';

// A few facts that make the section feel personal and specific.
// Edit these freely — they're meant to spark conversation with recruiters.
const FACTS = [
  { emoji: "🎓", label: "Studying", value: "CSE @ VIT Vellore, Batch of 2028" },
  { emoji: "📍", label: "Based in", value: "India" },
  { emoji: "💼", label: "Status", value: "Open to Work & Internships" },
  { emoji: "🔭", label: "Currently", value: "Interning at Infosys (AI Track)" },
  { emoji: "🛠️", label: "Building with", value: "React, Node.js, Python" },
  { emoji: "🎯", label: "Goal", value: "Full-Stack Engineer at scale" },
];

// Fade-up animation reused across children
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' }
  })
};

export default function About() {
  return (
    <section
      id="about"
      className="relative z-10 py-24 px-6 max-w-5xl mx-auto"
    >
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-16"
      >
        <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter mb-4">
          About
        </h2>
        <p className="text-zinc-500 font-mono text-sm border-l-2 border-red-500/50 pl-4">
          // WHO I AM
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

        {/* Left — written bio */}
        <div className="space-y-5">
          {[
            `I'm a Computer Science undergrad at VIT Vellore with a genuine 
             obsession for building things on the web. I got into CS not because 
             it was the obvious choice, but because it was the one field where 
             I could sit down with nothing and build something real by the end of the day.`,

            `My approach to learning is hands-on — I've always learned more from 
             shipping a broken project and fixing it than from any tutorial. 
             That's led me down some interesting rabbit holes: sorting visualizers, 
             AI research tools, freelance client work, and this portfolio you're 
             looking at right now.`,

            `Right now I'm focused on getting deeper into full-stack development 
             and AI applications. I'm actively looking for internships where I can 
             contribute to real products, work with experienced engineers, and keep 
             growing fast.`
          ].map((para, i) => (
            <motion.p
              key={i}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="text-zinc-400 leading-relaxed text-sm md:text-base"
            >
              {para}
            </motion.p>
          ))}

          {/* CTA */}
          <motion.div
            custom={3}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="pt-2"
          >
            <a
              href="mailto:connect.janak@gmail.com"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-red-500/30 bg-red-500/5 text-red-100 font-mono text-sm hover:bg-red-500 hover:text-white transition-all duration-300"
            >
              <span>Let's talk</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </a>
          </motion.div>
        </div>

        {/* Right — facts grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FACTS.map((fact, i) => (
            <motion.div
              key={i}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="bg-zinc-900/40 border border-white/5 rounded-2xl p-4 hover:border-red-500/20 hover:bg-zinc-900/60 transition-all duration-300"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{fact.emoji}</span>
                <span className="text-zinc-500 font-mono text-xs uppercase tracking-widest">
                  {fact.label}
                </span>
              </div>
              <p className="text-white text-sm font-medium pl-7">
                {fact.value}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
