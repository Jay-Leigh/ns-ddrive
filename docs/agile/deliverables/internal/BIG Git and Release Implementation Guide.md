# BIG Git and Release Implementation Guide

**Document type:** Project implementation guide  
**Applies to:** BIG delivery team  
**Governing standard:** AI and Automation Department — [*SOP: Git Workflow, Release Versioning & Team Collaboration Standards*](../../../../.agents/standards/Git%20Workflow%20SOP.md)  
**Effective for:** October 2026 delivery and subsequent BIG releases  
**Owner:** BIG Tech Lead  

## 1. Purpose

This guide explains how the department Git SOP is applied to the BIG project. It does not replace, weaken or duplicate the department SOP. If this guide conflicts with the department SOP, the department SOP takes precedence.

The guide connects:

- BIG journeys, user stories and developer items;
- Monday.com delivery tracking;
- feature branches, pull requests and environments;
- alpha, beta, release-candidate and stable builds; and
- roadmap milestones and release evidence.

## 2. Rules inherited without modification

The BIG team follows the department SOP without project-specific changes for:

- branch protections and authorization limits;
- Conventional Commits and atomic commits;
- pull-request review and approval;
- feature flags;
- database migrations;
- security and secret management;
- release fixes and back-merging;
- hotfixes and rollback safety; and
- branch cleanup and immutable release tags.

This guide adds only BIG-specific application details.

## 3. Sources of truth

| Information | Source of truth | Update rule |
|---|---|---|
| Work status, ownership, due dates and blockers | Monday.com | Kept up to date through the internal daily stand-up |
| Scope and acceptance criteria | BIG Agile journey, backlog and user-story files | Updated through the agreed documentation process |
| Code and release contents | Git repository, pull requests and immutable tags | Updated through the department Git SOP |
| Client-facing dates and outcomes | Approved BIG delivery plan | Changes require Product Owner approval |
| Included work for a release candidate | BIG release manifest | Updated for every alpha, beta, RC and stable candidate |

Git status does not replace Monday.com delivery status. Monday.com status does not prove that code is merged, deployed or released.

## 4. Traceability model

Every implementation item should be traceable through this chain:

```text
Journey → user story → developer item → Monday.com item → branch → pull request → release manifest → release tag
```

The smallest practical delivery reference should be used in branches and pull requests. For example:

```text
Journey: J6
User story: STORY-J6-01
Developer item: 3.56
Monday.com item: <item link>
```

## 5. Branch application

| Branch | BIG use | Environment |
|---|---|---|
| `feature/*` | New developer-item or coherent story slice | Local or feature preview |
| `bugfix/*` | Non-production correction | Local or feature preview |
| `develop` | Reviewed BIG work integrated across components | Integration environment |
| `release/vX.Y.Z-alpha.N` | Coherent October release scope under internal staging validation | Staging |
| `release/vX.Y.Z-beta.N` | Feature-complete selected scope under client UAT | Staging |
| `release/vX.Y.Z-rc.N` | Optional final candidate with no known release-blocking defects | Staging |
| `main` | Production-approved BIG code | Production |

Roadmap demonstrations in September normally use feature previews or the integration environment. They do not require a release branch merely because a milestone is demonstrated.

## 6. Branch naming

Use the department prefixes with a concise BIG work reference where practical:

```text
feature/j6-3-56-completion-webhook
feature/j1c-core-filtering
bugfix/j5-client-decision-audit
```

Do not put `alpha`, `beta`, `rc` or `stable` in feature-branch names. Those terms describe a combined release candidate, not an individual change.

## 7. Commit standards

Commits follow the department Conventional Commit format:

```text
type(scope): concise description
```

Examples:

```text
feat(survey2): add completion webhook
feat(vetting): record backup decision reason
fix(filtering): correct excluded-profile count
test(survey2): cover duplicate completion callbacks
```

Do not use release maturity as the commit type:

```text
alpha: add completion webhook
beta: fix filtering
stable: update approval flow
```

Release maturity is represented by versioned release branches and tags.

## 8. Pull-request requirements for BIG

In addition to the department SOP, a BIG pull request should include:

- journey reference;
- user-story reference;
- developer-item reference where available;
- Monday.com item link;
- acceptance criteria addressed;
- test evidence;
- migration, security and feature-flag impact;
- expected demonstrated outcome; and
- proposed target release or `not yet selected`.

Suggested title:

```text
J6 / 3.56 — Add Survey 2 completion webhook
```

Suggested release fields:

```text
Target release: v0.1.0
Roadmap batch: J6 technical enablement
Release inclusion: proposed / approved / deferred
```

A merged pull request is not automatically included in the next release. Inclusion is confirmed in the release manifest at the release gate.

## 9. BIG release maturity

| Stage | BIG meaning | Entry condition |
|---|---|---|
| Preview | A developer-item or workflow slice is available for internal review | Focused tests pass and the preview is safe to expose internally |
| Integration | Reviewed components operate together on `develop` | Approved PRs are merged and integration checks pass |
| Alpha | The selected October scope forms a coherent staging build | Scope is selected, branch is frozen and known limitations are documented |
| Beta | The selected release scope is feature-complete and ready for client UAT | Critical alpha issues are resolved and required test suites pass |
| RC | Optional final sign-off candidate | No known release-blocking defects remain |
| Stable | Production-approved immutable release | Product Owner and Tech Lead approve production readiness |

Client sign-off and production approval may occur together, but they are not assumed to be the same decision. If the 30 October outcome is pilot/UAT acceptance only, the build remains beta or RC until production approval is recorded.

## 10. October release flow

The planned progression is:

```text
Feature previews and develop integration
        ↓
9 October feature freeze and alpha selection
        ↓
Internal staging validation
        ↓
Beta for client UAT from 19 October
        ↓
Optional RC for final regression
        ↓
Stable only after production approval
```

The Tech Lead must confirm the actual base version against existing repository tags before creating the first release branch. `v0.1.0` is the provisional version used in the October release plan.

## 11. Feature-freeze rules

At the October feature freeze:

1. Confirm the selected release baseline.
2. Confirm required PRs are merged into `develop`.
3. Confirm all included work has test evidence.
4. Record feature-flag values.
5. Record known limitations.
6. Confirm migration order and rollback approach.
7. Create the versioned alpha branch from synchronized `develop`.
8. Publish the release manifest.

After the alpha branch is created, no new features are added to that branch. Only approved release-blocking corrections are permitted.

## 12. Conditional J6 treatment

J6 is managed as conditional parallel scope and does not automatically form part of the 30 October J0–J5 acceptance baseline.

J6 technical enablement may progress on feature branches and `develop`, including:

- Survey 2 completion webhook and self-confirmation;
- deadline and status foundations;
- send and reminder records;
- opt-out and backup transitions; and
- social-auth bridge preparation.

A J6 component enters the October release only when:

- its acceptance criteria are complete;
- required client inputs and external configuration are available;
- relevant tests pass;
- it does not place J0–J5 integration or UAT at risk;
- the Tech Lead recommends inclusion; and
- the Product Owner approves inclusion before the release gate.

Incomplete J6 behavior may merge into `develop` only when safely disabled by an explicit feature flag. It must not be enabled in the October candidate unless selected in the release manifest.

## 13. Release manifest

Every release candidate must list its contents. At minimum:

| Field | Required information |
|---|---|
| Version | Candidate version and Git commit SHA |
| Included scope | Journeys, stories and developer items |
| Excluded/deferred scope | Items explicitly not included |
| Feature flags | Required enabled and disabled values |
| Migrations | Ordered revisions and validation evidence |
| Test evidence | Automated suites, manual checks and outcomes |
| Known limitations | Accepted non-blocking issues |
| Rollback | Rollback steps and responsible owner |
| Approvals | Tech Lead, Product Owner and client gate where applicable |

The manifest should link back to Monday.com items and pull requests rather than duplicating their full content.

## 14. Release decision ownership

| Decision | Accountable role |
|---|---|
| PR approval and merge readiness | Tech Lead |
| Scope priority and release inclusion | Product Owner |
| Technical release readiness | Tech Lead |
| Client milestone acceptance | Product Owner coordinates with nominated client approver |
| Production approval | Product Owner and Tech Lead under the department SOP |
| Blocker escalation | Item owner, escalated through the Tech Lead |

## 15. Daily and fortnightly operating rhythm

### Internal daily stand-up

- Update Monday.com status, owner, due date and blocker.
- Identify PRs awaiting review.
- Identify integration or test failures.
- Confirm release-critical versus conditional work.
- Escalate decisions that threaten a milestone.

### Fortnightly review/check-in

- Review demonstrated outcomes and upcoming gates.
- Review client inputs and decisions.
- Review release-manifest readiness.
- Confirm conditional-scope inclusion or deferral.
- Record timeline risks and owners.

## 16. Definition of release evidence

A release stage is not achieved by changing a label alone. Evidence must include:

- reproducible Git branch and commit SHA;
- deployment record;
- applicable automated-test results;
- manual scenario results;
- migration and rollback evidence where applicable;
- known-defect list;
- release manifest; and
- recorded approval for the applicable gate.

