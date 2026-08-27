# NorthStar Project Seed

**Project:** BIG Platform / Project NorthStar  
**Seed status:** Active implementation handoff  
**Updated:** 27 August 2026  
**Architecture checkpoint:** Accepted 27 August 2026  

## 1. Purpose

This project contains the architecture, design, planning and implementation work for the BIG Platform. Keep detailed client-presentation and general project-management material outside the project unless it directly affects implementation.

The private NorthStar Git repository and its local `develop` foundation have been initialised. No BIG application code has been scaffolded yet.

This seed is a concise working handoff. It does not replace the accepted `NorthStar_Architecture_Decision_Register.md`, approved BIG business specifications, the department Git Workflow SOP, accepted ADRs, contracts or law. If they conflict, follow the authority hierarchy in the decision register.

## 2. Decision handling

| Status | Use |
|---|---|
| Confirmed | Governing baseline. Do not reopen without a concrete higher-authority conflict or superseding ADR. |
| Provisional | Current target requiring stated evidence before its acceptance trigger. |
| Deferred | Do not decide until the recorded trigger occurs. |
| Open | Requires an explicit decision before the affected work proceeds. |

Ask only implementation-blocking questions. Resolve reversible feature details immediately before implementation rather than extending foundation planning indefinitely.

## 3. Confirmed system identity and boundaries

- Internal programme name: **Project NorthStar**.
- Repository name: `northstar`.
- BIG is the complete operational platform for client accounts, influencer applications and profiles, recruitment, vetting, selection, product-box fulfilment and final reporting.
- InfluenceHub is the specialised content-review and moderation workroom in the wider BIG lifecycle. It keeps its own portal and backend.
- Freelancers access InfluenceHub only. They receive no BIG application or BIG API access.
- Internal staff may use both systems according to assignments and capabilities.
- BIG owns project, recruitment, accepted-influencer and posting-rule data.
- InfluenceHub owns social posts, moderation workflow and moderation decisions.
- BIG receives authorised moderation summaries without owning the moderation workflow.
- External survey experiences and Social Connect remain separate systems.
- There is no community-participant portal in current BIG scope.

Use **InfluenceHub** terminology only for its real moderation domain. Do not rename BIG project recruitment or lifecycle features as InfluenceHub campaigns or moderation features.

## 4. Confirmed repository and application structure

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

Application boundaries:

- `big-staff-frontend` and `big-client-review` are separate Next.js applications and deployments.
- They do not share a runtime, session or middleware boundary.
- Staff uses normal business routes; do not add a redundant `/staff` URL prefix.
- Client review uses dedicated routes such as `/reviews/{review_id}` and purpose-built backend operations such as `/api/v1/client-reviews/{id}`.
- `big-backend` is the authoritative FastAPI business backend.

Package rules:

- BIG owns assembled applications under `apps/big-*` and BIG-specific packages under `big-packages/*`.
- Start with only clearly required BIG packages, such as `@big/contracts` and `@big/design-system`.
- Do **not** initially create `@big/core`.
- Do **not** create a generic `@cs/shared` package.
- `cs-packages/README.md` initially records CS ownership and package-admission rules.
- Add a CS-owned package only for a clear reusable responsibility, such as `@cs/observability` or `@cs/api-errors`.
- CS-owned packages need a public API, tests, documentation and ownership/licensing notice and must not contain BIG confidential data or BIG-specific business rules.
- Features expose explicit public interfaces. An `index.ts` or export mapping may be used, but barrel files are not mandatory.
- Cross-feature deep imports are prohibited.

The executed commercial agreement is authoritative for ownership and licensing; paths alone do not create legal ownership.

## 5. Frontend architecture objective

Create the BIG Frontend Architecture and Development Standards before major feature scaffolding. It must define:

- architecture principles and application boundaries;
- feature structure and public interfaces;
- Server Component and Client Component guidance;
- strict TypeScript and component standards;
- TanStack Query server-state practices;
- React Hook Form and Zod form practices;
- BFF responsibilities and prohibited business logic;
- authentication, sessions, CSRF and authorisation integration;
- contract generation and error handling;
- accessibility, testing, observability and feature flags;
- quality, security and release gates.

Backend routes do not need to exist before this standard. Development remains contract-driven through the contract register, FastAPI/Pydantic, versioned OpenAPI and generated TypeScript clients.

## 6. Frontend feature organisation

Each frontend owns only features appropriate to its trust zone. A typical feature uses only the folders it needs:

```text
src/features/{feature}/
├── api/
├── components/
├── hooks/
├── schemas/
├── types/
├── utils/
├── tests/
└── index.ts          # optional public interface
```

Shared low-level UI belongs in the design system only when it is genuinely reused. Business rules, authorisation and sensitive filtering remain in FastAPI.

Initial staff capability areas include clients, brands, projects, recruitment, filtering, survey operations, survey ingestion, CRM profiles, vetting, internal approval, fulfilment, moderation summaries and audit/change history.

The client-review application receives only approved client-safe candidate information and permitted decisions. It must never receive internal comments, unvetted candidates, AI diagnostics, validator rules, ICM notes, unrestricted CRM data, other projects or internal workflow controls.

## 7. BFF and API boundaries

Each Next.js BFF is a limited security/session boundary. It may handle:

- server-issued session cookies;
- identity/session verification;
- backend workload authentication;
- CSRF protection and request controls;
- safe request/response validation;
- correlation identifiers;
- safe error normalisation;
- appropriate cache controls and selected rate controls;
- preventing backend internals from reaching the browser.

FastAPI remains authoritative for:

- business rules and workflow state machines;
- authorisation and scoped assignments;
- filtering, search and counts;
- deduplication and survey ingestion;
- vetting, selection and approval transitions;
- database access and audit integrity;
- selective PostgreSQL RLS;
- client-safe DTO construction.

The BFF must not become a second business backend.

## 8. Identity, sessions and authorisation

### Staff

- Firebase Authentication with Identity Platform capabilities.
- Dedicated staff Firebase project per environment.
- Mandatory TOTP authenticator-app MFA.
- `HttpOnly`, `Secure` cookie session.
- Initial limits: 30-minute inactivity and 10-hour absolute lifetime.

### Client review

- Separate client-review Firebase project per environment.
- Invite-only passwordless OTP or magic-link authentication.
- Separate cookie and session boundary.
- Initial limits: 30-minute inactivity and 4-hour absolute lifetime.

Sensitive actions require authentication no older than 15 minutes. Use explicit CSRF tokens plus Origin/Referer, content-type and unsafe-method protection. Never store ID tokens in browser local storage.

Firebase authenticates identity but does not own business permissions. PostgreSQL-backed domain profiles and scoped RBAC/ABAC assignments are authoritative. Capability scopes are `PLATFORM`, `CLIENT_ACCOUNT`, `BRAND`, `PROJECT` and `CLIENT_REVIEW`. There is no BIG freelancer role.

Use application-level checks plus selective RLS for defence in depth. The backend never trusts browser-supplied roles, organisation IDs or project IDs.

## 9. BIG and InfluenceHub integration

- Use one PostgreSQL infrastructure with domain-owned schemas, identities and migration histories.
- Illustrative schemas: `platform`, `big`, `influencehub`, `audit`.
- Each shared entity has one authoritative writer.
- No application writes another domain's schema.
- BIG and InfluenceHub share canonical opaque identifiers.
- Use APIs for commands and authoritative current reads.
- Use a transactional outbox and versioned events for durable asynchronous propagation.
- Stable approved read-only views may support shared projections.
- Cross-platform dashboards should normally be current within 60 seconds.
- Decisive actions revalidate against the authoritative domain.
- Posting/moderation rules are immutable and versioned; changes apply prospectively unless a controlled reassessment is requested.
- Use secure deep links and an appropriate shared visual header, never iframes.
- Each domain owns its state machine; cross-domain status mappings are explicit and versioned.

InfluenceHub migration must use inventory, ownership mapping, repeatable dry runs, snapshot-plus-delta or an approved write freeze, reconciliation, rollback window and read-only legacy retirement. Permanent dual-write is not the target.

## 10. API contract lifecycle

```text
Proposed/Confirmed contract register
→ FastAPI and Pydantic implementation
→ versioned OpenAPI
→ generated TypeScript types/client
→ automated verification
```

- Maintain separate staff and client-review OpenAPI specifications.
- Generate types with `openapi-typescript` and the client with `openapi-fetch`.
- BFF/server code consumes generated clients; feature TanStack Query hooks call the BFF.
- Never edit generated artifacts manually.
- Use `/api/v1` major URL versioning.
- Use RFC 9457 Problem Details with stable application codes and correlation IDs.
- Require `Idempotency-Key` for important creates/actions.
- Use ETags and `If-Match` for multi-user concurrency.
- Return 412 for stale versions and 428 when a required precondition is missing.
- Version domain events independently from HTTP APIs.

Initial contracts cover J0–J1 first, then release-critical J0–J5 flows, including client/brand operations, projects, filtering/live counts, survey ingestion, vetting, internal approval, restricted client decisions and audit/change timelines.

## 11. Confirmed technology baseline

Foundation evidence was validated on 27 August 2026.

| Area | Baseline |
|---|---|
| Frontend | Next.js `16.3.3`, App Router |
| Node.js | `24.20.0` LTS |
| Workspace | pnpm workspaces, one lockfile, `workspace:*` |
| TypeScript orchestration | Turborepo with local caching |
| Server state | TanStack Query v5 |
| Forms | React Hook Form and Zod 4 |
| Backend | FastAPI and Pydantic |
| Python | `3.14.7`, managed with `uv` and `uv.lock` |
| Persistence | PostgreSQL 18, SQLAlchemy 2, Alembic, Psycopg 3 |
| Search | PostgreSQL exact/prefix/full-text plus `pg_trgm` |

Exact package pins belong in reviewed lockfiles and may advance through security and compatibility updates. Python 3.13 and PostgreSQL 17 are compatibility fallbacks only after evidence and a recorded decision.

Do not initially add Redis, PgBouncer, async SQLAlchemy, an external search service, WebSockets, remote Turborepo caching or an external feature-flag provider.

## 12. Testing and engineering quality

- TypeScript unit tests: Vitest.
- Components: React Testing Library.
- End-to-end: Playwright.
- Python: pytest.
- Database tests: temporary real PostgreSQL, not SQLite.
- New/changed handwritten logic targets at least 80% branch coverage.
- Cover meaningful failure and security outcomes; repository coverage must not regress without an approved exception.
- Pre-commit: formatting, linting and secret detection.
- Pre-push: affected tests, type checks, Python checks and changed-code coverage.
- Full CI remains authoritative.
- TypeScript: Prettier, type-aware ESLint and strict mode.
- Python: Ruff and strict mypy.
- Both applications target WCAG 2.2 AA.

Code-complete is not delivery-complete. Delivery includes tests, accessibility, observability, contracts, documentation and deployability.

## 13. Cloud and delivery baseline

- Environment projects: `prj-big-platform-dev`, `prj-big-platform-stg`, `prj-big-platform-prod`, with uniqueness suffixes only where required.
- Primary region: `africa-south1` (Johannesburg).
- Provisional secondary region: `europe-west1` (Belgium).
- Cloud Run hosts frontends, private FastAPI services, handlers and jobs.
- Production uses a global external Application Load Balancer.
- Staff/client frontends have separate domains, backend services, Cloud Armor policies, CSPs and cookies.
- Disable direct public frontend `run.app` access after load-balancer integration.
- Keep FastAPI private.
- Use private-IP Cloud SQL, Direct VPC egress, Cloud SQL Python Connector and IAM DB authentication.
- Use Terraform, protected GCS state, GitHub Actions and Workload Identity Federation.
- Use Secret Manager; no long-lived service-account keys.

Cloud Tasks and Cloud Scheduler remain unavailable in Johannesburg as of the evidence checkpoint. Place them initially in Belgium and invoke IAM-protected Johannesburg workers/coordinators. The Johannesburg outbox protects task submission. Task payloads contain only task type, stable ID, correlation ID, idempotency information and contract version—no personal or sensitive content.

Belgium is not automatically privacy-compliant. POPIA Section 72, contractual safeguards, subprocessors, latency and cost must be validated before production use.

## 14. Security, privacy and recovery baseline

- Classify data as Public, Internal, Confidential or Restricted.
- Maintain a purpose-based retention register; legal/business owners approve exact periods.
- Coordinate privacy requests across BIG and InfluenceHub.
- Record consent in an immutable, purpose-specific ledger with evidence and withdrawal.
- Use telemetry field allowlists; never log bodies, tokens, cookies, survey answers, internal notes or unrestricted CRM data.
- Use synthetic non-production data by default.
- Use private GCS file storage, quarantine and asynchronous malware scanning for external uploads.
- Use CMEK for production Cloud SQL and approved Confidential/Restricted storage where supported.
- Production Cloud SQL uses regional HA and PITR.
- Initial recovery targets: RPO ≤5 minutes for accidental change, major-restore RTO 4 hours, seven-day PITR and 30-day daily backups.
- Maintain an encrypted off-region recovery copy; do not initially run a live cross-region replica.
- Complete threat modelling, an independent pre-production penetration test and formal POPIA impact assessment before stable production.

## 15. Git and release governance

The department Git Workflow SOP is authoritative.

- Protect integration and release branches and require CI.
- Normal pull requests require review.
- A senior project lead may self-merge their low-risk change after required checks.
- Independent qualified review remains mandatory for high-risk authentication, authorisation/RLS, redaction/trust zones, production IAM/KMS/networking, destructive migrations, privacy/audit, secrets and deployment-permission changes.
- A SEV1 exception requires recorded reason, checks where possible, monitoring and next-business-day retrospective review.

Release flow:

```text
feature preview
→ develop integration
→ alpha staging
→ beta client UAT
→ optional release candidate
→ stable after production approval
```

The October acceptance baseline is the connected J0–J5 workflow. Selected J6 components are conditional, backend-flagged and default off if incomplete. Client UAT is not production approval. Monday.com governs delivery status only.

## 16. Deferred decisions and triggers

| Deferred decision | Trigger |
|---|---|
| Organisation SSO | Enterprise requirement or staff identity-management need |
| Remote Turborepo cache | CI duration or developer feedback |
| Redis/shared cache | Measured database, rate-limit or distributed-state need |
| PgBouncer | Bounded pools/scaling cannot control connections |
| Async SQLAlchemy | Profiling proves sufficient benefit |
| SSE | Polling fails measured freshness, cost or scale targets |
| WebSockets | Genuine bidirectional real-time use case |
| External search | PostgreSQL fails scale/relevance targets |
| Pub/Sub | True independent fan-out consumers emerge |
| External observability | Documented GCP-native tooling gap |
| Feature-flag SaaS | Internal governance becomes inadequate |
| Cross-region live DB replica | Contractual/measured outage impact |
| Notification provider | Channel, volume, deliverability and residency known |
| Malware scanner | File types, throughput and operating model known |
| Restricted-field encryption list | Inventory/privacy classification |
| Retention periods | Business/legal purpose approved |
| UUID version | Initial schema/library validation |

Do not activate a Deferred item merely because it is common in other systems.

## 17. Current artefacts

- `NorthStar_Architecture_Decision_Register.md` — Accepted checkpoint and governing decision register.
- `NorthStar_Foundation_ADR_Pack.zip` — 13 repository-ready Proposed foundation ADRs.
- `NorthStar_Project_Seed.md` — this active implementation handoff; it supersedes the old BIG seed.
- `BIG_Frontend_Architecture_and_Development_Standards.md` — Proposed frontend standard derived from the accepted register; formal review remains.
- BIG Git/release documents incorporated into the repository:
  - `docs/agile/deliverables/internal/BIG Git and Release Implementation Guide.md`
  - `docs/agile/deliverables/internal/BIG October 2026 Release Plan.md`

## 18. Updated implementation sequence

1. ~~Confirm repository name, ownership boundary and application structure.~~ **Completed in the accepted checkpoint.**
2. ~~Validate foundation runtime versions and GCP service regions.~~ **Completed 27 August 2026; repeat during locked builds and before production.**
3. ~~Prepare foundation ADRs.~~ **Proposed ADR pack completed; acceptance checks and approval remain.**
4. ~~Create the private `northstar` Git repository and insert the ADR pack under `docs/architecture/decisions/`.~~ **Completed 27 August 2026.**
5. ~~Add root README, ignore rules, contribution guidance, CODEOWNERS and ownership notices.~~ **Completed 27 August 2026.**
6. Configure pinned runtimes, pnpm workspace, `uv`, locks and local PostgreSQL tooling. **Runtime targets, pnpm/Turborepo workspace boundaries, frozen JavaScript lock and local PostgreSQL Compose configuration added 27 August 2026. Node 24.20.0 and pnpm 11.23.0 were verified locally through NVM for Windows and Corepack; the frozen foundation checks passed with the pinned toolchain. Python 3.14.7 and `uv` 0.12.6 were verified locally, and PostgreSQL 18.4 was verified in an isolated container. The Python lock remains implementation-triggered until the backend manifest exists.**
7. Establish formatting, linting, typing, secret detection and test foundations.
8. Write the BIG Frontend Architecture and Development Standards. **Proposed repository draft completed 27 August 2026; formal review and acceptance remain.**
9. Create the API contract register and first J0–J1 contracts.
10. Scaffold the three applications without feature business logic.
11. Establish CI, protected branches and preview/develop environments.
12. Implement release-critical vertical slices from Confirmed contracts.

Do not scaffold major framework, security, data or infrastructure choices without the corresponding accepted register entry or ADR. Preserve Deferred items until their triggers occur.
