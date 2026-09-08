// Shared project content. Stack details checked against repository READMEs and dependency files.
export const labProjects = [
  {
    "title": "Algorithm Playground",
    "category": "Interactive",
    "year": "2026",
    "art": "algorithm",
    "description": "Make the invisible visible. An interactive execution debugger for sorting, pathfinding, graphs, trees, and dynamic programming, with a Canvas renderer and shareable state.",
    "tech": [
      "TypeScript",
      "React",
      "Vite",
      "Zustand",
      "Canvas API",
      "Web Audio API",
      "Tailwind CSS",
      "LZ-String",
      "Vitest"
    ],
    "github": "https://github.com/Jenak26/deterministic-algorithm-execution-debugger",
    "live": "https://algoplay-roan.vercel.app"
  },
  {
    "title": "Volatility Surface",
    "category": "Quant",
    "year": "2026",
    "art": "surface",
    "description": "Giving uncertainty a shape. A derivatives pricing engine exploring Black-Scholes, Monte Carlo, American options, SVI surfaces, and Heston calibration.",
    "tech": [
      "Python",
      "FastAPI",
      "Uvicorn",
      "NumPy",
      "SciPy",
      "Numba",
      "Plotly.js",
      "HTML / CSS",
      "Docker",
      "Pytest",
      "GitHub Actions"
    ],
    "github": "https://github.com/Jenak26/vol-surface-engine"
  },
  {
    "title": "RaftKV",
    "category": "Systems",
    "year": "2026",
    "art": "raft",
    "description": "What happens when everything goes wrong? A from-scratch Raft key-value store in Go, tested with seeded fault injection and a hand-written linearizability checker.",
    "tech": [
      "Go",
      "Raft consensus",
      "net/rpc",
      "TCP",
      "Durable file storage",
      "Deterministic simulation",
      "Linearizability testing",
      "Go race detector"
    ],
    "github": "https://github.com/Jenak26/raftkv",
    "live": "https://raftkv.onrender.com"
  },
  {
    "title": "SnapOrder",
    "category": "AI",
    "year": "2026",
    "art": "snap",
    "description": "Dinner starts with a photo. Gemini vision meets a tool-use agent over Swiggy’s Food MCP, connecting dish recognition with an interactive ordering experience.",
    "tech": [
      "TypeScript",
      "Next.js",
      "Tailwind CSS",
      "Gemini 2.5 Flash",
      "Swiggy Food MCP",
      "OAuth 2.1 PKCE",
      "iron-session",
      "SSE",
      "Vercel"
    ],
    "github": "https://github.com/Jenak26/SnapOrder",
    "live": "https://snap-order-six.vercel.app"
  },
  {
    "title": "CryptoVault",
    "category": "Systems",
    "tech": [
      "Java 21",
      "Spring Boot",
      "Spring Security",
      "JPA / Hibernate",
      "MySQL",
      "Redis",
      "Flyway",
      "React",
      "TypeScript",
      "JUnit 5",
      "Mockito",
      "Testcontainers",
      "Docker",
      "GitHub Actions"
    ],
    "description": "A crypto-agile secrets vault with envelope encryption, key rotation, JWT revocation, TOTP multi-factor authentication, role-based access, and audit logging.",
    "github": "https://github.com/Jenak26/cryptovault",
    "live": "https://cryptovault-beige-beta.vercel.app",
    "art": "vault",
    "year": "2026"
  },
  {
    "title": "Event-Driven Backtester",
    "category": "Quant",
    "tech": [
      "Python",
      "Pandas",
      "NumPy",
      "SciPy",
      "Statsmodels",
      "yfinance",
      "Matplotlib",
      "Seaborn",
      "Jupyter",
      "Pytest"
    ],
    "description": "An event-driven backtesting engine with a cointegration pairs-trading strategy. Point-in-time data, next-bar execution, trading costs, and out-of-sample walk-forward analysis.",
    "github": "https://github.com/Jenak26/event-driven-backtester",
    "art": "backtester",
    "year": "2026"
  },
  {
    "title": "NSE Screener",
    "category": "Quant",
    "tech": [
      "Python",
      "FastAPI",
      "SQLAlchemy",
      "PostgreSQL",
      "APScheduler",
      "yfinance",
      "React",
      "TypeScript",
      "TanStack Table",
      "TanStack Query",
      "Recharts",
      "Tailwind CSS",
      "Pytest"
    ],
    "description": "A NIFTY 500 stock screener with filters for P/E, return on equity, debt-to-equity, revenue growth, and promoter holding.",
    "github": "https://github.com/Jenak26/nse-screener",
    "live": "https://nse-screener-rose.vercel.app",
    "art": "screener",
    "year": "2026"
  }
];
