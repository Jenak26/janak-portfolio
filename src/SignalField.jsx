import { useEffect, useRef } from 'react';
export default function SignalField({
  paused,
  mode
}) {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current,
      ctx = canvas.getContext('2d');
    if (!ctx) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let w = 0,
      h = 0,
      frame = 0,
      visible = true,
      t = 0,
      last = 0;
    const pointer = {
      x: -10000,
      y: -10000
    };
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const size = Math.min(w, h),
        dots = [];
      for (let row = 0; row < 44; row++) for (let col = 0; col < 76; col++) {
        const u = col / 76 * Math.PI * 2,
          v = row / 43;
        let x, y, z;
        if (mode === 'wave') {
          x = (col / 75 - .5) * 3.2;
          y = (v - .5) * 2.5;
          z = .5 * Math.sin(col * .11 + t + v * 5) + .2 * Math.cos(v * 10 + t);
        } else {
          const twist = u + v * 3.4 + t * .12;
          const radius = .8 + .22 * Math.sin(v * 8 + t * .6);
          x = Math.cos(twist) * radius;
          y = (v - .5) * 2.85;
          z = Math.sin(twist) * radius;
        }
        const a = -.52,
          b = .24;
        const xx = x * Math.cos(a) - y * Math.sin(a),
          yy = x * Math.sin(a) + y * Math.cos(a);
        const ry = yy * Math.cos(b) - z * Math.sin(b),
          rz = yy * Math.sin(b) + z * Math.cos(b);
        let px = w * .54 + xx * size * .29,
          py = h * .51 + ry * size * .29;
        const dx = px - pointer.x,
          dy = py - pointer.y,
          d = Math.hypot(dx, dy),
          force = Math.max(0, 1 - d / 135);
        if (!reduced.matches && d > 0) {
          px += dx / d * force * 35;
          py += dy / d * force * 35;
        }
        dots.push({
          x: px,
          y: py,
          z: rz,
          r: Math.max(.6, 1.5 + rz * .45),
          color: row > 22 ? '#c0b1ff' : '#e4ff78',
          alpha: .35 + (rz + 1.5) / 4
        });
      }
      dots.sort((a, b) => a.z - b.z);
      for (const p of dots) {
        ctx.globalAlpha = Math.min(1, p.alpha);
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.r * 1.5, p.r * 1.5);
      }
      ctx.globalAlpha = 1;
      if (pointer.x > 0) {
        ctx.strokeStyle = '#ffffff50';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(pointer.x, pointer.y, 20, 0, Math.PI * 2);
        ctx.stroke();
      }
    };
    const loop = now => {
      frame = 0;
      if (!visible || document.hidden) return;
      if (now - last > 32) {
        if (!paused && !reduced.matches) t += .013;
        draw();
        last = now;
      }
      if (!paused && !reduced.matches) frame = requestAnimationFrame(loop);
    };
    const start = () => {
      if (!frame && visible && !document.hidden) frame = requestAnimationFrame(loop);
    };
    const resize = () => {
      const box = canvas.getBoundingClientRect();
      w = box.width;
      h = box.height;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
      start();
    };
    const move = e => {
      const box = canvas.getBoundingClientRect();
      pointer.x = e.clientX - box.left;
      pointer.y = e.clientY - box.top;
      if (paused || reduced.matches) draw();
    };
    const leave = () => {
      pointer.x = -10000;
      pointer.y = -10000;
      draw();
    };
    const visibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else start();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();else {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    });
    io.observe(canvas);
    canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerleave', leave);
    document.addEventListener('visibilitychange', visibility);
    reduced.addEventListener('change', start);
    resize();
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener('pointermove', move);
      canvas.removeEventListener('pointerleave', leave);
      document.removeEventListener('visibilitychange', visibility);
      reduced.removeEventListener('change', start);
    };
  }, [mode, paused]);
  return <canvas ref={ref} className="signal-canvas" role="img" aria-label={`Animated ${mode} made of particles. Move your pointer over it to bend the field.`} />;
}
