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

### Windows Node.js setup

Use [nvm-windows](https://github.com/coreybutler/nvm-windows) to keep NorthStar's Node.js version isolated from projects that still use Node.js 22.

1. Record any globally installed npm packages with `npm list -g --depth=0` if they need to be restored later.
2. Uninstall a standalone Node.js installation through Windows **Settings > Apps** before installing nvm-windows. This avoids PATH and symlink conflicts. Do not remove project source code or project-local `node_modules` as part of this step.
3. Install nvm-windows using its official installer. Administrator permission is normally required to create or switch its Node.js symlink.
4. Close and reopen Command Prompt, PowerShell, IDE terminals and development tools so they receive the updated environment variables.
5. Install the required versions and select NorthStar's version:

   ```cmd
   nvm install 22.16.0
   nvm install 24.20.0
   nvm use 24.20.0
   ```

6. Enable Corepack and verify the pinned NorthStar toolchain:

   ```cmd
   node --version
   corepack enable
   corepack pnpm --version
   ```

   Expected versions are Node.js `v24.20.0` and pnpm `11.23.0`.

Use `nvm use 22.16.0` when working on a project that still requires Node.js 22, and run `nvm use 24.20.0` again before working in NorthStar. If switching appears ineffective, run `where node` and `nvm debug` to identify a stale terminal or PATH conflict.

For the local PostgreSQL service, copy `.env.example` to an untracked `.env`, replace the local-only password, and run `docker compose up -d postgres`. The service binds only to loopback on host port 5433 by default so it does not conflict with InfluenceHub on port 5432. Set `POSTGRES_PORT` in the NorthStar `.env` if a different local port is required.

## Governing context

Read these sources in order before architecture or implementation work:

1. [NorthStar Architecture Decision Register](docs/architecture/NorthStar_Architecture_Decision_Register.md)
2. [NorthStar Project Seed](docs/project/NorthStar_Project_Seed.md)
3. Relevant [Architecture Decision Records](docs/architecture/decisions/README.md)

See the [NorthStar Technical Glossary](docs/project/NorthStar_Technical_Glossary.md) for recurring abbreviations and specialist terms used in project documentation.

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
