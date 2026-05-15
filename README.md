# procurement-web

Standalone Procurement Web.

## Boundary rules

- Procurement Web consumes procurement-api contracts.
- Procurement Web does not directly consume WMS purchase owner APIs.
- Procurement Web does not directly read PMS owner APIs.
- PMS product data must come through procurement-api contracts.

## Local dev ports

| Component | Port | Purpose |
| --- | ---: | --- |
| procurement-web | 5176 | Vite dev server |
| procurement-api | 8015 | FastAPI / Uvicorn HTTP service |
| procurement-db | 5433 | Shared local PostgreSQL host port, not a browser API |

Create `.env.local` from `.env.local.example`:

    cp .env.local.example .env.local

Start the frontend:

    pnpm dev
