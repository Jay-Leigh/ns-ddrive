# NorthStar API Contract Register

**Project:** BIG Platform / Project NorthStar
**Status:** Proposed
**Date:** 27 August 2026
**Owner:** Backend lead
**Reviewers:** Tech Lead; frontend lead; security reviewer; QA lead; product owner
**Authority:** Accepted NorthStar Architecture Decision Register and Accepted ADR 0006

## 1. Purpose

This register is the human-review authority for NorthStar application programming interface (API) contracts while an entry is **Proposed** or **Confirmed**. It records business traceability, trust-zone exposure, operation candidates, behavioral requirements and unresolved decisions before implementation.

The contract lifecycle is:

```text
Proposed/Confirmed contract register
→ FastAPI and Pydantic implementation
→ versioned OpenAPI
→ generated TypeScript types/client
→ automated verification
```

Once implemented, versioned OpenAPI is the machine-readable authority. A contract becomes **Verified** only when this register, OpenAPI, generated clients and automated checks agree.

This initial register covers J0 and J1A–J1C. Every entry remains Proposed until its listed confirmation gates are resolved and approved.

## 2. Status model

| Status | Meaning |
|---|---|
| Proposed | Under review. The register is authoritative for design intent, but implementation is not authorized as a Confirmed vertical-slice contract. |
| Confirmed | Approved for implementation with its recorded scope and trust boundary. |
| Verified | Register, OpenAPI, generated clients and automated contract checks agree. |
| Deprecated | Still supported temporarily with a documented replacement and removal plan. |
| Superseded | Replaced by a named later contract or higher-authority decision. |

Status changes require the backend lead, affected frontend lead and Tech Lead. Security review is additionally required for authentication, authorization, consent, redaction, client-review disclosure or other trust-boundary changes.

## 3. Source authority and traceability

The accepted NorthStar authority hierarchy applies. The J0/J1 business sources used here are from BIG Project Spec version 2.2:

- `docs/agile/02_user_journeys/user_journeys.md`
- `docs/agile/03_product_backlog/product_backlog_index.md`
- `docs/agile/03_product_backlog/user_stories/US-001.md` through `US-009.md`
- `docs/agile/03_product_backlog/user_stories/US-033.md`
- `docs/agile/03_product_backlog/user_stories/US-034.md`
- `docs/agile/03_product_backlog/user_stories/US-037.md`, used only as dependency context
- `docs/architecture/domain_decision_register.md`, specifically Confirmed decision SD04

The version 2.2 backlog index and generated delivery map identify the numbered `US-*` stories as the traceable backlog set. Journey-named `US-J*` files are supporting material only unless the approved backlog index is revised to incorporate them.

The user-supplied `brand influence/docs/agile` folder contains an older version 2.1 journey-oriented backlog. It is used only to fill gaps where it agrees with version 2.2 journey objectives and Accepted NorthStar architecture. Supporting references are labeled explicitly and cannot independently Confirm a contract.

### 3.1 Higher-authority resolutions

Where legacy business text conflicts with Accepted NorthStar architecture, the higher authority governs:

- Consent Boolean fields are current-state projections. The immutable, purpose-specific consent ledger and its evidence remain authoritative.
- The 500 millisecond autosave debounce is a frontend interaction target, not an API response-time guarantee.
- The canonical project name is backend-derived and read-only to users. It is recalculated when its authoritative source fields change, so it is not an unchangeable stored label.
- PgBouncer, Pub/Sub, fixed role tiers and named messaging providers in legacy J0 dependency text are not part of these contracts. Their Accepted NorthStar decisions remain Deferred or governed by later feature decisions.
- BIG does not render external survey experiences and there is no community-participant portal in current scope.
- Supporting v2.1 identity text does not override the Accepted staff Google/Firebase/TOTP boundary, the separate client-review passwordless boundary or the absence of a BIG community portal.

## 4. Global contract rules

### 4.1 Publication boundaries

- Staff operations appear only in the staff OpenAPI document.
- Client-review operations appear only in the client-review OpenAPI document.
- No J0/J1 client-review operation is proposed in this initial set.
- Service-to-service ingestion is not silently added to a browser-facing OpenAPI document. Its authentication and publication boundary must be approved with the affected integration contract.
- Purpose-built data transfer objects (DTOs) exclude unauthorized data before a response leaves FastAPI.

### 4.2 HTTP behavior

- Base path: `/api/v1`.
- Errors use RFC 9457 Problem Details with a stable application code, correlation ID and safe validation detail.
- Important creates and actions require `Idempotency-Key`.
- Mutable resources return an entity tag (ETag). Updates that can conflict require `If-Match`.
- A stale ETag returns `412 Precondition Failed`.
- A missing required precondition returns `428 Precondition Required`.
- Authorization failures do not reveal whether an inaccessible resource exists.
- Browser redirects and view navigation are frontend concerns; API responses return authorized resource identifiers and state.

### 4.3 Lists and search

- Cursor pagination is the default.
- Initial page size is 25; maximum page size is 100.
- Stable ordering and cursor fields are defined in OpenAPI before implementation.
- Search and counts apply authorization before results or metadata are calculated.
- Personal information and unrestricted sensitive criteria are not placed in query strings.
- Corporate client/brand search terms may use query parameters only after telemetry and logging controls are verified.

### 4.4 Identifiers and representation

- Public resource identifiers are opaque backend-generated universally unique identifiers (UUIDs).
- Sequential database identifiers are never public resource identifiers.
- Timestamps are timezone-aware UTC values represented unambiguously in ISO 8601 form.
- Date-only business values are distinct from timestamps.
- Money uses an exact amount representation and an ISO 4217 currency code.
- User IDs in change history are stable technical identifiers; authorized display names are separate projections.

### 4.5 Contract confirmation gates

Before any entry becomes Confirmed:

1. Resolve every item listed under that entry's **Open questions**.
2. Approve required capabilities and scope checks.
3. Confirm request, response and error examples contain no unauthorized fields.
4. Confirm idempotency and concurrency behavior.
5. Confirm audit/change-history requirements.
6. Identify the OpenAPI publication boundary.
7. Record the approval and status change in this register.

## 5. Register index

| Contract ID | Journey | Capability | Boundary | Status | Primary stories |
|---|---|---|---|---|---|
| API-J0-001 | J0 | Consent state and evidence | Staff/integration boundary pending | Proposed | US-033; US-037 dependency context |
| API-J0-002 | J0 | Autosave mutation protocol | Staff | Proposed | US-034 |
| API-J1A-001 | J1A | Client discovery and directory | Staff | Proposed | US-001; US-003 |
| API-J1A-002 | J1A | Client and brand creation | Staff | Proposed | US-001; US-002 |
| API-J1A-003 | J1A | Client portfolio dashboard | Staff | Proposed | J1A journey; supporting STORY-J1A-03 |
| API-J1B-001 | J1B | Project brief and canonical identity | Staff | Proposed | US-004; US-005 |
| API-J1B-002 | J1B | Project spine initialization and board | Staff | Proposed | US-006 |
| API-J1C-001 | J1C | Filtering configuration and audience preview | Staff | Proposed | US-008; US-034 |
| API-J1C-002 | J1C | Saved audience snapshot | Staff | Proposed | US-008 |
| API-J1C-003 | J1C | Brief change history and sign-off | Staff | Proposed | US-009 |

## 6. J0 Proposed contracts

### API-J0-001 — Consent state and evidence

**Status:** Proposed
**Business outcome:** Prevent outreach through unconsented channels and preserve evidence of grants and withdrawals.
**Traceability:** US-033; US-037 dependency context; Accepted register sections 8.2 and 8.5.
**Publication boundary:** Staff read boundary plus a future approved service-to-service ingestion boundary. No community browser API is implied.

#### Candidate operations

| Method | Candidate path | Purpose | Required controls |
|---|---|---|---|
| GET | `/api/v1/members/{member_id}/consents` | Return the authorized current consent projection and safe evidence metadata. | Scoped staff capability; no unrestricted member profile fields. |
| POST | Path deferred | Append a consent grant or withdrawal from an approved authoritative source. | Idempotency key; source authentication; immutable evidence; audit correlation. |

#### Minimum semantic model

- `member_id`
- `purpose_code`, not only a channel Boolean
- `channel`, where applicable
- `state`: granted or withdrawn
- `effective_at`
- `recorded_at`
- `source_type` and source-scoped reference
- `wording_version` or policy version
- safe evidence reference, not unrestricted evidence content
- current-state projection values needed for legacy flags

Each accepted event is append-only. Withdrawal creates a new event and updates the projection; it does not delete or rewrite earlier evidence. The projection may expose fields corresponding to `general_newsletter_consent`, `whatsapp_consent`, `project_mailer_consent` and `project_whatsapp_consent`, but those fields are not the authority.

#### Errors and audit

- Reject unknown purpose codes and unsupported source types with safe validation details.
- Duplicate delivery with the same idempotency key returns the original outcome.
- Record subject, source, purpose, state transition, timestamp, correlation ID and outcome without logging sensitive evidence.

#### Open questions

- Which system is authoritative for each initial consent purpose and wording version?
- What operation and authentication boundary will external survey callbacks use?
- Which staff capabilities may read consent evidence metadata?
- Which exact retention rules apply to consent evidence?

### API-J0-002 — Autosave mutation protocol

**Status:** Proposed
**Business outcome:** Persist recoverable field changes without manual save actions or silent overwrites.
**Traceability:** US-034; Accepted register sections 9.2 and 10.3.
**Publication boundary:** Cross-cutting staff API behavior applied to mutable J1 resources.

#### Protocol

- The frontend may debounce changes by 500 milliseconds after local validation.
- The API accepts explicit partial changes only on contract-defined mutable fields.
- Every autosave request includes `If-Match` with the last accepted ETag.
- The response returns the authoritative saved resource projection, a new ETag, `saved_at` and correlation ID.
- The frontend displays pending, saved, failed and conflict states from request outcomes; it must not claim success before acknowledgment.
- Retrying the same logical mutation uses an idempotency key when the affected operation is not naturally idempotent.
- A stale ETag returns 412 with safe conflict metadata; the server never silently overwrites the newer version.
- Recovery reloads the latest authorized server state. The API does not promise that unsent browser changes survive a crash.

#### Open questions

- Which J1 fields are independently patchable and which require whole-object validation?
- What is the user-resolution experience for a 412 conflict?
- Which changes create a version-history entry versus an operational audit event?

## 7. J1A Proposed contracts — Client Hub

### API-J1A-001 — Client discovery and directory

**Status:** Proposed
**Business outcome:** Find existing clients, brands and projects before creating duplicates, and support an A–Z client directory.
**Traceability:** US-001; US-003.
**Publication boundary:** Staff OpenAPI only.

#### Candidate operations

| Method | Candidate path | Purpose |
|---|---|---|
| GET | `/api/v1/client-accounts` | Cursor-paginated authorized client search and list. |
| GET | `/api/v1/client-directory` | A–Z directory projection with stable letter grouping and cursor pagination. |
| GET | `/api/v1/client-accounts/{client_account_id}` | Authorized client detail with permitted brand and project summaries. |

#### Minimum response projections

- Client account: `id`, human-readable reference, display name, normalized search name, safe summary, version.
- Brand summary: `id`, client account ID, display name, safe summary.
- Project summary: `id`, human-readable reference, canonical name, lifecycle status and permitted dates.
- Directory item: client initials/avatar fallback, display name, permitted metadata and drill-down identifier.

Search indicates possible exact or fuzzy matches; it does not automatically merge records. Authorization applies before matches, counts or letter groups are returned.

#### Open questions

- Which client, brand and project fields are safe in cross-entity search results?
- What normalization and similarity threshold produces a duplicate warning?
- Is directory ordering based on legal name, trading name or approved display name?
- Which project statuses and dates appear in the client summary?

### API-J1A-002 — Client and brand creation

**Status:** Proposed
**Business outcome:** Create a new client with its initial brand without orphaned records, and add brands to an existing client.
**Traceability:** US-001; US-002.
**Publication boundary:** Staff OpenAPI only.

#### Candidate operations

| Method | Candidate path | Purpose | Required controls |
|---|---|---|---|
| POST | `/api/v1/client-accounts` | Atomically create a client account and required initial brand. | Idempotency key; duplicate assessment; transaction. |
| POST | `/api/v1/client-accounts/{client_account_id}/brands` | Create a brand under an authorized client account. | Idempotency key; parent scope authorization. |
| PATCH | `/api/v1/client-accounts/{client_account_id}` | Update contract-defined client fields. | ETag and `If-Match`; change/audit classification. |
| PATCH | `/api/v1/brands/{brand_id}` | Update contract-defined brand fields. | ETag and `If-Match`; parent scope authorization. |

The client-creation response returns both created resource identifiers and versions so the frontend can navigate to Project Hub. Navigation itself is not an API side effect.

#### Open questions

- What are the minimum required client and brand attributes?
- Is an initial brand always mandatory for a new client?
- Who may override a duplicate warning, and is a reason required?
- Does duplicate merging belong in J1A or a separately reviewed administrative contract?

### API-J1A-003 — Client portfolio dashboard

**Status:** Proposed
**Business outcome:** Compare authorized client portfolio performance across equivalent periods and drill into the contributing projects.
**Traceability:** J1A journey objective; supporting v2.1 STORY-J1A-03.
**Publication boundary:** Staff OpenAPI only.

#### Candidate operations

| Method | Candidate path | Purpose | Required controls |
|---|---|---|---|
| POST | `/api/v1/client-portfolio/summary` | Calculate authorized portfolio metrics for an explicit current and comparison period. | Authorization before metrics; body avoids sensitive query parameters. |
| GET | `/api/v1/client-accounts/{client_account_id}/projects` | Return the cursor-paginated projects contributing to an authorized client summary. | Client-account scope authorization. |

The summary returns metric identifiers, exact values where authorized, comparison values, change direction and safe chart series. Metric definitions and calculation versions must be explicit; the API does not return presentation-specific card or chart configuration as business authority.

#### Open questions

- Which metrics, ranking rules and calculation versions are approved for the first dashboard?
- What date fields define the current and equivalent comparison periods?
- Are any commercial metrics restricted to particular capabilities?
- The v2.1 story must be incorporated into or explicitly approved alongside the v2.2 backlog before this entry can become Confirmed.

## 8. J1B Proposed contracts — Project creation

### API-J1B-001 — Project brief and canonical identity

**Status:** Proposed
**Business outcome:** Capture the full project brief, activation configuration and targets while deriving one canonical project identity.
**Traceability:** US-004; US-005; Confirmed business decision SD04.
**Publication boundary:** Staff OpenAPI only.

#### Candidate operations

| Method | Candidate path | Purpose | Required controls |
|---|---|---|---|
| POST | `/api/v1/projects` | Create a project draft under an authorized client and brand. | Idempotency key; scoped authorization; atomic shell creation. |
| GET | `/api/v1/projects/{project_id}` | Return the authorized project brief and derived state. | Project scope authorization. |
| PATCH | `/api/v1/projects/{project_id}` | Autosave contract-defined brief fields and activation blocks. | ETag and `If-Match`; API-J0-002 protocol. |

#### Minimum request field families

- Project type
- Client account and brand identifiers
- ICS project name (business shorthand; approved expansion and field definition pending)
- Overall project live date
- Community selection
- ICS product/project name (business shorthand; approved expansion and field definition pending)
- Main category and sub-category
- Primary objective and project messaging
- Main community commonality and community must-haves
- Total community profiles
- One or more activation methods from the approved taxonomy
- Per-activation date bounds, expected deliverables and KPI targets
- BIG Influence social platforms and main hashtag when applicable

The backend derives the read-only canonical name using SD04:

`year-month(live)_community_project-type_activation_main-category_brand_project-name-pulse(x)`

Underscores separate sections; hyphens replace spaces within a section. The contract must define normalization, missing-value handling and pulse numbering before confirmation. When source properties change, the response returns the recalculated canonical name and new resource version.

#### Open questions

- What does ICS expand to, and how do the two ICS-labelled fields differ?
- What controlled vocabularies and identifiers govern project type, community, category, activation and social platform fields?
- Which brief fields are mandatory for draft creation versus later initialization?
- What is the exact date validation across recruitment, live and reporting bounds?
- How are budget and currency represented, given that the journey references budget but US-004 does not define its fields?
- How are name collisions and changes to referenced canonical names handled?

### API-J1B-002 — Project spine initialization and board

**Status:** Proposed
**Business outcome:** Initialize the 13-stage project spine and provide an authorized project-status projection.
**Traceability:** US-006; supporting v2.1 STORY-J1B-02 and STORY-J1B-03.
**Publication boundary:** Staff OpenAPI only.

#### Candidate operations

| Method | Candidate path | Purpose | Required controls |
|---|---|---|---|
| POST | `/api/v1/projects/{project_id}/initialize` | Validate the brief and initialize the project spine once. | Idempotency key; recent state revalidation. |
| GET | `/api/v1/projects/{project_id}/spine` | Return all 13 stages with enabled, disabled and current-state projections. | Project scope authorization. |
| PUT | `/api/v1/projects/{project_id}/team-assignments` | Replace the reviewed project-role assignment set. | ETag and `If-Match`; assignment-authority check; audit event. |
| GET | `/api/v1/project-board` | Return cursor-paginated project cards grouped/filterable by lifecycle status. | Authorization before cards and counts. |

Initialization preserves all 13 stage definitions. Unticked stages are returned as disabled, not deleted. Once-off and custom-project constraints are validated by FastAPI. The supporting board states are Upcoming, In Recruitment, Live Moderating, In Reporting, Completed, On Hold and Cancelled; they remain Proposed until the lifecycle state machine is approved.

#### Open questions

- Which brief completeness rules permit initialization?
- Who may initialize or reconfigure a spine?
- What state transition governs re-enabling a previously disabled stage?
- What transitions and terminal-state rules govern the proposed seven project-board states?
- Which project roles, assignee eligibility rules and capabilities govern team allocation?
- Does changing an assignment affect active sessions immediately or on the next authorization check?

## 9. J1C Proposed contracts — Filtering

### API-J1C-001 — Filtering configuration and audience preview

**Status:** Proposed
**Business outcome:** Configure demographic, social, interest and past-project filters with autosave and authorized live counts.
**Traceability:** US-008; US-034; J1C journey definition.
**Publication boundary:** Staff OpenAPI only.

#### Candidate operations

| Method | Candidate path | Purpose | Required controls |
|---|---|---|---|
| GET | `/api/v1/projects/{project_id}/filtering` | Return the authorized filtering configuration and version. | Project scope authorization. |
| PATCH | `/api/v1/projects/{project_id}/filtering` | Autosave contract-defined filter changes. | ETag and `If-Match`; API-J0-002 protocol. |
| POST | `/api/v1/projects/{project_id}/audience-preview` | Calculate authorized matching counts without placing sensitive criteria in a URL. | Project scope authorization; safe aggregate response. |

The filter model must support the approved demographic and social criteria, interest categories, follower ranges and past-project include/exclude semantics. Include highlights candidates but does not override other qualification rules; exclude removes matching past participants from the result.

#### Open questions

- What is the approved filter schema and category taxonomy: 32 categories, 40 categories or a versioned taxonomy resource?
- Which aggregate counts are safe for each staff capability, including small-count suppression if required?
- How are filter clauses prioritized for saved-audience naming?
- Which changes trigger downstream recalculation, and is that recalculation synchronous or queued?

### API-J1C-002 — Saved audience snapshot

**Status:** Proposed
**Business outcome:** Store an immutable structural filter snapshot that can be re-run against current authorized data.
**Traceability:** US-008.
**Publication boundary:** Staff OpenAPI only.

#### Candidate operations

| Method | Candidate path | Purpose | Required controls |
|---|---|---|---|
| POST | `/api/v1/saved-audiences` | Create an immutable snapshot from a validated filtering configuration. | Idempotency key; scoped authorization. |
| GET | `/api/v1/saved-audiences/{saved_audience_id}` | Return the authorized definition and safe current summary. | Scope authorization. |
| POST | `/api/v1/saved-audiences/{saved_audience_id}/preview` | Re-query the snapshot against current authorized records. | Safe aggregate response; no unrestricted member list. |

The backend generates the display name from at most five prioritized filter tokens. The stored structural snapshot uses stable field and taxonomy identifiers rather than treating the display name as executable criteria.

#### Open questions

- Which scope owns a saved audience: platform, client account, brand or project?
- What deterministic priority orders the five naming tokens?
- Are display names unique, and may users provide a separate label?
- What does the backlog's database-wide deduplication requirement mean operationally and who may invoke it?

### API-J1C-003 — Brief change history and sign-off

**Status:** Proposed
**Business outcome:** Preserve attributable brief/filter changes and gate transition to Ready to Recruit.
**Traceability:** US-009; Accepted register section 8.5.
**Publication boundary:** Staff OpenAPI only.

#### Candidate operations

| Method | Candidate path | Purpose | Required controls |
|---|---|---|---|
| GET | `/api/v1/projects/{project_id}/change-history` | Return an authorized, cursor-paginated change-history projection. | Project scope authorization; safe field/value redaction. |
| POST | `/api/v1/projects/{project_id}/actions/sign-off-filtering` | Revalidate the brief and transition the project to Ready to Recruit. | Idempotency key; `If-Match`; recent authentication if classified sensitive. |

Change history records who, what and when, linked to the resulting resource version. It remains distinct from the internal audit log, which also records attempted controlled actions, scope, outcome and reason where required.

#### Open questions

- Which capability may sign off filtering and may delegation occur?
- What exact validation failures block Ready to Recruit?
- Which before/after values are safe to retain and display?
- Do post-sign-off changes revoke readiness automatically or require explicit re-sign-off?

## 10. Cross-entry unresolved decisions

The following items block confirmation of one or more entries but do not block this Proposed design register:

1. Approve the initial staff capability catalogue and resource scopes relevant to J0/J1.
2. Resolve the consent-source and external survey integration boundary.
3. Approve the client/brand/project minimum data dictionaries.
4. Approve versioned controlled vocabularies for project, activation, community, category and social-platform fields.
5. Resolve the category-count conflict in source material through an authoritative taxonomy.
6. Define project lifecycle transitions and the Ready to Recruit re-sign-off rule.
7. Define the styling framework separately before styling or design-system scaffolding; it does not affect these API semantics.
8. Decide whether the useful v2.1 supporting stories will be promoted into the approved v2.2 backlog or approved individually for contract confirmation.

## 11. Verification plan

When implementation begins, each Confirmed entry must add:

- Pydantic request and response models;
- staff or client-review OpenAPI publication tests;
- deterministic `openapi-typescript` and `openapi-fetch` generation;
- stale-generated-code detection in CI;
- RFC 9457 error examples;
- idempotency replay tests where required;
- ETag, 412 and 428 concurrency tests where required;
- authorization and negative disclosure tests;
- database integration tests against temporary PostgreSQL; and
- traceability from automated tests back to contract and story IDs.

## 12. Review history

| Date | Change | Reviewer outcome |
|---|---|---|
| 27 August 2026 | Initial J0/J1 register drafted from BIG Project Spec v2.2 and Accepted NorthStar architecture. | Proposed; formal contract review pending. |
| 27 August 2026 | Compared the user-supplied v2.1 `docs/agile` material; added only aligned dashboard, team-assignment and board-state details. | Supporting evidence only; conflicts excluded and promotion decision pending. |
