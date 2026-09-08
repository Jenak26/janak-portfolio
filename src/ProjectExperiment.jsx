import { useState } from 'react';
const seed = [8, 3, 11, 5, 2, 9, 6, 12, 4, 7, 1, 10];
const sortFrames = [seed];
{
  const a = [...seed];
  for (let end = a.length - 1; end > 0; end--) for (let j = 0; j < end; j++) if (a[j] > a[j + 1]) {
    [a[j], a[j + 1]] = [a[j + 1], a[j]];
    sortFrames.push([...a]);
  }
}
const studies = {
  algorithm: ['SORTING STUDY', 'Step through a real bubble sort.'],
  surface: ['SURFACE STUDY', 'Bend an illustrative surface.'],
  raft: ['NETWORK STUDY', 'Explore a five-node topology.'],
  snap: ['AGENT FLOW', 'Follow the stages of an ordering agent.'],
  vault: ['ENVELOPE STUDY', 'Explore the layers around a secret.'],
  evidence: ['PIXEL STUDY', 'Inspect a synthetic patch, without assigning a verdict.'],
  backtester: ['TIME STUDY', 'Reveal synthetic bars one step at a time.'],
  screener: ['FILTER STUDY', 'Filter illustrative values by threshold.']
};
export default function ProjectExperiment({
  type,
  title
}) {
  const [step, setStep] = useState(0);
  const [value, setValue] = useState(35);
  let art, control, status;
  if (type === 'algorithm') {
    const values = sortFrames[Math.min(step, sortFrames.length - 1)];
    art = <svg viewBox="0 0 400 230" aria-hidden="true">{values.map((v, i) => <g key={v}><rect x={30 + i * 28} y={193 - v * 12} width="17" height={v * 12} rx="2" fill={v === i + 1 ? '#e4ff78' : '#c0b1ff'} /><text x={38 + i * 28} y="213" textAnchor="middle">{v}</text></g>)}</svg>;
    status = step === sortFrames.length - 1 ? 'ORDER FOUND' : `SWAP ${String(step).padStart(2, '0')}`;
    control = <><button onClick={() => setStep(s => Math.min(s + 1, sortFrames.length - 1))} disabled={step === sortFrames.length - 1}>Next swap →</button><button onClick={() => setStep(0)} disabled={step === 0}>Reset ↺</button></>;
  } else if (type === 'raft') {
    const nodes = Array.from({
      length: 5
    }, (_, i) => ({
      x: 200 + Math.cos(i / 5 * Math.PI * 2 - 1.57) * 125,
      y: 118 + Math.sin(i / 5 * Math.PI * 2 - 1.57) * 78
    }));
    art = <svg viewBox="0 0 400 230" aria-hidden="true">{nodes.map((n, i) => <line key={`l${i}`} x1={nodes[step % 5].x} y1={nodes[step % 5].y} x2={n.x} y2={n.y} stroke="#858e72" strokeDasharray="3 5" />)}{nodes.map((n, i) => <g key={i}><circle cx={n.x} cy={n.y} r={i === step % 5 ? 23 : 17} fill={i === step % 5 ? '#e4ff78' : '#272d28'} stroke="#a0ae8a" /><text x={n.x} y={n.y + 4} textAnchor="middle" fill={i === step % 5 ? '#20271b' : '#d9e2cd'}>{i + 1}</text></g>)}</svg>;
    status = `LEADER / NODE 0${step % 5 + 1}`;
    control = <button onClick={() => setStep(s => s + 1)}>Change leader ↻</button>;
  } else if (type === 'surface') {
    const paths = [];
    for (let row = 0; row < 18; row++) {
      const pts = [];
      for (let col = 0; col < 30; col++) {
        const x = (col - 15) / 8,
          z = (row - 9) / 7,
          y = x * x * .2 - Math.cos(z) * value / 70;
        pts.push(`${200 + x * 70 + z * 28},${130 + z * 30 - y * 45}`);
      }
      paths.push(pts.join(' '));
    }
    art = <svg viewBox="0 0 400 230" aria-hidden="true">{paths.map((d, i) => <polyline key={i} points={d} fill="none" stroke={i % 3 ? '#c0b1ff' : '#e4ff78'} strokeWidth="1.2" />)}</svg>;
    status = 'ILLUSTRATIVE / NOT MARKET DATA';
    control = <label>Curvature<input aria-label={`${title} curvature`} type="range" min="0" max="100" value={value} onChange={e => setValue(+e.target.value)} /></label>;
  } else if (type === 'snap') {
    const labels = ['PHOTO', 'VISION', 'TOOLS', 'ORDER'];
    art = <svg viewBox="0 0 400 230" aria-hidden="true"><path d="M65 110H335" stroke="#736780" strokeDasharray="4 5" />{labels.map((label, i) => <g key={label}><rect x={35 + i * 88} y="82" width="65" height="65" rx="14" fill={i === step % 4 ? '#e4ff78' : '#302936'} stroke="#9988ad" /><text x={67 + i * 88} y="121" textAnchor="middle" fill={i === step % 4 ? '#222' : '#c0b1ff'} fontSize="25">{['◎', '✳', '⌘', '✓'][i]}</text><text x={67 + i * 88} y="172" textAnchor="middle">{label}</text></g>)}</svg>;
    status = labels[step % 4];
    control = <button onClick={() => setStep(s => s + 1)}>Next stage →</button>;
  } else if (type === 'vault') {
    art = <svg viewBox="0 0 400 230" aria-hidden="true">{[0, 1, 2].map(i => <rect key={i} x={68 + i * 35} y={32 + i * 25} width={264 - i * 70} height={170 - i * 50} rx="14" fill="none" stroke={i <= step % 3 ? '#e4ff78' : '#45505d'} strokeWidth="1.5" strokeDasharray={i > step % 3 ? '4 6' : undefined} />)}<text x="200" y="120" textAnchor="middle" fill="#eceee4">SECRET</text><text x="200" y="182" textAnchor="middle">{['DATA', 'DATA ENCRYPTION KEY', 'KEY ENCRYPTION KEY'][step % 3]}</text></svg>;
    status = `LAYER 0${step % 3 + 1} / DIAGRAM ONLY`;
    control = <button onClick={() => setStep(s => s + 1)}>Explore next layer →</button>;
  } else if (type === 'evidence') {
    art = <svg viewBox="0 0 400 230" aria-hidden="true">{Array.from({
        length: 180
      }, (_, i) => <rect key={i} x={50 + i % 18 * 17} y={30 + Math.floor(i / 18) * 17} width="14" height="14" fill={i * 17 % 7 < 3 ? '#a392bc' : '#59466e'} />)}<rect x={45 + value * 2.4} y="62" width="70" height="105" fill="#e4ff7810" stroke="#e4ff78" strokeWidth="2" /><path d={`M${80 + value * 2.4} 54v-15M${80 + value * 2.4} 178v15`} stroke="#e4ff78" /></svg>;
    status = 'SYNTHETIC PATCH / NO VERDICT';
    control = <label>Inspect<input aria-label={`${title} inspection position`} type="range" min="0" max="100" value={value} onChange={e => setValue(+e.target.value)} /></label>;
  } else if (type === 'backtester') {
    const bars = Array.from({
      length: 22
    }, (_, i) => 90 + Math.sin(i * .8) * 24 + i * 2);
    art = <svg viewBox="0 0 400 230" aria-hidden="true"><path d="M30 30v165h340" fill="none" stroke="#53605b" />{bars.slice(0, step + 1).map((v, i) => <g key={i}><line x1={45 + i * 14} x2={45 + i * 14} y1={195 - v - 12} y2={195 - v + 20} stroke="#c0b1ff" /><rect x={41 + i * 14} y={195 - v} width="8" height="13" fill={i % 3 ? '#c0b1ff' : '#e4ff78'} /></g>)}<line x1={52 + step * 14} x2={52 + step * 14} y1="28" y2="195" stroke="#e4ff78" strokeDasharray="3 5" /></svg>;
    status = `BAR ${step + 1} / SYNTHETIC DATA`;
    control = <><button onClick={() => setStep(s => Math.min(21, s + 1))} disabled={step === 21}>Next bar →</button><button onClick={() => setStep(0)} disabled={step === 0}>Reset ↺</button></>;
  } else {
    const data = [18, 64, 42, 79, 25, 88, 52, 34, 71, 47, 93, 60];
    art = <svg viewBox="0 0 400 230" aria-hidden="true">{data.map((n, i) => <g key={i} opacity={n >= value ? 1 : .15}><rect x={34 + i % 4 * 86} y={25 + Math.floor(i / 4) * 65} width="73" height="51" rx="5" fill={n >= value ? '#c0b1ff' : '#504a58'} /><text x={70 + i % 4 * 86} y={56 + Math.floor(i / 4) * 65} textAnchor="middle" fill="#222">{n}</text></g>)}</svg>;
    status = `${data.filter(n => n >= value).length} MATCHES / SAMPLE VALUES`;
    control = <label>Minimum {value}<input aria-label={`${title} minimum value`} type="range" min="0" max="100" value={value} onChange={e => setValue(+e.target.value)} /></label>;
  }
  return <div className={`project-experiment study-${type}`} role="group" aria-label={`${title} interactive illustration`}><div className="study-heading"><span>{studies[type][0]}</span><span>TRY IT ↙</span></div><div className="study-visual">{art}</div><p className="study-description">{studies[type][1]}</p><div className="study-controls">{control}</div><p className="study-status" role="status">{status}</p></div>;
}
