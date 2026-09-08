import { useEffect, useRef } from 'react';

export default function SignatureCursor({ disabled, rootRef }) {
  const cursorRef = useRef(null);
  useEffect(() => {
    const media = matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    const root = rootRef.current;
    const cursor = cursorRef.current;
    if (disabled || !root) return;
    let frame = 0;
    let x = 0, y = 0, currentX = 0, currentY = 0;
    const hide = () => { cursor.dataset.visible = 'false'; root.classList.remove('signature-pointer'); };
    const draw = () => {
      currentX += (x - currentX) * .24;
      currentY += (y - currentY) * .24;
      cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      frame = Math.abs(x - currentX) + Math.abs(y - currentY) > .2 ? requestAnimationFrame(draw) : 0;
    };
    const move = e => {
      if (!media.matches || e.pointerType !== 'mouse' || !root.contains(e.target)) { hide(); return; }
      x = e.clientX; y = e.clientY;
      if (cursor.dataset.visible !== 'true') { currentX = x; currentY = y; }
      cursor.dataset.visible = 'true';
      root.classList.add('signature-pointer');
      const target = e.target.closest('a,button,input');
      cursor.dataset.active = target ? 'true' : 'false';
      cursor.querySelector('span').textContent = target?.matches('input[type="range"]') ? 'DRAG' : target?.matches('a[target="_blank"]') ? 'OPEN ↗' : target ? 'GO' : '';
      if (!frame) frame = requestAnimationFrame(draw);
    };
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerleave', hide);
    window.addEventListener('blur', hide);
    window.addEventListener('scroll', hide, { passive: true });
    media.addEventListener('change', hide);
    return () => {
      hide(); cancelAnimationFrame(frame);
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', hide);
      window.removeEventListener('blur', hide);
      window.removeEventListener('scroll', hide);
      media.removeEventListener('change', hide);
    };
  }, [disabled, rootRef]);
  return <div ref={cursorRef} className="signature-cursor" aria-hidden="true"><i /><span /></div>;
}
