# ADR 0002: Separate staff and client-review applications

- **Status:** Accepted
- **Date:** 27 August 2026
- **Accepted:** 27 August 2026 by Mkhuphuli, Tech Lead
- **Decision owner:** Project owner
- **Reviewers:** Frontend lead; security reviewer; product owner
- **Source:** Accepted NorthStar Architecture Decision Register, sections 5.2, 6 and 14.1

## Context

Internal staff and invited client reviewers have different trust levels, workflows, information needs and session policies. A single frontend or session boundary would increase the risk that internal fields or capabilities reach client users.

## Decision

Create two independent Next.js applications and deployments:

- `apps/big-staff-frontend/` for staff workflows using normal business routes without a redundant `/staff` prefix.
- `apps/big-client-review/` for invitation-based client review, with routes such as `/reviews/{review_id}`.

Both consume the private FastAPI backend through their own limited backend-for-frontend (BFF) and session boundary. They do not share runtime sessions or middleware. Client operations use purpose-built endpoints such as `/api/v1/client-reviews/{id}` and client-safe data transfer objects (DTOs) constructed by the backend. Shared packages may provide contracts and visual consistency but cannot collapse the trust boundary.

Use separate domains, Firebase projects, cookies, backend services, Cloud Armor policies and CSPs. They may share the global external Application Load Balancer.

## Alternatives considered

- One application with role-based screens: rejected because accidental data disclosure and session-boundary coupling would be harder to contain.
- An iframe embedding one portal in another: rejected because it complicates security, navigation and accessibility.
- A wholly separate repository: rejected initially because the applications share delivery governance and selected packages.

## Consequences

Deployment and testing effort increases, but client/staff isolation becomes explicit. Shared UX work must occur through reviewed packages rather than runtime coupling.

## Security and privacy

Client applications never receive complete internal candidate objects, AI diagnostics, validator rules, ICM notes or unrestricted CRM data. Hiding fields in the browser is insufficient.

## Operations and migration

Provision independent deployment, monitoring and security policies. Contract tests must prove DTO and OpenAPI separation.

## Acceptance checks

- Before environment provisioning, approve staff and client domain names.
- During application scaffolding, verify independent authentication projects and cookie boundaries.
- Before client-review release, add automated negative tests for internal-field leakage.

## Review triggers

Supersede only if a higher-authority product or security requirement changes the trust boundary.
