import { useEffect, useRef } from 'react';
import './signature.css';

export default function OpeningSequence({ onComplete }) {
  const dialog = useRef(null);
  useEffect(() => {
    const element = dialog.current;
    const previousOverflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = 'hidden';
    const finish = setTimeout(onComplete, 5000);
    return () => {
      clearTimeout(finish);
      element.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [onComplete]);
  return <dialog ref={dialog} className="signature-opening" aria-label="Janak Kabra introduction" onCancel={e => { e.preventDefault(); onComplete(); }}>
    <div className="opening-top"><span>JANAK KABRA / CREATIVE DEVELOPER</span><button onClick={onComplete} autoFocus>SKIP INTRO ↗</button></div>
    <div className="opening-art" aria-hidden="true">
      <div className="opening-orbit" /><div className="opening-orbit orbit-two" />
      <svg viewBox="0 0 600 340" className="opening-monogram">
        {Array.from({ length: 28 }, (_, i) => <path key={i} className="opening-fragment" style={{ '--dx': `${Math.sin(i * 7) * 230}px`, '--dy': `${Math.cos(i * 3) * 130}px`, '--angle': `${i * 29}deg`, '--delay': `${i * 13}ms` }} d={i < 14 ? `M${180 + i * 5} 100V210Q${180 + i * 5} 252 ${155 + i * 5} 252` : `M${305 + (i - 14) * 5} 95V250M${410 + (i - 14) * 3} 95L${310 + (i - 14) * 5} 173L${415 + (i - 14) * 3} 250`} />)}
      </svg>
      <span className="opening-coordinate coordinate-one">THOUGHT → FORM</span><span className="opening-coordinate coordinate-two">JK / 01</span>
    </div>
    <div className="opening-copy"><span className="opening-line line-one">A little disorder.</span><span className="opening-line line-two">A different perspective.</span><span className="opening-line line-three">Happily <em>off script.</em></span></div>
    <div className="opening-bottom"><span>COMPLEXITY → CLARITY</span><span>AN INTRODUCTION / 05 SEC</span><div className="opening-progress" /></div>
  </dialog>;
}
