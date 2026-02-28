# FluentFlow

English learning app (CEFR A1-C2) — React 18, TypeScript, Pure CSS/BEM.

**Live**: https://gsphome.github.io/englishgame6/

## Stack

React 18 · TypeScript strict · Vite + esbuild · Zustand · TanStack Query · Zod · Recharts · i18next · Vitest · GitHub Actions → GitHub Pages

## Features

6 learning modes (Flashcards, Quiz, Completion, Sorting, Matching, Reading) · Dark/light theme · Progress tracking · Bilingual EN/ES · CEFR A1-C2

## Setup

```bash
git clone https://github.com/gsphome/englishgame6.git && cd englishgame6
npm install && npm run dev
```

## Commands

| Category | Command | Description |
|----------|---------|-------------|
| Dev | `npm run dev` | Dev server |
| Build | `npm run build` | Production build |
| Test | `npm test` | 2 files, 24 tests, ~2s |
| Lint | `npm run lint` | ESLint |
| Format | `npm run format` | Prettier |
| Types | `npm run type-check` | TypeScript check |
| Validate | `npm run validate:all` | All validations |
| CSS | `npm run validate:bem` | BEM validation |
| Security | `npm run security:audit` | Dependency audit |
| Deploy | `npm run deploy:push` | Build + commit + push |
| Monitor | `npm run gh:status` | GitHub Actions status |
| Pipeline | `npm run pipeline` | Interactive pipeline |

## Structure

```
config/          5 files (vite, vitest, tsconfig, eslint, .env)
src/             components/ hooks/ services/ stores/ styles/ types/ utils/
public/data/     Learning content JSON by CEFR level (A1-C2)
scripts/         5 dirs: build, development, git, validation, utils
tests/           setup.ts + 2 test files (api-service, progressionService)
```

## Architecture

- Pure CSS/BEM — no Tailwind, no utility classes
- esbuild CSS minification (33% smaller than cssnano for BEM)
- No PostCSS, no autoprefixer (Vite handles it)
- Data-driven: all content in `public/data/` JSON, no external APIs
- CSS variables for light/dark theming
