import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const DEFAULT_ITEMS = [
  {
    label: 'Home',
    href: '#home',
    hoverStyles: { bgColor: 'rgba(59, 130, 246, 0.5)', textColor: '#ffffff' }
  },
  {
    label: 'About',
    href: '#about',
    hoverStyles: { bgColor: 'rgba(236, 72, 153, 0.5)', textColor: '#ffffff' }
  },
  {
    label: 'Skills',
    href: '#skills',
    hoverStyles: { bgColor: 'rgba(16, 185, 129, 0.5)', textColor: '#ffffff' }
  },
  {
    label: 'Experience',
    href: '#experience',
    hoverStyles: { bgColor: 'rgba(139, 92, 246, 0.5)', textColor: '#ffffff' }
  },
  {
    label: 'Projects',
    href: '#projects',
    hoverStyles: { bgColor: 'rgba(245, 158, 11, 0.5)', textColor: '#ffffff' }
  }
];

export default function BubbleMenu() {
  const [activeTab, setActiveTab] = useState(DEFAULT_ITEMS[0].label);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Scroll spy — highlights nav item matching current section
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      for (const item of DEFAULT_ITEMS) {
        const section = document.querySelector(item.href);
        if (section) {
          const { offsetTop, offsetHeight } = section;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveTab(item.label);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-6 inset-x-0 z-50 flex justify-center pointer-events-none">
      <div className="pointer-events-auto bg-zinc-900/80 backdrop-blur-md border border-white/10 rounded-full p-1.5 flex items-center gap-1 shadow-2xl">

        {DEFAULT_ITEMS.map((tab) => (
          <a
            key={tab.label}
            href={tab.href}
            onClick={(e) => {
              e.preventDefault();
              const section = document.querySelector(tab.href);
              if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
              }
              setActiveTab(tab.label);
            }}
            className="relative px-4 py-2 rounded-full text-sm font-medium text-zinc-400 transition-colors duration-300 hover:text-white cursor-pointer"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            {activeTab === tab.label && (
              <motion.div
                layoutId="bubble-active"
                className="absolute inset-0 rounded-full -z-10"
                style={{ backgroundColor: tab.hoverStyles.bgColor }}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
              />
            )}

            <span
              className="relative z-10 mix-blend-screen"
              style={{
                color: activeTab === tab.label ? tab.hoverStyles.textColor : 'inherit'
              }}
            >
              {tab.label}
            </span>
          </a>
        ))}

      </div>
    </div>
  );
}
