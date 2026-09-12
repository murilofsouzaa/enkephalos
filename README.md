# Enkephalos

A minimalist study workspace, technical knowledge base, intelligent study planner powered by the **Ebbinghaus Forgetting Curve**, and integrated Pomodoro focus manager.

Live deployment: **[enkephalos.mubadev.com.br](https://enkephalos.mubadev.com.br)**

---

## Features

### 1. Study Planner & Spaced Repetition (Ebbinghaus Curve)
- **Interactive Retention Curve Chart**: Real-time mathematical simulation and visualization of natural memory decay and exponential retention gains across active review cycles.
- **View Modes**:
  - *Individual View*: Detailed breakdown of review history, elapsed days, and retention trajectory for a specific subject.
  - *Comparative Overview*: Simultaneous plotting of all tracked subjects for a panoramic, bird's-eye view of long-term learning progress.
- **Smart Review Calendar**: Automatic identification and scheduling when memory retention approaches the optimal threshold (~80%), pinpointing the exact day for active review.
- **Comprehensive Methodological Guide**:
  - Historical and scientific background on Hermann Ebbinghaus and spaced repetition theory.
  - Dynamic animated vector diagram illustrating the natural forgetting curve drop and the restorative surge of timely reviews.
  - Strategic complementarity with **Anki** (macroscopic subject-level overview vs. daily atomic flashcard memorization).

### 2. Technical Knowledge Base & Notes
- **Obsidian Integration**: Clean viewing of structured technical notes synchronized directly from Obsidian Markdown files.
- **Mathematical & Code Rendering**: Native rendering of LaTeX formulas via KaTeX, code blocks with syntax highlighting, and quick-navigation topic indexes.
- **In-Article Quick Finder (`Ctrl + K` / `Ctrl + F`)**:
  - VS Code-inspired search with natural text highlighting.
  - Diacritic/accent-insensitive search matching (`faisca` finds `Faísca`).
  - Word-by-word keyboard navigation (`Enter` / `Shift + Enter`).

### 3. Pomodoro & Deep Focus
- **Focus Cycles**: Dedicated Pomodoro, Short Break, and Long Break timers with in-display duration adjustments.
- **Strict Mode**: Disables artificial pauses and forces a complete restart upon interruption to foster genuine deep work.
- **Optimized Soundscapes**: Continuous rain ambient audio and native transition sound effects managed via an audio singleton pool with zero memory leaks.

### 4. Visual Customization & Theming
- **Global Accent Color Palette**: 6 accent themes (*Teal/Cyan [Default]*, *Blue*, *Amber Gold*, *Emerald*, *Violet*, *Coral Rose*).
- **Light and Dark Themes**: Seamless toggle utilizing native CSS custom properties with automatic preference persistence.

---

## Architecture & Performance Optimizations

- **On-Demand Code-Splitting**: Route-level asynchronous loading via `React.lazy` and `<Suspense>`, slashing the initial entry bundle by **~98%** (from 1.62 MB down to **~32 kB**).
- **Intelligent Vendor Chunking**: Vite split-chunks configuration segregating heavy dependencies (`katex`, `framer-motion`, `lucide-react`, `react/react-dom`) for long-term browser cache efficiency.
- **Leak-Free Audio Pool**: Audio singleton with preloaded instance caching and safe disposal, preventing RAM accumulation during prolonged study sessions.
- **Strict Code Quality**: 100% passing coverage with ESLint and strict TypeScript with zero errors and zero warnings.

---

## Tech Stack

- **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/), [Tailwind CSS v4](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/), [KaTeX](https://katex.org/), [Lucide Icons](https://lucide.dev/)
- **Backend**: [Java 21](https://www.oracle.com/java/), [Spring Boot](https://spring.io/projects/spring-boot), [Maven](https://maven.apache.org/)
- **DevOps & Infrastructure**: [Docker](https://www.docker.com/), [Docker Compose](https://docs.docker.com/compose/), [Nginx](https://nginx.org/), [Certbot (SSL)](https://certbot.eff.org/), [GitHub Actions (CI/CD)](https://github.com/features/actions)

---

## Getting Started Locally

### Option 1: Frontend Development (Node.js)

1. Clone the repository:
```bash
git clone https://github.com/murilofsouzaa/enkephalos.git
cd enkephalos
```

2. Install dependencies and launch the dev server:
```bash
cd frontend
npm install
npm run dev
```

Open your browser at: `http://localhost:5173`

---

### Option 2: Full Stack with Docker Compose

Spin up the entire containerized stack (Frontend + Backend + Nginx) with a single command:

```bash
docker compose up -d --build
```

- **Frontend**: `http://localhost:8088`
- **Backend**: `http://localhost:8089`

---

## Continuous Deployment (CI/CD)

The project leverages an automated **CI/CD pipeline** through GitHub Actions ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)).

On every `git push` to the `main` branch, GitHub Actions connects via SSH to the VPS, triggers Docker container builds, and gracefully updates the live production instance at `enkephalos.mubadev.com.br` with HTTP/2 and SSL encryption.

---

## License

Personal project built for focused technical learning and knowledge management.

