# HUMΛN-Ø Setup Guide

## Prerequisites
- **Node.js**: v18+ (LTS recommended)
- **pnpm**: v8+ (`npm install -g pnpm`)
- **Git**: Latest version

## 1. Initialization

If you are starting fresh:

```bash
# Clone the repo
git clone https://github.com/YOUR_ORG/human-0.git
cd human-0

# Install dependencies
pnpm install
```

## 2. Development

We use **Turborepo** to manage tasks.

### Start All Apps
```bash
pnpm dev
```
- **Web App**: [http://localhost:8081](http://localhost:8081)
- **Docs**: [http://localhost:3000](http://localhost:3000)

### Start Specific Workspace
```bash
pnpm --filter @human-0/web dev
# or
pnpm --filter @human-0/docs start
```

## 3. Contracts

### Compile & Generate Types
```bash
pnpm build --filter @human-0/contracts
```
This runs Hardhat compile and generates TypeChain bindings in `packages/contracts/typechain-types`.

### Run Contract Tests
```bash
pnpm test --filter @human-0/contracts
```

## 4. Testing & Linting

### Run All Tests
```bash
pnpm test
```

### Lint All Code
```bash
pnpm lint
```

## 5. Deployment

Deployment is handled by GitHub Actions, but you can build locally:

```bash
# Build Web App (Static Export)
pnpm build --filter @human-0/web

# Build Docs
pnpm build --filter @human-0/docs
```
