# Procurement Web local development ports

| Component | Port | Purpose |
| --- | ---: | --- |
| procurement-web | 5176 | Vite dev server |
| procurement-api | 8015 | FastAPI / Uvicorn HTTP service |
| procurement-db | 5433 | Shared local PostgreSQL host port, not used directly by the browser |

## Environment variables

| Variable | Example | Meaning |
| --- | --- | --- |
| `VITE_PROCUREMENT_API_BASE_URL` | `http://127.0.0.1:8015` | procurement-api HTTP base URL used by procurement-web |

## Rules

- The browser never connects to `5433`; that is PostgreSQL.
- procurement-web calls procurement-api on `8015`.
- Keep the Vite dev server on `5176`.
