# ADR 0007: Polyglot monorepo tooling and pinned runtimes

- **Status:** Proposed
- **Date:** 27 August 2026
- **Decision owner:** Senior technical lead
- **Reviewers:** Frontend lead; backend lead; DevOps lead
- **Source:** Accepted NorthStar Architecture Decision Register, sections 10, 11 and 24.1

## Context

NorthStar contains TypeScript frontends and a Python backend. Tooling must be reproducible without forcing one ecosystem's task runner to own the other. Foundation versions were validated on 27 August 2026.

## Decision

Use pnpm workspaces with one lockfile and `workspace:*` internal relationships. Use Turborepo for TypeScript task orchestration only, beginning with local caching. Remote caching remains Deferred until CI time or developer feedback demonstrates value.

Use `uv`, `pyproject.toml` and `uv.lock` for Python. Python tasks remain outside Turborepo.

Initial pinned runtime baselines:

- Next.js `16.3.3` with the App Router.
- Node.js `24.20.0` LTS.
- Python `3.14.7`.

The Python 3.14 Linux dependency set was resolved for FastAPI, SQLAlchemy 2, Psycopg 3 and the Cloud SQL Python Connector. Python 3.13 is only a recorded contingency if a concrete locked-build incompatibility appears.

Run pinned runtimes natively and use Docker Compose for PostgreSQL and supporting local services. CI uses frozen locks. Exact library/tool pins may advance through reviewed compatibility and security changes; they are implementation baselines rather than permanent architectural constraints.

## Alternatives considered

- npm/yarn: rejected in favour of pnpm workspace efficiency and the confirmed standard.
- One task runner for TypeScript and Python: rejected because it obscures native Python workflows.
- Unpinned latest versions: rejected because builds would not be reproducible.
- Python 3.13 now: rejected because the validated 3.14 target did not trigger the fallback.

## Consequences

Developers use two native package workflows but one repository. Update automation must respect both lockfiles and compatibility checks.

## Security and privacy

Use safe environment templates and synthetic data. Lockfile review and vulnerability checks are required; no production credentials enter local configuration.

## Operations and migration

Record runtimes in repository version files, CI images and Dockerfiles. Revalidate the complete locked dependency graph during scaffolding.

## Acceptance checks

- Build both frontends and backend in CI using pinned runtimes.
- Reproduce installs from frozen locks.
- Run smoke tests in the deployment container images.

## Review triggers

Review for runtime EOL, a material security release, unsupported deployment images or a concrete compatibility failure.

