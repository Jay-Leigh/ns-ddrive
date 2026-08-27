# ADR 0004: Identity zones, MFA and sessions

- **Status:** Proposed
- **Date:** 27 August 2026
- **Decision owner:** Security owner
- **Reviewers:** Backend lead; frontend lead; InfluenceHub lead; privacy owner
- **Source:** Accepted NorthStar Architecture Decision Register, section 6

## Context

NorthStar serves staff and invited clients while InfluenceHub separately serves freelancers. Authentication must prevent identities crossing trust zones and must not turn identity-provider claims into authoritative business permissions.

## Decision

Use Firebase Authentication with Google Cloud Identity Platform capabilities.

- Staff use dedicated BIG staff projects per environment and mandatory TOTP authenticator-app MFA.
- Client review uses separate client Firebase projects and invite-only passwordless OTP or magic-link authentication.
- Freelancers remain in the InfluenceHub authentication zone. BIG rejects their issuer or identity zone before business authorisation.
- Organisation SSO remains Deferred until an enterprise requirement or identity-management need triggers it.

Each application owns its session. BFFs use `HttpOnly`, `Secure` cookies and do not persist ID tokens in browser local storage. Apply explicit CSRF tokens, Origin/Referer checks, content-type controls and unsafe-method protection.

Initial staff sessions have a 30-minute inactivity limit and 10-hour absolute lifetime. Client-review sessions have a 30-minute inactivity limit and 4-hour absolute lifetime. Sensitive actions require authentication no older than 15 minutes. UAT may adjust these internal settings through documented security review.

The FastAPI backend independently verifies identity or the server-issued session. Admin invitations automatically provision or link identity; administrators do not copy Firebase UIDs manually. MFA recovery is admin-assisted, audited, revokes sessions and requires re-enrolment, with a second approver for access administrators where practicable.

## Alternatives considered

- One Firebase project for all users: rejected because trust-zone separation would be weaker.
- Browser-held bearer tokens: rejected because token theft impact is greater.
- Organisation SSO at foundation: deferred because current complexity exceeds demonstrated need.

## Consequences

There are more identity projects and operational flows, but issuer isolation and client/staff separation are explicit.

## Security and privacy

Do not place business roles, organisation IDs or project IDs in browser-trusted claims. Log no tokens, cookies or OTP values.

## Operations and migration

Create six named Firebase projects from the register, automate invitation linking and document MFA recovery.

## Acceptance checks

- Threat-model issuer confusion, CSRF and session fixation.
- Test freelancer rejection before business authorisation.
- Approve MFA recovery roles and audit events.

## Review triggers

Revisit for enterprise SSO, material UAT session problems or a change in identity-provider capabilities.

