# ADR 0001: Repository ownership and package licensing boundary

- **Status:** Proposed
- **Date:** 27 August 2026
- **Decision owner:** Project owner
- **Reviewers:** Commercial/legal representative; senior technical lead
- **Source:** Accepted NorthStar Architecture Decision Register, sections 5 and 19

## Context

NorthStar combines BIG-owned applications and business-specific packages with selected reusable technical components owned by Conversion Science (CS). Repository placement must support development without silently changing legal ownership or allowing BIG confidential logic to enter reusable CS packages.

## Decision

Use a BIG-owned monorepo named `northstar` with top-level directories `apps/`, `big-packages/`, `cs-packages/`, `docs/` and `infrastructure/`.

BIG owns assembled applications under `apps/big-*` and BIG-specific packages under `big-packages/*`. CS owns purpose-specific reusable packages under `cs-packages/*` and licenses them for use within BIG, subject to the executed commercial agreement.

Do not initially create generic `@big/core` or `@cs/shared` packages. Admit a CS package only when it has a clear reusable responsibility, public API, tests, documentation and an ownership/licensing notice. CS packages must contain neither BIG confidential data nor BIG-specific business rules. Directory placement is evidence of intended organisation, not the legal source of ownership.

## Alternatives considered

- Separate repositories for every application and package: rejected initially because coordinated contracts and delivery would become harder.
- One undifferentiated shared-package area: rejected because ownership and reuse boundaries would be ambiguous.
- Treat every repository artifact as BIG-owned: rejected because it conflicts with the intended reusable CS component model.

## Consequences

Ownership is visible in the repository and package admission is deliberate. Cross-boundary changes require appropriate review. Some duplication is preferable to prematurely extracting an unclear shared abstraction.

## Security and privacy

Package reviews must prevent BIG confidential data, credentials, personal data and business-specific authorisation rules from entering reusable CS packages.

## Operations and migration

Add CODEOWNERS rules and package metadata after repository creation. Any pre-existing reusable component must be classified before import.

## Acceptance checks

- Verify wording against the executed commercial agreement.
- Assign legal/commercial and technical reviewers.
- Confirm package naming and licensing notices.

## Review triggers

Supersede this ADR if the commercial agreement changes, ownership of a package is disputed, or a separate-repository model becomes necessary.

