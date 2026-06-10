import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="flex min-h-screen flex-col justify-between bg-ink px-4 pb-6 pt-20 text-paper md:px-6">
    <p className="border-b border-paper/30 pb-3 font-mono text-[11px] uppercase tracking-[0.2em]">
      Error — Page not found
    </p>

    <h1
      className="w-full font-black uppercase leading-[0.82] tracking-[-0.03em]"
      style={{ fontSize: 'clamp(6rem, 28vw, 26rem)' }}
    >
      4<span className="text-accent">0</span>4
    </h1>

    <div className="flex flex-col gap-4 border-t border-paper/15 pt-4 md:flex-row md:items-center md:justify-between">
      <p className="max-w-sm text-sm text-paper/60">
        This page doesn't exist. The work does.
      </p>
      <Link
        to="/"
        className="flex h-11 items-center font-mono text-xs uppercase tracking-[0.2em] underline-offset-4 hover:text-accent hover:underline"
      >
        Back to home ↗
      </Link>
    </div>
  </div>
);

export default NotFound;
