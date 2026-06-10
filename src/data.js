// Single source of truth for all site content.
// Edit here; components only render what this file declares.

export const profile = {
  name: 'Janak Kabra',
  role: 'Full-stack developer. I build AI systems, quant tools, and interactive experiences for the web.',
  email: 'connect.janak@gmail.com',
  location: 'India (IST)',
  status: 'Open to internships',
  currently: 'AI Domain Intern @ Infosys Springboard',
  resumeUrl: '/resume-swe.pdf',
  // Quant resume is work in progress; add it back here when ready:
  // { label: 'Resume · Quant', href: '/resume-quant.pdf' }
  resumes: [
    { label: 'Resume', href: '/resume-swe.pdf' },
  ],
  socials: [
    { label: 'GitHub', href: 'https://github.com/Jenak26', icon: 'github' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/janak-kabra-553b4b377', icon: 'linkedin' },
    { label: 'X (Twitter)', href: 'https://x.com/janak484457', icon: 'x' },
    { label: 'Email', href: 'mailto:connect.janak@gmail.com', icon: 'mail' },
  ],
};

export const projects = [
  {
    title: 'Volatility Surface Engine',
    year: 'May 2026',
    tagline: 'Options pricing from first principles.',
    story: [
      `I wanted to understand how options desks actually price risk, so instead
       of reading about it I built the whole stack from scratch. It started as
       Black-Scholes and spiraled: Monte Carlo, American options via
       Longstaff-Schwartz, then a full Heston stochastic-volatility solver with
       arbitrage-free SVI surfaces on top.`,
      `The hardest bug was the "Little Heston Trap", a numerical instability at
       long maturities that silently corrupts prices. Fixing it meant rewriting
       the complex logarithm to dodge branch cuts entirely. Numba JIT pushed
       pricing under a millisecond and calibration under 100ms, and the engine
       ships as a Dockerized FastAPI service streaming 3D vol surfaces and
       Greeks to the browser.`,
    ],
    specs: 'Heston Fourier solver · SVI surfaces · sub-ms pricing · <100ms calibration',
    tech: ['Python', 'Numba JIT', 'FastAPI', 'Docker', 'Plotly'],
    live: null,
    github: 'https://github.com/Jenak26/vol-surface-engine',
    image: null,
  },
  {
    title: 'InternshipGOAT',
    year: 'May 2026',
    tagline: 'First to know when a role opens.',
    story: [
      `Born from a real problem: by the time you see an internship posting on
       LinkedIn, a thousand people have already applied. So I found 53
       companies with public job APIs (Jane Street, OpenAI, Stripe, CRED and
       more) and pointed GitHub Actions at them every 10 minutes.`,
      `The moment a matching intern or new-grad role goes live, the Telegram
       bot pings you, with filters for India-relevant locations, batch year,
       and technical roles. The whole thing runs 24/7 and costs exactly
       nothing: Actions for scanning, Render for the bot, UptimeRobot to keep
       it awake.`,
    ],
    specs: '53 company APIs · 10-minute alerts · runs 24/7 free',
    tech: ['Python', 'GitHub Actions', 'Telegram Bot API', 'Render'],
    live: null,
    github: 'https://github.com/Jenak26/internship-goat',
    image: null,
  },
  {
    title: 'Algorithm Execution Debugger',
    year: 'Apr 2026',
    tagline: 'A debugger for algorithms, not just a visualizer.',
    story: [
      `Every algorithm visualizer I tried animated the DOM and choked past a
       hundred elements. I wanted something closer to a real debugger: run the
       algorithm to completion instantly inside a virtual container, record
       every state as an immutable snapshot, then scrub the timeline like
       video. Sorting, pathfinding, graphs, BSTs, and DP all work this way.`,
      `The custom canvas renderer holds 60fps with a thousand-plus elements,
       counts every swap and comparison so Big-O stops being abstract, and
       compresses entire grid states into shareable URLs. My favorite feature
       is race mode: two algorithms, identical input, side by side.`,
    ],
    specs: '60 fps at 1,000+ elements · complexity metrics · race mode · shareable URL state',
    tech: ['React 19', 'TypeScript', 'Zustand', 'Canvas API'],
    live: 'https://algoplay-roan.vercel.app',
    github: 'https://github.com/Jenak26/deterministic-algorithm-execution-debugger',
    image: '/projects/algoplay.png',
  },
  {
    title: 'NSE Screener',
    year: 'Feb 2026',
    tagline: 'NIFTY 500, filtered in under 500ms.',
    story: [
      `I got tired of screener sites that take seconds to apply a single
       filter, so I built my own for the NIFTY 500. The interesting work is in
       the database layer: chained filters compile into one indexed PostgreSQL
       roundtrip, so any combination of P/E, ROE, debt-to-equity, and revenue
       growth resolves in under half a second.`,
      `Raw numbers lie without context, so it also ranks every stock against
       its industry peers by percentile. A P/E of 40 means something completely
       different for an IT company than for a bank, and the screener knows
       that. Recharts sparklines show the quarterly trends inline.`,
    ],
    specs: '500 stocks · <500ms queries · sector percentile engine · Recharts sparklines',
    tech: ['FastAPI', 'PostgreSQL', 'React', 'TypeScript'],
    live: 'https://nse-screener-rose.vercel.app',
    github: 'https://github.com/Jenak26/nse-screener',
    image: '/projects/nse-screener.png',
  },
  {
    title: 'SnapOrder',
    year: '2026',
    featured: true,
    tagline: 'Photo to doorstep, run by an AI agent.',
    story: [
      `Made for the Swiggy Builders Club. The pitch: see a dish anywhere,
       photograph it, have it at your door. Gemini identifies the dish from the
       photo, then a tool-use agent loop takes over Swiggy's MCP: it searches
       restaurants, builds the cart, hunts for applicable coupons, places the
       order, and tracks delivery through a live four-stage timeline.`,
      `The parts I'm proudest of are the unglamorous ones: idempotency guards
       so a retry never double-orders food, exponential backoff on every MCP
       call, OAuth 2.1 PKCE for the Swiggy login, and a chat panel that streams
       every tool call as it happens, so you literally watch the agent think.`,
    ],
    specs: 'Gemini 2.5 vision agent · OAuth 2.1 PKCE · SSE streaming · idempotent ordering',
    tech: ['Next.js', 'TypeScript', 'Gemini 2.5 Flash', 'MCP', 'Swiggy Builders Club'],
    live: 'https://snap-order-six.vercel.app',
    github: 'https://github.com/Jenak26/SnapOrder',
    image: '/projects/snaporder.png',
  },
];

export const experience = [
  {
    role: 'AI Domain Intern',
    company: 'Infosys Springboard',
    meta: 'Remote',
    period: 'Feb 2026 – Jun 2026',
    summary: `Forecasting agricultural time series on the AI track. I build LSTM
      models and multivariate-regression baselines, then benchmark them against
      each other until the out-of-sample error genuinely beats the baseline
      instead of just looking like it does. Most of the real work is in the
      validation discipline, not the model.`,
    skills: ['LSTM', 'Time Series', 'Python', 'Regression'],
  },
  {
    role: 'AI Research Intern',
    company: 'Mythus AI Studios',
    meta: 'Remote',
    period: 'Oct 2025 – Dec 2025',
    summary: `The unglamorous side of computer vision: taking messy,
      heterogeneous datasets and making them trustworthy before they ever touch
      a classifier. I rewrote the team's feature-selection scripts with
      vectorized NumPy and multiprocessing (about 20% faster pipelines) and
      reproduced CV architectures from published papers in PyTorch, which
      became a reference notebook the team kept coming back to.`,
    skills: ['PyTorch', 'NumPy', 'Computer Vision', 'Data Pipelines'],
  },
  {
    role: 'Web Developer',
    company: 'Freelance',
    meta: 'Remote',
    period: 'Jun 2025 – Present',
    summary: `Client work, owned end to end: requirements conversations, design,
      build, deploy. Along the way I built myself a reusable Tailwind + Framer
      Motion component library so every new page ships faster, and learned that
      a 95+ Lighthouse score is mostly about what you refuse to load.`,
    skills: ['React', 'Node.js', 'Tailwind CSS', 'Performance'],
  },
];

export const skills = [
  { group: 'Core', items: ['Python', 'TypeScript / JavaScript', 'SQL'] },
  { group: 'Familiar', items: ['C++', 'C', 'Java', 'Go', 'C#'] },
  { group: 'Quant', items: ['Black-Scholes', 'Heston model', 'SVI', 'Monte Carlo', 'Option Greeks', 'LSTM / ARIMA', 'Probability', 'Linear Algebra'] },
  { group: 'Frameworks', items: ['React', 'Next.js', 'Node.js', 'FastAPI', 'PyTorch', 'TensorFlow', 'OpenCV', 'NumPy', 'Pandas', 'SciPy', 'Numba JIT', 'Tailwind CSS', 'Framer Motion', 'Zustand', 'Plotly'] },
  { group: 'Tools', items: ['PostgreSQL', 'MySQL', 'Git', 'Docker', 'Linux', 'GitHub Actions', 'Vercel', 'Postman', 'Power BI'] },
];

export const facts = [
  { label: 'Based in', value: 'India (IST)' },
  { label: 'Studying', value: 'CSE @ VIT Vellore, class of 2028' },
  { label: 'Currently', value: 'AI Domain Intern, Infosys Springboard' },
  { label: 'Focus', value: 'Full-stack engineering + applied AI + quant' },
];
