# NorthStar GitHub Repository Controls

**Recorded:** 30 August 2026  
**Repository:** `Conversion-Science/northstar`  
**Visibility:** Private

This record summarises the GitHub controls implementing the department Git Workflow SOP and the BIG Git and Release Implementation Guide. GitHub configuration is the operational source for the exact active settings.

## Protected integration and production branches

The `main` and `develop` branches:

- require changes through pull requests;
- require the `Repository governance` status check and an up-to-date branch;
- require review conversations to be resolved;
- dismiss stale reviews when new changes are pushed;
- enforce the controls for administrators;
- prevent force-pushes and deletion; and
- restrict branch updates and merge gatekeeping to the Maintain-level `NorthStar Tech Leads` team.

The general `NorthStar` team has Write access for ordinary contribution. It is a general CODEOWNER but is not included in protected-branch restrictions, so its members cannot merge to `main` or `develop` unless they also belong to `NorthStar Tech Leads`.

The required approval count is initially zero so that the sole Tech Lead can self-review and merge low-risk work after CI. This does not waive the independent qualified review required by ADR 0012 for high-risk self-authored changes. Multiple GitHub accounts controlled by the same person do not constitute independent review.

## Release branches and stable tags

The active `Protect versioned release branches` ruleset applies to `release/*`. It requires pull requests, the current required status check, resolved review conversations, and prevents branch deletion and non-fast-forward updates.

The active `Protect stable version tags` ruleset applies to `v*` and prevents tag updates, deletion and non-fast-forward changes. Stable release tags are therefore immutable.

## Review-policy limitation

GitHub cannot infer all NorthStar high-risk categories from business context. The Tech Lead must identify high-risk work during task initiation and obtain independent qualified review before merge. The `NorthStar Tech Leads` team owns `.github/`, `docs/architecture/` and `infrastructure/`, but this ownership does not substitute for independent review when the author and available team members represent the same person. Repository rules must be strengthened when a genuinely independent qualified reviewer or reviewer team is established.

## Deferred deployment controls

GitHub deployment environments are not yet created. Create the approved development, preview, staging and production environments when their deployment workflows and hosting targets are introduced; this does not block contract confirmation or local application development.
