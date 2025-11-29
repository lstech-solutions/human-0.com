<div align="center">

  <h1>HUMΛN-Ø</h1>

  <p><strong>Sustainable impact through Web3 technology.</strong><br/>
  A TypeScript monorepo for building climate-positive, human-centric experiences on-chain.</p>

  <p>
    <a href="https://github.com/lstech-solutions/human-0.com/actions/workflows/ci.yml">
      <img alt="CI" src="https://github.com/lstech-solutions/human-0.com/actions/workflows/ci.yml/badge.svg" />
    </a>
    <a href="https://github.com/lstech-solutions/human-0.com/actions/workflows/deploy-web.yml">
      <img alt="Web Deploy" src="https://github.com/lstech-solutions/human-0.com/actions/workflows/deploy-web.yml/badge.svg" />
    </a>
    <a href="https://human-0.com/docs/intro">
      <img alt="Docs" src="https://github.com/lstech-solutions/human-0.com/actions/workflows/deploy-docs.yml/badge.svg" />
    </a>
    <a href="https://github.com/lstech-solutions/human-0.com/actions/workflows/deploy-lambda.yml">
      <img alt="Lambda Deploy" src="https://github.com/lstech-solutions/human-0.com/actions/workflows/deploy-lambda.yml/badge.svg" />
    </a>
    <a href="https://github.com/lstech-solutions/human-0.com/actions/workflows/version.yml">
      <img alt="Versioning" src="https://github.com/lstech-solutions/human-0.com/actions/workflows/version.yml/badge.svg" />
    </a>
  </p>

  <p>
    <a href="#getting-started">Getting Started</a>
    ·
    <a href="#monorepo-architecture">Architecture</a>
    ·
    <a href="#contributing">Contributing</a>
    ·
    <a href="#license">License</a>
  </p>

</div>

---

## Vision

HUMΛN-Ø is an **agentic, Web3-native platform** designed to turn climate and social impact into something you can **see, verify, and own**.

Built as a **TypeScript monorepo** with **Expo Web**, **smart contracts**, **a dedicated docs site**, and **automated CI/CD**, this repository is the home for the core HUMAN‑0 experience.

> From prototype to planet-scale: this repo is the launchpad.

---

## Features

- **Web3 Frontend (Expo Web)** – React/TypeScript app using Expo Router for web-first, native-ready experiences.
- **Smart Contracts Package** – Hardhat + TypeChain, wired for typed contract access from the web app.
- **Documentation Site** – Docusaurus v3 docs for vision, architecture, and developer guides.
- **Design System** – Shared UI primitives with a deep-space & neon aesthetic.
- **Agentic Diamond Architecture** – Planner, Architect, Implementer, Reviewer mapped into the codebase.
- **Automated CI/CD** – GitHub Actions for lint, test, build, web/docs deploy, versioning, and lambda delivery.

---

## Monorepo Architecture

HUMΛN-Ø uses **Turborepo** + **pnpm workspaces**.

```text
human-0.com
├── package.json          # Root manifest (scripts, tooling, description)
├── pnpm-workspace.yaml   # Workspace configuration
├── turbo.json            # Turborepo pipeline config
├── apps
│   ├── web               # Expo Router app (web-first, native-ready)
│   └── docs              # Docusaurus documentation site
├── packages
│   ├── contracts         # Smart contracts (Hardhat + TypeChain)
│   ├── ui                # Shared design system components
│   ├── config            # Shared ESLint / TS / Prettier / Tailwind config
│   └── i18n              # Localisation utilities and translations
└── lambda                # Serverless backend entrypoint(s)
```

For a deeper technical breakdown, see **`ARCHITECTURE.md`**.

---

## Getting Started

### Prerequisites

- **Node.js** (LTS recommended)
- **pnpm** (the repo is tuned for pnpm workspaces)
- **git** and a modern browser

### Install

```bash
pnpm install
```

### Run everything in dev mode

```bash
pnpm dev
```

This uses **Turborepo** to start the relevant apps in parallel.

### Focused app workflows

- **Web app (Expo Web)**

  ```bash
  pnpm web:dev
  ```

- **Docs (Docusaurus)**

  ```bash
  pnpm --filter @human-0/docs dev
  ```

> Tip: Check `ARCHITECTURE.md` for the latest recommended dev flow.

---

## Development

### Common scripts

At the root:

```bash
pnpm build       # turbo run build
pnpm lint        # turbo run lint
pnpm test        # turbo run test
pnpm web:build   # build web app only
pnpm web:test    # test web app only
pnpm web:lint    # lint web app only
```

Code style is enforced via **Prettier** and shared config in `packages/config`.

### Agentic Diamond Flow

The repo is structured to make work visible across four roles:

- **Planner** – defines routes, flows, and specs (Expo Router, docs specs).
- **Architect** – shapes domains, services, and interfaces.
- **Implementer** – builds the UI and logic that users touch.
- **Reviewer** – writes and runs tests, enforces CI gates.

See **`ARCHITECTURE.md` → Agentic Roles in Action** for concrete examples.

---

## Web3 & Contracts

The `packages/contracts` workspace holds the on-chain logic.

- **Stack**: Hardhat, TypeChain, TypeScript.
- **Flow**:
  - `pnpm build` compiles contracts and generates typed bindings.
  - Web app consumes generated factories/types from `@human-0/contracts`.

Frontends access contracts through dedicated hooks/services, keeping UI components framework-agnostic and testable.

---

## Docs

The docs live in `apps/docs` and are built with **Docusaurus v3**.

- Vision & story: `/docs/intro`
- Architecture & diagrams: `/docs/architecture`
- Contracts reference: `/docs/contracts`
- Developer onboarding: `/docs/dev`

Docs are deployed via GitHub Actions (`deploy-docs.yml`).

---

## Lambda / Serverless

The `lambda` folder contains the serverless entrypoint(s), typically deployed via **AWS Lambda**.

- Entry: `lambda/index.js`
- Deployment: `.github/workflows/deploy-lambda.yml`

Use this for off-chain computation, integrations, or sensitive workflows that should not live in the client.

---

## CI/CD

GitHub Actions power the continuous delivery pipeline:

- **`ci.yml`** – install, lint, test, build on pull requests.
- **`deploy-web.yml`** – build and deploy the Expo web app.
- **`deploy-docs.yml`** – build and deploy the docs site.
- **`deploy-lambda.yml`** – package and deploy Lambda artifacts.
- **`version.yml`** – manages semantic versioning + changelog.
- **`sync-translations.yml`** – ensures i18n resources stay in sync.

Status is surfaced at the top of this README via badges.

---

## Versioning & Releases

This repo is versioned as a unified monorepo (`version.json` + `VERSIONING.md`).

Convenience scripts:

```bash
pnpm version:patch   # bump patch, update changelog, create tag
pnpm version:minor   # bump minor
pnpm version:major   # bump major
pnpm release         # bump patch and push with tags
```

See **`VERSIONING.md`** and **`CHANGELOG.md`** for details.

---

## Contributing

We welcome contributions that move HUMΛN‑Ø closer to a **sustainable, open Web3 commons**.

### Local dev loop

1. **Fork** the repo and create a feature branch.
2. Run `pnpm install` and `pnpm dev`.
3. Add or update tests.
4. Run `pnpm lint` and `pnpm test` until they are green.
5. Open a PR with a clear description and link to any relevant issues/specs.

> For more detailed guidelines, see **`CONTRIBUTING.md`**.

---

## License

Unless otherwise noted in specific subdirectories, this project is released under an open-source license suitable for collaborative climate and Web3 innovation.

See **`LICENSE`** (or the root license file once added) for full terms.

