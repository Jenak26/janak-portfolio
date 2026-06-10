// Hairline top bar. mix-blend-difference keeps it legible over the black,
// white, and red sections without any per-section logic.
const LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

export default function TopBar() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 mix-blend-difference">
      <nav
        aria-label="Primary"
        className="flex h-14 items-center justify-between px-4 font-mono text-[11px] uppercase tracking-[0.2em] text-white md:px-6"
      >
        <a
          href="#home"
          className="pointer-events-auto flex h-11 items-center font-bold"
        >
          Janak Kabra
        </a>
        <div className="flex items-center gap-5 md:gap-8">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="pointer-events-auto flex h-11 items-center underline-offset-4 transition-opacity duration-300 hover:underline hover:opacity-70"
            >
              {link.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
