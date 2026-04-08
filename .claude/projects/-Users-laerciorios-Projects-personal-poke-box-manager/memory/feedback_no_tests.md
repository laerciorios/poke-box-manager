---
name: No automated tests
description: User does not want automated tests in this project — skip all test tasks and don't install test frameworks
type: feedback
---

Do not write automated tests, test files, or install test frameworks (Vitest, Jest, Playwright, Testing Library, etc.) in this project.

**Why:** User explicitly said "não quero testes automatizados, pode remover" (I don't want automated tests, can remove) when tests were being written during preset-system-builtin implementation.

**How to apply:** When implementing tasks that include writing tests, skip those tasks entirely. If a proposal or task list includes test tasks, remove or skip them. Don't install vitest, @testing-library, or similar packages. Don't add test scripts to package.json. Keep `tsc --noEmit` for TypeScript verification as that's not a test framework.
