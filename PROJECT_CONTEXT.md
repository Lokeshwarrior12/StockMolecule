# StockMolecule: project context (read this first, every session)

Name: StockMolecule (renamed from TradeMind; the blueprint docx still says TradeMind). The name is only a name: chemistry (Breaking Bad-style lab, molecules) is background atmosphere only; front content is pure stock market as in the blueprint, no fusion. See docs/brand-stockmolecule.md.
Full plan: docs/TradeMind_Project_Blueprint.docx. Mind map: docs/trademind_website_mind_map.png. Repo layout: docs/repo-layout.md.

## Product
- Trade mode: live candlestick lab, pattern academy, Indicator X-ray, support and resistance, paper trading and alerts, market pulse.
- Invest mode: Screener.in-style screener, column manager, filter builder with custom ratios, strategy models, weekly top 10, company pages.
- Shared: accounts, data pipeline, AI engine (scoring, alerts), learn content.

## Look
Apple-style calm structure and typography, with Lusion-style 3D depth only where it teaches. Green = buy and gains, red = sell and losses, amber = indicators and levels. Respect reduced motion; every 3D scene has a static fallback.

## Stack
Next.js + TypeScript + R3F + GSAP + Lenis; FastAPI; Postgres + TimescaleDB; Redis; Arq workers; GitHub Actions. Hosting: Vercel (web), Fly.io or ECS (api), Neon or RDS (db).

## Assumptions (confirm any time)
US stocks first (SEC EDGAR fundamentals, delayed prices), solo developer, weekly picks private per user until legal review. Never scrape Screener.in. Not financial advice.

## Progress (12 weeks x 5 days)
- [x] Week 1, Day 1: monorepo, tooling, CI skeleton
- [x] Day 2: Next.js app shell, design tokens, fonts, light and dark themes (not yet run locally: do pnpm install, pnpm format, pnpm check)
- [ ] Day 3: FastAPI skeleton, Docker Compose (Postgres/Timescale/Redis)
- [ ] Day 4: Alembic, instruments table, seed
- [ ] Day 5: provider adapter interface, first provider, first three ADRs

- [x] Backend core logic (tested, 49 unit tests): indicators, candlestick patterns, safe screener expression parser and SQL compiler, paper trading engine, provider interface with demo mode, cache and rate limiter. See docs/implementation-plan.md
- [ ] Next: Day 3 FastAPI skeleton + Docker Compose, then API endpoints over these modules
