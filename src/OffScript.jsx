import { useRef, useState, useEffect } from 'react';
import { labProjects } from './labData';
import { profile, experience } from './data';
import ProjectArt from './ProjectArt';
import SignalField from './SignalField';
const Out = ({
  href,
  children,
  ...rest
}) => <a href={href} target="_blank" rel="noreferrer" {...rest}>{children}</a>;
export default function OffScript() {
  const [paused, setPaused] = useState(false);
  const [mode, setMode] = useState('helix');
  const [category, setCategory] = useState('Everything');
  const [copied, setCopied] = useState(false);
  const timer = useRef();
  useEffect(() => () => clearTimeout(timer.current), []);
  const visible = labProjects.filter(p => category === 'Everything' || p.category === category);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };
  return <div className={`offscript${paused ? ' motion-paused' : ''}`} id="os-top">
    <a className="skip-link" href="#os-main">Skip to content</a>
    <header className="os-header"><a href="#os-top" className="os-logo" aria-label="Janak Kabra, home">JK<span>↗</span></a><span className="os-header-note">DEVELOPER.<br />PERPETUALLY CURIOUS.</span><nav aria-label="Main navigation"><a href="#os-work">Projects <span>08</span></a><a href="#os-about">About</a><a href="#os-contact" className="os-contact-nav">Say hello <span>↗</span></a></nav></header>
    <main id="os-main">
      <section className="os-hero" aria-labelledby="os-title"><div className="os-hero-top"><span><i /> JANAK KABRA / INDIA</span><span>FULL STACK. OPEN MIND.</span></div>
        <div className="os-hero-stage"><div className="os-signal"><SignalField paused={paused} mode={mode} /></div><span className="os-side-note">EXPERIMENT 001 / MOVE THROUGH THE FIELD</span><h1 id="os-title">Happily<br /><span>off script</span><b>.</b></h1><div className="os-hero-bottom"><p>Some ideas don’t fit in a box.<br />I write the code to let them out.</p><a href="#os-work" className="os-explore"><span>MEET THE PROJECTS</span><span>↓</span></a></div></div>
        <div className="os-console"><span>WEB / SYSTEMS / AI / QUANT</span><div role="group" aria-label="Particle field controls"><button aria-pressed={mode === 'helix'} onClick={() => setMode('helix')}>01 Helix</button><button aria-pressed={mode === 'wave'} onClick={() => setMode('wave')}>02 Wave</button><button aria-label={paused ? 'Play animations' : 'Pause animations'} onClick={() => setPaused(!paused)}>{paused ? 'PLAY ▷' : 'PAUSE Ⅱ'}</button></div><span className="os-console-end">SCROLL TO GO OFF SCRIPT ↙</span></div>
      </section>
      <section className="os-manifesto"><span>THE WAY I SEE IT</span><p>Good code should work.<br />Great experiences should <em>move you.</em><span className="os-spark" aria-hidden="true">✳</span></p><span>ENGINEERING MEETS INSTINCT.</span></section>
      <section className="os-work" id="os-work"><div className="os-section-label"><span>01 / PROJECT INDEX</span><span>EIGHT DIFFERENT RABBIT HOLES.</span></div><div className="os-work-heading"><h2>Proof of<br /><span>curiosity.</span></h2><p>Systems that hold up.<br />Experiences that stand out.<br />Explore what I’ve been building.</p></div><div className="os-filters" role="group" aria-label="Filter projects">{['Everything', 'Interactive', 'Systems', 'AI', 'Quant'].map(c => <button key={c} aria-pressed={category === c} onClick={() => setCategory(c)}>{c}{c === 'Everything' && <span>08</span>}</button>)}<span aria-live="polite">{String(visible.length).padStart(2, '0')} PROJECTS</span></div>
        <div className="os-project-list">{visible.map(p => <article className={`os-project os-project-${p.art}`} key={p.title}><span className="os-project-number">{String(labProjects.indexOf(p) + 1).padStart(2, '0')}</span><Out href={p.live || p.github} className="os-project-art" aria-label={`Explore ${p.title}`}><ProjectArt type={p.art} paused={paused} /><span className="os-art-arrow">↗</span></Out><div className="os-project-info"><span className="os-project-category">{p.category} / {p.year}</span><h3><Out href={p.github}>{p.title}</Out></h3><p>{p.description}</p><div className="os-project-tech">{p.tech.map(t => <span key={t}>{t}</span>)}</div><div className="os-project-links"><Out href={p.github}>Source code ↗</Out>{p.live && <Out href={p.live}>Live project ↗</Out>}</div></div></article>)}</div><Out href="https://github.com/Jenak26" className="os-github">EVERY LINE HAS A STORY. <span>Find the source on GitHub ↗</span></Out>
      </section>
      <section className="os-about" id="os-about"><div className="os-section-label"><span>02 / NOT A LANGUAGE MODEL</span><span>A PERSON WHO LIKES MAKING THINGS.</span></div><div className="os-about-layout"><div className="os-portrait"><img src="/janaksomething.jpg" alt="Illustrated portrait of Janak Kabra" width="640" height="640" loading="lazy" /><span className="os-portrait-tag">HUMAN, MOSTLY.</span><span className="os-portrait-caption">JANAK KABRA<br />VIT VELLORE / CSE ’28</span></div><div className="os-about-copy"><span className="os-small">THE PERSON BEHIND THE PIXELS</span><h2>Built on logic.<br />Driven by<br /><em>“what if?”</em></h2><p>I’m Janak, a computer science student at VIT Vellore. My interests tend to cross boundaries: a web interface one day, distributed consensus or options pricing the next.</p><p>I like taking things apart until I understand them, then putting them back together as something useful. This is a collection of where that habit has taken me.</p><div className="os-resumes">{profile.resumes.map(r => <Out key={r.href} href={r.href}>{r.label} ↗</Out>)}</div></div></div><div className="os-experience"><span>ALONG THE WAY</span><div>{experience.map(e => <div className="os-experience-row" key={e.company}><h3>{e.company}</h3><span>{e.role}</span><span>{e.period}</span></div>)}</div></div></section>
      <section className="os-contact" id="os-contact"><div className="os-section-label"><span>03 / OVER TO YOU</span><span><i /> OPEN TO INTERNSHIPS</span></div><p>Let’s see where a conversation goes.</p><a className="os-big-hello" href={`mailto:${profile.email}`}>Got a<br /><span>what if?</span><b>↗</b></a><div className="os-contact-details"><a href={`mailto:${profile.email}`}>{profile.email}</a><button onClick={copy} aria-live="polite">{copied ? 'Copied ✓' : 'Copy address ↗'}</button></div></section>
    </main><footer className="os-footer"><a href="#os-top" className="os-footer-mark">JK↗</a><span>© {new Date().getFullYear()} JANAK KABRA<br />ALWAYS A WORK IN PROGRESS.</span><div>{profile.socials.filter(s => s.icon !== 'mail').map(s => <Out key={s.href} href={s.href}>{s.label} ↗</Out>)}</div><a href="#os-top">BACK UP ↑</a></footer>
  </div>;
}
