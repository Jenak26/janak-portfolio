import React from 'react';
import SpotlightCard from './SpotlightCard';

const projects = [
  {
    title: "Sorting Visualizer",
    description: "An interactive tool that visualizes complex sorting algorithms (Merge Sort, Quick Sort, Bubble Sort) in real-time to help students understand DSA.",
    tech: ["React", "Algorithms", "CSS Animations"],
    link: "https://jenak26.github.io/Sorting-visualizer/",       
    github: "https://github.com/Jenak26/Sorting-visualizer/blob/main/index.html",  
  },
  {
    title: "Personal Portfolio",
    description: "The recursive website you are looking at right now. Built with a focus on high-performance animations and a cyber-minimalist aesthetic.",
    tech: ["React", "Framer Motion", "GSAP", "Tailwind"],
    link: "janakkabra.in",
    github: "#"
  }
];

//SVG here :)
const Icons = {
  GitHub: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>,
  Link: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
};

export default function Projects() {
  return (
    <section id="projects" className="relative z-10 py-24 px-4 max-w-7xl mx-auto">
      
     
      <div className="mb-16 text-center w-full">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
          Featured <span className="text-red-500">Projects</span>
        </h2>
        <p className="text-zinc-400 max-w-2xl text-lg mx-auto">
         Learning. Building. Improving.
        </p>
      </div>

      {/* Projects here */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project, index) => (
          <SpotlightCard key={index} className="h-full">
            <div className="p-8 h-full flex flex-col">
              
              <h3 className="text-2xl font-bold text-white mb-3">{project.title}</h3>
              
              <p className="text-zinc-400 leading-relaxed mb-6 flex-grow">
                {project.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-8">
                {project.tech.map((t, i) => (
                  <span key={i} className="px-3 py-1 text-xs font-mono text-red-400 bg-red-500/10 rounded-full border border-red-500/20">
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-6 mt-auto">
                <a href={project.github} className="flex items-center gap-2 text-sm text-zinc-300 hover:text-white transition-colors group">
                  <span className="group-hover:text-red-400 transition-colors">{Icons.GitHub}</span>
                  <span className="font-mono">View Code</span>
                </a>
                <a href={project.link} className="flex items-center gap-2 text-sm text-zinc-300 hover:text-white transition-colors group">
                  <span className="group-hover:text-red-400 transition-colors">{Icons.Link}</span>
                  <span className="font-mono">Live Demo</span>
                </a>
              </div>

            </div>
          </SpotlightCard>
        ))}
      </div>

    </section>
  );
}