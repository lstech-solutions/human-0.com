# Contributing to HUMΛN-Ø

## The Agentic Diamond Workflow

We follow a strict **Agentic Diamond** process. When picking up a task, identify which role you are currently playing:

1.  **Planner**: Define the *what* and *why*. Write a spec in `apps/docs/docs/specs`.
2.  **Architect**: Define the *how*. Create interfaces, types, and folder structures.
3.  **Implementer**: Write the code to satisfy the Architect's design.
4.  **Reviewer**: Verify quality with tests and linting.

---

## TDD Workflow (Test Driven Development)

**You must write tests before implementation.**

### 1. The Red Phase (Failing Test)
Create a test file in `__tests__` or alongside your component (e.g., `feature.test.ts`).

```typescript
// features/wallet/hooks/__tests__/useBalance.test.ts
describe('useBalance', () => {
  it('should return 0 when wallet is not connected', () => {
    const { result } = renderHook(() => useBalance());
    expect(result.current.balance).toBe(0);
  });
});
```

### 2. The Green Phase (Implementation)
Implement just enough code to pass the test.

```typescript
// features/wallet/hooks/useBalance.ts
export const useBalance = () => {
  return { balance: 0 }; // Minimal implementation
};
```

### 3. The Refactor Phase
Clean up, add types, optimize.

---

## Coding Standards

### Styling
- Use **Tailwind CSS** (via NativeWind in Expo).
- Follow the **Deep Space** theme.
- **Do not hardcode colors**. Use `theme.colors.primary` or Tailwind classes like `bg-primary`.

### Components
- **Atoms**: Small, dumb components (Button, Input).
- **Molecules**: Combinations of atoms (SearchForm).
- **Organisms**: Complex sections (HeroSection).
- **Templates**: Page layouts.

### Git Conventions
- **Branches**: `feat/feature-name`, `fix/bug-name`, `docs/doc-name`.
- **Commits**: Conventional Commits (`feat: add wallet connect`, `fix: resolve hydration error`).

## Pull Request Process
1.  Run `pnpm test` and `pnpm lint` locally.
2.  Open a PR against `main`.
3.  Ensure CI passes.
4.  Request review from a peer.
