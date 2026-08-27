# SOP: Git Workflow, Release Versioning & Team Collaboration Standards

## 1. Purpose and Scope

This SOP defines the standardized Git workflow used to ensure:

* Code quality
* Controlled integration
* Traceable version history
* Safe feature development
* Alpha and beta testing
* Staging validation
* Controlled production releases
* Reliable rollback and recovery

It applies to the Product Owner, Supervisor/Tech Lead, and all Developers.

---

## 2. Roles and Responsibilities

### Product Owner

The Product Owner:

* Defines and prioritizes work.
* Provides a clear description and acceptance criteria.
* Confirms which features belong in each release.
* Validates release candidates in staging.
* Approves or rejects production readiness.

### Supervisor / Tech Lead

The Supervisor or Tech Lead acts as the Git and release gatekeeper.

Responsibilities include:

* Reviewing Pull Requests.
* Approving merges into `develop`, release branches, and `main`.
* Confirming release scope.
* Overseeing alpha, beta, and production readiness.
* Reviewing security, migrations, and rollback safety.
* Coordinating conflict resolution and hotfix back-merges.

### Developers

Developers are responsible for:

* Building assigned features and fixes.
* Creating focused, atomic commits.
* Writing and maintaining tests.
* Performing self-review.
* Preserving unrelated work.
* Keeping branches synchronized using the approved strategy.
* Following authorization limits for Git and deployment operations.

---

## 3. Stability Pipeline

The project uses a Stability Pipeline:

```text
feature/* or bugfix/*
        ↓
     develop
        ↓
versioned release/*
        ↓
       main
```

Each stage has a higher stability expectation than the stage before it.

Code must not skip a stage except through the approved hotfix procedure.

---

## 4. Branching and Environment Strategy

| Branch             |   Stability | Purpose                                                | Deployment               |
| ------------------ | ----------: | ------------------------------------------------------ | ------------------------ |
| `main`             |        100% | Production-approved code and mirror of the live system | Production               |
| `release/vX.Y.Z-*` |         90% | Alpha, beta, or release-candidate validation           | Staging                  |
| `release/vX.Y.Z`   |         95% | Final stable release candidate                         | Staging                  |
| `develop`          |         70% | Integration of reviewed features and fixes             | Integration environment  |
| `feature/*`        | In progress | New feature development                                | Local or feature preview |
| `bugfix/*`         | In progress | Non-production defect correction                       | Local or feature preview |
| `hotfix/*`         |    Critical | Emergency production correction                        | Hotfix validation        |

### Environment mapping

```text
feature/* or bugfix/* → local or preview environment
develop               → integration environment
release/*              → staging environment
main                   → production environment
```

A permanent `staging`, `release/alpha`, or `release/beta` branch is not used.

Staging deploys from a temporary, versioned release branch.

---

## 5. Core Branch Rules

* Never push directly to `main` or `develop`.
* Changes enter `develop` through reviewed Pull Requests.
* Production code enters `main` only from a release or hotfix branch.
* Release branches are temporary.
* New feature development must not occur on a release branch.
* Incomplete functionality merged into `develop` must be safely disabled using a feature flag.
* Feature branches may deploy to preview environments without merging.
* Do not merge, rebase, reset, restore, force-push, or switch branches without appropriate authorization.
* Never commit credentials, tokens, private keys, `.env` files, or other secrets.
* Do not delete untracked files unless their ownership is known.
* Preserve unrelated work already present in the working tree.

---

## 6. Task Initiation

Before implementation begins:

1. Define the requested change.
2. Document the acceptance criteria.
3. Confirm the responsible developer.
4. Identify the starting branch.
5. Classify the work as:

   * Feature
   * Non-production bugfix
   * Release fix
   * Production hotfix
6. Identify whether the work includes:

   * Database migrations
   * Feature flags
   * Security-sensitive behavior
   * Deployment changes
   * Backward compatibility impact

A Jira, Trello, or Monday task is recommended.

A task identifier may be omitted when the Product Owner explicitly approves proceeding without one.

When a task exists, it must be linked in the Pull Request.

---

## 7. Feature Development Workflow

### 7.1 Starting a feature

New features normally branch from `develop`:

```bash
git checkout develop
git pull origin develop
git checkout -b feature/descriptive-name
```

If an existing feature branch already contains the unfinished feature, related work may continue on that branch without creating another branch.

Before editing:

```bash
git branch --show-current
git status --short --branch
```

Confirm:

* The correct branch is checked out.
* Existing changes are understood.
* Unrelated work will be preserved.
* The branch starting point is correct.

### 7.2 Working locally

Developers must:

* Make focused changes.
* Commit logical units independently.
* Run focused tests during development.
* Run the relevant broader suite before review.
* Keep unsafe or incomplete functionality disabled.
* Avoid unrelated refactoring during scoped fixes.
* Report environmental blockers accurately.

### 7.3 Feature preview

An unfinished feature may be deployed from its feature branch to a temporary preview environment.

A feature preview:

* Is intended for internal development testing.
* Does not represent staging.
* Does not represent a release candidate.
* Must not be treated as production-ready.

### 7.4 Integration into develop

A feature may be merged into `develop` when:

* The approved scope is complete.
* Acceptance criteria are satisfied.
* Tests pass.
* Security review is complete where applicable.
* Migrations have been verified.
* Backward compatibility has been considered.
* Incomplete user-facing behavior is disabled safely.
* The Pull Request has been approved.

Large features should be divided into independently reviewable Pull Requests where practical.

---

## 8. Conventional Commit Standards

Commit messages use Conventional Commits:

```text
type(scope): concise description
```

### Common types

* `feat`: New functionality
* `fix`: Defect correction
* `test`: Test or fixture changes
* `docs`: Documentation only
* `refactor`: Internal restructuring without behavior changes
* `style`: Formatting only
* `chore`: Configuration, tooling, or maintenance
* `perf`: Performance improvement
* `build`: Build-system or dependency changes
* `ci`: Continuous-integration changes

### Examples

```text
feat(access): enforce active auth identity uniqueness
feat(audit): add secure identity-link auditing
fix(auth): enforce fail-closed Firebase identity linking
test(db): preserve seeded capabilities across test cleanup
```

Commit descriptions should:

* Use imperative language.
* Be concise.
* Explain the purpose of the change.
* Avoid vague wording such as “updates” or “fix stuff.”

---

## 9. Atomic Commits

Each commit must perform one coherent operation.

Before committing, apply the following checks.

### Revert test

If this commit is reverted, is its effect understandable and recoverable?

### Reviewer test

Can the Tech Lead understand the purpose of the commit without unrelated changes obscuring it?

### “And” test

If the commit message needs “and” to describe unrelated behavior, split the commit.

### Staging safety

Stage files explicitly:

```bash
git add path/to/file1 path/to/file2
```

Avoid:

```bash
git add .
git add -A
git commit -a
```

Before every commit:

```bash
git diff --cached --stat
git diff --cached
```

Confirm:

* No unrelated files are staged.
* No secrets are included.
* No temporary files are included.
* The staged change matches the commit message.

---

## 10. Feature Chunking Guide

Large features should be divided into logical implementation layers where practical.

### 1. Skeleton

Examples:

* Models
* Schemas
* Types
* Interfaces
* Database migrations

```text
feat(api): define user access schemas
```

### 2. Logic

Examples:

* Services
* Repositories
* Business rules
* Data processing

```text
feat(access): add identity resolution logic
```

### 3. UI

Examples:

* Components
* Layout
* Styling
* Accessibility structure

```text
feat(ui): create freelancer onboarding form
```

### 4. Wiring

Examples:

* API integration
* State management
* Event handling
* Component-to-service connections

```text
feat(ui): connect onboarding form to invitation API
```

### 5. Polish

Examples:

* Validation
* Error handling
* Logging
* Loading states
* Final security hardening

```text
fix(ui): add onboarding error and loading states
```

These layers are guidance rather than a requirement to create exactly five commits.

Every commit must remain coherent, reviewable, and testable.

---

## 11. Daily Developer Quick Reference

1. Confirm the correct base and working branch.
2. Inspect the working tree.
3. Synchronize only using the team-approved merge or rebase strategy.
4. Make focused changes.
5. Stage files explicitly.
6. Review the staged diff.
7. Run focused tests.
8. Create an atomic Conventional Commit.
9. Push the feature branch when authorized.
10. Open a Pull Request into `develop`.
11. Self-review before requesting Tech Lead review.

Before tagging a reviewer, check for:

* `console.log`
* Debugging statements
* Temporary scripts
* Dead code
* Commented-out code
* Typos
* Unused imports
* Accidental files
* Secrets
* Missing tests
* Sensitive information in logs

---

## 12. Semantic Versioning

Releases use Semantic Versioning:

```text
MAJOR.MINOR.PATCH
```

Example:

```text
0.1.0
```

### Version meaning

* `MAJOR`: Breaking or incompatible changes
* `MINOR`: Backward-compatible features
* `PATCH`: Backward-compatible fixes

Before the first stable `1.0.0` release, versions may remain under `0.x`.

---

## 13. Prerelease Versioning

Prereleases use Semantic Versioning identifiers.

### Alpha

Alpha releases are early staging candidates.

They may contain incomplete product behavior, but the selected build must be coherent and testable.

Examples:

```text
v0.1.0-alpha.1
v0.1.0-alpha.2
```

### Beta

Beta releases are feature-complete for the selected release scope.

Beta work focuses on:

* Defects
* Security
* Compatibility
* Performance
* User validation

Examples:

```text
v0.1.0-beta.1
v0.1.0-beta.2
```

### Release candidate

An optional release-candidate stage may be used when no known release-blocking defects remain.

Examples:

```text
v0.1.0-rc.1
v0.1.0-rc.2
```

### Stable release

After approval:

```text
v0.1.0
```

The normal progression is:

```text
alpha → beta → rc → stable
```

Not every release must use every prerelease stage. The Product Owner and Tech Lead decide which stages are required.

---

## 14. Release Branch Naming

Release branches are versioned and temporary.

Examples:

```text
release/v0.1.0-alpha.1
release/v0.1.0-alpha.2
release/v0.1.0-beta.1
release/v0.1.0-rc.1
release/v0.1.0
```

Do not use permanent branches such as:

```text
release/alpha
release/beta
staging
```

Versioned branches make each staging candidate identifiable and reproducible.

---

## 15. Release-Branch Freeze

Once a versioned release branch is created:

* No new features may be added.
* Release scope is frozen.
* Only release-blocking changes are permitted.
* Every release-branch correction must be returned to `develop`.

Permitted changes include:

* Release-blocking bug fixes
* Security corrections
* Migration fixes
* Configuration corrections
* Test corrections
* Documentation required for the release

Unrelated feature development must continue on feature branches.

---

## 16. Creating an Alpha Release

An alpha release is created only after `develop` contains the selected alpha scope.

```bash
git checkout develop
git pull origin develop
git checkout -b release/v0.1.0-alpha.1
git push -u origin release/v0.1.0-alpha.1
```

Staging is configured to deploy:

```text
release/v0.1.0-alpha.1
```

Before creating the branch:

* Confirm the release scope.
* Confirm required Pull Requests are merged.
* Confirm tests pass.
* Confirm migration ordering.
* Document feature-flag values.
* Document known limitations.

---

## 17. Producing Additional Alpha Versions

If another alpha candidate is required:

1. Apply approved release fixes.
2. Validate the fixes.
3. Return release fixes to `develop`.
4. Create the next versioned candidate:

```text
release/v0.1.0-alpha.2
```

5. Deploy the new candidate to staging.
6. Retire the previous alpha branch after its history is safely retained.

Each staging candidate must have an unambiguous version.

---

## 18. Promoting Alpha to Beta

Beta begins when the selected release scope is feature-complete.

Before creating beta:

* All approved alpha fixes must be present in `develop`.
* Required features must be integrated.
* Known critical alpha defects must be resolved.
* Database migrations must be repeatable.
* Feature-flag values must be documented.
* The relevant full test suite must pass.
* The Product Owner and Tech Lead must approve beta readiness.

Create beta from synchronized `develop`:

```bash
git checkout develop
git pull origin develop
git checkout -b release/v0.1.0-beta.1
git push -u origin release/v0.1.0-beta.1
```

Staging then deploys from the beta branch.

No new release-scope features should be added during beta without Product Owner and Tech Lead approval.

---

## 19. Release-Candidate Stage

The optional release-candidate stage is used when:

* Release scope is frozen.
* No known critical defects remain.
* Staging behavior is production-like.
* Migrations have been validated.
* Rollback procedures are documented.
* Only final release-blocking corrections are permitted.

Example:

```bash
git checkout develop
git pull origin develop
git checkout -b release/v0.1.0-rc.1
git push -u origin release/v0.1.0-rc.1
```

---

## 20. Stable Release Procedure

When the release candidate is approved:

1. Confirm Product Owner staging approval.
2. Confirm Tech Lead approval.
3. Confirm the release branch is current.
4. Confirm the full required test suite passes.
5. Confirm migrations and rollback procedures.
6. Confirm production configuration and feature flags.
7. Merge the approved release into `main`.
8. Tag the production release:

```bash
git tag -a v0.1.0 -m "Release v0.1.0"
git push origin v0.1.0
```

9. Deploy `main` to production.
10. Perform production smoke tests.
11. Merge the release branch back into `develop`.
12. Confirm all release fixes exist in `develop`.
13. Delete the release branch after verification.

Production deployments must correspond to an immutable version tag.

---

## 21. Release Fixes and Back-Merging

Fixes discovered during alpha, beta, RC, or stable validation may be made on the active release branch.

Every release-branch fix must be returned to `develop`.

Procedure:

1. Commit the fix on the active release branch.
2. Validate it in staging.
3. Merge or cherry-pick the approved fix into `develop` using the Tech Lead’s selected strategy.
4. Confirm both branches contain the correction.
5. Run relevant integration tests.

Do not allow staging-only fixes to remain absent from `develop`.

---

## 22. Pull Request Requirements

Every Pull Request must include:

* Descriptive title
* Summary
* Acceptance criteria
* Source branch
* Destination branch
* Test evidence
* Migration impact
* Feature-flag impact
* Security considerations
* Backward compatibility
* Rollback considerations
* Known limitations
* Screenshots or API examples where useful
* Task link when one exists

Before requesting review:

```bash
git status --short --branch
git diff target-branch...HEAD --stat
git log target-branch..HEAD --oneline
```

The developer must self-review the complete Pull Request diff.

---

## 23. Code Review Policy

The Tech Lead reviews:

### Functionality

* Does the change meet its acceptance criteria?
* Does it behave correctly in success and failure cases?

### Code quality

* Is the code readable and maintainable?
* Are responsibilities clearly separated?
* Are changes scoped appropriately?

### Security

* Are authorization and authentication correct?
* Are secrets or sensitive values exposed?
* Does the change fail safely?
* Are logs and audit records appropriate?

### Database safety

* Are migrations safe and reversible?
* Are existing records protected?
* Are concurrency and uniqueness handled?

### Coverage

* Are necessary unit, integration, migration, and concurrency tests included?
* Were tests actually executed?

### Release safety

* Are feature flags documented?
* Is rollback possible?
* Are operational impacts understood?

A passing test suite does not replace code review.

---

## 24. Hotfix Procedure

A hotfix is used only for a critical defect currently affecting production.

Create it from `main`:

```bash
git checkout main
git pull origin main
git checkout -b hotfix/descriptive-name
```

Procedure:

1. Implement the smallest safe correction.
2. Add regression tests.
3. Open a Pull Request into `main`.
4. Review and validate the fix.
5. Merge into `main`.
6. Create a patch tag.
7. Deploy production.
8. Perform smoke tests.
9. Merge the hotfix into `develop`.
10. Apply it to any active release branch.
11. Delete the hotfix branch after verification.

Example patch tag:

```text
v0.1.1
```

Hotfix corrections must never remain only on `main`.

---

## 25. Feature Flags

Feature flags allow reviewed code to integrate without exposing unfinished behavior.

Rules:

* Unsafe or incomplete features default to disabled.
* Shared environments configure flags explicitly.
* Enabled and disabled behavior must be tested.
* Feature flags must not bypass authentication or authorization.
* Disabled endpoints must fail safely.
* Release documentation must list required flag values.
* Removing a flag requires a separate reviewed change.
* Flags must not become permanent substitutes for completing or removing obsolete code.

---

## 26. Database Migration Rules

Every migration must:

* Have one clear purpose.
* Use a unique revision.
* Declare the correct previous revision.
* Match corresponding model metadata.
* Be tested against a disposable database.
* Include a safe downgrade where practical.
* Preserve existing data unless otherwise approved.
* Detect incompatible data before enforcing constraints.
* Avoid silently accepting incorrectly defined database objects.
* Never run destructively against production without an approved plan.

Recommended verification:

```text
upgrade → inspect → downgrade → inspect → upgrade
```

Migration reports should include:

* Starting revision
* Final revision
* SQL object created or changed
* Data-preflight behavior
* Downgrade result
* Relevant test evidence

---

## 27. Deployment Rules

### Preview deployment

May deploy from:

```text
feature/*
bugfix/*
```

Used for internal feature testing only.

### Integration deployment

Deploys from:

```text
develop
```

Used to test interaction between reviewed changes.

### Staging deployment

Deploys only from an approved versioned branch:

```text
release/vX.Y.Z-alpha.N
release/vX.Y.Z-beta.N
release/vX.Y.Z-rc.N
release/vX.Y.Z
```

### Production deployment

Deploys only from:

```text
main
```

Production must correspond to an approved immutable version tag.

---

## 28. Safety Rules

* Never push directly to `main` or `develop`.
* Never force-push shared branches without approval.
* Never commit `.env` files or secrets.
* Never use destructive Git commands without confirming exact scope.
* Never delete untracked files unless ownership is known.
* Never silently modify unrelated tests to obtain a passing suite.
* Never run destructive migrations against production.
* Never bypass review because tests pass.
* Never treat alpha or beta branches as permanent.
* Always return release and hotfix corrections to `develop`.
* Always preserve an auditable release history.
* Always use a descriptive Pull Request title.
* Always link the project-management task when one exists.
* Always delete completed branches after merge and verification.

---

## 29. Branch Cleanup

After successful merge and verification:

* Delete merged feature branches.
* Delete completed release branches.
* Delete completed hotfix branches.
* Preserve immutable version tags.
* Confirm no required fix exists only on a deleted branch.
* Remove obsolete remote branches according to repository policy.

---

## 30. Workflow Summary

```text
feature/* or bugfix/*
        ↓ Pull Request
develop
        ↓ Select release scope
release/vX.Y.Z-alpha.N
        ↓ Stabilize
release/vX.Y.Z-beta.N
        ↓ Optional final validation
release/vX.Y.Z-rc.N
        ↓ Approval
main + vX.Y.Z tag
        ↓ Back-merge fixes
develop
```

This workflow keeps feature development, integration, staging validation, and production releases distinct while maintaining traceability for every release candidate.

