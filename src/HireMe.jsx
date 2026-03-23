import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Floating "Let's connect" button — always visible in the bottom right
// corner regardless of scroll position. Pulses subtly to draw attention.
// On click opens mailto so the visitor can reach out in one click.
export default function HireMe() {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.a
      href="mailto:connect.janak@gmail.com"
      target="_blank"
      rel="noopener noreferrer"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      // Fixed position — always bottom right, above everything
      style={{ position: 'fixed', bottom: '28px', right: '28px', zIndex: 9999 }}
      // Pulse animation via keyframes defined in index.css
      className="hire-me-btn flex items-center gap-0 bg-zinc-900/90 border border-red-500/40 rounded-full cursor-pointer text-white font-mono text-sm overflow-hidden backdrop-blur-md"
      animate={{
        width: hovered ? 160 : 44,
        paddingLeft: hovered ? 18 : 12,
        paddingRight: hovered ? 18 : 12,
        gap: hovered ? 8 : 0,
      }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      // Stop pulse on hover — cleaner feel
      whileHover={{ boxShadow: '0 0 20px rgba(255,77,77,0.5)' }}
      initial={{ scale: 0, opacity: 0 }}
      // Small entrance animation on first render
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
    >
      {/* Mail icon — always visible */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        style={{ width: 18, height: 18, flexShrink: 0, color: '#ff4d4d' }}
      >
        <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
        <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
      </svg>

      {/* Text — fades in on hover */}
      <AnimatePresence>
        {hovered && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}
          >
            Let's connect
          </motion.span>
        )}
      </AnimatePresence>
    </motion.a>
  );
}
