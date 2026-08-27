# ADR 0006: API contract authority and TypeScript generation

- **Status:** Proposed
- **Date:** 27 August 2026
- **Decision owner:** Backend lead
- **Reviewers:** Frontend lead; QA lead; security reviewer
- **Source:** Accepted NorthStar Architecture Decision Register, sections 3 and 9

## Context

Backend and frontend teams need a single, reviewable contract lifecycle that prevents manually maintained TypeScript types from drifting from FastAPI behaviour. Staff and client-review surfaces require different disclosure boundaries.

## Decision

Use this authority chain:

`Proposed/Confirmed contract register → FastAPI/Pydantic implementation → versioned OpenAPI → generated TypeScript types/client → automated verification`.

The contract register governs a Proposed or Confirmed contract. Once implemented, versioned OpenAPI is the machine-readable authority. A contract is Verified when the register, OpenAPI, generated clients and automated checks agree.

Maintain separate staff and client-review OpenAPI specifications. Generate types with `openapi-typescript` and the request client with `openapi-fetch`. Server/BFF code consumes the generated client; feature-level TanStack Query hooks call the BFF boundary. Generated files are never edited manually.

Use `/api/v1`, compatible additive evolution and independently versioned domain events. Use RFC 9457 Problem Details with stable application codes and correlation IDs. Important create/action requests require `Idempotency-Key`. Multi-user updates use ETags and `If-Match`, returning 412 for stale state and 428 when the required precondition is absent.

## Alternatives considered

- Handwritten duplicate frontend types: rejected because drift is difficult to detect.
- One combined staff/client schema: rejected because it increases disclosure risk.
- GraphQL as the initial boundary: rejected because the confirmed workflows and FastAPI contract approach do not require it.
- Silent last-write-wins: rejected because it loses concurrent user work.

## Consequences

Contract changes become visible and testable. CI gains generation checks, while developers must follow the contract lifecycle rather than editing clients directly.

## Security and privacy

Client schemas must exclude internal fields at source. Problem details must contain safe validation information only. PII must not appear in query parameters or error telemetry.

## Operations and migration

Create the contract-register template, initial J0–J1 entries and deterministic generation commands before the first vertical slice.

## Acceptance checks

- Approve separate OpenAPI publication boundaries.
- Demonstrate deterministic client generation and stale-code failure in CI.
- Contract-test error, idempotency and concurrency behaviour.

## Review triggers

Supersede if a different machine contract becomes authoritative or a major API version is introduced.

