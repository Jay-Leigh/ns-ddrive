# @big/design-system

BIG-owned visual foundations shared by the NorthStar applications.

The initial package exports semantic CSS tokens only. Interactive components are admitted later only when they satisfy the accepted frontend standard and ADR 0014: demonstrated cross-application need, accessible behavior and tests, a documented API, no business logic and no trust-zone-specific data behavior.

```css
@import "@big/design-system/tokens.css";
```

Feature code consumes semantic tokens rather than the underlying primitive palette. This package does not merge the applications' runtime, session, middleware or data boundaries.
