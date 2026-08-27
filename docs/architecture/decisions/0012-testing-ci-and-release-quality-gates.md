# ADR 0012: Testing, CI and release-quality gates

- **Status:** Accepted
- **Date:** 27 August 2026
- **Accepted:** 27 August 2026 by Mkhuphuli, Tech Lead
- **Decision owner:** Tech Lead
- **Reviewers:** QA lead; security owner; DevOps lead; product owner
- **Source:** Accepted NorthStar Architecture Decision Register, sections 12 and 18

## Context

NorthStar will be built by a bottom-heavy team and includes security-sensitive, multi-tenant workflows. Fast feedback, qualified review and explicit delivery completion are needed without treating every local check as a full release gate.

## Decision

Use Vitest for TypeScript unit tests, React Testing Library for components, Playwright for end-to-end tests and pytest for Python. Database tests use temporary real PostgreSQL, never SQLite substitutes. Contract verification covers OpenAPI and generated frontend clients.

New or changed handwritten logic targets at least 80% branch coverage, including meaningful failure and security outcomes. Repository coverage does not regress without an approved exception. Generated code, migrations and configuration-only files may be excluded with rationale.

Pre-commit runs formatting, linting and secret detection. Pre-push runs affected unit/component tests, type checks, Python checks and changed-code coverage. Full CI is authoritative and runs the required complete suite. TypeScript uses strict mode, Prettier and type-aware ESLint; Python uses Ruff and strict mypy.

The Tech Lead is the pull-request approval and merge gatekeeper. Every pull request requires review and protected-branch checks. For a self-authored low-risk pull request, the Tech Lead may complete the required self-review and merge after CI succeeds, or may request another qualified reviewer when useful. Independent qualified review is mandatory for self-authored authentication, authorisation/RLS, redaction/trust-zone isolation, production IAM/KMS/networking, destructive migrations, audit/privacy controls, secrets or deployment-permission changes. SEV1 exceptions require reason, monitoring and retrospective next-business-day review. Repository rules must preserve this distinction even where GitHub does not treat an author's review as formal approval.

Release flow is feature preview → develop integration → alpha staging → beta client UAT → optional release candidate → stable after production approval. Merge is not release; client UAT is not production approval. Monday.com governs delivery status only.

## Alternatives considered

- Full suite on every local commit: rejected because feedback would be too slow.
- Coverage percentage without branch/security expectations: rejected because it can reward shallow tests.
- Unrestricted senior self-merge: rejected for high-risk boundaries.
- Treat UAT approval as deployment approval: rejected because operational/security readiness is separate.

## Consequences

CI and preview infrastructure require investment, but quality rules are predictable for junior and senior contributors.

## Security and privacy

Use synthetic preview data, secret scanning and negative security tests. Preview environments expire automatically and have isolated temporary databases.

## Operations and migration

Implement checks incrementally but make required gates active before protected branches receive production-bound code.

Until the private organization repository is upgraded to a GitHub plan that supports the required branch rules, the Tech Lead manually enforces pull-request review, passing checks and independent qualified review for high-risk self-authored changes. This temporary limitation does not weaken the policy and must be replaced with repository enforcement after the upgrade.

## Acceptance checks

- After the GitHub plan upgrade, map every required check to branch rules and verify the resulting enforcement.
- Until automated rules are available, record manual high-risk independent-review evidence on each affected pull request.
- During application scaffolding, activate application-specific formatting, typing, testing and coverage gates; code-complete and delivery-complete expectations are already documented.
- Before pre-release approval, run the applicable browser and accessibility suites.

## Review triggers

Review when CI duration, escape defects, security findings or team capacity show that the gate set is ineffective or disproportionate.
