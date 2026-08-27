# BIG October 2026 Release Plan

**Release objective:** Client pilot and UAT sign-off by 30 October 2026  
**Provisional version:** `v0.1.0`  
**Release baseline:** Connected J0–J5 workflow  
**Conditional parallel scope:** Selected J6 components  
**Status system of record:** Monday.com  
**Technical governance:** Department Git Workflow SOP and the BIG Git and Release Implementation Guide  

## 1. Release objective

The October release must provide a connected, secure and auditable BIG workflow that allows authorised users to:

1. Create or select a client and brand.
2. Create and configure a BIG project.
3. Apply the agreed core filtering criteria.
4. Receive Survey 1 responses.
5. Deduplicate and populate CRM profiles.
6. Vet candidates as YES, NO or BACKUP.
7. Complete internal final approval.
8. Share a secure candidate list with the client.
9. Capture client approval or rejection.
10. Preserve attribution and audit history.

The target is client pilot and UAT sign-off by 30 October 2026. Production release occurs only when production readiness is separately approved under the department SOP.

## 2. Delivery and release-stage alignment

| Period | Delivery focus | Demonstrated outcome | Git/release treatment |
|---|---|---|---|
| **24 Aug–4 Sep** | Platform foundation, client and brand setup | Authorised users can create and find clients and brands | Feature previews and `develop` integration |
| **7–18 Sep** | Project creation and core filtering | Users can configure a project and obtain expected audience results | Feature previews and `develop` integration |
| **21 Sep–2 Oct** | Survey 1 ingestion, CRM updates and live counts | Survey data is matched, recorded and reflected in counts | `develop` integration build |
| **5–9 Oct** | Complete release-critical implementation | Selected J0–J5 baseline is code-complete for release selection | Final integration on `develop` |
| **9 Oct** | Feature freeze and scope selection | Release manifest identifies included, deferred and flagged work | Create `release/v0.1.0-alpha.1` after gate approval |
| **9–16 Oct** | Connected-flow staging validation | Vetting, approval and secure review operate as one connected flow | Alpha staging candidates |
| **19–26 Oct** | Client UAT, defect correction and regression | Client validates agreed scenarios and release-blocking defects are resolved | Beta staging candidates |
| **27–29 Oct** | Final regression and readiness decision | No known release-blocking defects remain | Optional RC candidate |
| **30 Oct** | Sign-off gate | Pilot/UAT acceptance is recorded | Stable only if production approval is also recorded |

## 3. Release milestones and gates

### Gate 1 — Client and brand setup

**Date:** 4 September 2026  
**Evidence:** Demonstration, agreed scenarios, internal test results and milestone acceptance record.

### Gate 2 — Project setup and filtering

**Date:** 18 September 2026  
**Evidence:** Demonstration using agreed test profiles, expected filter results and milestone acceptance record.

### Gate 3 — Survey 1 data flow

**Date:** 2 October 2026  
**Evidence:** Webhook ingestion, profile matching, duplicate handling, CRM writeback and live-count verification.

### Gate 4 — Feature freeze and alpha selection

**Date:** 9 October 2026  
**Entry criteria:**

- release-critical J0–J5 code is merged into `develop`;
- required tests pass;
- required client inputs are available;
- migrations and feature flags are documented;
- the release manifest is reviewed;
- excluded work is explicitly recorded; and
- Tech Lead and Product Owner approve the selected alpha scope.

### Gate 5 — Connected-flow preview and beta readiness

**Date:** 16 October 2026  
**Entry criteria:**

- critical alpha defects are resolved;
- the selected scope is feature-complete;
- the connected J0–J5 flow passes internal testing;
- staging configuration is documented;
- client UAT data and users are ready; and
- Product Owner and Tech Lead approve beta readiness.

### Gate 6 — Client UAT

**Period:** 19–26 October 2026  
**Evidence:** Scenario results, consolidated feedback, defect decisions, retest evidence and current known-defect list.

### Gate 7 — Final candidate

**Date:** 27–29 October 2026  
**Entry criteria:**

- no known release-blocking defects;
- required regression suite passes;
- migrations and rollback are validated;
- security and access checks pass; and
- the final release manifest is complete.

The Tech Lead may omit the RC stage if the approved beta candidate already satisfies the final-candidate criteria.

### Gate 8 — 30 October sign-off

Record separately:

1. Client pilot/UAT acceptance.
2. Product Owner release approval.
3. Tech Lead technical approval.
4. Production approval, if production deployment is intended.

Do not merge to `main` or create the stable tag solely because client UAT has ended. The stable procedure follows only when the department SOP’s production conditions are met.

## 4. Provisional version progression

The Tech Lead must confirm that `v0.1.0` does not conflict with existing repository tags.

```text
release/v0.1.0-alpha.1
release/v0.1.0-alpha.2       if required
release/v0.1.0-beta.1
release/v0.1.0-beta.2        if required
release/v0.1.0-rc.1          optional
v0.1.0                       stable, after production approval
```

Each candidate must be reproducible from its release branch and commit SHA.

## 5. Release scope

### Release-critical baseline

The October acceptance baseline consists of the connected J0–J5 workflow described in Section 1.

### Conditional J6 parallel scope

J6 work may begin from late September without changing the October baseline. Candidate components include:

- `3.56` — Survey 2 completion webhook and self-confirmation;
- `3.48` — project-wide deadline foundations;
- `3.49` — manual-reminder and send-record foundations;
- `3.50` — opt-out and backup status transitions;
- `3.43` — Survey 2 tick-and-send; and
- `3.57` — social-auth bridge preparation.

Instagram and TikTok authentication work remains subject to platform configuration, test accounts and external integration readiness.

J6 inclusion decisions are made at the 9 October feature-freeze gate. An item is included only when it is complete, tested, safe and does not threaten J0–J5 integration or UAT. Otherwise, it remains disabled or is deferred to the next release.

## 6. Client inputs and decision dates

| Required input or decision | Needed for | Due date |
|---|---|---|
| Representative anonymised profiles, confirmed filtering fields, valid values and expected results | Core filtering | **4 Sep** |
| Survey 1 field definitions and mapping sign-off | Survey 1 ingestion | **11 Sep** |
| Sample Survey 1 responses, including incomplete and duplicate cases | Survey 1 testing | **18 Sep** |
| Representative candidate records, vetting criteria, decision reasons and approval rules | Vetting and internal approval | **25 Sep** |
| Client reviewers, access details and expected client-review behaviour | Secure client review | **2 Oct** |
| Survey 2 payload, completion behavior, deadline rules and status transitions required for selected J6 work | Conditional J6 enablement | **Before J6 inclusion decision on 9 Oct** |
| OAuth applications, redirect configuration, permissions and representative test accounts | J6 social verification | **Before the related component can enter a release candidate** |

All test data must be anonymised but realistic. Each supplied scenario must have an agreed expected result. One nominated client contact should consolidate decisions and sign-offs.

## 7. Release manifest

Create a release manifest for every candidate with:

- version and commit SHA;
- included journeys, stories and developer items;
- excluded and deferred items;
- feature-flag values;
- migrations;
- environment configuration;
- automated and manual test evidence;
- known limitations and accepted non-blocking defects;
- rollback procedure; and
- recorded approvals.

For conditional J6 work, use an explicit inclusion table:

| Work item | Included | Feature flag | Evidence | Decision owner |
|---|---:|---|---|---|
| J6 / 3.56 completion webhook | Yes/No | Enabled/disabled | Link | Product Owner and Tech Lead |
| J6 / 3.48 deadline | Yes/No | Enabled/disabled | Link | Product Owner and Tech Lead |
| J6 / 3.57 auth bridge | Yes/No | Enabled/disabled | Link | Product Owner and Tech Lead |

## 8. Defect management during release validation

| Severity | Meaning | Release treatment |
|---|---|---|
| Release blocker | Prevents the agreed flow, compromises security/data integrity or prevents safe deployment | Must be resolved before promotion |
| High | Major agreed behavior fails with no acceptable workaround | Product Owner and Tech Lead decide whether it blocks promotion |
| Medium | Limited impact with an acceptable workaround | May be deferred with documented acceptance |
| Low | Cosmetic or minor usability issue | Normally deferred unless correction is low risk |

All fixes made on an active release branch must be returned to `develop` according to the department SOP.

## 9. Operating rhythm

### Internal daily stand-up

- Keep Monday.com current.
- Review blockers, PRs, failing tests and environment issues.
- Confirm release-critical and conditional work.
- Assign actions and due dates.

### Fortnightly review/check-in

- Review progress against the next demonstrated outcome.
- Confirm upcoming client inputs and decisions.
- Review release readiness and risks.
- Confirm any J6 inclusion or deferral decision.

### Release-gate review

- Review the candidate release manifest.
- Confirm test and deployment evidence.
- Confirm known defects and limitations.
- Record the gate decision and approvers.

## 10. Release roles

| Role | October responsibility |
|---|---|
| Product Owner | Scope priority, client coordination, milestone acceptance and release inclusion decisions |
| Tech Lead | Architecture, task allocation, PR gatekeeping, release branches, technical readiness and rollback safety |
| Developers | Focused implementation, tests, atomic commits, PR evidence and correction of assigned defects |
| QA | Scenario preparation, test execution, defect evidence, regression results and release-quality reporting |
| Client approver | Consolidated workflow decisions, input confirmation, UAT feedback and client acceptance |

## 11. Principal release risks

| Risk | Control |
|---|---|
| Late client inputs reduce test and correction time | Track inputs as dated Monday.com items and escalate before the dependent milestone |
| Conditional work displaces release-critical work | Require explicit inclusion at feature freeze and keep incomplete behavior disabled |
| Release fixes exist only on staging | Return every approved release fix to `develop` |
| Client sign-off is mistaken for production approval | Record UAT acceptance and production approval as separate decisions |
| Senior technical capacity becomes a bottleneck | Prioritise architectural decisions, interfaces and review queues during daily planning |
| External OAuth configuration delays J6 | Gate social verification separately and require test configuration before inclusion |

## 12. Release completion checklist

- [ ] Client/UAT acceptance recorded.
- [ ] Product Owner approval recorded.
- [ ] Tech Lead approval recorded.
- [ ] Production approval recorded if deployment is intended.
- [ ] Final release manifest completed.
- [ ] Full required test suite passed.
- [ ] Migrations and rollback validated.
- [ ] Feature-flag values recorded.
- [ ] Known defects and limitations accepted or resolved.
- [ ] Release branch merged according to the department SOP.
- [ ] Stable tag created only after production approval.
- [ ] Production smoke tests completed where applicable.
- [ ] Release and hotfix corrections confirmed in `develop`.
- [ ] Monday.com and release documentation updated.


