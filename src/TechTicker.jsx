import React from 'react';
import LogoLoop from './LogoLoop';

const logos = [
  // --- Languages ---
  { title: "Python", src: "https://cdn.simpleicons.org/python" },
  { title: "Java", src: "https://cdn.simpleicons.org/openjdk" }, // Java often uses OpenJDK icon
  { title: "HTML5", src: "https://cdn.simpleicons.org/html5" },
  { title: "CSS3", src: "https://cdn.simpleicons.org/css3" },
  { title: "C", src: "https://cdn.simpleicons.org/c" },
  { title: "C#", src: "https://cdn.simpleicons.org/csharp" },
  { title: "JavaScript", src: "https://cdn.simpleicons.org/javascript" },
  { title: "TypeScript", src: "https://cdn.simpleicons.org/typescript" },

  // --- Frameworks ---
  { title: "React", src: "https://cdn.simpleicons.org/react" },
  { title: "Tailwind", src: "https://cdn.simpleicons.org/tailwindcss" },
  { title: "Framer", src: "https://cdn.simpleicons.org/framer" },
  { title: "GSAP", src: "https://cdn.simpleicons.org/greensock" },
  { title: "Three.js", src: "https://cdn.simpleicons.org/threedotjs" },

  // --- Databases ---
  { title: "MySQL", src: "https://cdn.simpleicons.org/mysql" },
  { title: "PostgreSQL", src: "https://cdn.simpleicons.org/postgresql" },

  // --- Tools ---
  { title: "Git", src: "https://cdn.simpleicons.org/git" },
  { title: "Docker", src: "https://cdn.simpleicons.org/docker" },
  { title: "VS Code", src: "https://cdn.simpleicons.org/visualstudiocode" },
  { title: "Vite", src: "https://cdn.simpleicons.org/vite" },
  { title: "LaTeX", src: "https://cdn.simpleicons.org/latex" }
];

export default function TechTicker() {
  return (
    <section className="relative z-10 py-12 w-full overflow-hidden min-h-[100px]">
      <div className="w-full opacity-60 hover:opacity-100 transition-opacity duration-500">
        <LogoLoop
          logos={logos}
          speed={35} 
          direction="left"
          logoHeight={32} // Slightly larger for images
          gap={60} 
          hoverSpeed={5}
          scaleOnHover={true}
          fadeOut={false} 
        />
      </div>
    </section>
  );
}