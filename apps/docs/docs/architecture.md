# HUMΛN-Ø Architecture & Delivery Plan

## 1. High-Level Overview

**HUMΛN-Ø** is a modern Web3 platform built on a **TypeScript Monorepo** architecture. It combines a high-performance **Expo Web** frontend, a dedicated **Smart Contracts** package, and a **Docusaurus** documentation site, all orchestrated via **GitHub Actions** for continuous delivery.

### Core Principles
- **Monorepo First**: Single source of truth using **Turborepo** and **pnpm workspaces**.
- **Agentic Diamond Architecture**: Clear separation of concerns (Planner, Architect, Implementer, Reviewer) mapped to code structure.
- **Type Safety**: End-to-end typing from Smart Contracts (Solidity) to Frontend (React/TypeScript).
- **Automated Delivery**: CI/CD pipelines for testing, linting, and deploying to GitHub Pages.

---

## 2. Monorepo Structure

We use **Turborepo** with **pnpm workspaces**.
*   **Why Turborepo?** Fast, intelligent caching, and excellent support for task pipelines (build, test, lint).
*   **Why pnpm?** Efficient disk usage and strict dependency management.

### Folder Layout

```text
/human-0
├── package.json          # Root manifest (defines workspaces)
├── pnpm-workspace.yaml   # Workspace configuration
├── turbo.json            # Turborepo pipeline config
├── /apps
│   ├── /web              # Expo Router app (Web-first, Native-ready)
│   └── /docs             # Docusaurus v3 documentation site
├── /packages
│   ├── /contracts        # Hardhat/Foundry contracts + TypeChain types
│   ├── /ui               # Shared UI Design System (Tamagui or NativeWind + primitives)
│   ├── /config           # Shared configurations (ESLint, TS, Prettier)
│   └── /utils            # Shared TypeScript utilities (formatting, math, etc.)
└── /tools                # CI scripts, generators, etc.
```

### Pipeline Wiring (`turbo.json`)
- **`build`**: Depends on `^build`.
- **`test`**: Runs in parallel.
- **`lint`**: Runs in parallel.
- **`dev`**: Runs `apps` in parallel, packages in watch mode.

---

## 3. Expo Web App (`apps/web`)

**Stack**: Expo SDK 50+, Expo Router v3, React 18, TypeScript, NativeWind (Tailwind CSS).
**State**: **Zustand** (Minimalist, scalable, no boilerplate) + **TanStack Query** (Server state/Contract reads).

### Agentic Diamond Architecture Implementation

| Role | Responsibility | Code Location |
| :--- | :--- | :--- |
| **Planner** | Routes, Feature Specs | `app/` (File-system routing), `docs/specs` |
| **Architect** | Domain Modules, Interfaces | `features/*/domain`, `hooks/use*` |
| **Implementer** | UI Components, Screens | `features/*/components`, `components/ui` |
| **Reviewer** | Tests, Storybook | `__tests__`, `app.config.ts` (Config validation) |

### Directory Structure
```text
/apps/web
├── app/                  # Expo Router (Planner)
│   ├── (tabs)/           # Main tabs
│   ├── [auth]/           # Auth routes
│   └── _layout.tsx       # Root layout
├── components/           # Shared atoms/molecules (Implementer)
├── features/             # Domain-driven features (Architect)
│   ├── impact/           # e.g., "Impact" domain
│   │   ├── components/   # Feature-specific UI
│   │   ├── hooks/        # Logic & State
│   │   ├── services/     # API/Contract calls
│   │   └── types.ts      # Domain Interfaces
│   └── wallet/           # Wallet connection logic
├── hooks/                # Global hooks
└── providers/            # Context providers (Web3, Theme, Query)
```

### Web3 Injection
- Use **Wagmi** + **ConnectKit** (or RainbowKit) wrapped in a `Web3Provider`.
- **Decoupling**: Create a `useContract` hook in `packages/contracts` or `apps/web/hooks` that returns typed contract instances. The UI *never* imports `ethers.js` directly; it uses the hook.

---

## 4. Contracts Package (`packages/contracts`)

**Stack**: **Hardhat** (for robust TS integration) + **TypeChain**.
*Alternative*: Foundry is powerful, but Hardhat offers the smoothest "JS/TS Monorepo" experience for teams familiar with TS.

### Structure
```text
/packages/contracts
├── contracts/            # Solidity sources (.sol)
├── scripts/              # Deployment scripts
├── test/                 # Hardhat tests (Mocha/Chai)
├── typechain-types/      # Generated TS bindings (Auto-exported)
└── hardhat.config.ts     # Config
```

### Integration
1.  **Compile**: `pnpm build` runs `hardhat compile` -> generates `typechain-types`.
2.  **Export**: `package.json` exports `typechain-types` and deployment addresses.
3.  **Consume**: `apps/web` imports types: `import { HumanToken__factory } from '@human-0/contracts'`.

---

## 5. Documentation (`apps/docs`)

**Stack**: **Docusaurus v3** (Standard, robust).
*Note*: Docusaurus v4 is currently in beta. We recommend v3 for stability, but v4 can be used if "bleeding edge" is required.

### Information Architecture
- **`/docs/intro`**: Project vision (Net Zero / Web3).
- **`/docs/architecture`**: This document, System diagrams.
- **`/docs/contracts`**: Auto-generated from Solidity (using `solidity-docgen`).
- **`/docs/dev`**: TDD Guide, Setup, Contribution.

### Branding
- **Custom Theme**: Override `src/css/custom.css` with HUMΛN-Ø variables.
- **Font**: Import `Space Grotesk` and `Inter` in `docusaurus.config.ts`.

---

## 6. CI/CD & GitHub Pages

### Workflows
1.  **`ci.yml`**: Runs on PR.
    *   `pnpm install` (with cache).
    *   `pnpm turbo run lint test build`.
2.  **`deploy-web.yml`**: Runs on push to `main`.
    *   Builds Expo Web: `npx expo export -p web`.
    *   Deploys to `gh-pages` (root `/` or `/app`).
3.  **`deploy-docs.yml`**: Runs on push to `main`.
    *   Builds Docusaurus: `pnpm build`.
    *   Deploys to `gh-pages` (subfolder `/docs`).

### Routing Strategy
- **User Site**: `https://<org>.github.io/human-0/` (Expo Web)
- **Docs**: `https://<org>.github.io/human-0/docs/` (Docusaurus)
*Config*: Set `baseUrl: "/human-0/"` in Expo and `baseUrl: "/human-0/docs/"` in Docusaurus.

---

## 7. Design System

**Theme**: "Deep Space & Neon"
- **Background**: `#050B10`
- **Primary**: `#00FF9C` (Neon Green)
- **Accent**: `#CDA464` (Gold)
- **Text**: `#E6ECE8`

**Typography**:
- Headers: **Space Grotesk**
- Body: **Inter**
- Code: **JetBrains Mono**

**Implementation**:
- **Tailwind Config**: Shared in `packages/config/tailwind.config.js`.
- **Fonts**: Loaded via `expo-font` in `apps/web/_layout.tsx`.

---

## 8. TDD Strategy

**Cycle**:
1.  **Red**: Write a failing test in `__tests__` (e.g., "Wallet hook should return balance").
2.  **Green**: Implement the minimal logic in `features/wallet/hooks`.
3.  **Refactor**: Clean up code, ensure types are strict.

**Tools**:
- **Unit**: Jest (Logic).
- **Components**: React Testing Library (RTL).
- **Contracts**: Hardhat (Chai matchers).
- **E2E**: Playwright (Optional, for critical flows).

---

## 9. Agentic Roles in Action

- **Planner**: Creates a new Markdown file in `apps/docs/docs/specs` defining the "Minting Flow".
- **Architect**: Creates the `features/mint` folder structure and defines `MintService` interface.
- **Implementer**: Codes the `MintScreen.tsx` and `useMint.ts` hook, satisfying the interface.
- **Reviewer**: Runs `pnpm test`, checks strict linting rules, and verifies the PR.

