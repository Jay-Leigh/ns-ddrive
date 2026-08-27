# ADR 0005: Hybrid authorisation and selective PostgreSQL RLS

- **Status:** Proposed
- **Date:** 27 August 2026
- **Decision owner:** Security owner
- **Reviewers:** Backend lead; data architect; product owner
- **Source:** Accepted NorthStar Architecture Decision Register, sections 6.4 and 7

## Context

NorthStar access depends on business assignments and resource scope, not merely a user's identity or a coarse role. Client review and staff workflows require different capabilities, and cross-client data exposure is a critical risk.

## Decision

Use three layers:

1. IAM and identity-provider verification authenticate workloads and people.
2. Domain profiles link identities to BIG subjects.
3. PostgreSQL-backed RBAC/ABAC capability assignments authorise business actions.

Capabilities are explicitly scoped to `PLATFORM`, `CLIENT_ACCOUNT`, `BRAND`, `PROJECT` or `CLIENT_REVIEW`. There is no BIG freelancer role and no BIG `REVIEW_QUEUE` scope because freelancers use InfluenceHub only.

FastAPI performs application-level authorisation for every operation. Selective PostgreSQL Row Level Security provides defence in depth for high-risk multi-tenant tables and projections. RLS does not replace explicit service checks. Backend code derives scope from verified assignments; it never trusts browser-supplied roles, organisation IDs or project IDs.

Client-review APIs expose purpose-built DTOs and endpoint capabilities. Apply authorisation before search, filtering, counts and pagination so metadata cannot leak inaccessible records.

## Alternatives considered

- Identity-provider custom claims as the permission source: rejected because assignments change independently and claims become stale.
- Pure RBAC without scope: rejected because it cannot safely express project/client assignment.
- RLS-only authorisation: rejected because business actions and non-database resources still need explicit policy enforcement.
- Application checks only: rejected for the most sensitive multi-tenant data because defence in depth is valuable.

## Consequences

Policies require a common vocabulary, test fixtures and careful database session context. The model supports least privilege and auditable assignment changes.

## Security and privacy

Negative authorisation tests must cover cross-client, cross-project, freelancer and client/staff boundary cases. Assignment changes and privileged overrides are audited.

## Operations and migration

Create capability, assignment and scope tables before feature access rules. Introduce RLS table by table with connection-pooling-safe session context.

## Acceptance checks

- Approve the initial capability catalogue and assignment lifecycle.
- Identify the first RLS-protected tables.
- Prove fail-closed behaviour when scope context is absent.

## Review triggers

Supersede if the scope hierarchy changes materially or policy complexity justifies a dedicated policy engine.

