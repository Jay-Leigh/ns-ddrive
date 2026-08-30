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
- restrict branch updates and merge gatekeeping to `Mkhuphuli`, the current Tech Lead.

The required approval count is initially zero so that the sole senior developer can self-review and merge low-risk work after CI. This does not waive the independent qualified review required by ADR 0012 for high-risk self-authored changes.

## Release branches and stable tags

The active `Protect versioned release branches` ruleset applies to `release/*`. It requires pull requests, the current required status check, resolved review conversations, and prevents branch deletion and non-fast-forward updates.

The active `Protect stable version tags` ruleset applies to `v*` and prevents tag updates, deletion and non-fast-forward changes. Stable release tags are therefore immutable.

## Review-policy limitation

GitHub cannot infer all NorthStar high-risk categories from business context. Until an approved independent-review team and path mapping exist, the Tech Lead must identify high-risk work during task initiation and obtain independent qualified review before merge. CODEOWNERS and repository rules must be strengthened when the second qualified reviewer or reviewer team is established.

