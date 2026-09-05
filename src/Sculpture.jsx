import { useEffect, useRef } from 'react';

// A dependency-free parametric sculpture. Rendering stays outside React.
export default function Sculpture({
  mode = 'knot',
  paused = false,
  color = 'orange'
}) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let width = 0,
      height = 0,
      frame = 0,
      visible = true,
      dragging = false;
    let lastX = 0,
      lastY = 0,
      angle = -.36,
      tilt = -.45,
      targetAngle = -.36,
      targetTilt = -.45;
    let lastTime = 0;
    const project = (x, y, z) => {
      const xx = x * Math.cos(angle) + z * Math.sin(angle),
        zz = -x * Math.sin(angle) + z * Math.cos(angle);
      const yy = y * Math.cos(tilt) - zz * Math.sin(tilt),
        depth = y * Math.sin(tilt) + zz * Math.cos(tilt);
      const scale = Math.min(width, height) * (mode === 'surface' ? .19 : .23) * 6 / (6 + depth);
      return [width * .5 + xx * scale, height * .5 + yy * scale, depth];
    };
    const point = (u, v) => {
      if (mode === 'surface') {
        const x = (u / Math.PI - 1) * 2.3,
          z = (v / Math.PI - 1) * 2.3;
        return [x, .65 * Math.sin(x * 1.1) * Math.cos(z * .75) + .22 * x * x - .65, z];
      }
      if (mode === 'orbit') {
        const r = 1.45 + .48 * Math.cos(v);
        return [r * Math.cos(u), .48 * Math.sin(v) + .4 * Math.sin(u * 3), r * Math.sin(u)];
      }
      const r = 1.2 + .42 * Math.cos(3 * u);
      const center = [r * Math.cos(2 * u), r * Math.sin(2 * u), .65 * Math.sin(3 * u)];
      return [center[0] + .43 * Math.cos(v) * Math.cos(2 * u), center[1] + .43 * Math.cos(v) * Math.sin(2 * u), center[2] + .43 * Math.sin(v)];
    };
    // Geometry is generated once per form, then only projected during animation.
    const geometry = [];
    const count = mode === 'surface' ? 35 : 180,
      segments = 32;
    for (let i = 0; i < count; i++) {
      const points = [];
      for (let j = 0; j <= segments; j++) points.push(point(i / count * Math.PI * 2, j / segments * Math.PI * 2));
      geometry.push(points);
    }
    if (mode === 'surface') for (let i = 0; i < 35; i++) {
      const points = [];
      for (let j = 0; j <= 42; j++) points.push(point(j / 42 * Math.PI * 2, i / 35 * Math.PI * 2));
      geometry.push(points);
    }
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const lines = geometry.map(points => {
        let depth = 0;
        const pts = points.map(p => {
          const projected = project(...p);
          depth += projected[2];
          return projected;
        });
        return {
          pts,
          depth: depth / pts.length
        };
      });
      // Opaque shaded ribbon faces give the knot depth and true self-occlusion.
      if (mode !== 'surface') {
        const faces = [];
        for (let i = 0; i < lines.length; i++) {
          const next = (i + 1) % lines.length;
          for (let j = 0; j < segments; j++) {
            const points = [lines[i].pts[j], lines[next].pts[j], lines[next].pts[j + 1], lines[i].pts[j + 1]];
            const p = geometry[i][j],
              q = geometry[next][j],
              r = geometry[i][j + 1];
            const a = q.map((v, k) => v - p[k]),
              b = r.map((v, k) => v - p[k]);
            let nx = a[1] * b[2] - a[2] * b[1],
              ny = a[2] * b[0] - a[0] * b[2],
              nz = a[0] * b[1] - a[1] * b[0];
            const length = Math.hypot(nx, ny, nz) || 1;
            nx /= length;
            ny /= length;
            nz /= length;
            const rx = nx * Math.cos(angle) + nz * Math.sin(angle),
              rz = -nx * Math.sin(angle) + nz * Math.cos(angle);
            const ry = ny * Math.cos(tilt) - rz * Math.sin(tilt),
              zz = ny * Math.sin(tilt) + rz * Math.cos(tilt);
            const lighting = Math.abs(-.3 * rx - .55 * ry + .78 * zz);
            faces.push({
              points,
              depth: points.reduce((sum, p) => sum + p[2], 0) / 4,
              light: 25 + lighting * 37
            });
          }
        }
        faces.sort((a, b) => b.depth - a.depth);
        for (const face of faces) {
          ctx.beginPath();
          face.points.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
          ctx.closePath();
          ctx.fillStyle = `hsl(15,88%,${face.light}%)`;
          ctx.fill();
          ctx.strokeStyle = ctx.fillStyle;
          ctx.lineWidth = .45;
          ctx.stroke();
        }
        return;
      }
      lines.sort((a, b) => b.depth - a.depth);
      for (const {
        pts,
        depth
      } of lines) {
        const light = Math.max(27, Math.min(61, 46 - depth * 9));
        ctx.beginPath();
        pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
        ctx.strokeStyle = color === 'gold' ? `hsla(39,85%,${light + 15}%,${.7 - depth * .1})` : `hsl(16,94%,${light}%)`;
        ctx.lineWidth = mode === 'surface' ? 1 : 1.6;
        ctx.stroke();
      }
    };
    const render = time => {
      frame = 0;
      if (!visible || document.hidden) return;
      if (time - lastTime >= 32) {
        if (!dragging && !paused && !reduced.matches) targetAngle += .004;
        angle += (targetAngle - angle) * .075;
        tilt += (targetTilt - tilt) * .075;
        draw();
        lastTime = time;
      }
      if (!paused && !reduced.matches || dragging || Math.abs(targetAngle - angle) > .001 || Math.abs(targetTilt - tilt) > .001) frame = requestAnimationFrame(render);
    };
    const start = () => {
      if (!frame && visible && !document.hidden) frame = requestAnimationFrame(render);
    };
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
      start();
    };
    const down = e => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      canvas.setPointerCapture(e.pointerId);
      start();
    };
    const move = e => {
      if (!dragging) return;
      targetAngle += (e.clientX - lastX) * .008;
      targetTilt = Math.max(-1.2, Math.min(1.2, targetTilt + (e.clientY - lastY) * .005));
      lastX = e.clientX;
      lastY = e.clientY;
      start();
    };
    const up = () => {
      dragging = false;
    };
    const key = e => {
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) return;
      e.preventDefault();
      targetAngle += e.key === 'ArrowLeft' ? -.3 : e.key === 'ArrowRight' ? .3 : 0;
      targetTilt += e.key === 'ArrowUp' ? -.15 : e.key === 'ArrowDown' ? .15 : 0;
      start();
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
    canvas.addEventListener('pointerdown', down);
    canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerup', up);
    canvas.addEventListener('pointercancel', up);
    canvas.addEventListener('keydown', key);
    document.addEventListener('visibilitychange', visibility);
    reduced.addEventListener('change', start);
    resize();
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener('pointerdown', down);
      canvas.removeEventListener('pointermove', move);
      canvas.removeEventListener('pointerup', up);
      canvas.removeEventListener('pointercancel', up);
      canvas.removeEventListener('keydown', key);
      document.removeEventListener('visibilitychange', visibility);
      reduced.removeEventListener('change', start);
    };
  }, [mode, paused, color]);
  return <canvas ref={canvasRef} className="sculpture-canvas" tabIndex={color === 'gold' ? -1 : 0} role="img" aria-label={color === 'gold' ? 'Illustrative mathematical surface' : `Interactive ${mode} sculpture. Drag horizontally or use arrow keys to rotate.`}>An abstract mathematical sculpture.</canvas>;
}
