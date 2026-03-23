import React, { useRef, useEffect } from "react";

export default function Beams({
  className,
  beamWidth = 2,
  beamHeight = 40,
  beamNumber = 50,
  lightColor = "#ffffff",
  speed = 1.5,
  rotation = 30,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Respect the OS-level "reduce motion" accessibility setting.
    // If the user has enabled it, skip the animation entirely — the
    // canvas stays blank and the page remains usable without motion.
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

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

      ctx.translate(width / 2, height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.translate(-width / 2, -height / 2);

      // "lighter" blend mode makes overlapping beams brighter,
      // creating a natural glow effect without extra draw calls
      ctx.globalCompositeOperation = "lighter";

      beams.forEach((beam) => {
        beam.y -= beam.speed;

        // Reset beam to bottom when it scrolls off the top
        if (beam.y < -500) {
          beam.y = height + 500;
          beam.x = Math.random() * width * 1.5 - width * 0.25;
        }

        const gradient = ctx.createLinearGradient(
          beam.x, beam.y,
          beam.x, beam.y + beam.length
        );

        const opacityHex = Math.floor(beam.opacity * 255)
          .toString(16)
          .padStart(2, "0");

        gradient.addColorStop(0, `rgba(255, 255, 255, 0)`);
        gradient.addColorStop(0.4, `${lightColor}${opacityHex}`);
        gradient.addColorStop(0.6, `${lightColor}${opacityHex}`);
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
      style={{ background: "#020202" }}
    />
  );
}
