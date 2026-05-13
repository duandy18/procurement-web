# procurement-web

Standalone Procurement Web.

Boundary rules:

- Procurement Web consumes procurement-api contracts.
- Procurement Web does not directly consume WMS purchase owner APIs.
- Procurement Web does not directly read PMS owner APIs.
- PMS product data must come through PMS read/projection contracts exposed to Procurement.
