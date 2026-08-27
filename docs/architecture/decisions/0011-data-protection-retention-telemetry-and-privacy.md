# ADR 0011: Data protection, retention, telemetry and privacy requests

- **Status:** Proposed
- **Date:** 27 August 2026
- **Decision owner:** BIG privacy owner
- **Reviewers:** Security owner; data architect; BIG and InfluenceHub leads
- **Source:** Accepted NorthStar Architecture Decision Register, section 8

## Context

BIG and InfluenceHub process personal and potentially restricted information across a shared lifecycle. Privacy controls must coordinate the canonical subject while preserving domain ownership and operational evidence.

## Decision

Classify data as Public, Internal, Confidential or Restricted. Maintain a purpose-based retention register; exact periods remain intentionally unresolved until business and legal approval. Automate deletion or de-identification where practical. Legal holds suspend normal deletion, backups age out on their approved schedule, and required deletions are re-applied after restore.

Coordinate privacy requests across BIG and InfluenceHub using identity verification, impact preview, approval, idempotent execution and an audit record that does not retain deleted personal content.

Record consent in an immutable purpose-specific ledger with a current-state projection, including source, evidence, wording/version and withdrawal. External survey systems must provide verifiable consent evidence; submission existence alone is not consent.

Logs, traces, analytics and error reporting use explicit field allowlists. Never log bodies, tokens, cookies, survey answers, internal notes or unrestricted CRM content. Correlation IDs cross frontends, BFFs, APIs, tasks and scheduled jobs.

Use field-level envelope encryption only for fields classified Restricted after inventory and privacy assessment. Minimise the data first. Use synthetic non-production data by default; production-shaped data requires approved repeatable anonymisation.

Distinguish change logs from audit logs and link them where both exist. Client timelines are purpose-built projections, not the internal audit trail.

## Alternatives considered

- Fixed retention periods chosen by engineering: rejected because purpose and legal authority are required.
- Blanket field encryption: rejected because it adds complexity without classification-based value.
- Copy production data to development: rejected because exposure risk is unacceptable.
- Per-system uncoordinated privacy requests: rejected because canonical subjects span both domains.

## Consequences

Data inventory, retention automation and privacy orchestration are first-class work. Some exact controls remain triggered by approved classification evidence.

## Security and privacy

Privacy action approvals, legal holds and production access are audited. Normal support uses controlled interfaces; direct production access is individual, time-bound and approved.

## Operations and migration

Build classification metadata, consent ledger, retention register and privacy-workflow state before production. Test restore-and-redelete behaviour.

## Acceptance checks

- Complete the data inventory and formal POPIA impact assessment.
- Approve retention periods and Restricted-field list.
- Test cross-domain privacy requests and legal holds.
- Verify telemetry allowlists with automated tests.

## Review triggers

Review for new data purposes, legal/contractual changes, new processors or classification of additional Restricted fields.

