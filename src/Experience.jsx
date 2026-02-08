import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';

const experiences = [
  {
    id: 1,
    role: "Web Developer (Freelance)",
    company: "Remote",
    period: "Jun 2025 - Present",
    description: [
      "Developed a responsive static website for a business to establish an online presence.",
      "Implemented structured layouts, reusable components, and mobile friendly design using HTML and CSS.",
      "Collaborated with the client to understand requirements and deliver a functional website."
    ],
    skills: ["HTML", "CSS", "UI/UX","React"]
  },
  {
    id: 2,
    role: "Mythus AI Studio",
    company: "Remote-Intern",
    period: "Oct 2025 - Dec 2025",
    description: [
      "Tracked emerging trends in artificial intelligence by reviewing research papers, model releases, and industry updates",
      "Performed comparative analysis of AI models and tools to evaluate performance, usability, and potential applications",
      "Prepared structured summaries and insights to support research direction and internal discussions"
    ],
    skills: ["AI","LateX", "Research", "Data Analysis","Prompt Engineering"]
  },
  {
  id: 3,
  role: "Infosys Intern",
  company: "Infosys Springboard - AI Domain(Remote)",
  period: "Feb 2026 - Present",
  description: [
    "Currently undergoing orientation and foundational training as part of the AI Track, preparing for upcoming research and project work"],
  skills: ["AI Track"]
}

];

// --- 3D TILT CARD (Balanced Design) ---
const TimelineCard = ({ data, index }) => {
  const ref = useRef(null);
  
  // Physics
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);
  
  // HOVER EFFECT: Subtle Red Spotlight (Not overwhelming)
  const gradientBg = useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(220, 38, 38, 0.08), transparent 80%)`;

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const mX = e.clientX - rect.left;
    const mY = e.clientY - rect.top;
    x.set(mX / rect.width - 0.5);
    y.set(mY / rect.height - 0.5);
    mouseX.set(mX);
    mouseY.set(mY);
  };

  const handleMouseLeave = () => {
    x.set(0); y.set(0); mouseX.set(0); mouseY.set(0);
  };

  return (
    <div className="relative pl-12 md:pl-24 py-8 group/timeline">
      
      {/* CONNECTOR NODE: Turns Red on Hover */}
      <div className="absolute left-[11px] md:left-[19px] top-20 w-3 h-3 rounded-full bg-zinc-900 border border-zinc-600 z-20 group-hover/timeline:border-red-500 group-hover/timeline:bg-red-500/20 group-hover/timeline:scale-125 transition-all duration-300" />
      
      {/* HORIZONTAL LINE: Shoots out to card */}
      <div className="absolute left-[24px] md:left-[32px] top-[5.25rem] w-8 md:w-16 h-px bg-zinc-800 group-hover/timeline:bg-gradient-to-r group-hover/timeline:from-red-500/50 group-hover/timeline:to-transparent transition-all duration-500" />

      {/* 3D CARD */}
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateY, rotateX, transformStyle: "preserve-3d" }}
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, delay: index * 0.2 }}
        className="relative w-full rounded-2xl bg-zinc-900/40 border border-white/5 backdrop-blur-md group perspective-card hover:border-red-500/30 transition-colors duration-300"
      >
        {/* Spotlight Effect */}
        <motion.div 
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: gradientBg, transform: "translateZ(0px)" }} 
        />

        <div style={{ transform: "translateZ(30px)" }} className="relative p-6 md:p-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-2 mb-4">
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-zinc-100 group-hover:text-red-100 transition-colors">
                {data.role}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                 <span className="text-zinc-500 font-mono text-sm">{data.company}</span>
                 <span className="h-px w-4 bg-zinc-700" />
                 <span className="text-xs font-mono text-zinc-400">{data.period}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <ul className="space-y-3 mb-6">
            {data.description.map((item, i) => (
              <li key={i} className="text-zinc-400 text-sm leading-relaxed flex items-start gap-3 group/item">
                <span className="text-zinc-600 mt-1 group-hover/item:text-red-500 transition-colors">▹</span>
                <span className="group-hover/item:text-zinc-300 transition-colors">{item}</span>
              </li>
            ))}
          </ul>

          {/* Skills (The "Not Plain" part) */}
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, i) => (
              <span key={i} className="px-2 py-1 text-xs font-mono text-zinc-400 bg-black/20 border border-white/5 rounded hover:text-red-400 hover:border-red-500/30 transition-colors">
                {skill}
              </span>
            ))}
          </div>
        </div>
        
        {/* Decorative Corners (Only visible on hover) */}
        <div className="absolute -top-px -right-px w-8 h-8 border-t border-r border-red-500/0 rounded-tr-2xl group-hover:border-red-500/50 transition-colors duration-500" />
        <div className="absolute -bottom-px -left-px w-8 h-8 border-b border-l border-red-500/0 rounded-bl-2xl group-hover:border-red-500/50 transition-colors duration-500" />

      </motion.div>
    </div>
  );
};

export default function Experience() {
  return (
    <section id="experience" className="py-24 px-6 relative z-10 max-w-5xl mx-auto" style={{ perspective: "1500px" }}>
      
      {/* SECTION HEADER */}
      <div className="mb-20 pl-4 md:pl-24">
        <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tighter">
          Experience
        </h2>
        <p className="text-zinc-500 max-w-lg font-mono text-sm border-l-2 border-red-500/50 pl-4">
          // CAREER TIMELINE 
        </p>
      </div>

      <div className="relative min-h-[600px]">
        
        {/* --- THE TIMELINE SPINE (Track) --- */}
        <div className="absolute left-4 md:left-6 top-0 bottom-0 w-px bg-zinc-800">
          
          {/* THE BALL (Data Packet) - Fixed Z-Index & Visibility */}
          <motion.div 
            className="absolute -top-2 -left-[3px] w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-white shadow-[0_0_15px_rgba(248,113,113,1)] z-30"
            initial={{ top: "0%" }}
            whileInView={{ top: ["0%", "100%"] }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ 
              duration: 3, 
              ease: "easeInOut", 
              times: [0, 1],
              repeat: 2, // Runs twice
              repeatDelay: 1
            }}
          >
            {/* The Trail behind the ball */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-[2px] h-24 bg-gradient-to-t from-red-500 via-red-500/50 to-transparent" />
          </motion.div>

        </div>

        {/* EXPERIENCE CARDS */}
        <div className="flex flex-col gap-8">
          {experiences.map((exp, index) => (
            <TimelineCard key={exp.id} data={exp} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
}