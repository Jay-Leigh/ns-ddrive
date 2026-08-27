# ADR 0009: GCP topology, regions and private networking

- **Status:** Proposed
- **Date:** 27 August 2026
- **Decision owner:** DevOps lead
- **Reviewers:** Security owner; privacy owner; backend lead
- **Source:** Accepted NorthStar Architecture Decision Register, section 14

## Context

NorthStar needs isolated environments, private backend/data paths and South African primary processing. Some required managed services are not available in Johannesburg.

## Decision

Use workload projects `prj-big-platform-dev`, `prj-big-platform-stg` and `prj-big-platform-prod`, adding a uniqueness suffix only where GCP requires it. Use consistent labels including `system=big`, environment, purpose and security zone.

Primary region is `africa-south1` (Johannesburg). `europe-west1` (Belgium) is the provisional secondary region for services unavailable in Johannesburg. Cloud Tasks and Cloud Scheduler availability was revalidated on 27 August 2026: both omitted Johannesburg and listed Belgium.

Deploy frontends, private FastAPI services, task handlers and jobs to Cloud Run. Production external traffic enters through a global external Application Load Balancer. Staff and client frontends have separate domains, backend services, Cloud Armor policies, CSPs and cookie boundaries. Disable direct public `run.app` access after load-balancer integration for public frontends. Keep FastAPI private.

Use Direct VPC egress and private Cloud SQL IP. Use Terraform with protected GCS remote state and pinned providers. GitHub Actions deploys through Workload Identity Federation; no long-lived service-account keys. Secret Manager stores environment secrets, while Terraform manages containers and IAM rather than secret values.

Production Cloud SQL uses regional HA; lower environments may be single-zone. Belgium remains subject to POPIA Section 72, contractual, subprocessor, latency and cost validation.

## Alternatives considered

- Public backend and database endpoints: rejected because private connectivity is available.
- NorthStar-named workload projects: rejected because operational names use the BIG product identity.
- Treat Belgium as automatically privacy-compliant: rejected; EU location alone is insufficient.
- Console-managed infrastructure: rejected because repeatability and review are required.

## Consequences

Cross-region metadata triggers are necessary. Terraform, IAM and network design require coordinated platform ownership.

## Security and privacy

Use least-privilege service identities, separate trust zones and no sensitive task payloads. Complete the transfer/privacy assessment before production.

## Operations and migration

Create projects, state backend, VPC, load balancer, Cloud Run and Cloud SQL in controlled phases. Validate ingress and direct-URL restrictions.

## Acceptance checks

- Complete the POPIA Section 72 and subprocessor assessment.
- Validate cross-region latency/cost.
- Prove private backend and database reachability and public-path denial.
- Approve production project and key ownership.

## Review triggers

Review if Johannesburg gains required services, regional requirements change, or privacy/cost evidence rejects Belgium.

