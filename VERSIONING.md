# 🚀 HUMΛN-Ø Version Management System

## 📋 Overview

This project implements a comprehensive semantic versioning system with automatic changelog tracking, git integration, and release management.

## 🎯 Features

- **Semantic Versioning**: Follows semver.org standards (major.minor.patch)
- **Auto Changelog**: Automatically tracks and formats changes in CHANGELOG.md
- **Git Integration**: Auto-commits version changes and creates git tags
- **CI/CD Integration**: GitHub Actions for automated versioning
- **CLI Tools**: Command-line interface for version management
- **Release Management**: Automated GitHub releases

## 🛠️ Installation

The versioning system is built into the project. No additional installation required.

## 📚 Usage

### Basic Commands

```bash
# View current version
npm run version:current

# Bump patch version (bug fixes)
npm run version:patch

# Bump minor version (new features)
npm run version:minor

# Bump major version (breaking changes)
npm run version:major

# View changelog
npm run version:changelog

# Full release (bump + push)
npm run release
```

### Advanced Usage

```bash
# Custom version bump with changes
node scripts/version-manager.js bump minor "Added new feature" "Improved performance" --commit

# View full changelog
node scripts/version-manager.js changelog

# Manual commit with version
node scripts/version-manager.js commit "Custom commit message"
```

## 📁 File Structure

```
human-0/
├── version.json              # Version data and changelog source
├── package.json              # Project version and scripts
├── CHANGELOG.md              # Generated version history
├── PROPER.md                 # Legacy project documentation (no longer used for versioning)
├── scripts/
│   └── version-manager.js    # Version management CLI
├── .github/workflows/
│   └── version.yml           # CI/CD versioning workflow
└── VERSIONING.md             # This documentation
```

## 🔄 Version Types

| Type | Description | Example |
|------|-------------|---------|
| **Major** | Breaking changes or major releases | 1.0.0 → 2.0.0 |
| **Minor** | New features, backward compatible | 1.0.0 → 1.1.0 |
| **Patch** | Bug fixes, minor improvements | 1.0.0 → 1.0.1 |

## 📊 Version Data Structure

```json
{
  "name": "human-zero",
  "version": "1.0.0",
  "build": "20250125012800",
  "changelog": {
    "current": {
      "version": "1.0.0",
      "date": "2025-01-25",
      "type": "major",
      "changes": [...]
    },
    "history": [...]
  },
  "semver": {
    "major": 1,
    "minor": 0,
    "patch": 0,
    "prerelease": null,
    "build": null
  },
  "metadata": {
    "lastModified": "2025-01-25T01:28:00.000Z",
    "commitHash": "abc123",
    "branch": "main",
    "author": "HUMΛN-Ø Team"
  }
}
```

## 🤖 Automation

### GitHub Actions

The system includes automated workflows:

1. **Version Check**: Validates version on push/PR
2. **Auto Version**: Automatically bumps patch version on main branch
3. **Release**: Creates GitHub releases with changelog

### Auto-Commit Process

When using version commands with `--commit`:

1. Updates `version.json` with new version
2. Updates `package.json` version field
3. Updates `CHANGELOG.md` with the latest changelog section
4. Creates git commit with version info
5. Creates git tag (v1.0.0)
6. Pushes changes to repository

## 📝 Changelog Format

The changelog follows this format in CHANGELOG.md:

```markdown
## 📋 Version History

### 🚀 Version 1.0.0 **[CURRENT]**
**Date:** 2025-01-25  
**Type:** major

**Changes:**
- Initial release of HUMΛN-Ø Business Model Canvas
- Complete implementation of 9 Business Model Canvas components
- Professional PDF export functionality
- Full-screen modal drawer system
```

## 🔧 Configuration

### Environment Variables

- `GITHUB_TOKEN`: For GitHub Actions releases
- `GIT_AUTHOR_NAME`: Git commit author name
- `GIT_AUTHOR_EMAIL`: Git commit author email

### Customization

You can customize the versioning behavior by editing:

- `scripts/version-manager.js`: CLI logic and behavior
- `package.json`: Scripts and configuration
- `.github/workflows/version.yml`: CI/CD pipeline

## 🚀 Release Process

### Manual Release

1. Make your changes
2. Run appropriate version command:
   ```bash
   npm run version:patch  # for fixes
   npm run version:minor  # for features
   npm run version:major  # for breaking changes
   ```
3. Review the auto-generated commit
4. Push to repository:
   ```bash
   git push --follow-tags
   ```

### Automated Release

The system automatically:
- Detects meaningful changes
- Bumps patch version
- Creates git commit and tag
- Generates GitHub release

## 🐛 Troubleshooting

### Common Issues

1. **Git not initialized**: Initialize git repository first
2. **Permission denied**: Use `chmod +x scripts/version-manager.js`
3. **JSON parse error**: Check `version.json` syntax
4. **Commit fails**: Check git configuration and permissions

### Debug Mode

Run with debug information:
```bash
DEBUG=1 node scripts/version-manager.js current
```

## 📞 Support

For issues or questions:
1. Check this documentation
2. Review `CHANGELOG.md` for release history
3. Check GitHub Issues for known problems

## 🔄 Migration

To migrate from another versioning system:

1. Set initial version in `version.json`
2. Update `package.json` version
3. Import existing changelog to `CHANGELOG.md`
4. Test version commands
5. Commit initial version

---

*This versioning system ensures consistent, automated, and traceable version management for the HUMΛN-Ø project.*
