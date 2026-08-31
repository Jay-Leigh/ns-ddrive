# BIG-owned packages

This directory contains BIG-specific packages owned by BIG, subject to the executed commercial agreement.

Admit only packages with a clear BIG-specific responsibility. Initial candidates are purpose-specific packages such as `@big/contracts` and `@big/design-system`. Do not create a generic `@big/core` package.

Package code must expose an explicit public interface and must not rely on cross-feature deep imports.
