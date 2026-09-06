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
  if (!['/', '/concept-a', '/concept-b'].includes(pathname)) return null;
  const isA = pathname === '/concept-a';
  return <nav className="concept-switcher" aria-label="Compare design concepts"><span>DESIGN STUDY</span><Link to="/concept-a" aria-current={isA ? 'page' : undefined}>A <span>Curiosity Lab</span></Link><Link to="/concept-b" aria-current={!isA ? 'page' : undefined}>B <span>Off Script</span></Link></nav>;
}
