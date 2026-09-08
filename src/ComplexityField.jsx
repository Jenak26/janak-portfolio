import { useEffect, useRef } from 'react';
const TAU = Math.PI * 2;
const hash = n => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
// The same particles morph between disorder, a sorting study, a network and a surface.
export default function ComplexityField({
  mode,
  paused,
  clarity,
  onClarityChange
}) {
  const canvasRef = useRef(null);
  const wake = useRef(null);
  const settings = useRef({
    mode,
    paused,
    clarity
  });
  useEffect(() => {
    settings.current = {
      mode,
      paused,
      clarity
    };
    wake.current?.();
  }, [mode, paused, clarity]);
  useEffect(() => {
    const canvas = canvasRef.current,
      ctx = canvas.getContext('2d');
    if (!ctx) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let width = 0,
      height = 0,
      frame = 0,
      visible = true,
      time = 0,
      last = 0,
      arrival = 0;
    const pointer = {
      x: -9999,
      y: -9999
    };
    const points = Array.from({
      length: 1680
    }, (_, i) => ({
      x: (hash(i) - .5) * 3.5,
      y: (hash(i + 7000) - .5) * 2.8,
      z: (hash(i + 9000) - .5) * 2.7
    }));
    const scattered = points.map(p => ({
      ...p
    }));
    const target = (i, shape) => {
      if (shape === 'algorithm') {
        const column = i % 28,
          row = Math.floor(i / 28),
          height = (column + 5) / 33;
        return {
          x: (column / 27 - .5) * 3.05,
          y: .98 - row / 59 * height * 2.25,
          z: Math.sin(column * .16) * .12
        };
      }
      if (shape === 'surface') {
        const x = i % 56 / 55 * 3.4 - 1.7,
          z = Math.floor(i / 56) / 29 * 3 - 1.5;
        return {
          x,
          y: -.5 * Math.cos(x * 1.3) * Math.cos(z * .9) + x * x * .25 - .15,
          z
        };
      }
      const node = i % 5,
        angle = node / 5 * TAU - 1.57;
      const u = hash(i + 22) * TAU,
        v = Math.acos(2 * hash(i + 69) - 1),
        r = .36;
      return {
        x: Math.cos(angle) * 1.12 + r * Math.sin(v) * Math.cos(u),
        y: Math.sin(angle) * 1.02 + r * Math.sin(v) * Math.sin(u),
        z: r * Math.cos(v)
      };
    };
    const project = p => {
      const shape = settings.current.mode;
      const a = shape === 'surface' ? -.38 : Math.sin(time * .2) * .08;
      const b = shape === 'surface' ? .75 : .13;
      const x = p.x * Math.cos(a) + p.z * Math.sin(a),
        z = -p.x * Math.sin(a) + p.z * Math.cos(a);
      const y = p.y * Math.cos(b) - z * Math.sin(b),
        depth = p.y * Math.sin(b) + z * Math.cos(b);
      const scale = Math.min(width, height) * .25 * 5 / (5 + depth);
      return {
        x: width * .5 + x * scale,
        y: height * .5 + y * scale,
        z: depth
      };
    };
    const draw = () => {
      const {
        mode: shape,
        clarity: amount
      } = settings.current;
      ctx.clearRect(0, 0, width, height);
      const blend = reduced.matches || settings.current.paused ? amount : amount * Math.min(1, arrival);
      if (shape === 'network' && blend > .72) {
        const centers = Array.from({
          length: 5
        }, (_, i) => project({
          x: Math.cos(i / 5 * TAU - 1.57) * 1.12,
          y: Math.sin(i / 5 * TAU - 1.57) * 1.02,
          z: 0
        }));
        ctx.strokeStyle = `rgba(193,178,255,${(blend - .72) * 1.2})`;
        ctx.lineWidth = .8;
        for (let i = 0; i < 5; i++) for (let j = i + 1; j < 5; j++) {
          ctx.beginPath();
          ctx.moveTo(centers[i].x, centers[i].y);
          ctx.lineTo(centers[j].x, centers[j].y);
          ctx.stroke();
        }
      }
      const projected = [];
      for (let i = 0; i < points.length; i++) {
        const dest = target(i, shape),
          scatter = scattered[i];
        const q = {
          x: scatter.x + (dest.x - scatter.x) * blend,
          y: scatter.y + (dest.y - scatter.y) * blend,
          z: scatter.z + (dest.z - scatter.z) * blend
        };
        const lerp = reduced.matches || settings.current.paused ? 1 : .075;
        points[i].x += (q.x - points[i].x) * lerp;
        points[i].y += (q.y - points[i].y) * lerp;
        points[i].z += (q.z - points[i].z) * lerp;
        const p = project(points[i]),
          dx = p.x - pointer.x,
          dy = p.y - pointer.y,
          d = Math.hypot(dx, dy);
        if (!settings.current.paused && !reduced.matches && d > 0 && d < 90) {
          p.x += dx / d * (90 - d) * .28;
          p.y += dy / d * (90 - d) * .28;
        }
        projected.push({
          ...p,
          i
        });
      }
      projected.sort((a, b) => b.z - a.z);
      for (const p of projected) {
        ctx.fillStyle = p.i % 5 === 0 ? '#e7ff89' : '#c9bdff';
        ctx.globalAlpha = Math.max(.3, Math.min(1, .8 - p.z * .18));
        const r = 1.25 + (1 - p.z) * .35;
        ctx.fillRect(p.x, p.y, r, r);
      }
      ctx.globalAlpha = 1;
      if (blend > .92) {
        ctx.font = '9px monospace';
        ctx.fillStyle = '#b0b5ac';
        if (shape === 'network') for (let i = 0; i < 5; i++) {
          const p = project({
            x: Math.cos(i / 5 * TAU - 1.57) * 1.12,
            y: Math.sin(i / 5 * TAU - 1.57) * 1.02 + .48,
            z: 0
          });
          ctx.fillText(`NODE 0${i + 1}`, p.x - 20, p.y);
        }
      }
    };
    const loop = now => {
      frame = 0;
      if (!visible || document.hidden) return;
      if (now - last >= 32) {
        if (!settings.current.paused && !reduced.matches) {
          time += .025;
          arrival += .012;
        }
        draw();
        last = now;
      }
      if (!settings.current.paused && !reduced.matches) frame = requestAnimationFrame(loop);
    };
    const start = () => {
      if (!frame && visible && !document.hidden) frame = requestAnimationFrame(loop);
    };
    const refresh = () => {
      if (settings.current.paused || reduced.matches) {
        cancelAnimationFrame(frame);
        frame = 0;
        draw();
      } else start();
    };
    wake.current = refresh;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
      start();
    };
    const move = e => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
    };
    const leave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
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
    reduced.addEventListener('change', refresh);
    resize();
    return () => {
      wake.current = null;
      reduced.removeEventListener('change', refresh);
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener('pointermove', move);
      canvas.removeEventListener('pointerleave', leave);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, []);
  return <div className="complexity-field"><canvas ref={canvasRef} role="img" aria-label={`${mode} particle study, ${Math.round(clarity * 100)} percent organized`} /><div className="clarity-control"><label htmlFor="clarity">DISORDER</label><input id="clarity" type="range" min="0" max="100" value={Math.round(clarity * 100)} onChange={e => onClarityChange(Number(e.target.value) / 100)} aria-label="Organize the particles" /><span>CLARITY</span></div></div>;
}
