# ADR 0013: Production encryption, backup and disaster recovery

- **Status:** Proposed
- **Date:** 27 August 2026
- **Decision owner:** DevOps lead
- **Reviewers:** Security owner; BIG governance representative; data architect
- **Source:** Accepted NorthStar Architecture Decision Register, sections 17.3 and 17.4

## Context

NorthStar requires recoverability from local failures, accidental changes and major regional events. Production key governance must prevent developers or a single accidental action from destroying protected data.

## Decision

Use regional HA for production Cloud SQL, aiming for approximately five-minute recovery from zone or instance failure. Enable point-in-time recovery with an initial RPO no greater than five minutes, a seven-day PITR window and a four-hour major-restore RTO. Retain daily backups for 30 days and a controlled-decommission final backup for 30 days unless the retention register requires otherwise.

Do not initially run a live cross-region database replica. Maintain an encrypted off-region recovery copy and measure and accept a distinct regional-loss recovery target. Add a replica only when contractual obligations or measured business impact trigger it.

Test restoration before launch and quarterly thereafter. Recovery exercises must validate application integrity, permissions, canonical identifiers and reapplication of required privacy deletions after restore.

Use CMEK for production Cloud SQL and Confidential/Restricted GCS or off-region copies where supported. Use Google-managed encryption in lower environments unless production-equivalent testing requires CMEK. BIG's governance boundary controls production keys. Developers receive narrow use permission and no destruction rights. Separate KMS responsibilities, audit key use, rotate keys, protect against accidental destruction and require dual approval for destructive key operations. Use region-appropriate keys and configure Cloud SQL CMEK at instance creation.

## Alternatives considered

- Live cross-region replica immediately: deferred because current contractual and measured-impact triggers have not occurred.
- Developer-controlled production keys: rejected because destruction and separation-of-duty risk are unacceptable.
- Untested backups: rejected because a backup is not evidence of recoverability.
- CMEK in every environment: rejected because lower-environment cost/complexity lacks current benefit.

## Consequences

Production provisioning must establish keys before Cloud SQL creation. Quarterly exercises and off-region copy monitoring become ongoing operational work. Regional-loss recovery is slower than HA recovery until a replica trigger occurs.

## Security and privacy

Key permissions, backup access and restore actions are least-privilege and audited. Recovery environments must not create uncontrolled copies or bypass retention/privacy obligations.

## Operations and migration

Create KMS, backup, copy, restore and verification runbooks through Terraform and reviewed operational procedures. Record measured RPO/RTO results.

## Acceptance checks

- Approve KMS ownership and dual-control roles before instance creation.
- Complete a full production-like restore test.
- Validate off-region encryption and access controls.
- Approve the regional-loss recovery target.

## Review triggers

Review on contractual recovery requirements, failed restore exercises, changed regional risk or measured impact that justifies a live replica.

