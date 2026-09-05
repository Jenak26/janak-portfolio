import { Link } from 'react-router-dom';
export default function NotFound() {
  return <main className="not-found"><a className="wordmark" href="/" aria-label="Janak Kabra, home">j✳k<span className="orange">.</span></a><div><p className="mono">AN UNEXPECTED DETOUR / 404</p><h1>Curiosity is good.<br /><em>This path is empty.</em></h1><Link to="/">Back to the good stuff ↗</Link></div><p className="mono">JANAK KABRA / CREATIVE DEVELOPER</p></main>;
}
