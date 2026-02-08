import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './TargetCursor.css';

const TargetCursor = ({ rootRef }) => {
  const cursorRef = useRef(null);
  const dotRef = useRef(null);
  const cornersRef = useRef([]);

  useEffect(() => {
    const cursor = cursorRef.current;
    const dot = dotRef.current;
    const corners = cornersRef.current;
    const root = rootRef?.current;

    if (!cursor || !root) return;

    // Initial State: Hidden
    gsap.set(cursor, { opacity: 0 });
    
    // Mouse State
    let mouseX = 0;
    let mouseY = 0;
    let isHoveringTarget = false;

    // Constants
    const baseOffset = 20; // Default size of crosshair

    // --- MOUSE MOVE LOGIC ---
    const moveCursor = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // 1. Move the central dot instantly
      gsap.to(dot, {
        x: mouseX,
        y: mouseY,
        duration: 0.05,
        ease: 'power2.out'
      });

      // 2. Check if hovering a ".cursor-target" inside our section
      const target = e.target.closest('.cursor-target');
      const isInsideSection = root.contains(e.target);

      if (target && isInsideSection) {
        isHoveringTarget = true;
        const rect = target.getBoundingClientRect();
        const padding = 10; // Extra breathing room around the button

        // SNAP TO TARGET CORNERS
        gsap.to(corners[0], { x: rect.left - padding, y: rect.top - padding, duration: 0.3, ease: 'back.out(1.7)' }); // TL
        gsap.to(corners[1], { x: rect.right + padding, y: rect.top - padding, duration: 0.3, ease: 'back.out(1.7)' }); // TR
        gsap.to(corners[2], { x: rect.left - padding, y: rect.bottom + padding, duration: 0.3, ease: 'back.out(1.7)' }); // BL
        gsap.to(corners[3], { x: rect.right + padding, y: rect.bottom + padding, duration: 0.3, ease: 'back.out(1.7)' }); // BR
        
        // Active Dot State
        gsap.to(dot, { scale: 1.5, backgroundColor: '#ff4d4d', duration: 0.3 });

      } else {
        isHoveringTarget = false;
        
        // DEFAULT CROSSHAIR STATE (Follow mouse)
        // TL
        gsap.to(corners[0], { x: mouseX - baseOffset, y: mouseY - baseOffset, duration: 0.15 }); 
        // TR
        gsap.to(corners[1], { x: mouseX + baseOffset, y: mouseY - baseOffset, duration: 0.15 });
        // BL
        gsap.to(corners[2], { x: mouseX - baseOffset, y: mouseY + baseOffset, duration: 0.15 });
        // BR
        gsap.to(corners[3], { x: mouseX + baseOffset, y: mouseY + baseOffset, duration: 0.15 });

        // Reset Dot
        gsap.to(dot, { scale: 1, backgroundColor: '#fff', duration: 0.3 });
      }
    };

    // --- VISIBILITY LOGIC ---
    const handleMouseEnter = () => {
      gsap.to(cursor, { opacity: 1, duration: 0.3 });
      document.body.style.cursor = 'none'; // Hide default cursor
    };

    const handleMouseLeave = () => {
      gsap.to(cursor, { opacity: 0, duration: 0.3 });
      document.body.style.cursor = 'auto'; // Restore default cursor
    };

    // Attach Listeners
    window.addEventListener('mousemove', moveCursor);
    root.addEventListener('mouseenter', handleMouseEnter);
    root.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      root?.removeEventListener('mouseenter', handleMouseEnter);
      root?.removeEventListener('mouseleave', handleMouseLeave);
      document.body.style.cursor = 'auto';
    };
  }, [rootRef]);

  return (
    <div ref={cursorRef} className="target-cursor-wrapper">
      <div ref={dotRef} className="target-cursor-dot" />
      <div ref={el => cornersRef.current[0] = el} className="target-cursor-corner corner-tl" />
      <div ref={el => cornersRef.current[1] = el} className="target-cursor-corner corner-tr" />
      <div ref={el => cornersRef.current[2] = el} className="target-cursor-corner corner-bl" />
      <div ref={el => cornersRef.current[3] = el} className="target-cursor-corner corner-br" />
    </div>
  );
};

export default TargetCursor;