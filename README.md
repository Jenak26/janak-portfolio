# ⚡ Janak Kabra | Personal Portfolio Website

![Project Status](https://img.shields.io/badge/Status-Production-success?style=for-the-badge)
[![Live Demo](https://img.shields.io/badge/Live_Site-janakkabra.in-blue?style=for-the-badge&logo=vercel&logoColor=white)](https://janakkabra.in)

## 📖 Introduction

This repository hosts the source code for my personal portfolio website. The goal of this project was to move away from static HTML templates and build a **scalable, component-based Single Page Application (SPA)** that represents my skills as a Full-Stack Engineer.

It is designed with a focus on **performance, accessibility, and modern UI/UX principles**, utilizing the latest features of the React ecosystem.

---

## 🛠️ Tech Stack & Engineering Decisions

I chose this specific stack to ensure the site is fast, type-safe, and easy to maintain.

| Component | Technology | Reasoning |
| :--- | :--- | :--- |
| **Frontend Core** | **React 18** | Utilizes the latest concurrent features for smooth rendering. |
| **Build System** | **Vite** | Chosen over CRA for its lightning-fast Hot Module Replacement (HMR) and optimized Rollup bundling. |
| **Styling** | **Tailwind CSS** | Utility-first approach allowing for rapid UI development and consistent design tokens. |
| **Animations** | **Framer Motion** | Handles complex layout transitions and scroll-triggered animations with high performance (60fps). |
| **Routing** | **React Scroll** | Provides smooth navigation between sections without full page reloads. |
| **Icons** | **Lucide React** | Lightweight, tree-shakeable SVG icons. |
| **Deployment** | **Vercel** | Automated CI/CD pipeline ensuring zero-downtime deployments. |

---

## ✨ Key Features

* **⚡ High Performance:** Optimized asset loading and code-splitting via Vite.
* **📱 Fully Responsive:** Mobile-first architecture ensuring perfect rendering on phones, tablets, and desktops.
* **🎨 Dynamic UI:** Features a custom "Dark Mode" aesthetic with neon accents, glassmorphism, and hover effects.
* **📄 PDF Integration:** Direct access to view and download my resume from the public assets.
* **📧 Interactive Contact:** One-click integration for email and social platforms.

---

## 📂 Architecture & Directory Structure

The project follows a modular directory structure to keep components and logic separated.

```text
janak-portfolio/
├── public/              # Static assets (Favicon, CV, robots.txt)
├── src/
│   ├── assets/          # Imported images and SVGs
│   ├── components/      # Reusable UI Components
│   │   ├── Hero.jsx     # Landing section
│   │   ├── Navbar.jsx   # Responsive navigation
│   │   ├── About.jsx    # Profile details
│   │   ├── Projects.jsx # Project grid layout
│   │   └── Footer.jsx   # Social links & copyright
│   ├── App.jsx          # Main application layout
│   ├── main.jsx         # React DOM entry point
│   └── index.css        # Tailwind directives & global styles
├── .gitignore           # Git exclusion rules
├── index.html           # SPA Entry point
├── package.json         # Project dependencies
├── postcss.config.js    # CSS processing
├── tailwind.config.js   # Tailwind theme customization
└── vite.config.js       # Build configuration
