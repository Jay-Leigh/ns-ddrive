# NorthStar Architecture Decision Register

**Project:** BIG Platform / Project NorthStar  
**Status:** Accepted checkpoint  
**Checkpoint date:** 27 August 2026  
**Accepted by:** Project owner (Ian Smith)  
**Acceptance date:** 27 August 2026  
**Latest evidence validation:** 27 August 2026  
**Coverage:** Decisions confirmed through Question 117  

## 1. Purpose and use

This register consolidates the architecture, security, data, delivery and engineering decisions made during the NorthStar planning discussion. It is intended to prevent decisions from being lost in conversation history and to provide the starting context for future architecture and implementation work.

The project owner accepted this register as the NorthStar architecture checkpoint on 27 August 2026. Confirmed entries are treated as governing decisions unless they are superseded by an approved Architecture Decision Record (ADR), an authoritative business specification, a contract, law or organisational policy.

This register does not turn every implementation detail into a permanent constraint. Decisions are classified by when they must be resolved so that reversible choices can be made close to implementation.

## 2. Decision status and timing

| Status | Meaning |
|---|---|
| Confirmed | Agreed during the architecture discussion and recorded here for verification. |
| Provisional | Current target that must be validated through compatibility, cost, legal or operational evidence. |
| Deferred | Intentionally postponed until there is a real implementation need or sufficient evidence. |
| Open | Requires an explicit future decision. |

| Timing | Meaning |
|---|---|
| Foundation | Required before or during repository and platform scaffolding. |
| Feature | Required before implementing the affected feature. |
| Production | Required before the first stable production release. |
| Evidence-triggered | Revisited only when measurements, scale or a new use case justify it. |

## 3. Authority hierarchy

If sources conflict, use the following order:

1. Applicable law and executed commercial or data-processing agreements.
2. The department Git Workflow SOP and organisation-wide policies.
3. Approved BIG business specifications and workflow confirmations.
4. Accepted Architecture Decision Records.
5. BIG architecture and development standards.
6. Confirmed entries in the API contract register.
7. Implemented, versioned OpenAPI specifications.
8. Feature documentation and repository README files.
9. Application code.

The API contract register is authoritative while a contract is **Proposed** or **Confirmed**. Once implemented, the generated OpenAPI specification becomes the machine-readable authority. A contract is **Verified** when the register, OpenAPI definition, generated clients and automated checks agree.

Monday.com is authoritative for delivery status only. A delivery status does not override architecture or contract decisions.

## 4. Product and system boundaries

### 4.1 BIG and InfluenceHub

**Status:** Confirmed  
**Timing:** Foundation

- BIG is the complete operational platform for client accounts, influencer applications and profiles, project recruitment, vetting, selection, product-box fulfilment and final reporting.
- InfluenceHub is the specialised content-review and moderation workroom within the wider BIG business lifecycle. It retains its own portal and backend.
- Freelancers access InfluenceHub only. They do not receive access to the BIG applications or BIG APIs.
- Internal staff may use both systems according to their assignments and capabilities.
- BIG owns project, recruitment, accepted-influencer and posting-rule data.
- InfluenceHub owns social posts, moderation workflow and moderation decisions.
- A project created in BIG, its accepted influencers and the applicable posting rules must become available to InfluenceHub when moderation is required.
- BIG must be able to show appropriate moderation summaries, such as submitted, awaiting review and approved post counts, without taking ownership of InfluenceHub's moderation workflow.
- The two systems present different authorised dimensions of the same business lifecycle; neither should create an unauthorised duplicate source of truth.

### 4.2 Integration boundary

**Status:** Confirmed  
**Timing:** Foundation and feature

- Use APIs for commands and current authoritative reads.
- Use a transactional outbox and versioned events for durable asynchronous propagation.
- Approved read-only database views may be used for stable shared read models, but applications must not write across another domain's schema.
- Cross-platform dashboard projections should normally become current within 60 seconds.
- Decisive workflow actions must revalidate against the authoritative domain rather than relying solely on a potentially stale projection.
- Posting and moderation rules are immutable and versioned. Rule changes apply prospectively by default; reassessing earlier decisions requires an explicit controlled action.
- Contextual navigation between portals uses secure deep links and a shared visual header where appropriate. Do not embed one portal inside the other using an iframe.
- InfluenceHub must not show BIG navigation to freelancer users.
- Each domain owns its status state machine. Cross-platform status mappings are explicit and versioned.

### 4.3 Scope exclusions

**Status:** Confirmed  
**Timing:** Foundation

- BIG does not render or become the owner of external survey experiences.
- Social Connect remains a separate system for its existing responsibilities.
- BIG records external references and ingestion status without absorbing another system's OAuth or verification logic.
- There is no community-participant portal in the current BIG scope.

## 5. Repository and intellectual-property boundary

### 5.1 Repository identity

**Status:** Confirmed  
**Timing:** Foundation

- Internal programme name: **Project NorthStar**.
- Repository name: `northstar`.
- NorthStar is a BIG-owned monorepo with selected CS-owned reusable packages. It is not a general-purpose home for unrelated CS applications.

Initial top-level structure:

```text
northstar/
├── apps/
├── big-packages/
├── cs-packages/
├── docs/
├── infrastructure/
└── README.md
```

### 5.2 Application structure

**Status:** Confirmed  
**Timing:** Foundation

```text
apps/
├── big-staff-frontend/
├── big-client-review/
└── big-backend/
```

- Staff and client review are separate frontend applications and deployments inside the same monorepo.
- The staff frontend uses normal business routes; a redundant `/staff` URL prefix is not required.
- Client review uses a dedicated route such as `/reviews/{review_id}` and purpose-built backend operations such as `/api/v1/client-reviews/{id}`.
- Shared packages may provide contracts and design consistency, but the applications do not share a runtime, session or middleware boundary.

### 5.3 Ownership model

**Status:** Confirmed  
**Timing:** Foundation and commercial governance

- BIG owns the assembled BIG applications in `apps/big-*`.
- BIG owns BIG-specific packages in `big-packages/*`.
- Conversion Science owns reusable technical components in `cs-packages/*` and licenses them for use within BIG.
- BIG's ownership of the assembled system must not prevent CS from reusing or developing its own reusable packages elsewhere.
- BIG may not extract and separately commercialise CS-owned packages contrary to the governing agreement.
- The executed commercial agreement is authoritative; directory placement alone does not establish legal ownership.
- CS-owned packages must not contain BIG confidential data or BIG-specific business rules. They require an explicit purpose, public API, tests, documentation and ownership/licensing notice.

### 5.4 Package admission rules

**Status:** Confirmed  
**Timing:** Foundation and evidence-triggered

- Do not initially create a generic `@big/core` package.
- Start BIG packages with only clearly required, specifically owned packages such as `@big/contracts` and `@big/design-system`.
- Do not create a generic `@cs/shared` package. `cs-packages/README.md` initially documents ownership and admission rules.
- Add a CS package only when its reusable responsibility is clear; name it for that responsibility, for example `@cs/observability` or `@cs/api-errors`.
- Features expose explicit public interfaces. Cross-feature deep imports are prohibited. A public interface may use `index.ts` or package export mappings; barrel files are not mandatory.

## 6. Identity, sessions and access control

### 6.1 Authentication architecture

**Status:** Confirmed  
**Timing:** Foundation

- Use Firebase Authentication with Google Cloud Identity Platform capabilities.
- Staff use mandatory TOTP authenticator-app MFA.
- Organisation SSO is deferred because of implementation complexity and may be added later.
- Staff identity may be shared across BIG and InfluenceHub, but each application has its own session and performs its own authorisation.
- Freelancers remain in the separate InfluenceHub authentication zone. BIG rejects a freelancer issuer or identity zone before business authorisation is evaluated.
- Client review uses a separate Firebase project and invite-only passwordless OTP or magic-link authentication.
- The FastAPI backend independently verifies Firebase identity or the server-issued session; it never trusts browser-supplied roles, organisation IDs or project IDs.

Authentication environment naming:

```text
prj-big-platform-staff-dev
prj-big-platform-staff-stg
prj-big-platform-staff-prod
prj-big-platform-client-dev
prj-big-platform-client-stg
prj-big-platform-client-prod
```

### 6.2 Sessions and request protection

**Status:** Confirmed  
**Timing:** Foundation

- BFF sessions use `HttpOnly`, `Secure` cookies. ID tokens are not stored in browser local storage.
- Use explicit CSRF tokens together with Origin/Referer checking, content-type controls and protection of unsafe methods.
- Initial staff session policy: 30-minute inactivity timeout and 10-hour absolute lifetime.
- Initial client-review session policy: 30-minute inactivity timeout and 4-hour absolute lifetime.
- Sensitive actions require recent authentication, initially no older than 15 minutes.
- These values may be adjusted during UAT using documented security review; they are internal security settings rather than user-facing promises.

### 6.3 Identity lifecycle

**Status:** Confirmed  
**Timing:** Feature

- Admin invitations automatically provision or link Firebase and the database identity. Administrators must not manually copy Firebase UIDs.
- A client-contact CRM record does not automatically grant portal access.
- MFA recovery is an admin-assisted, audited workflow involving session revocation and MFA re-enrolment. A second approver is required for access administrators where practicable.

### 6.4 Authorisation model

**Status:** Confirmed  
**Timing:** Foundation and feature

- Identity authenticates the subject but contains no authoritative business permissions.
- PostgreSQL-backed assignments are authoritative for business access.
- Use the three-layer hybrid model: IAM authentication, domain profiles and RBAC/ABAC capability assignments.
- Capability assignments are explicitly scoped to `PLATFORM`, `CLIENT_ACCOUNT`, `BRAND`, `PROJECT` or `CLIENT_REVIEW`.
- There is no BIG freelancer role or BIG `REVIEW_QUEUE` scope because freelancers use InfluenceHub only.
- Use application-level authorisation together with selective PostgreSQL Row Level Security for defence in depth.
- Client-review APIs return purpose-built, client-safe DTOs. Internal fields are removed during backend response construction, not hidden by the frontend.
- Client-review applications must never receive complete internal candidate objects, internal AI diagnostics, validator rules, ICM notes or unrestricted CRM data.

## 7. Database and data ownership

### 7.1 Shared data infrastructure

**Status:** Confirmed  
**Timing:** Foundation and migration

- BIG and InfluenceHub will ultimately use the same PostgreSQL data infrastructure because they participate in the same lifecycle.
- They retain domain-owned schemas, backends, permissions and migration histories.
- Illustrative schemas are `platform`, `big`, `influencehub` and `audit`.
- Use separate database identities for each API, worker, migrator and developer access path.
- Each domain owns its Alembic history and version table. Migrations are centrally orchestrated and never run automatically on application startup.
- Use expand/contract database changes and a dedicated migrator identity. Cross-schema changes require explicit review.
- Each shared entity has one authoritative writer. Do not implement multi-writer rows or direct cross-domain writes.
- BIG and InfluenceHub use the same canonical identifiers for shared projects, influencers and related entities.

### 7.2 InfluenceHub migration

**Status:** Confirmed  
**Timing:** Feature/migration

Migrate InfluenceHub data in controlled stages:

1. Inventory existing data and dependencies.
2. Map domain ownership and canonical identifiers.
3. Build repeatable migration tooling and dry runs.
4. Transfer a snapshot plus deltas, or use an approved short write freeze.
5. Reconcile counts, identifiers and business outcomes.
6. Retain a defined rollback window with the legacy system read-only.
7. Decommission only after acceptance.

Avoid permanent dual-write as the target architecture.

### 7.3 PostgreSQL and persistence tooling

**Status:** Confirmed with compatibility fallback  
**Timing:** Foundation

- Target PostgreSQL 18 consistently across local development, CI and Cloud SQL.
- PostgreSQL 18.4 was the Cloud SQL default when the foundation baseline was validated on 27 August 2026. Pin the local/CI PostgreSQL image to a reviewed patch or immutable digest; allow Cloud SQL to apply supported minor updates through its managed maintenance process.
- PostgreSQL 17 is an allowed fallback only after a compatibility assessment and ADR.
- Begin with an application extension allowlist containing only `pg_trgm`.
- Use SQLAlchemy 2, Alembic and Psycopg 3.
- Begin with synchronous SQLAlchemy. Adopt asynchronous database access only when measurements justify the added complexity.
- Use Cloud SQL Python Connector, IAM database authentication and bounded SQLAlchemy connection pools.
- Cloud SQL uses private IP and Direct VPC egress; it has no public database endpoint.
- Define a total database connection budget across Cloud Run services. Maximum instance counts, pool sizes, concurrency and overlapping revisions must fit that budget.
- Do not add PgBouncer initially.

### 7.4 Query, pagination and search

**Status:** Confirmed  
**Timing:** Feature

- Measure and review query performance using safe query diagnostics and Query Insights where enabled.
- Do not place personal information in query parameters captured by telemetry.
- Test for N+1 behaviour and inspect critical query plans safely.
- Cursor pagination is the default. Initial page size is 25 and maximum page size is 100, subject to feature evidence.
- Offset pagination is allowed only for small, stable lists with a documented reason.
- Use PostgreSQL exact matching, prefix matching, full-text search and `pg_trgm` initially.
- Apply authorisation before returning search results or counts.
- Do not introduce a separate search service until scale or relevance evidence justifies it.
- Do not introduce Redis or another shared cache initially. Use browser/TanStack Query caching, ETags, database indexes and projections, with explicit authenticated-cache safety.

## 8. Data protection, privacy and auditability

### 8.1 Classification and retention

**Status:** Confirmed  
**Timing:** Foundation and production

- Classify data as Public, Internal, Confidential or Restricted.
- Maintain a purpose-based retention register. Exact retention periods require business and legal approval.
- Automate lifecycle deletion or de-identification where practical.
- Legal holds suspend normal deletion for the affected records.
- Backups age out according to their approved retention, and required deletions are re-applied after restore.

### 8.2 Privacy requests and consent

**Status:** Confirmed  
**Timing:** Feature and production

- Privacy requests use a controlled administrative workflow with identity verification, impact preview, approval, idempotent execution and an audit record that does not retain the deleted personal information.
- A privacy request is coordinated across BIG and InfluenceHub because they share data infrastructure and canonical subjects.
- Consent is recorded in an immutable, purpose-specific ledger with a current-state projection.
- Store consent source, evidence, wording/version and withdrawal.
- External survey systems must provide verifiable consent evidence. BIG must not infer consent from the mere existence of a survey submission.

### 8.3 Encryption and production access

**Status:** Confirmed  
**Timing:** Feature and production

- Minimise or avoid Restricted data before considering encryption.
- Apply field-level envelope encryption selectively to explicitly approved Restricted fields; do not blanket-encrypt every application field.
- Use controlled support interfaces for normal production support.
- Direct production database access is individually assigned, time-bound, approved and audited.
- Routine direct production writes are prohibited. Emergency writes require dual control where practicable.
- Use synthetic data in non-production environments by default.
- If production-shaped data is unavoidable, use an approved, repeatable anonymisation process; never copy production data directly into development.

### 8.4 Telemetry and logs

**Status:** Confirmed  
**Timing:** Foundation and production

- Logs, traces, analytics and error reporting use explicit field allowlists.
- Do not log request/response bodies, authentication tokens, session cookies, survey answers, internal notes or unrestricted CRM content.
- Use correlation identifiers across frontend BFFs, APIs, tasks and scheduled work.

### 8.5 Change logs and audit logs

**Status:** Confirmed  
**Timing:** Feature

- A **change log** answers what changed and preserves relevant record or configuration version history.
- An **audit log** answers who attempted or performed a controlled action, when, within which scope, with what outcome and, where required, for what reason.
- When an action creates both, link the audit event to the resulting change set or version.
- Client-visible timelines are separate, purpose-built projections and never expose the complete internal audit trail.

## 9. API contracts and concurrency

### 9.1 Contract lifecycle and generation

**Status:** Confirmed  
**Timing:** Foundation

```text
Proposed/Confirmed contract register
→ FastAPI and Pydantic implementation
→ versioned OpenAPI
→ generated TypeScript types/client
→ automated verification
```

- Maintain separate staff and client-review OpenAPI specifications.
- Generate TypeScript contracts using `openapi-typescript` and the request client using `openapi-fetch`.
- Generated clients are consumed by server/BFF code. Feature-level TanStack Query hooks call the BFF boundary.
- Generated artifacts are not edited manually.
- CI detects stale generated code and contract mismatches.

### 9.2 API behaviour

**Status:** Confirmed  
**Timing:** Foundation and feature

- Use RFC 9457 Problem Details with a stable application error code, correlation ID and safe validation detail.
- Important create and action requests require an `Idempotency-Key`.
- Use ETags and `If-Match` for multi-user optimistic concurrency.
- Return `412 Precondition Failed` for a stale version and `428 Precondition Required` when a required precondition is missing.
- Never silently overwrite a conflicting update.
- Use `/api/v1` major URL versioning.
- Prefer compatible additive API evolution, with evidence-based deprecation.
- Version domain events independently from HTTP API versions.

## 10. Frontend architecture

### 10.1 Framework and runtime

**Status:** Confirmed  
**Timing:** Foundation

- Use Next.js 16 Active LTS with the App Router. The initial scaffolding baseline is Next.js `16.3.3`, which was the current patched release on 27 August 2026.
- Pin Node.js `24.20.0` in the initial repository/tooling baseline. Node.js 24 was in LTS and `24.20.0` was the latest LTS patch when validated on 27 August 2026.
- Exact dependency pins are implementation baselines, not permanent architecture constraints. Update them through reviewed dependency changes with compatibility, security and lockfile checks.
- The Next.js BFF is a limited security and session boundary, not a second business-logic layer.
- FastAPI remains authoritative for business rules, filtering, authorisation, deduplication and audit integrity.

### 10.2 Data fetching and forms

**Status:** Confirmed  
**Timing:** Foundation and feature

- Use TanStack Query v5 for client-side server state.
- Prefer Server Components for suitable initial data loading.
- Use React Hook Form and Zod 4 for forms and frontend interaction validation.
- Pydantic/API models remain authoritative for backend contracts; UI form schemas may be purpose-specific rather than copies of backend objects.

### 10.3 Live interactions

**Status:** Confirmed initial strategy  
**Timing:** Feature

- Autosave uses debounced, validated mutations with visible pending, saved, failed and conflict states.
- Live audience counts recalculate after the relevant debounce.
- Survey-ingestion status begins with short polling and backoff.
- Multi-user screens refetch and use ETag conflict detection.
- Consider Server-Sent Events only when latency or load evidence justifies them.
- Do not introduce WebSockets initially.

### 10.4 Feature flags and configuration

**Status:** Confirmed  
**Timing:** Foundation

- Sensitive feature flags are enforced by the backend, default off and never act as authorisation controls.
- Every flag has an owner, purpose, expiry/review point and auditable change path.
- Do not adopt an external feature-flag provider initially.
- Each service uses typed, validated configuration.
- Terraform supplies non-secret configuration and Secret Manager supplies secrets.
- Browser-public and server-only configuration are explicitly separated.

### 10.5 Styling and design tokens

**Status:** Confirmed
**Timing:** Foundation

- Use Tailwind CSS v4 as the primary styling framework.
- Semantic CSS custom properties are the stable application-facing design-token interface. Primitive tokens may support semantic tokens but are not normally consumed directly by feature code.
- Use CSS Modules only where component-specific complexity is clearer than Tailwind utilities, and require them to consume the same semantic tokens.
- Adopt Radix Primitives selectively for complex interactive controls. Radix does not replace NorthStar's WCAG 2.2 AA testing obligations.
- Do not add runtime CSS-in-JS or an opinionated visual component suite to the foundation baseline. A later justified need requires separate review.
- Do not adopt shadcn/ui patterns automatically; review provenance, licensing, tokens, accessibility and tests per component.
- Add `clsx`, `tailwind-merge`, CVA and `prettier-plugin-tailwindcss` only when their implementation need occurs.
- This baseline enables future theming but does not commit NorthStar to dark mode or multi-tenant branding.
- Accepted ADR 0014 records the decision detail and review triggers.

## 11. Monorepo and development tooling

### 11.1 TypeScript workspace

**Status:** Confirmed  
**Timing:** Foundation

- Use pnpm workspaces with one lockfile.
- Use `workspace:*` for internal package relationships.
- CI installs with a frozen lockfile.
- Use Turborepo to orchestrate TypeScript tasks only.
- Start with local Turborepo caching; remote caching is deferred.

### 11.2 Python workspace

**Status:** Confirmed  
**Timing:** Foundation

- Manage Python with `uv`, `pyproject.toml` and `uv.lock`.
- Pin Python `3.14.7` for the initial repository/tooling baseline.
- Python 3.14 compatibility was validated on 27 August 2026 by resolving the Linux deployment set for FastAPI, SQLAlchemy 2, Psycopg 3 and the Cloud SQL Python Connector. The fallback trigger did not occur.
- Python 3.13 remains an allowed contingency only if the locked application or container build later exposes a concrete incompatibility; activating it requires a recorded compatibility decision.
- Python tasks remain outside Turborepo unless a later ADR changes the boundary.

### 11.3 Local development

**Status:** Confirmed  
**Timing:** Foundation

- Run pinned Node and Python toolchains natively.
- Use Docker Compose for PostgreSQL and supporting local services.
- Provide synthetic seed data and safe environment templates.
- Use dedicated development Firebase projects for flows that cannot be faithfully emulated.
- Local development has no production data or implicit production access.

## 12. Testing and engineering quality

### 12.1 Test stack

**Status:** Confirmed  
**Timing:** Foundation

- TypeScript unit tests: Vitest.
- Component tests: React Testing Library.
- End-to-end tests: Playwright.
- Python tests: pytest.
- Database tests use temporary real PostgreSQL instances, not SQLite substitutes.
- Contract verification includes generated OpenAPI and frontend-client checks.

### 12.2 Coverage policy

**Status:** Confirmed  
**Timing:** Foundation

- New or changed handwritten logic targets at least 80% branch coverage.
- Tests cover meaningful success, failure and security outcomes, including relevant branches and exception paths.
- Repository coverage must not regress without an approved exception.
- Generated code, migrations and configuration-only files may be excluded with a documented rationale.
- Tests exercise public behaviour. There is no blanket rule requiring functions to be invoked through namespace objects.

### 12.3 Developer and CI checks

**Status:** Confirmed  
**Timing:** Foundation

- Pre-commit checks remain fast: formatting, linting and secret detection.
- Developers run unit and component tests continuously or in watch mode while working.
- Pre-push runs affected unit/component tests, type checks, Python checks and changed-code coverage.
- Full CI remains authoritative and runs the complete required suite.
- TypeScript uses Prettier, ESLint with Next.js/type-aware rules and strict TypeScript.
- Python uses Ruff formatting/linting and strict mypy.
- Suppressions must be narrow and documented.

### 12.4 Security scanning

**Status:** Confirmed baseline  
**Timing:** Foundation and production

- Use local and CI secret scanning plus repository push protection where the selected GitHub plan supports it.
- Use Dependabot and vulnerability checks with severity/exploitability triage and expiring exceptions.
- Record CodeQL and Trivy, including Terraform scanning, as preferred tools when available; they are not mandatory initial gates.
- Use GCP Artifact Analysis where cost and configuration permit.
- Production-readiness documentation identifies which scans are advisory and which block release.

### 12.5 Definition of done

**Status:** Confirmed  
**Timing:** Foundation

- Distinguish code-complete from delivery-complete.
- Delivery completion includes appropriate tests, accessibility, observability, contract verification, documentation and deployability.
- Merge does not equal release.
- Client UAT approval does not equal production approval.
- Monday.com remains the delivery-status source of truth.

## 13. Accessibility, compatibility and performance

### 13.1 Accessibility

**Status:** Confirmed  
**Timing:** Feature and production

- Both frontends target WCAG 2.2 AA.
- Combine automated checks with manual keyboard and screen-reader verification.

### 13.2 Browser support

**Status:** Confirmed initial matrix  
**Timing:** Feature

- Staff: current and previous Chrome and Edge desktop releases; essential workflows remain usable on tablets.
- Client review: current and previous Chrome, Edge, Firefox and Safari desktop releases, plus modern iOS Safari and Android Chrome with responsive layouts.
- Pull requests test Chromium; pre-release suites cover Chromium, Firefox and WebKit.

### 13.3 Performance targets

**Status:** Provisional internal targets  
**Timing:** Production

- p75 LCP no greater than 2.5 seconds.
- p75 INP no greater than 200 milliseconds.
- p75 CLS no greater than 0.1.
- Normal API reads target p95 no greater than 500 milliseconds.
- Normal API writes target p95 no greater than 1 second.
- Long-running work is asynchronous.
- Load-test and recalibrate these targets before stable production; they are not yet external contractual SLAs.

## 14. Cloud platform and infrastructure

### 14.1 Runtime topology

**Status:** Confirmed  
**Timing:** Foundation

- Deploy frontends, private FastAPI services, handlers and jobs to Cloud Run.
- Production external traffic enters through a global external Application Load Balancer.
- Staff and client applications have separate domains, backend services, Cloud Armor policies, Content Security Policies and cookie boundaries. They may share the global load balancer.
- Disable direct public `run.app` access for public frontend services after load-balancer integration.
- Keep FastAPI private.
- Cloud Tasks handlers retain their default `run.app` URL because Cloud Tasks and Cloud Scheduler require it; protect it with internal ingress and IAM.

### 14.2 Environment naming

**Status:** Confirmed  
**Timing:** Foundation

Workload project prefix uses BIG rather than the internal NorthStar codename:

```text
prj-big-platform-dev
prj-big-platform-stg
prj-big-platform-prod
```

Use consistent labels including `system=big`, purpose, security zone and environment. Project IDs may require a uniqueness suffix because GCP identifiers are globally unique.

### 14.3 Infrastructure as code and delivery identity

**Status:** Confirmed  
**Timing:** Foundation

- Use Terraform with pinned versions/providers.
- Store remote state in an appropriately protected GCS backend.
- Run Terraform plan in pull requests and apply through reviewed workflows.
- Avoid routine production changes through the cloud console.
- Use a private GitHub repository and GitHub Actions.
- Deploy to GCP using Workload Identity Federation; do not create long-lived service-account keys.
- Store secrets in Secret Manager per environment.
- Terraform manages secret containers and IAM, not secret values.
- Use separate service identities with least privilege.

### 14.4 Region and availability

**Status:** Confirmed primary; provisional secondary  
**Timing:** Foundation and production

- Primary region: `africa-south1` (Johannesburg).
- Provisional secondary region: `europe-west1` (Belgium), chosen for service coverage and general privacy governance.
- Official GCP location documentation revalidated on 27 August 2026 still omitted `africa-south1` for Cloud Tasks and Cloud Scheduler and listed `europe-west1` for both services.
- Belgium remains subject to a POPIA Section 72 assessment, contractual safeguards, subprocessors, latency and cost validation; it is not automatically compliant merely because it is in the EU.
- Production Cloud SQL uses regional high availability.
- Development and staging Cloud SQL may be single-zone.

### 14.5 Scaling and connectivity

**Status:** Confirmed  
**Timing:** Foundation and production

- Configure Cloud Run min/max instances and concurrency per service based on load tests and the database connection budget.
- Keep a warm production instance where cold starts would threaten user-experience targets.
- Account for overlapping revisions during deployments.
- Use private Cloud SQL connections through the Cloud SQL connector and IAM authentication.

### 14.6 Cloud Tasks and Scheduler

**Status:** Confirmed  
**Timing:** Foundation and feature

- Continue using Cloud Tasks even though it is not available in Johannesburg.
- Place queues in the supported secondary region, initially Belgium, and invoke IAM-protected Johannesburg workers.
- The Johannesburg transactional outbox protects against queue or cross-region submission failures.
- Task payloads contain only task type, stable ID, correlation ID, idempotency information and contract version—no personal content, access tokens or sensitive records.
- Keep the queue in the same GCP project as its target worker where practical.
- Place Cloud Scheduler in the supported secondary region and use it as a lightweight authenticated trigger for a Johannesburg coordinator.
- Business logic and authoritative data remain in Johannesburg.
- Express schedules explicitly in `Africa/Johannesburg` and make scheduled jobs idempotent with overlap protection.
- FastAPI `BackgroundTasks` is allowed only for disposable, non-critical work.
- Use transactional outbox plus Cloud Tasks for durable work; handlers are idempotent.
- Keep the outbox transport-neutral. Add Pub/Sub only when a real fan-out requirement exists.

### 14.7 Rate limiting and caching

**Status:** Confirmed  
**Timing:** Feature and production

- Define rate limits per operation and threat model.
- Combine edge, authenticated-identity and application controls; do not rely only on source IP.
- Return `429 Too Many Requests` with `Retry-After` where appropriate.
- Use database-backed counters for low-volume critical operations initially; do not add Redis solely for rate limiting.

## 15. Security controls

### 15.1 Browser security

**Status:** Confirmed  
**Timing:** Foundation and production

- Maintain a separate strict CSP for each frontend, using nonces or hashes.
- Roll out CSP in report-only mode in staging before enforcement.
- Prohibit `unsafe-eval` in production and avoid `unsafe-inline`.
- Configure HSTS and other appropriate security headers at the frontend/edge boundary.

### 15.2 Threat modelling and assurance

**Status:** Confirmed  
**Timing:** Foundation and production

- Produce a baseline threat model before architecture completion.
- Revisit it when trust boundaries or high-risk capabilities change, before production and at least annually.
- Track identified mitigations to completion.
- Commission an independent penetration test against a production-like staging environment before the first stable production release.
- The assessment includes authentication, MFA, authorisation, IDOR, redaction, client/staff isolation, files, CSRF, CSP, IAM and other relevant attack paths.
- Remediate and retest material findings.
- Complete a formal POPIA privacy impact assessment before production. BIG's privacy owner approves it; CS supplies technical evidence. Unresolved high risks block release.

### 15.3 AI safeguards

**Status:** Confirmed  
**Timing:** Feature and production

- AI output is advisory; an accountable human makes consequential decisions.
- Record applicable model, prompt/version, input reference, output, reviewer and final decision.
- Do not autonomously make consequential vetting or approval decisions.
- Send only minimal approved data to AI providers and prevent provider training on BIG data where the service supports this control.
- Redact internal diagnostics from client users.
- Address bias, drift and prompt-injection risk.
- Keep conditional J6 AI functionality behind backend-enforced, default-off feature flags.

## 16. Files and notifications

### 16.1 File handling

**Status:** Confirmed  
**Timing:** Feature and production

- Store private file content in GCS and file metadata/authorisation state in PostgreSQL.
- Separate buckets by environment, enable uniform bucket-level access and public-access prevention.
- Do not place personal information in object names.
- Use short-lived signed URLs and do not log them.
- External uploads enter quarantine, are validated and malware-scanned asynchronously, and remain inaccessible until declared clean.
- Enforce file type, size and signature checks plus explicit policy for password-protected files, macros and archives.
- Select the exact malware-scanning engine through a later implementation decision.

### 16.2 Notifications

**Status:** Confirmed architecture; provider deferred  
**Timing:** Feature

- Business notifications use a central queued provider adapter.
- Firebase continues to deliver authentication messages.
- Notifications contain minimal information and link users back to the authorised portal.
- Sending is idempotent.
- Staging has safe recipient controls.
- Notification logs exclude message bodies and sensitive content.
- Select the business email/SMS provider when delivery requirements are known.

## 17. Observability, reliability and recovery

### 17.1 Observability

**Status:** Confirmed  
**Timing:** Foundation

- Begin with Google Cloud Logging, Monitoring, Trace and Error Reporting.
- Keep instrumentation OpenTelemetry-compatible.
- Add Sentry, Datadog or another external platform only if specific gaps justify the additional data processor and cost.

### 17.2 Service levels and incidents

**Status:** Confirmed internal targets  
**Timing:** Production

- Target 99.9% availability for critical user journeys as an internal SLO, not an external SLA.
- SEV1: outage, breach, data loss or cross-client exposure; 30-minute response including after hours.
- SEV2: serious degradation; one business-hour response.
- SEV3: normal defect; one business-day response.
- SEV4: backlog prioritisation.
- Operate normal business-hours support with a narrow SEV1 duty contact.

### 17.3 Backup and recovery

**Status:** Confirmed initial targets  
**Timing:** Production

- Regional HA aims for approximately five-minute recovery from a zone or instance failure.
- Point-in-time recovery targets an RPO no greater than five minutes for accidental change or corruption.
- Major restore RTO target: four hours.
- Initial PITR window: seven days.
- Daily backup retention: 30 days.
- Final backup retention on controlled decommission: 30 days unless the retention register requires otherwise.
- Test restore before launch and quarterly thereafter.
- Do not initially run a live cross-region database replica.
- Maintain an encrypted off-region recovery copy and measure/accept a separate regional-loss recovery target.
- Add a cross-region replica when contractual obligations or measured business impact justify it.

### 17.4 Customer-managed encryption keys

**Status:** Confirmed for production  
**Timing:** Foundation and production

- Use CMEK for production Cloud SQL and Confidential/Restricted GCS or off-region copies where supported.
- Lower environments use Google-managed encryption unless a production-equivalent test requires CMEK.
- BIG's governance boundary controls production keys; developers receive narrow usage permissions and no key-destruction rights.
- Separate KMS responsibilities, enable audit logging and rotation, prevent accidental destruction and require dual approval for destructive key operations.
- Use region-appropriate keys.
- Cloud SQL CMEK must be decided and configured at instance creation.

## 18. Git and release governance

### 18.1 Pull requests

**Status:** Confirmed  
**Timing:** Foundation

- The department Git Workflow SOP remains authoritative.
- Protect integration and release branches and require applicable CI checks.
- The Tech Lead is the pull-request approval and merge gatekeeper. Every pull request requires review and applicable CI checks before merge.
- For a self-authored low-risk pull request, the Tech Lead may complete the required self-review and merge after the required CI checks succeed, or may request another qualified reviewer when useful. GitHub may not treat an author's review as formal approval, so repository rules must implement this gatekeeper exception carefully without weakening the high-risk rule below.
- Independent qualified review is mandatory for self-authored changes involving authentication/MFA, authorisation/RLS, redaction or trust-zone isolation, production IAM/KMS/networking, destructive migrations, audit/privacy controls, secrets or deployment permissions.
- A SEV1 emergency may allow self-merge with recorded reason, checks where possible, active monitoring and retrospective review by the next business day.

### 18.2 Release flow

**Status:** Confirmed  
**Timing:** Foundation

```text
feature preview
→ develop integration
→ alpha staging
→ beta client UAT
→ optional release candidate
→ stable after production approval
```

- Client UAT sign-off does not automatically approve production deployment.
- The October acceptance baseline covers connected J0–J5 workflows.
- Selected J6 components are conditional parallel scope and remain safely disabled if incomplete.

### 18.3 Preview environments

**Status:** Confirmed  
**Timing:** Foundation

- Every pull request receives CI/build/test feedback and a lightweight UI preview where useful.
- Create a full isolated preview environment on demand for significant or risky changes.
- Maintain a persistent develop integration environment.
- Preview environments use synthetic restricted data and expire automatically.
- A full preview receives a separate temporary PostgreSQL database on a shared non-production Cloud SQL instance, all required schemas/migrations, synthetic seeds and distinct roles.
- Enforce pool limits and automatic teardown.

## 19. Architecture governance

### 19.1 ADR process

**Status:** Confirmed  
**Timing:** Foundation

- Record consequential, expensive-to-reverse decisions as sequential ADRs under `docs/architecture/decisions/`.
- ADRs are immutable after acceptance; a later ADR supersedes an earlier one.
- The lightweight template includes context, decision, alternatives, consequences, security/privacy, operations, migration and review trigger.
- This consolidated register is not a substitute for detailed ADRs where implementation consequences require them.

### 19.2 Stop rule for architecture questions

**Status:** Confirmed by checkpoint approach  
**Timing:** Immediate

- Decide before scaffolding only matters that affect security, data ownership, system boundaries, repository structure, contract foundations, infrastructure foundations or expensive-to-reverse choices.
- Decide feature-specific matters immediately before implementing the feature.
- Defer reversible choices until evidence is available.
- Record deferred matters rather than extending the pre-build questionnaire indefinitely.

### 19.3 Checkpoint acceptance

**Status:** Confirmed  
**Timing:** Immediate

- The project owner accepted this register as the governing NorthStar architecture checkpoint on 27 August 2026.
- Acceptance settles entries marked Confirmed and authorises creation of the foundation ADRs and controlled repository scaffolding.
- Acceptance does not promote Provisional or Deferred entries. Their existing validation requirements and triggers remain in force.
- A Confirmed entry may be reopened only when a concrete conflict is identified with a higher-authority source or it is superseded through the approved ADR process.

## 20. Data representation and identifiers

### 20.1 Dates, time, locale and money

**Status:** Confirmed  
**Timing:** Foundation

- Store timestamps as timezone-aware UTC values and exchange them using unambiguous ISO 8601 representations.
- Display operational dates and times using `Africa/Johannesburg` and `en-ZA` defaults.
- Model date-only business values separately from instants/timestamps.
- Store money using exact decimal values or integer minor units, always with an ISO 4217 currency code such as `ZAR`.
- Normalise telephone numbers to international format where possible.
- Keep display formatting locale-ready for future expansion.

### 20.2 Identifiers

**Status:** Confirmed  
**Timing:** Foundation

- Use immutable, opaque, backend-generated UUIDs as technical identifiers.
- Use separate human-readable reference codes where staff need to search, communicate or transcribe a reference.
- BIG and InfluenceHub share the same canonical project, influencer and other shared-entity IDs.
- Never expose sequential database identifiers as public resource identifiers.
- Identifiers contain no names, email addresses or other personal information.
- Human-readable codes are display/search references, not relational primary keys.
- External identifiers such as Firebase UIDs, survey references, courier IDs or provider IDs are stored as provider- and context-scoped mappings, not as BIG primary keys.
- Public client-review identifiers are unguessable, but possession of an identifier never replaces authentication and authorisation.
- Identifiers remain stable if names, titles or organisations change.
- Select and record the exact UUID version during schema implementation; the opaque, immutable identifier boundary is the governing decision.

## 21. Decisions required before scaffolding

The following foundation decisions are sufficiently confirmed to begin formal architecture documentation and controlled scaffolding after this register is verified:

- Repository identity, top-level ownership and application boundaries.
- Separate staff and client-review deployments.
- BIG/InfluenceHub domain ownership and integration direction.
- Identity zones, Firebase/TOTP strategy and authorisation model.
- PostgreSQL/schema ownership and migration governance.
- API contract lifecycle and generation direction.
- Next.js/Node, Python/FastAPI, pnpm/Turborepo and `uv` targets.
- Cloud Run, Cloud SQL, Terraform, GCP environment naming and regional direction.
- Baseline testing, security, privacy and Git governance.

Before framework scaffolding, create or approve the first ADR set, verify version compatibility and write the initial BIG Frontend Architecture and Development Standards.

## 22. Deferred or implementation-triggered decisions

The following are intentionally not blockers for initial scaffolding:

| Decision | Trigger |
|---|---|
| Organisation SSO | Enterprise requirement or staff identity-management need. |
| Remote Turborepo cache | CI duration or developer feedback demonstrates value. |
| Redis/shared cache | Measured database, rate-limit or distributed-state requirement. |
| PgBouncer | Connection pressure cannot be handled safely through bounded pools and scaling. |
| Async SQLAlchemy | Profiling demonstrates a concurrency benefit that exceeds complexity cost. |
| SSE | Polling fails measured freshness, cost or scale requirements. |
| WebSockets | A genuine bidirectional real-time use case emerges. |
| External search service | PostgreSQL search cannot meet measured scale or relevance requirements. |
| Pub/Sub | A single event needs true independent fan-out consumers. |
| External observability provider | GCP-native tooling has a documented capability gap. |
| Feature-flag SaaS | Internal flag governance no longer meets operational needs. |
| Cross-region live database replica | Contractual or measured regional-outage impact justifies it. |
| Business notification provider | Channel, volume, deliverability and residency requirements are confirmed. |
| Malware-scanning engine | File types, throughput and operating model are confirmed. |
| Exact field-level encryption list | Data inventory and privacy assessment classify specific fields as Restricted. |
| Exact retention periods | Business/legal purpose and statutory requirements are approved. |
| Exact UUID version | Initial schema implementation and supported database/application libraries are validated. |

## 23. Initial ADR set

Create the following ADRs before or alongside scaffolding. Related confirmed decisions may be grouped where that produces a clearer record.

1. Repository ownership and CS/BIG package licensing boundary.
2. Separate staff and client-review frontend applications/deployments.
3. BIG and InfluenceHub domain ownership, shared database and integration pattern.
4. Firebase identity zones, TOTP MFA, sessions and identity propagation.
5. Hybrid RBAC/ABAC authorisation and selective PostgreSQL RLS.
6. Contract register, FastAPI/OpenAPI authority and TypeScript generation.
7. Polyglot monorepo tooling and pinned runtime versions.
8. PostgreSQL version, schema ownership, migrations and connection strategy.
9. GCP project/environment topology, primary/secondary region and private networking.
10. Transactional outbox, Cloud Tasks and cross-region queue handling.
11. Data classification, retention, telemetry and privacy-request controls.
12. Testing, coverage, CI and release-quality gates.
13. Production encryption, KMS ownership, backup and disaster recovery.

## 24. Post-acceptance verification checklist

Acceptance establishes the governing baseline. The following evidence checks remain required at their stated implementation or production trigger and may produce a superseding ADR or correction if a higher-authority conflict is found:

- [ ] Verify that BIG and InfluenceHub responsibilities are accurately stated.
- [ ] Verify that no freelancer access to BIG is implied anywhere.
- [ ] Verify BIG/CS intellectual-property wording against the commercial agreement.
- [ ] Verify application and GCP project names.
- [ ] Verify identity-zone and client-review authentication decisions.
- [x] Verify the initial Next.js, Node.js, Python and PostgreSQL foundation versions against supported releases and core dependencies. **Validated 27 August 2026; recheck during dependency locking and container build.**
- [x] Verify Johannesburg/Belgium Cloud Tasks and Cloud Scheduler availability. **Validated 27 August 2026.**
- [ ] Complete the Johannesburg/Belgium data-transfer, subprocessors and POPIA Section 72 privacy assessment before production use.
- [ ] Confirm that internal targets are not presented externally as contractual SLAs.
- [ ] Confirm ADR owners and formally review each Proposed ADR at its trigger. **ADRs 0002, 0006, 0007, 0008 and 0012 accepted 27 August 2026; ADR 0014 accepted 30 August 2026; eight ADRs remain Proposed.**
- [x] Transfer accepted decisions into the NorthStar project seed. **Completed 27 August 2026.**
- [ ] Transfer accepted decisions into the frontend standards and API contract register where applicable. **Frontend standard accepted 27 August 2026; Proposed API contract register drafted 27 August 2026, with contract confirmation still pending.**

### 24.1 Foundation evidence references

Evidence reviewed on 27 August 2026:

- [Cloud Tasks locations](https://cloud.google.com/tasks/docs/locations)
- [Cloud Scheduler locations](https://cloud.google.com/scheduler/docs/locations)
- [Cloud SQL for PostgreSQL versions](https://cloud.google.com/sql/docs/postgres/db-versions)
- [Node.js release status](https://nodejs.org/en/about/previous-releases)
- [Python 3.14.7 release](https://www.python.org/downloads/release/python-3147/)
- [Next.js 16.3 release](https://nextjs.org/blog/next-16-3) and the current patched package release
- Python package metadata for [FastAPI](https://pypi.org/project/fastapi/), [SQLAlchemy](https://pypi.org/project/SQLAlchemy/), [Psycopg](https://pypi.org/project/psycopg/) and the [Cloud SQL Python Connector](https://pypi.org/project/cloud-sql-python-connector/)

## 25. Recommended next sequence

1. ~~Review and accept or correct this checkpoint.~~ **Completed 27 August 2026.**
2. ~~Mark the register as Accepted checkpoint with approver and date.~~ **Completed 27 August 2026.**
3. ~~Create the first foundation ADRs.~~ **Repository-ready Proposed ADR pack completed 27 August 2026; formal acceptance remains pending.**
4. ~~Update the NorthStar project seed to distinguish Confirmed, Provisional, Deferred and Open decisions.~~ **Completed 27 August 2026.**
5. Write the BIG Frontend Architecture and Development Standards.
6. Create the API contract register template and first J0–J1 entries.
7. Validate runtime/framework versions and GCP service compatibility.
8. Scaffold the repository, quality controls and environments.
9. Begin release-critical vertical slices from confirmed contracts.

---

### Future-conversation handoff

Use the following instruction when continuing in a new conversation:

> Continue the NorthStar architecture and implementation work using the attached NorthStar Architecture Decision Register. Treat entries marked Confirmed as settled unless you identify a concrete conflict with a higher-authority source. Preserve Deferred items unless their stated trigger has occurred. Ask only unresolved, implementation-blocking questions, one at a time, and record any new decision back into the register.
