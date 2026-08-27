# ADR 0008: PostgreSQL ownership, migrations and connection strategy

- **Status:** Proposed
- **Date:** 27 August 2026
- **Decision owner:** Data architect
- **Reviewers:** BIG backend lead; InfluenceHub lead; DevOps lead; security reviewer
- **Source:** Accepted NorthStar Architecture Decision Register, section 7

## Context

BIG and InfluenceHub share a business lifecycle and ultimately share PostgreSQL infrastructure, but they must retain authoritative ownership, safe migrations and bounded Cloud Run connection usage.

## Decision

Target PostgreSQL 18 across local development, CI and Cloud SQL. PostgreSQL 18.4 was the managed default at validation; local/CI images use a reviewed patch or immutable digest while Cloud SQL manages supported minor maintenance. PostgreSQL 17 is a fallback only through compatibility evidence and a superseding ADR.

Use illustrative domain schemas `platform`, `big`, `influencehub` and `audit`, with separate identities for APIs, workers, migrators and developer access. Each domain owns its Alembic history and version table. Centrally orchestrate migrations; never run them on application startup. Use expand/contract changes and explicit review for cross-schema work.

Use SQLAlchemy 2, Alembic, Psycopg 3 and initially synchronous database access. Use the Cloud SQL Python Connector, IAM database authentication, private IP and bounded SQLAlchemy pools. Set a total database connection budget that includes service concurrency, maximum instances and overlapping revisions. Do not initially add PgBouncer; do not adopt async SQLAlchemy until profiling triggers it.

Begin with only `pg_trgm` on the application extension allowlist. Use PostgreSQL exact, prefix, full-text and trigram search before considering a separate service.

## Alternatives considered

- Separate permanent databases: rejected because canonical lifecycle joins and coordinated privacy operations would be harder.
- Shared unrestricted schema: rejected because writer ownership would be unclear.
- Startup migrations: rejected because concurrent deployment instances create operational risk.
- PgBouncer/async access immediately: deferred until measurement justifies complexity.

## Consequences

Central orchestration and connection budgeting become platform responsibilities. Domain teams keep independent histories while coordinating shared changes.

## Security and privacy

Cloud SQL has no public endpoint. IAM DB authentication and least-privilege identities are mandatory. Production access is time-bound, approved and audited.

## Operations and migration

Create connection-budget calculations, migration pipelines, backup gates and rollback procedures before production schema changes.

## Acceptance checks

- Prove PostgreSQL 18 container and Cloud SQL compatibility.
- Approve schema ownership and role grants.
- Demonstrate overlapping-revision connection safety.
- Exercise expand/contract and rollback in staging.

## Review triggers

Review on measured connection pressure, PostgreSQL incompatibility, cross-schema ownership changes or migration failure evidence.

