import React, { useRef, useEffect } from "react";

export default function Beams({
  className,
  beamWidth = 2, // comee here for sharpness 
  beamHeight = 40, 
  beamNumber = 50, // increase if feel so 
  lightColor = "#ffffff",
  speed = 1.5,
  rotation = 30,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    
    let animationFrameId;
    let width, height;
    const beams = [];

    
    for (let i = 0; i < beamNumber; i++) {
      beams.push({
        x: Math.random() * window.innerWidth * 1.5 - window.innerWidth * 0.25,
        y: Math.random() * window.innerHeight * 1.5 - window.innerHeight * 0.5,
        speed: (Math.random() * 0.5 + 0.5) * speed,
        length: Math.random() * 300 + beamHeight * 10,
       
        opacity: Math.random() * 0.4 + 0.2, 
        width: Math.random() * beamWidth + 1,
      });
    }

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      
      // rotation here
      ctx.translate(width / 2, height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.translate(-width / 2, -height / 2);

      // less overlapping
      ctx.globalCompositeOperation = "lighter";

      beams.forEach((beam) => {
        // Move beam
        beam.y -= beam.speed;
        
        // Reset if off screen
        if (beam.y < -500) {
          beam.y = height + 500;
          beam.x = Math.random() * width * 1.5 - width * 0.25;
        }

        // Draw the beam
        const gradient = ctx.createLinearGradient(beam.x, beam.y, beam.x, beam.y + beam.length);
        
        // Tail fade 
        gradient.addColorStop(0, `rgba(255, 255, 255, 0)`);
        
        // Core (Bright & Visible)
        
        const opacityHex = Math.floor(beam.opacity * 255).toString(16).padStart(2, '0');
        gradient.addColorStop(0.4, `${lightColor}${opacityHex}`);
        gradient.addColorStop(0.6, `${lightColor}${opacityHex}`);
        
        // Head fade (transparent)
        gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);

        ctx.fillStyle = gradient;
        ctx.fillRect(beam.x, beam.y, beam.width, beam.length);
      });

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [beamWidth, beamHeight, beamNumber, lightColor, speed, rotation]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 z-0 pointer-events-none w-full h-full ${className}`}
      style={{ background: "#020202" }} //bg clr
    />
  );
}