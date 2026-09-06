export default function ExtraProjectArt({
  type
}) {
  if (type === 'vault') return <div className="extra-art art-vault" aria-hidden="true"><span className="art-topline">CRYPTOGRAPHY / LAYERS OF TRUST</span><div className="vault-rings">{[0, 1, 2, 3].map(i => <i key={i} style={{
        '--ring': i
      }} />)}<span>⌑</span></div><span className="art-caption">ONE SECRET. MANY LAYERS.</span></div>;
  if (type === 'evidence') return <div className="extra-art art-evidence" aria-hidden="true"><span className="art-topline">DIGITAL FORENSICS / TRACE THE TRUTH</span><div className="evidence-grid">{Array.from({
        length: 96
      }, (_, i) => <i key={i} style={{
        opacity: .15 + i * 17 % 80 / 100
      }} />)}<span className="evidence-frame" /></div><span className="art-caption">QUESTION EVERY PIXEL.</span></div>;
  if (type === 'backtester') return <div className="extra-art art-backtester" aria-hidden="true"><span className="art-topline">POINT IN TIME / NO LOOKING AHEAD</span><svg viewBox="0 0 600 350"><defs><pattern id="backtest-grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="currentColor" opacity=".12" /></pattern></defs><rect width="600" height="350" fill="url(#backtest-grid)" /><path d="M20 260 55 240 80 258 100 215 125 229 145 193 175 211 200 156 230 183 255 123 280 140 315 170 345 100 375 126 405 77 435 100 460 50 500 74 535 32 580 58" /><path className="second-trace" d="M20 280 60 251 100 262 150 218 180 225 220 180 260 192 300 149 340 162 380 124 420 144 470 99 515 108 580 70" /></svg><span className="art-caption">A STRATEGY IS ONLY AS GOOD AS ITS TEST.</span></div>;
  return <div className="extra-art art-screener" aria-hidden="true"><span className="art-topline">NIFTY 500 / FIND YOUR SIGNAL</span><div className="market-matrix">{Array.from({
        length: 35
      }, (_, i) => <i key={i} style={{
        '--cell': `${25 + i * 13 % 45}%`
      }}><span>{['P/E', 'ROE', 'D/E', 'REV', 'NSE'][i % 5]}</span></i>)}</div><span className="art-caption">LESS NOISE. MORE CONTEXT.</span></div>;
}
