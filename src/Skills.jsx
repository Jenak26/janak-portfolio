import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import TrueFocus from './TrueFocus';
import TargetCursor from './TargetCursor';

// Data: Your Image + This Website's Stack
const categories = [
  {
    title: "Languages",
    skills: [
      "Python", "Java", "HTML/CSS", "C", "C#", "JavaScript", "TypeScript"
    ]
  },
  {
    title: "Frameworks & Libs",
    skills: [
      "ReactJS", "Tailwind CSS", "Framer Motion", "GSAP", "Three.js" 
    ]
  },
  {
    title: "Databases",
    skills: [
      "MySQL", "PostgreSQL"
    ]
  },
  {
    title: "Tools & Platforms",
    skills: [
      "Git", "Docker", "VS Code", "Vite", "LaTeX"
    ]
  }
];

const CategoryBox = ({ category, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: delay, duration: 0.5 }}
    className="flex-1 min-w-[250px] bg-zinc-900/20 border border-white/10 rounded-3xl p-6 backdrop-blur-sm hover:bg-zinc-900/40 hover:border-white/20 transition-all duration-500"
  >
    <div className="flex items-center gap-3 mb-6">
      <div className="h-2 w-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(255,77,77,0.5)]"></div>
      <h3 className="text-xl font-bold text-white tracking-tight">{category.title}</h3>
    </div>

    <div className="flex flex-wrap gap-3">
      {category.skills.map((skill, idx) => (
        <motion.span
          key={idx}
          whileHover={{ 
            scale: 1.05, 
            color: "#fff",
            backgroundColor: "rgba(255, 77, 77, 0.1)"
          }}
          className="cursor-target cursor-none px-4 py-2 rounded-lg bg-zinc-800/50 border border-white/5 text-zinc-400 font-mono text-sm transition-all duration-300 relative"
        >
          {skill}
        </motion.span>
      ))}
    </div>
  </motion.div>
);

export default function Skills() {
  const sectionRef = useRef(null);

  return (
    <section 
      id="skills" 
      ref={sectionRef} 
      className="flex flex-col items-center justify-center py-12 px-4 md:px-6 relative z-10 max-w-7xl mx-auto overflow-hidden"
    > 
      {/* The Spinning Target Cursor */}
      <TargetCursor rootRef={sectionRef} />

      {/* Heading - FIXED RESPONSIVELY */}
      {/* - text-2xl: Small on phones (approx 24px) - Fits 320px screens
         - sm:text-4xl: Medium on tablets
         - md:text-5xl: Large on desktop
         - font-bold: Ensures weight matches design
      */}
      <div className="mb-12 md:mb-20 w-full flex justify-center">
        <div className="cursor-target p-4 rounded-xl whitespace-nowrap text-2xl sm:text-4xl md:text-5xl font-bold">
          <TrueFocus 
            sentence="Technical Skills"
            manualMode={false}
            blurAmount={4}
            borderColor="#ff4d4d"
            glowColor="rgba(255, 77, 77, 0.3)"
            animationDuration={0.3}
            pauseBetweenAnimations={1}
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full px-2">
        {categories.map((cat, index) => (
          <CategoryBox key={index} category={cat} delay={index * 0.1} />
        ))}
      </div>
      
    </section>
  );
}