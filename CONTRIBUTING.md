# Contributing to NorthStar

NorthStar follows the department [SOP: Git Workflow, Release Versioning & Team Collaboration Standards](.agents/standards/Git%20Workflow%20SOP.md). The controlled departmental SOP is authoritative. The project-specific application is documented in [BIG Git and Release Implementation Guide](docs/agile/deliverables/internal/BIG%20Git%20and%20Release%20Implementation%20Guide.md).

## Before starting

- Confirm the work item, acceptance criteria, responsible developer and starting branch.
- Classify the change as a feature, non-production bugfix, release fix or production hotfix.
- Identify migration, feature-flag, security, deployment and compatibility impacts.
- Inspect the current branch and working tree, and preserve unrelated work.

## Branches and commits

- Create `feature/*` and `bugfix/*` branches from `develop`.
- Never push directly to `develop` or `main`.
- Use focused, atomic Conventional Commits: `type(scope): concise description`.
- Stage and inspect files explicitly before each commit.
- Keep incomplete functionality safely disabled behind an explicit feature flag.

## Pull requests

- Open normal feature and bugfix pull requests into `develop`.
- Complete the repository pull-request template and self-review the full diff.
- The Tech Lead is the approval and merge gatekeeper.
- For a self-authored low-risk pull request, the Tech Lead may complete the required self-review and merge after required checks pass, or request another qualified reviewer.
- Independent qualified review is mandatory for self-authored changes involving authentication or MFA, authorisation or RLS, redaction or trust-zone isolation, production IAM/KMS/networking, destructive migrations, audit/privacy controls, secrets or deployment permissions.

## Quality and release safety

- Run focused tests during development and all relevant broader checks before review.
- Full CI is authoritative.
- Never commit secrets, production data or unrestricted sensitive information.
- Merge does not equal release, and client UAT does not equal production approval.
- Versioned release branches, release manifests, production approval and immutable tags follow the department SOP and BIG implementation guide.
