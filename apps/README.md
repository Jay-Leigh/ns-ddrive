# BIG applications

This directory contains the assembled BIG applications owned by BIG, subject to the executed commercial agreement.

Authorized application boundaries:

- `big-staff-frontend/` — internal staff Next.js application and deployment.
- `big-client-review/` — invited client-review Next.js application and deployment.
- `big-backend/` — authoritative FastAPI business backend.

The two frontends do not share a runtime, session or middleware boundary. Their approved application foundations are scaffolded; feature code must not be added until the relevant architecture and contract decisions permit it.
