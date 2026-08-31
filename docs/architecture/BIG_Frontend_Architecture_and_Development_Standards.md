# BIG Frontend Architecture and Development Standards

**Project:** BIG Platform / Project NorthStar
**Status:** Accepted
**Date:** 27 August 2026
**Accepted:** 27 August 2026 by Mkhuphuli, Tech Lead
**Owner:** Frontend lead
**Reviewers:** Tech Lead; backend lead; security owner; QA lead; product owner
**Authority:** Accepted NorthStar Architecture Decision Register and applicable Accepted ADRs

## 1. Purpose

This standard defines how NorthStar frontend code is structured, secured, tested and delivered. It applies to the staff and client-review Next.js applications and to frontend-facing BIG packages.

This document does not override the authority hierarchy in the NorthStar Architecture Decision Register. Confirmed decisions are mandatory. Deferred decisions remain deferred until their recorded trigger occurs. Feature-specific details are decided through the contract register and normal review when implementation reaches that feature.

## 2. Architecture principles

1. Preserve trust boundaries before optimizing reuse.
2. Keep business rules and authoritative authorization in FastAPI.
3. Make data disclosure explicit through purpose-built contracts.
4. Prefer Server Components and server-side data handling unless browser interactivity requires a Client Component.
5. Keep features cohesive and expose explicit public interfaces.
6. Generate API contracts; do not maintain parallel handwritten transport types.
7. Fail closed at identity, authorization and disclosure boundaries.
8. Treat accessibility, observability, tests and deployability as delivery requirements.
9. Keep reversible implementation detail close to the feature that needs it.
10. Do not activate Deferred infrastructure or libraries without their recorded evidence trigger.

## 3. Application and trust boundaries

NorthStar has two independent frontend applications:

```text
apps/
├── big-staff-frontend/
└── big-client-review/
```

### 3.1 Staff frontend

`big-staff-frontend` serves authorized internal staff. It uses normal business routes without a redundant `/staff` prefix. Its initial capability areas include clients, brands, projects, recruitment, filtering, survey operations and ingestion, customer relationship management (CRM) profiles, vetting, internal approval, fulfilment, moderation summaries and audit/change history.

### 3.2 Client-review frontend

`big-client-review` serves invited client reviewers through dedicated routes such as `/reviews/{review_id}`. It receives only client-safe data transfer objects (DTOs) and operations appropriate to the invitation and review scope.

It must never receive:

- complete internal candidate records;
- internal comments or unrestricted CRM data;
- unvetted candidates;
- AI diagnostics or validator rules;
- Influencer Community Management (ICM) notes;
- other projects or client accounts; or
- internal workflow controls.

### 3.3 Separation requirements

The applications have separate:

- deployments and domains;
- Firebase projects per environment;
- sessions and cookies;
- backend-for-frontend (BFF) boundaries and middleware;
- backend services;
- Cloud Armor policies;
- Content Security Policies (CSPs); and
- staff and client-review OpenAPI specifications.

They do not share a runtime, session or middleware boundary. Shared packages may provide contracts and visual consistency, but may not collapse the trust boundary. Neither application embeds the other with an iframe.

## 4. Route and rendering architecture

Use the Next.js App Router.

### 4.1 Server Components by default

Components remain Server Components unless they require browser-only behavior such as:

- event handlers;
- local interactive state;
- effects or browser APIs;
- client-side form interaction;
- TanStack Query hooks; or
- a third-party browser library that cannot run safely on the server.

Fetch initial data and construct page composition on the server where this reduces browser exposure and client JavaScript. Pass only the minimum serializable, authorized data required by a Client Component.

### 4.2 Client Components

Place `"use client"` at the smallest practical interactive boundary. Do not mark an entire route or layout as client-side merely because one nested control is interactive.

Client Components must not:

- contain authoritative business authorization;
- hide sensitive fields as a substitute for backend filtering;
- access backend service credentials;
- write directly to FastAPI when the BFF boundary is required; or
- create a second transport or domain model independent of generated contracts.

### 4.3 Route handlers and server actions

Route handlers may implement the limited BFF responsibilities defined below. Server Actions may be used only when they preserve the same BFF, CSRF, authorization, contract and observability requirements. Their convenience does not authorize business logic in Next.js.

## 5. Feature organization

Each application owns only features appropriate to its trust zone. A feature uses only the directories it needs:

```text
src/features/{feature}/
├── api/
├── components/
├── hooks/
├── schemas/
├── types/
├── utils/
├── tests/
└── index.ts
```

`index.ts` is optional. If present, it defines the feature's public interface. Package export mappings may provide the same boundary.

Rules:

- Cross-feature deep imports are prohibited.
- A feature imports another feature only through its explicit public interface.
- Feature-private components and utilities remain inside the feature.
- Application-wide infrastructure must have a narrow, named responsibility.
- Do not create generic `utils`, `common`, `core` or `shared` dumping grounds.
- Low-level UI enters `@big/design-system` only after genuine reuse and ownership are demonstrated.
- Do not create `@big/core` or `@cs/shared`.

## 6. TypeScript and component standards

- Enable strict TypeScript.
- Do not use `any` without a documented, reviewed boundary reason.
- Prefer `unknown` with explicit narrowing for untrusted input.
- Model impossible states out where practical using discriminated unions.
- Keep transport, domain-view and form types distinct when their responsibilities differ.
- Derive transport types from generated OpenAPI artifacts.
- Do not use non-null assertions to bypass a missing-state decision.
- Components have one clear responsibility and explicit props.
- Prefer composition over mode-heavy components with many unrelated boolean props.
- Use semantic HTML before adding Accessible Rich Internet Applications (ARIA) attributes.
- Do not introduce module-level mutable state for request- or user-specific data.
- Never place secrets, unrestricted personal data or authoritative permissions in client bundles.

Formatting uses Prettier. Linting uses type-aware ESLint with Next.js rules. Generated artifacts are excluded only with a documented reason and are never edited manually.

## 7. State management

### 7.1 Server state

Use TanStack Query v5 for client-side server state. Query keys must be stable, structured and scoped by every input that changes the result. They must not contain secrets or unrestricted personal data.

Feature hooks call the BFF, not private FastAPI endpoints directly. Configure stale time, retry, refetch and invalidation intentionally for the workflow rather than using one global behavior for every query.

Mutations must:

- expose pending, success and failure states;
- use idempotency keys where the contract requires them;
- preserve ETag/`If-Match` concurrency behavior;
- surface 412 conflicts for explicit user resolution;
- avoid optimistic updates where rollback could misrepresent a decisive workflow state; and
- invalidate or update only the affected authorized queries.

Do not introduce Redis or another shared cache initially. Browser/TanStack Query caching, safe HTTP caching, ETags, projections and database indexes are the starting tools.

### 7.2 Local UI state

Use component state for transient presentation state. Lift state only to the nearest common owner. A global client-state library requires a concrete cross-feature need and a reviewed decision; it is not part of the foundation baseline.

### 7.3 URL state

Use URL state for safe, shareable navigation and filtering when appropriate. Do not put personal information, secrets or sensitive internal criteria in query parameters captured by telemetry.

## 8. Forms and validation

Use React Hook Form with Zod 4 for interactive forms.

- Client validation improves feedback but never replaces FastAPI validation.
- Schemas distinguish absent, empty, invalid and intentionally cleared values.
- Server errors use stable application codes and safe field details from RFC 9457 Problem Details.
- Preserve user input after recoverable errors.
- Focus and announce validation summaries accessibly.
- Disable duplicate submission while retaining idempotency protection server-side.
- Sensitive actions require recent authentication according to the session policy.
- Confirmation UI must reflect the consequence and scope of destructive or decisive actions.

Do not infer business authorization from form options rendered in the browser. FastAPI revalidates every submitted identifier and transition.

## 9. BFF boundary

Each Next.js application has its own limited BFF. It may handle:

- server-issued session cookies;
- identity and session verification;
- workload authentication to the private backend;
- CSRF protection and request controls;
- safe request and response validation;
- correlation identifiers;
- safe error normalization;
- appropriate cache headers;
- selected rate controls; and
- preventing backend internals from reaching the browser.

The BFF must not own:

- business workflow state machines;
- business authorization policy;
- authoritative filtering, search or counts;
- deduplication or survey ingestion;
- vetting, selection or approval rules;
- database access;
- audit integrity; or
- client-safe DTO construction.

FastAPI remains the authoritative business backend. The BFF is not a second backend.

## 10. Authentication, sessions and request protection

### 10.1 Staff

- Firebase Authentication with Identity Platform capabilities.
- Dedicated staff Firebase project per environment.
- Mandatory time-based one-time password (TOTP) authenticator-app multi-factor authentication (MFA).
- `HttpOnly`, `Secure` session cookie.
- Initial 30-minute inactivity and 10-hour absolute session limits.

### 10.2 Client review

- Separate client-review Firebase project per environment.
- Invite-only passwordless one-time password (OTP) or magic-link authentication.
- Separate cookie and session boundary.
- Initial 30-minute inactivity and 4-hour absolute session limits.

### 10.3 Common controls

- Never store ID tokens in browser local storage.
- Apply explicit Cross-Site Request Forgery (CSRF) tokens plus Origin/Referer, content-type and unsafe-method controls.
- Require authentication no older than 15 minutes for sensitive actions.
- Never trust browser-supplied roles, organization IDs or project IDs.
- Identity proves the subject; PostgreSQL-backed assignments authorize business access.
- Reject identities from the freelancer trust zone before business authorization.
- Avoid logging tokens, cookies, OTPs or request/response bodies.

## 11. API contracts and errors

Use the contract lifecycle:

```text
Proposed/Confirmed contract register
→ FastAPI and Pydantic implementation
→ versioned OpenAPI
→ generated TypeScript types/client
→ automated verification
```

- Maintain separate staff and client-review OpenAPI documents.
- Generate types with `openapi-typescript`.
- Generate the request client with `openapi-fetch`.
- Server/BFF code consumes generated clients.
- Feature TanStack Query hooks call BFF operations.
- Never manually edit generated code.
- Continuous integration (CI) fails when generated artifacts are stale.
- Use `/api/v1` major URL versioning.
- Version domain events independently from HTTP APIs.

Errors use RFC 9457 Problem Details with a stable application error code, correlation ID and safe validation information. Do not expose stack traces, infrastructure identifiers, unrestricted record content or internal authorization reasoning.

## 12. Concurrency and idempotency

- Important creates and actions require `Idempotency-Key` where specified by contract.
- Multi-user updates use ETags and `If-Match`.
- Treat 412 as a user-resolvable stale-state conflict.
- Treat 428 as a missing required precondition.
- Never silently overwrite a conflicting update.
- Decisive cross-platform actions revalidate against the authoritative domain instead of trusting a potentially stale projection.

## 13. Accessibility and responsive behavior

Both applications target WCAG 2.2 AA.

- All functionality is keyboard operable.
- Focus order and focus restoration are deliberate.
- Errors, loading states and status changes are announced appropriately.
- Labels, instructions and error associations are programmatic.
- Color is not the sole indicator of meaning.
- Respect contrast and reduced-motion preferences.
- Tables provide headers and responsive alternatives where needed.
- Dialogs manage focus, escape behavior and background interaction correctly.
- Authentication and timeout flows remain accessible.

Browser support:

- Staff: current and previous Chrome and Edge desktop releases; essential workflows remain usable on tablets.
- Client review: current and previous Chrome, Edge, Firefox and Safari desktop releases, plus modern iOS Safari and Android Chrome.
- Pull requests test Chromium; pre-release suites cover Chromium, Firefox and WebKit.

## 14. Testing standards

- TypeScript unit tests use Vitest.
- Components use React Testing Library.
- End-to-end tests use Playwright.
- New or changed handwritten logic targets at least 80% branch coverage.
- Repository coverage must not regress without an approved exception.
- Test meaningful success, failure, empty, loading, concurrency and security outcomes.
- Prefer behavior and accessible-role assertions over implementation-detail assertions.
- Contract verification covers OpenAPI and generated clients.
- Negative tests prove client/internal-field isolation and cross-scope denial.
- Use synthetic data in tests and previews.

Generated code, migrations and configuration-only files may be excluded from coverage with a recorded rationale. A percentage does not replace meaningful assertions.

## 15. Observability and safe telemetry

- Propagate a correlation ID through browser-visible errors, BFF requests and backend calls.
- Use explicit telemetry field allowlists.
- Never log bodies, tokens, cookies, survey answers, internal notes or unrestricted CRM content.
- Do not put personal information in URLs, analytics labels or metric dimensions.
- Record safe operation names, outcomes, latency and stable error codes.
- Client-visible error messages are actionable without revealing internal security detail.
- Google Cloud Platform (GCP)-native observability is the initial baseline. An external provider remains Deferred until a documented gap exists.

## 16. Feature flags

Use backend-governed flags for incomplete or conditional behavior.

- Unsafe or incomplete behavior defaults off.
- Shared environments configure values explicitly.
- Test enabled and disabled behavior.
- Flags never bypass authentication or authorization.
- Disabled endpoints fail safely.
- Release manifests record required values.
- Remove obsolete flags through a separate reviewed change.
- Flags are temporary controls, not substitutes for completing or removing behavior.

An external feature-flag provider remains Deferred until internal governance is inadequate.

## 17. Security headers and browser controls

- Each frontend has its own strict CSP using nonces or hashes where appropriate.
- Apply HTTP Strict Transport Security (HSTS) and appropriate security headers at the frontend or edge boundary.
- Staff and client frontends use separate cookies with the narrowest domain and path practical.
- Authenticated responses default to private/no-store unless an explicit safe caching design permits otherwise.
- Do not expose direct private-backend addresses or credentials to the browser.
- Validate upload type and size before transfer, while authoritative malware and content validation remains server-side.
- Avoid dangerous HTML injection. Any exceptional rich-content rendering requires sanitization and security review.

## 18. Performance and data access

- Cursor pagination is the default, initially 25 items with a maximum of 100 unless feature evidence changes it.
- Offset pagination requires a documented small, stable-list reason.
- Authorization is applied before search results, counts and pagination metadata are returned.
- Avoid request waterfalls by composing server data needs and prefetching intentionally.
- Keep client bundles small by limiting Client Component boundaries and third-party code.
- Use images, fonts and dynamic imports intentionally and measure material routes.
- Polling is the initial freshness mechanism where needed. Server-Sent Events (SSE) and WebSockets remain Deferred until their recorded triggers occur.

## 19. Design-system admission

`@big/design-system` is the initial location for genuinely reused BIG-owned visual primitives and tokens. Admission requires:

- use by more than one appropriate consumer or a clear platform-wide requirement;
- accessible behavior and tests;
- documented API and examples;
- no application business logic;
- no trust-zone-specific data behavior; and
- reviewed ownership.

Accepted ADR 0014 establishes Tailwind CSS v4 as the primary styling framework and semantic CSS custom properties as the stable application-facing token interface. Primitive tokens may support semantic tokens but are not normally consumed directly by feature code.

Use CSS Modules only where component-specific complexity is clearer than Tailwind utilities, and require them to consume the same semantic tokens. Radix Primitives may be adopted selectively for complex interactive controls, but NorthStar must still verify WCAG 2.2 AA behavior.

Runtime CSS-in-JS libraries and opinionated visual component suites are not part of the foundation baseline. shadcn/ui patterns require individual provenance, licensing, token, accessibility and test review. Add class-composition, variant and Tailwind class-formatting helpers only when their implementation need occurs. The baseline permits future theming without committing NorthStar to dark mode or multi-tenant branding.

## 20. Quality gates and delivery

Before review, run applicable formatting, linting, type, unit/component and changed-code coverage checks. Full CI remains authoritative.

A frontend change is delivery-complete only when applicable requirements are satisfied:

- acceptance criteria and contracts;
- tests and coverage;
- accessibility;
- safe telemetry and correlation;
- authorization and disclosure tests;
- feature-flag behavior;
- documentation;
- deployment configuration; and
- rollback or disablement approach.

Normal pull requests follow the department Git SOP. The Tech Lead may self-review and merge a low-risk self-authored change after required checks pass. Self-authored high-risk authentication, authorization/RLS, redaction/trust-zone, production IAM/KMS/networking, destructive migration, audit/privacy, secret or deployment-permission changes require independent qualified review.

Merge does not equal release. Client UAT does not equal production approval. Release maturity follows preview → integration → alpha → beta → optional RC → stable after production approval.

## 21. Prohibited foundation choices

Do not introduce the following without their recorded trigger and review:

- organization single sign-on (SSO);
- remote Turborepo caching;
- Redis or another shared cache;
- PgBouncer;
- asynchronous SQLAlchemy;
- SSE or WebSockets;
- an external search service;
- Pub/Sub for point-to-point work;
- an external observability provider;
- an external feature-flag provider; or
- a generic `@big/core` or `@cs/shared` package.

## 22. Acceptance review

The acceptance review confirmed:

- application and trust-zone boundaries match the accepted register;
- no staff/client runtime or session sharing is implied;
- BFF responsibilities do not absorb business logic;
- authentication, CSRF and contract rules are implementable with the selected Next.js baseline;
- disclosure, accessibility, testing and release gates are sufficient;
- Deferred choices remain deferred; and
- the styling baseline is governed by Accepted ADR 0014 and preserves independent accessibility verification and staged design-system admission.

## 23. Review triggers

Review this standard when:

- an Accepted ADR changes a frontend boundary or baseline;
- a major Next.js or React migration changes rendering or request semantics;
- security testing finds a systemic browser/BFF weakness;
- accessibility testing finds a systemic component or workflow gap;
- generated contract tooling changes materially; or
- measured delivery evidence shows a rule is ineffective or disproportionate.
