# StockMolecule

Learn, practice, invest. A premium, 3D-assisted market learning platform. Educational use only; nothing here is financial advice.

Start with PROJECT_CONTEXT.md, then docs/TradeMind_Project_Blueprint.docx.

## Quick start
    make setup    # python venv + pnpm install
    make check    # lint, typecheck, tests (same as CI)

## Layout
    apps/web        Next.js frontend (Day 2)
    apps/api        FastAPI backend and workers (Day 3)
    packages/shared generated TypeScript types
    infra           Docker and Compose
    docs            blueprint, mind map, ADRs
