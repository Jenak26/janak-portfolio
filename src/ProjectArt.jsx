import Sculpture from './Sculpture';
import ExtraProjectArt from './ExtraProjectArt';
export default function ProjectArt({
  type,
  paused
}) {
  if (['vault', 'evidence', 'backtester', 'screener'].includes(type)) return <ExtraProjectArt type={type} />;
  if (type === 'surface') return <div className="surface-art"><Sculpture mode="surface" color="gold" paused={paused} /><span className="art-caption">IMPLIED VOLATILITY / A STUDY IN UNCERTAINTY</span></div>;
  if (type === 'algorithm') return <div className="algorithm-art" aria-hidden="true"><div className="art-topline"><span>EXECUTION / 001</span><span>● RECORDING</span></div><div className="algorithm-bars">{Array.from({
        length: 32
      }, (_, i) => <i key={i} style={{
        '--i': i,
        '--height': `${20 + (i * 37 + 17) % 79}%`
      }} />)}</div><div className="algorithm-bottom"><span>01:24:08</span><span>↤ &nbsp; Ⅱ &nbsp; ↦</span><span>STEP BY STEP.</span></div></div>;
  if (type === 'raft') return <div className="raft-art" aria-hidden="true"><span className="art-topline">FIVE NODES. ONE SOURCE OF TRUTH.</span><svg viewBox="0 0 600 340"><g className="network-lines">{[[110, 110], [490, 110], [160, 270], [440, 270]].map(([x, y], i) => <g key={i}><line x1="300" y1="165" x2={x} y2={y} /><circle className="network-pulse" cx={(x + 300) / 2} cy={(y + 165) / 2} r="5" /></g>)}</g>{[[300, 165], [110, 110], [490, 110], [160, 270], [440, 270]].map(([x, y], i) => <g key={i}><circle className={i === 0 ? 'leader' : 'node'} cx={x} cy={y} r={i === 0 ? 43 : 30} /><text x={x} y={y + 4} textAnchor="middle">{i === 0 ? 'LEADER' : `0${i}`}</text></g>)}</svg><span className="art-caption">CONSENSUS, EVEN IN THE CHAOS.</span></div>;
  return <div className="snap-art"><div className="snap-orbit" aria-hidden="true" /><span className="art-topline">SEE IT. SNAP IT. ORDER IT.</span><div className="snap-window"><img src="/projects/snaporder.png" alt="SnapOrder interface showing its food ordering experience" loading="lazy" width="1440" height="900" /></div><span className="snap-word" aria-hidden="true">Hungry?</span><span className="art-caption">VISION → AGENT → DOORSTEP</span></div>;
}
