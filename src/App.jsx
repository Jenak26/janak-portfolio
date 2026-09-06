import { useEffect, useRef, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { profile, experience } from './data';
import Sculpture from './Sculpture';
import { labProjects } from './labData';
import NotFound from './NotFound';
import ProjectArt from './ProjectArt';
import OffScript from './OffScript';
import ConceptSwitcher from './ConceptSwitcher';
const Arrow = () => <span aria-hidden="true">↗</span>;
const External = ({
  href,
  children,
  ...props
}) => <a href={href} target="_blank" rel="noreferrer" {...props}>{children}</a>;
function ProjectCard({
  project,
  index,
  paused
}) {
  return <article className={`project-card reveal project-${project.art}`}>
    <External className="project-image" href={project.live || project.github} aria-label={`Explore ${project.title}`}><ProjectArt type={project.art} paused={paused} /><span className="project-open"><Arrow /></span></External>
    <div className="project-meta mono"><span>0{index + 1} / {project.category}</span><span>{project.year}</span></div>
    <div className="project-title-row"><h3><External href={project.github}>{project.title}</External></h3><External href={project.github} className="code-link">Code <Arrow /></External></div>
    <p>{project.description}</p><div className="project-tags">{project.tech.map(t => <span key={t}>{t}</span>)}</div>
  </article>;
}
function Portfolio() {
  const [mode, setMode] = useState('knot');
  const [paused, setPaused] = useState(false);
  const [copied, setCopied] = useState(false);
  const [time, setTime] = useState('');
  const copyTimer = useRef();
  useEffect(() => {
    const tick = () => setTime(new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(new Date()));
    tick();
    const id = setInterval(tick, 60000);
    const observer = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        observer.unobserve(e.target);
      }
    }), {
      threshold: .08
    });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => {
      clearInterval(id);
      clearTimeout(copyTimer.current);
      observer.disconnect();
    };
  }, []);
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${profile.email}`;
    }
  };
  return <div id="home" className={`site-shell${paused ? ' motion-paused' : ''}`}>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header"><a href="#home" className="wordmark" aria-label="Janak Kabra, home">j<span className="wordmark-star">✳</span>k<span className="wordmark-dot">.</span></a><span className="header-note mono">INDEPENDENT MIND.<br />INFINITE POSSIBILITIES.</span><nav aria-label="Main navigation"><a href="#work">Work <sup>08</sup></a><a href="#about">The human</a><a href="#contact" className="nav-contact">Let’s talk <Arrow /></a></nav></header>
    <main id="main">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-eyebrow mono"><span><i className="status-dot" /> JANAK KABRA / CREATIVE DEVELOPER</span><span className="hero-edition">PORTFOLIO VOL. 02 / 2026</span></div>
        <div className="hero-composition"><h1 id="hero-title"><span>Serious code.</span><span className="second-line">Curious <em>mind.</em><span className="title-asterisk" aria-hidden="true">✳</span></span></h1>
          <div className="hero-art"><Sculpture mode={mode} paused={paused} /></div>
          <div className="sculpture-label mono"><span className="tiny-cross">+</span> FIG. 01<br />DRAG TO TURN. STAY CURIOUS.</div>
          <p className="hero-description">I turn <em>“what if”</em> into things<br />you can actually use.<br /><span>Web. Systems. AI. And the space between.</span></p>
          <a href="#work" className="work-orb" aria-label="Explore all projects"><span>EXPLORE<br />THE WORK</span><span aria-hidden="true">↓</span></a>
        </div>
        <div className="hero-bottom"><span className="mono hero-location">BASED IN INDIA <span className="muted">/ {time || 'IST'} IST</span></span><div className="experiment-controls"><span className="mono control-label">PLAY WITH THE FORM</span><div className="mode-controls" role="group" aria-label="Sculpture shape">{['knot', 'orbit', 'surface'].map((m, i) => <button key={m} onClick={() => setMode(m)} aria-pressed={mode === m} aria-label={`${m} shape`}><span>0{i + 1}</span> {m}</button>)}</div><button className="pause-button" onClick={() => setPaused(!paused)} aria-label={paused ? 'Play animations' : 'Pause animations'}>{paused ? '▷' : 'Ⅱ'}</button></div><a className="mono scroll-note" href="#work">SCROLL TO DISCOVER ↓</a></div>
      </section>
      <div className="ticker" aria-hidden="true"><div>{Array.from({
            length: 4
          }, (_, i) => <span key={i}>A LITTLE LOGIC <b>✳</b> A LOT OF CURIOSITY <b>✳</b> BUILT TO BE EXPERIENCED <b>✳</b> </span>)}</div></div>
      <section className="work-section section-padding" id="work"><div className="section-kicker mono"><span>01 / THE PROJECTS</span><span>IDEAS, MADE REAL.</span></div><div className="section-heading reveal"><h2>Out of my head.<br /><em>Into the world.</em></h2><p>A few rabbit holes worth going down.<br />From making algorithms visible to<br />teaching machines to order dinner.</p></div><div className="project-grid">{labProjects.map((p, i) => <ProjectCard key={p.title} project={p} index={i} paused={paused} />)}</div>
      <External href="https://github.com/Jenak26" className="github-all">The source of it all. Find me on GitHub <Arrow /></External>
      </section>
      <section className="about-section section-padding" id="about"><div className="section-kicker mono"><span>02 / THE HUMAN BEHIND THE CODE</span><span>HELLO, I’M JANAK.</span></div><div className="about-grid"><div className="about-portrait reveal"><span className="portrait-note">a work in progress,<br />always.</span><div className="portrait-frame"><img src="/janaksomething.jpg" alt="Illustrated portrait of Janak Kabra" loading="lazy" width="640" height="640" /><span className="mono">JANAK KABRA / IN HIS NATURAL HABITAT</span></div><span className="portrait-star" aria-hidden="true">✳</span></div><div className="about-copy reveal"><h2>Engineer by training.<br /><em>Explorer by default.</em></h2><p>I’m a computer science student at VIT Vellore, class of 2028. I like the moment an abstract idea becomes something you can click, break, understand, or build on.</p><p>That curiosity takes me from interactive web experiences to distributed systems, AI agents, and the mathematics of markets. Different rabbit holes. Same need to figure out how things work.</p><div className="about-facts mono"><span>VIT VELLORE / CSE ’28</span><span><i className="status-dot" /> OPEN TO INTERNSHIPS</span></div><div className="resume-links">{profile.resumes.map(r => <External key={r.href} href={r.href}>{r.label} <Arrow /></External>)}</div></div></div><div className="experience-block"><span className="mono">SOME STOPS ALONG THE WAY</span><div>{experience.map(e => <div className="experience-row" key={e.company}><span>{e.company}</span><span>{e.role}</span><span className="mono">{e.period}</span></div>)}</div></div></section>
      <section className="contact-section section-padding" id="contact"><div className="section-kicker mono"><span>03 / THE NEXT GOOD THING</span><span><i className="status-dot" /> STARTS WITH A CONVERSATION</span></div><p className="contact-intro">A wild idea? A real problem? A simple hello?</p><a className="contact-title" href={`mailto:${profile.email}`}>Let’s make<br /><em>something</em> <span className="contact-arrow" aria-hidden="true">↗</span><br />interesting<span className="orange">.</span></a><div className="contact-bottom"><a href={`mailto:${profile.email}`}>{profile.email}</a><button onClick={copyEmail} aria-live="polite">{copied ? 'Copied ✓' : 'Copy email ↗'}</button><span className="mono">GOOD CONVERSATIONS WELCOME.</span></div></section>
    </main><footer><a href="#home" className="footer-name">JANAK KABRA<span>✳</span></a><div className="footer-bottom mono"><span>© {new Date().getFullYear()} / BUILT WITH INTENT.</span><div>{profile.socials.filter(s => s.icon !== 'mail').map(s => <External key={s.label} href={s.href}>{s.label} <Arrow /></External>)}</div><a href="#home">BACK TO TOP ↑</a></div></footer>
  </div>;
}
export default function App() {
  return <BrowserRouter><ConceptSwitcher /><Routes><Route path="/" element={<OffScript />} /><Route path="/concept-a" element={<Portfolio />} /><Route path="/concept-b" element={<OffScript />} /><Route path="*" element={<NotFound />} /></Routes></BrowserRouter>;
}
