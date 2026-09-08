import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import './offscript.css';
export default function ConceptSwitcher() {
  const {
    pathname
  } = useLocation();
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'instant'
    });
  }, [pathname]);
  if (!['/', '/concept-a', '/concept-b', '/concept-b-original'].includes(pathname)) return null;
  return <nav className="concept-switcher" aria-label="Compare design concepts"><span>DESIGN STUDY</span><Link to="/concept-a" aria-current={pathname === '/concept-a' ? 'page' : undefined}>A <span>Curiosity Lab</span></Link><Link to="/concept-b-original" aria-current={pathname === '/concept-b-original' ? 'page' : undefined}>B <span>Original</span></Link><Link to="/concept-b" aria-current={['/', '/concept-b'].includes(pathname) ? 'page' : undefined}>B <span>Refined ↗</span></Link></nav>;
}
