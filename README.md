# Project NorthStar

NorthStar is the BIG-owned monorepo for the BIG operational platform. It contains separate staff and client-review applications, the authoritative BIG backend, BIG-owned packages and selected Conversion Science-owned reusable packages.

The repository is currently in its governed foundation stage. Application scaffolding has not started.

## Foundation prerequisites

- Node.js `24.20.0`
- pnpm `11.23.0`
- Python `3.14.7`
- `uv` for Python dependency and workspace management
- Docker with Compose support

Runtime targets are recorded in the repository. Frozen JavaScript and Python locks will be generated and verified when the corresponding application manifests are introduced.

For the local PostgreSQL service, copy `.env.example` to an untracked `.env`, replace the local-only password, and run `docker compose up -d postgres`. The service binds only to loopback by default. If another local database such as InfluenceHub already uses port 5432, set `POSTGRES_PORT` in the NorthStar `.env` to an available local port.

## Governing context

Read these sources in order before architecture or implementation work:

1. [NorthStar Architecture Decision Register](docs/architecture/NorthStar_Architecture_Decision_Register.md)
2. [NorthStar Project Seed](docs/project/NorthStar_Project_Seed.md)
3. Relevant [Architecture Decision Records](docs/architecture/decisions/README.md)

Git and release work is governed by:

- [Department Git Workflow SOP](.agents/standards/Git%20Workflow%20SOP.md)
- [BIG Git and Release Implementation Guide](docs/agile/deliverables/internal/BIG%20Git%20and%20Release%20Implementation%20Guide.md)
- [BIG October 2026 Release Plan](docs/agile/deliverables/internal/BIG%20October%202026%20Release%20Plan.md)
- [Contributing guide](CONTRIBUTING.md)

## Planned structure

```text
northstar/
├── apps/
│   ├── big-staff-frontend/
│   ├── big-client-review/
│   └── big-backend/
├── big-packages/
├── cs-packages/
├── docs/
├── infrastructure/
└── README.md
```

Do not scaffold major framework, security, data or infrastructure choices without authorization from the accepted decision register or an applicable Accepted ADR.
