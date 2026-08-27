# NorthStar Technical Glossary

This glossary defines recurring abbreviations and specialist terms used in NorthStar architecture, delivery and implementation documents. Documents should still expand an abbreviation on first use when the intended audience may not know it.

| Term | Meaning |
|---|---|
| ADR | Architecture Decision Record: an immutable record of a consequential architecture decision after acceptance. |
| Alembic | The database migration tool used with SQLAlchemy. Each NorthStar data domain owns its own Alembic history and version table. |
| API | Application Programming Interface: the defined operations through which software components communicate. |
| ARIA | Accessible Rich Internet Applications: attributes that supplement semantic HTML when native elements cannot express the required accessible behavior. |
| BFF | Backend for Frontend: a limited server boundary tailored to one frontend's session, security and request needs. It is not a second business backend. |
| CI | Continuous Integration: automated checks run against proposed or integrated repository changes. |
| Cloud SQL | Google Cloud's managed relational database service, used for NorthStar's hosted PostgreSQL infrastructure. |
| Code coverage | A measurement of which executable paths tests exercise. NorthStar targets at least 80% branch coverage for new or changed handwritten logic. |
| CMEK | Customer-Managed Encryption Key: an encryption key whose lifecycle and access policy are controlled within the customer's governance boundary. |
| CSP | Content Security Policy: browser security rules that restrict which content and code a page may load or execute. |
| CSRF | Cross-Site Request Forgery: an attack that attempts to make an authenticated browser submit an unintended request. |
| Connection pool | A bounded set of reusable database connections. Pool sizes must fit NorthStar's total connection budget across services and overlapping deployments. |
| CRM | Customer Relationship Management: BIG's records and workflows for clients, brands, contacts and community members. |
| DTO | Data Transfer Object: a purpose-built data structure returned or accepted at a system boundary. Client-safe DTOs exclude internal or unauthorized fields before data reaches the frontend. |
| ETag | An HTTP response identifier representing a particular resource version, used with `If-Match` to prevent conflicting updates. |
| Expand/contract migration | A staged database-change pattern that first adds backward-compatible structures, transitions usage, and only later removes obsolete structures. |
| HTTP | Hypertext Transfer Protocol: the request-and-response protocol used by web browsers and NorthStar API boundaries. |
| IAM | Identity and Access Management: policies and identities controlling access to cloud and infrastructure resources. |
| ICM | Influencer Community Management: the BIG operational function responsible for relevant community, filtering, vetting and campaign activities. |
| Idempotency | The property that safely repeating the same requested operation has no additional unintended effect. NorthStar uses an `Idempotency-Key` to recognize important retried creates and actions. |
| Lockfile | A generated dependency record that fixes the exact resolved package versions so installations can be reproduced. NorthStar uses `pnpm-lock.yaml` and, when the backend is introduced, `uv.lock`. |
| LTS | Long-Term Support: a runtime release line maintained for stability and security over a defined support period. |
| MFA | Multi-Factor Authentication: authentication requiring more than one independent factor. |
| Monorepo | A single repository containing multiple applications and packages governed and versioned together. |
| OTP | One-Time Password: a short-lived code used for a single authentication attempt. |
| OpenAPI | A machine-readable description of HTTP API operations, inputs, outputs and errors. NorthStar generates frontend types and clients from separate staff and client-review OpenAPI documents. |
| Optimistic concurrency | A conflict-control approach that allows work without locking a record, then rejects an update if the record version has changed. NorthStar uses ETags and `If-Match` for this purpose. |
| PII | Personally Identifiable Information: information that identifies or can reasonably be linked to a person. |
| `pg_trgm` | A PostgreSQL extension that supports trigram-based text similarity and indexed fuzzy matching. It is NorthStar's only initially allowed application extension. |
| PgBouncer | A PostgreSQL connection-pooling proxy. NorthStar defers it until measured connection pressure justifies the additional component. |
| POPIA | Protection of Personal Information Act: South Africa's primary personal-information protection law. |
| PR | Pull Request: a reviewed proposal to merge one Git branch into another. |
| Psycopg | The PostgreSQL database adapter used by the Python backend. |
| pnpm | The Node.js package manager used for NorthStar's TypeScript workspace and JavaScript dependency lock. |
| RBAC | Role-Based Access Control: permissions assigned through roles. |
| RLS | Row-Level Security: PostgreSQL policies that restrict which database rows an identity may access. |
| RFC 9457 | The Internet standard defining Problem Details, the structured HTTP error format used by NorthStar APIs. |
| SSO | Single Sign-On: authentication allowing one organizational identity to access multiple systems. |
| SQLAlchemy | The Python database toolkit and object-relational mapper used by the NorthStar backend. |
| Smoke test | A focused check that verifies a built or deployed application starts and its essential path is functioning. |
| SEV | Severity level used to classify incidents. SEV1 is NorthStar's highest-severity incident category. |
| UAT | User Acceptance Testing: business-user validation that a release meets its intended requirements. It is not production-deployment approval. |
| Turborepo | The task orchestrator used for NorthStar's TypeScript workspace. It does not orchestrate Python tasks. |
| uv | The Python project and dependency manager used to create reproducible Python environments and the `uv.lock` file. |
| UUID | Universally Unique Identifier: an opaque technical identifier designed to remain stable and avoid predictable sequential IDs. |
| WCAG | Web Content Accessibility Guidelines: the accessibility standard NorthStar targets at level 2.2 AA. |
