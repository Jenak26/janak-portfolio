import React from 'react';
import SpotlightCard from './SpotlightCard';

const projects = [
  {
    title: "Sorting Visualizer",
    description: "Built an interactive DSA learning tool that animates 6 sorting algorithms in real-time. Designed to bridge the gap between reading about algorithms and actually understanding how they behave — you can control speed, array size, and watch each comparison and swap happen live.",
    problem: "Most DSA resources are static — diagrams and pseudocode that don't show you what's actually happening at runtime.",
    tech: ["React", "Algorithms", "CSS Animations", "Vanilla JS"],
    link: "https://jenak26.github.io/Sorting-visualizer/",
    github: "https://github.com/Jenak26/Sorting-visualizer/blob/main/index.html",
    stats: [
      { label: "Algorithms", value: "6" },
      { label: "Controls", value: "Speed + Size" },
      { label: "Stack", value: "Pure JS" },
    ]
  },
  {
    title: "Personal Portfolio",
    description: "Engineered this portfolio from scratch with a focus on performance and UI craftsmanship. Features a canvas-based beam background, variable font pressure effects, GSAP-powered custom cursors, Framer Motion scroll animations, and a seamless intro sequence — all without any UI component library.",
    problem: "Most student portfolios use templates. I wanted to build every interaction myself to demonstrate what I can actually do.",
    tech: ["React", "Framer Motion", "GSAP", "Tailwind", "Canvas API"],
    link: "https://janakkabra.in",
    github: "https://github.com/Jenak26/janak-portfolio",
    stats: [
      { label: "Components", value: "15+" },
      { label: "Animations", value: "Custom" },
      { label: "Lighthouse", value: "90+" },
    ]
  },
  {
    // Coming soon card — shows you're actively building
    title: "Next Project",
    description: "Something new is in the works. I'm currently exploring full-stack ideas involving React, Node.js, and real-time data. If you have an interesting problem to solve or want to collaborate, reach out.",
    problem: null,
    tech: ["React", "Node.js", "PostgreSQL", "TBD"],
    link: null,
    github: null,
    stats: null,
    comingSoon: true,
  }
];

// SVG icons defined inline — no extra imports needed
const Icons = {
  GitHub: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  ),
  Link: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
};

export default function Projects() {
  return (
    <section id="projects" className="relative z-10 py-24 px-4 max-w-7xl mx-auto">

      {/* Section header */}
      <div className="mb-16 text-center w-full">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
          Featured <span className="text-red-500">Projects</span>
        </h2>
        <p className="text-zinc-400 max-w-2xl text-lg mx-auto">
          Learning. Building. Improving.
        </p>
      </div>

      {/* Projects grid — 2 cols on desktop, 1 on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <SpotlightCard key={index} className="h-full">
            <div className="p-8 h-full flex flex-col">

              {/* Coming soon badge */}
              {project.comingSoon && (
                <div className="mb-4">
                  <span className="px-3 py-1 text-xs font-mono text-red-400 bg-red-500/10 rounded-full border border-red-500/20 animate-pulse">
                    // IN PROGRESS
                  </span>
                </div>
              )}

              <h3 className="text-2xl font-bold text-white mb-3">
                {project.title}
              </h3>

              {/* Problem statement — the WHY behind the project */}
              {project.problem && (
                <p className="text-zinc-500 text-xs font-mono mb-3 border-l-2 border-red-500/30 pl-3 italic">
                  "{project.problem}"
                </p>
              )}

              <p className="text-zinc-400 leading-relaxed mb-6 flex-grow text-sm">
                {project.description}
              </p>

              {/* Stats row — makes projects feel more substantial */}
              {project.stats && (
                <div className="flex gap-4 mb-6 pb-6 border-b border-white/5">
                  {project.stats.map((stat, i) => (
                    <div key={i} className="text-center">
                      <p className="text-white font-bold text-sm">{stat.value}</p>
                      <p className="text-zinc-500 text-xs font-mono">{stat.label}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Tech tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tech.map((t, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-xs font-mono text-red-400 bg-red-500/10 rounded-full border border-red-500/20"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Links — hidden for coming soon card */}
              {!project.comingSoon && (
                <div className="flex items-center gap-6 mt-auto">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-zinc-300 hover:text-white transition-colors group"
                  >
                    <span className="group-hover:text-red-400 transition-colors">
                      {Icons.GitHub}
                    </span>
                    <span className="font-mono">View Code</span>
                  </a>
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-zinc-300 hover:text-white transition-colors group"
                  >
                    <span className="group-hover:text-red-400 transition-colors">
                      {Icons.Link}
                    </span>
                    <span className="font-mono">Live Demo</span>
                  </a>
                </div>
              )}

              {/* Coming soon CTA */}
              {project.comingSoon && (
                <a
                  href="mailto:connect.janak@gmail.com"
                  className="mt-auto inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-red-400 transition-colors font-mono group"
                >
                  <span>Got an idea? Let's build</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:translate-x-1 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </a>
              )}

            </div>
          </SpotlightCard>
        ))}
      </div>

    </section>
  );
}