# ADR 0003: BIG and InfluenceHub domain integration

- **Status:** Proposed
- **Date:** 27 August 2026
- **Decision owner:** Project owner
- **Reviewers:** BIG backend lead; InfluenceHub lead; data architect; security reviewer
- **Source:** Accepted NorthStar Architecture Decision Register, sections 4 and 7

## Context

BIG owns the operational lifecycle while InfluenceHub is the specialised content-review workroom. Both need consistent project and influencer identity without becoming competing sources of truth. Freelancers must remain isolated from BIG.

## Decision

BIG owns clients, influencer applications/profiles, project recruitment, accepted influencers, fulfilment, posting rules and final reporting. InfluenceHub owns social posts, moderation workflow and moderation decisions.

Use the same PostgreSQL infrastructure with domain-owned schemas, database identities, migrations and authoritative writers. Use canonical opaque IDs for shared projects, influencers and related entities. No application writes another domain's schema.

Use APIs for commands and authoritative current reads. Use transactional outbox records and versioned events for durable asynchronous propagation. Approved read-only views may support stable shared projections. Cross-platform projections normally become current within 60 seconds; decisive actions revalidate with the authoritative domain.

Posting rules are immutable and versioned. InfluenceHub receives the project, accepted influencers and applicable rule version when moderation is required. BIG receives client-safe moderation summaries, not ownership of the moderation state machine. Cross-domain status mappings are explicit and versioned.

Freelancers access InfluenceHub only. InfluenceHub never exposes BIG navigation to freelancers. Portals use secure deep links, not iframes.

## Alternatives considered

- Direct cross-schema writes: rejected because ownership and migrations become unsafe.
- Permanent dual-write: rejected because reconciliation failure becomes a normal operating mode.
- Independent duplicated IDs: rejected because lifecycle correlation becomes unreliable.
- Merge InfluenceHub into BIG immediately: rejected because it erases a valid specialised domain and expands freelancer access risk.

## Consequences

The shared database reduces unnecessary replication while domain permissions preserve boundaries. Integration code must handle eventual consistency, idempotency and explicit status mapping.

## Security and privacy

Database identities, API authorisation and projections must enforce freelancer isolation and least-privilege field exposure.

## Operations and migration

Migrate InfluenceHub through inventory, mapping, repeatable dry runs, snapshot-plus-delta or approved freeze, reconciliation, rollback window and read-only legacy retirement.

## Acceptance checks

- Approve the shared-entity ownership matrix.
- Confirm canonical identifier mappings.
- Approve initial event and status-mapping contracts.
- Threat-model freelancer and cross-client isolation.

## Review triggers

Supersede if domain ownership changes, permanent independent data infrastructure becomes mandatory, or measured integration requirements require a different pattern.

