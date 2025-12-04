# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.5] - 2024-12-03

### Fixed
- Corrected Ethereum address format in tests and validation utilities
- Fixed placeholder addresses to have exactly 40 hex characters (not 41)
- All test addresses now properly match `/^0x[a-fA-F0-9]{40}$/` pattern

## [1.0.4] - 2024-12-02

### Fixed
- Fixed contract address validation error by updating placeholder addresses to proper 40-character hex format
- Updated all contract addresses in posh-sdk, wagmi-config, and validation utilities

## [1.0.3] - 2024-12-01

### Fixed
- Various bug fixes and improvements

## [1.0.2] - 2024-12-01

### Fixed
- Build and configuration improvements

## [1.0.1] - 2024-11-30

### Fixed
- Renamed `.eslintrc.js` to `.eslintrc.cjs` for ESM compatibility
- Fixed CI lint errors caused by ES module scope

### Changed
- Improved documentation formatting

## [1.0.0] - 2024-11-30

### 🎉 First Independent Release

This is the first stable release of `@human-0/posh-sdk` with independent versioning from the monorepo.

### Added
- **Blockchain Agnostic Design**: SDK now works with any EVM-compatible chain
- **ESLint Configuration**: Added TypeScript linting rules for code quality
- **Multi-Chain Examples**: Configuration examples for Ethereum, Polygon, Base, and more
- **Independent Versioning**: SDK now follows its own semantic versioning

### Changed
- **Documentation**: Updated README to emphasize blockchain agnostic nature
- **Versioning Strategy**: Decoupled from monorepo versioning for clearer npm releases

### Previous Development (Pre-1.0.0)

## [0.2.0] - 2024-11-30

### Added
- Provider abstraction layer for framework-agnostic blockchain interactions
- `BaseProvider` interface for standardized provider operations
- `ViemProvider` adapter with full read/write support
- `WagmiProvider` adapter (basic implementation)
- `EthersProvider` adapter with full read/write support
- Write operations for IdentityManager (`register()`, `linkExternalProof()`)
- Gas estimation methods (`estimateRegisterGas()`, `estimateLinkProofGas()`)
- Provider support across all managers (Identity, Proof, Score, Events)

### Changed
- `PoshClient` now accepts optional `provider` parameter for write operations
- All managers updated to support provider-based blockchain interactions
- Improved TypeScript type safety for provider operations
- Enhanced error handling for provider-related operations

### Technical
- Resolved type conflicts between provider and SDK event types
- Added proper TypeScript casting for contract ABIs
- Improved build configuration for provider exports

## [0.1.0] - 2024-11-30

### Added
- Initial release of @human-0/posh-sdk
- Core SDK with PoshClient, IdentityManager, ProofManager, ScoreManager, EventManager
- React hooks layer with PoshProvider and comprehensive hooks
- Multi-deployment support for decentralized architecture
- TypeScript support with full type definitions
- Configuration validation and defaults
- Caching utility with TTL support
- Retry logic with exponential backoff
- Error handling with custom error classes
- Formatting utilities for addresses and values
- Mock implementations for development without deployed contracts
- Comprehensive documentation and examples
- 46 passing tests

### Features
- `PoshClient` - Main SDK client
- `useIdentity` - React hook for identity management
- `useProofs` - React hook for proof queries
- `useScore` - React hook for score tracking
- `useEvents` - React hook for event subscriptions
- Multi-deployment registry system
- Contract ABI and address management
- React Query integration for caching

### Documentation
- README with quick start guide
- SETUP guide with detailed instructions
- INTEGRATION guide for Expo Web
- MULTI_DEPLOYMENT guide for decentralization
- API reference documentation
- Multiple usage examples
- Publishing guide

### Developer Experience
- Full TypeScript support
- ESM and CJS builds
- Source maps included
- Comprehensive error messages
- IDE autocomplete support

[Unreleased]: https://github.com/lstech-solutions/human-0.com/compare/posh-sdk-v1.0.5...HEAD
[1.0.5]: https://github.com/lstech-solutions/human-0.com/compare/posh-sdk-v1.0.4...posh-sdk-v1.0.5
[1.0.4]: https://github.com/lstech-solutions/human-0.com/compare/posh-sdk-v1.0.3...posh-sdk-v1.0.4
[1.0.3]: https://github.com/lstech-solutions/human-0.com/compare/posh-sdk-v1.0.2...posh-sdk-v1.0.3
[1.0.2]: https://github.com/lstech-solutions/human-0.com/compare/posh-sdk-v1.0.1...posh-sdk-v1.0.2
[1.0.1]: https://github.com/lstech-solutions/human-0.com/compare/posh-sdk-v1.0.0...posh-sdk-v1.0.1
[1.0.0]: https://github.com/lstech-solutions/human-0.com/releases/tag/posh-sdk-v1.0.0
[0.2.0]: https://github.com/lstech-solutions/human-0.com/releases/tag/v0.2.0
[0.1.0]: https://github.com/lstech-solutions/human-0.com/releases/tag/v0.1.0
