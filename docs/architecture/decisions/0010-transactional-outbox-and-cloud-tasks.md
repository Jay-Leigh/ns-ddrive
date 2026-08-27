# ADR 0010: Transactional outbox and cross-region Cloud Tasks

- **Status:** Proposed
- **Date:** 27 August 2026
- **Decision owner:** Backend lead
- **Reviewers:** DevOps lead; InfluenceHub lead; security reviewer
- **Source:** Accepted NorthStar Architecture Decision Register, sections 4.2 and 14.6

## Context

NorthStar requires durable asynchronous work and BIG-to-InfluenceHub propagation. Cloud Tasks and Cloud Scheduler are not available in Johannesburg, but authoritative data and business processing must remain there.

## Decision

Use a Johannesburg transactional outbox as the durable boundary between committed domain changes and task submission. Place Cloud Tasks queues initially in `europe-west1` and use them to invoke IAM-protected Johannesburg Cloud Run workers. Keep queues in the same GCP project as target workers where practical.

Task payloads contain only task type, stable entity/work ID, correlation ID, idempotency information and contract version. They contain no personal content, access tokens or sensitive records. Workers load authorised current data in Johannesburg and are idempotent. Handlers retain their default `run.app` URL because Cloud Tasks/Scheduler require it, protected by internal ingress and IAM.

Place Cloud Scheduler in Belgium and use it only as an authenticated trigger for a Johannesburg coordinator. Express schedules in `Africa/Johannesburg`; jobs use overlap protection and idempotent execution.

Keep the outbox transport-neutral. Add Pub/Sub only when one event has a real independent fan-out requirement. FastAPI `BackgroundTasks` is limited to disposable, non-critical work.

## Alternatives considered

- Abandon Cloud Tasks because of regional absence: rejected because the durable managed queue remains valuable and payload minimisation limits transfer risk.
- Put business logic in Belgium: rejected because authoritative processing remains in Johannesburg.
- Direct best-effort task creation after commit: rejected because queue/network failure could lose work.
- Pub/Sub initially: deferred because current work is point-to-point rather than genuine fan-out.

## Consequences

Outbox dispatch, retry, dead-letter handling and idempotency become required platform capabilities. Some metadata crosses regions, while personal and business content stays in Johannesburg.

## Security and privacy

IAM audience validation, service identity and ingress controls must prevent arbitrary task-handler invocation. Logs allowlist task metadata and exclude payload content beyond approved identifiers.

## Operations and migration

Implement outbox leasing, retry policy, poison-message handling, replay tooling, metrics and correlation propagation. Test queue unavailability and cross-region failure.

## Acceptance checks

- Complete metadata-transfer privacy review.
- Demonstrate no task loss across commit/submission failures.
- Prove duplicate delivery produces one business outcome.
- Prove unauthorised handler calls fail.

## Review triggers

Review if Cloud Tasks becomes available in Johannesburg, a true fan-out use case appears, or cross-region latency/privacy evidence changes.

