# ADR 0014: Frontend styling and design-token baseline

- **Status:** Accepted
- **Date:** 30 August 2026
- **Accepted:** 30 August 2026 by Mkhuphuli, Tech Lead
- **Decision owner:** Tech Lead
- **Reviewers:** Frontend lead; accessibility reviewer; product owner
- **Source:** Accepted NorthStar Architecture Decision Register, section 10.5; BIG Frontend Architecture and Development Standards, section 19

## Context

NorthStar has separate staff and client-review Next.js applications that require consistent BIG visual language without collapsing their trust boundaries. The accepted frontend standard permits an eventual `@big/design-system` package but intentionally deferred the styling framework until an explicit decision. The baseline must support Server Components, WCAG 2.2 AA, predictable static styling and gradual promotion of proven shared components.

## Decision

Use Tailwind CSS v4 as the primary styling framework. Semantic CSS custom properties are the stable application-facing design-token interface. Primitive palette or scale tokens may support semantic tokens but feature code does not normally consume primitive tokens directly.

Use CSS Modules only when component-specific selectors, keyframes or other styling complexity are clearer than Tailwind utilities. CSS Modules consume the same semantic tokens and do not establish a parallel token system.

Radix Primitives may be adopted selectively for complex interactive controls such as dialogs, menus, popovers and tooltips. Radix does not itself prove WCAG 2.2 AA compliance; NorthStar remains responsible for accessible naming, focus behavior, keyboard operation, contrast, motion, announcements and workflow tests.

Do not add a runtime CSS-in-JS library or opinionated visual component suite to the foundation baseline. This is a baseline exclusion based on runtime and integration complexity, not a claim that such libraries cannot work with Next.js. A future need requires a separately reviewed decision.

Do not install or import shadcn/ui patterns automatically. Evaluate a pattern individually, preserve required third-party provenance and licensing, convert it to BIG semantic tokens, and apply NorthStar review and test requirements.

Adopt `clsx`, `tailwind-merge`, class-variance-authority (CVA) and `prettier-plugin-tailwindcss` only when their implementation need occurs. Configure the Tailwind Prettier plugin against the correct Tailwind v4 stylesheet in each monorepo consumer.

The token architecture may support future theming, but this decision does not commit NorthStar to dark mode or multi-tenant branding.

## Alternatives considered

- CSS Modules alone: viable and low-dependency, but rejected as the primary approach because consistent utility and token use across two applications would require more local conventions and repeated CSS.
- Runtime CSS-in-JS or a visual component suite: viable in supported Next.js boundaries, but rejected from the foundation because it adds styling runtime, registry or opinionated-system complexity that is not currently justified.
- Tailwind plus automatic shadcn/ui adoption: rejected because copied patterns would bypass component-by-component admission, provenance, token and accessibility review.
- A complete design system before application work: rejected because the accepted admission rules require demonstrated reuse or a clear platform-wide need.

## Consequences

Most component styling remains colocated as Tailwind utilities backed by semantic tokens. Exceptional CSS remains locally scoped. Shared primitives can converge gradually without forcing premature package APIs. Developers must avoid arbitrary values that bypass approved tokens when a semantic token exists.

## Security and privacy

Styling and design-system code contains no authorization logic, secrets or trust-zone-specific data behavior. Shared components must not expose internal data through labels, diagnostics, DOM attributes or visual-only hiding. Client-safe DTO construction remains a backend responsibility.

## Operations

Pin Tailwind and related tooling in the workspace lockfile. Production builds verify generated CSS and both frontend applications independently. Monitor bundle size and client-component boundaries when adopting interactive primitives.

## Migration

During frontend scaffolding, add Tailwind v4 and the shared semantic-token source to each application. Begin with application-local components. Promote a component into `@big/design-system` only after it meets the accepted admission criteria. Later token or component migrations use reviewed, incremental changes rather than a bulk unverified conversion.

## Acceptance checks

- Verify Tailwind v4 production builds in both Next.js applications.
- Verify semantic tokens are consumed consistently by Tailwind and any CSS Modules.
- Test adopted Radix-based controls against applicable WCAG 2.2 AA behavior.
- Verify no styling dependency collapses the separate application runtime or trust boundaries.
- Verify optional class-composition and formatting tools are added only with a demonstrated use and compatible configuration.

## Review triggers

Review when brand or theming requirements change, accessibility findings show a systemic primitive weakness, Tailwind introduces a material migration, repeated styling patterns justify design-system promotion, or measured bundle/build evidence shows the baseline is ineffective.
