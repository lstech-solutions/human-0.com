#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class VersionManager {
  constructor() {
    this.versionPath = path.join(__dirname, '../version.json');
    this.packagePath = path.join(__dirname, '../package.json');
    this.changelogPath = path.join(__dirname, '../CHANGELOG.md');
    this.webVersionPath = path.join(__dirname, '../apps/web/version.json');
    this.versionData = this.loadVersion();
  }

  loadVersion() {
    try {
      return JSON.parse(fs.readFileSync(this.versionPath, 'utf8'));
    } catch (error) {
      console.error('Error loading version.json:', error.message);
      process.exit(1);
    }
  }

  saveVersion() {
    fs.writeFileSync(this.versionPath, JSON.stringify(this.versionData, null, 2));
    this.saveWebVersion();
  }

  saveWebVersion() {
    try {
      fs.writeFileSync(this.webVersionPath, JSON.stringify(this.versionData, null, 2));
      console.log(`✅ Updated apps/web/version.json to ${this.versionData.version}`);
    } catch (error) {
      console.error('Error updating apps/web/version.json:', error.message);
    }
  }

  updatePackageVersion() {
    try {
      // Update root package.json
      const packageData = JSON.parse(fs.readFileSync(this.packagePath, 'utf8'));
      packageData.version = this.versionData.version;
      fs.writeFileSync(this.packagePath, JSON.stringify(packageData, null, 2));
      
      // Update all app package.json files
      const appsPath = path.join(__dirname, '../apps');
      const packagesPath = path.join(__dirname, '../packages');
      
      // Update apps
      if (fs.existsSync(appsPath)) {
        const apps = fs.readdirSync(appsPath);
        apps.forEach(app => {
          const appPackagePath = path.join(appsPath, app, 'package.json');
          if (fs.existsSync(appPackagePath)) {
            try {
              const appPackageData = JSON.parse(fs.readFileSync(appPackagePath, 'utf8'));
              appPackageData.version = this.versionData.version;
              fs.writeFileSync(appPackagePath, JSON.stringify(appPackageData, null, 2));
              console.log(`✅ Updated ${app}/package.json to ${this.versionData.version}`);
            } catch (error) {
              console.error(`Error updating ${app}/package.json:`, error.message);
            }
          }
        });
      }
      
      // Update packages
      if (fs.existsSync(packagesPath)) {
        const packages = fs.readdirSync(packagesPath);
        packages.forEach(pkg => {
          const pkgPackagePath = path.join(packagesPath, pkg, 'package.json');
          if (fs.existsSync(pkgPackagePath)) {
            try {
              const pkgPackageData = JSON.parse(fs.readFileSync(pkgPackagePath, 'utf8'));
              pkgPackageData.version = this.versionData.version;
              fs.writeFileSync(pkgPackagePath, JSON.stringify(pkgPackageData, null, 2));
              console.log(`✅ Updated packages/${pkg}/package.json to ${this.versionData.version}`);
            } catch (error) {
              console.error(`Error updating packages/${pkg}/package.json:`, error.message);
            }
          }
        });
      }
      
      // Update lambda package.json
      const lambdaPackagePath = path.join(__dirname, '../lambda/package.json');
      if (fs.existsSync(lambdaPackagePath)) {
        try {
          const lambdaPackageData = JSON.parse(fs.readFileSync(lambdaPackagePath, 'utf8'));
          lambdaPackageData.version = this.versionData.version;
          fs.writeFileSync(lambdaPackagePath, JSON.stringify(lambdaPackageData, null, 2));
          console.log(`✅ Updated lambda/package.json to ${this.versionData.version}`);
        } catch (error) {
          console.error(`Error updating lambda/package.json:`, error.message);
        }
      }
      
    } catch (error) {
      console.error('Error updating package.json:', error.message);
    }
  }

  incrementVersion(type = 'patch', changes = []) {
    const { major, minor, patch } = this.versionData.semver;
    
    switch (type) {
      case 'major':
        this.versionData.semver.major = major + 1;
        this.versionData.semver.minor = 0;
        this.versionData.semver.patch = 0;
        break;
      case 'minor':
        this.versionData.semver.minor = minor + 1;
        this.versionData.semver.patch = 0;
        break;
      case 'patch':
        this.versionData.semver.patch = patch + 1;
        break;
      default:
        console.error('Invalid version type. Use: major, minor, or patch');
        return;
    }

    // Update version string
    this.versionData.version = `${this.versionData.semver.major}.${this.versionData.semver.minor}.${this.versionData.semver.patch}`;
    
    // Update build number
    this.versionData.build = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
    
    // Update metadata
    this.versionData.metadata.lastModified = new Date().toISOString();
    
    // Auto-detect changes if none provided
    if (changes.length === 0) {
      changes = this.detectChanges();
    }
    
    // Update changelog
    this.updateChangelog(type, changes);
    
    // Save files
    this.saveVersion();
    this.updatePackageVersion();
    this.updateChangelogFile();
    
    console.log(`✅ Version updated to ${this.versionData.version}`);
  }

  detectChanges() {
    try {
      // Get git diff to detect changes
      const output = execSync('git diff --name-only HEAD~1', { encoding: 'utf8' });
      const changedFiles = output.trim().split('\n').filter(f => f.length > 0);
      
      const changes = [];
      let hasLambdaChanges = false;
      let hasUIChanges = false;
      let hasAPIChanges = false;
      let hasVersionChanges = false;
      let hasConfigChanges = false;
      let hasDocsChanges = false;
      
      // Analyze changed files and categorize
      changedFiles.forEach(file => {
        // Skip cache and temporary files
        if (file.includes('.turbo/') || file.includes('node_modules/') || file.includes('.git/') || 
            file.includes('.cache') || file.includes('dist/') || file.includes('build/')) {
          return;
        }
        
        if (file.includes('lambda/')) {
          hasLambdaChanges = true;
        } else if (file.includes('apps/web/') && file.includes('.tsx')) {
          hasUIChanges = true;
        } else if (file.includes('apps/web/') && file.includes('.ts')) {
          hasAPIChanges = true;
        } else if (file.includes('version-manager.js') || file.includes('version.json')) {
          hasVersionChanges = true;
        } else if (file.includes('README.md') || file.includes('CHANGELOG.md')) {
          hasDocsChanges = true;
        } else if (file.includes('.config.') || file.includes('turbo.json') || file.includes('package.json')) {
          hasConfigChanges = true;
        }
      });
      
      // Generate concise change descriptions
      if (hasLambdaChanges) changes.push('Fixed lambda proxy configuration');
      if (hasUIChanges) changes.push('UI component improvements');
      if (hasAPIChanges) changes.push('API endpoint updates');
      if (hasVersionChanges) changes.push('Version management enhancements');
      if (hasConfigChanges) changes.push('Configuration updates');
      if (hasDocsChanges) changes.push('Documentation updates');
      
      // If no categorized changes, provide generic description
      if (changes.length === 0 && changedFiles.length > 0) {
        changes.push('Code improvements and fixes');
      }
      
      return changes.length > 0 ? changes : [`Version ${this.versionData.version} release`];
      
    } catch (error) {
      // Fallback to generic message
      return [`Version ${this.versionData.version} release`];
    }
  }

  updateChangelog(type, changes) {
    const currentChangelog = this.versionData.changelog.current;
    
    // Move current changelog to history with timestamp if missing
    if (currentChangelog && currentChangelog.changes.length > 0) {
      const historyEntry = { ...currentChangelog };
      if (!historyEntry.timestamp) {
        // For legacy entries, use date with a reasonable time instead of current time
        if (historyEntry.date) {
          // Use noon of the release date for legacy entries
          historyEntry.timestamp = new Date(historyEntry.date + 'T12:00:00.000Z').toISOString();
        } else {
          historyEntry.timestamp = new Date().toISOString();
        }
      }
      this.versionData.changelog.history.unshift(historyEntry);
    }
    
    // Create new current changelog with full timestamp
    this.versionData.changelog.current = {
      version: this.versionData.version,
      date: new Date().toISOString().split('T')[0], // Keep date for display
      timestamp: new Date().toISOString(), // Add full timestamp
      type: type,
      changes: changes.length > 0 ? changes : [`Version ${this.versionData.version} release`]
    };
  }

  updateChangelogFile() {
    const changelogContent = this.generateChangelogMarkdown();
    
    try {
      let properContent = '';
      try {
        properContent = fs.readFileSync(this.changelogPath, 'utf8');
      } catch (error) {
        // File doesn't exist, create new one
        properContent = '# HUMΛN-Ø Changelog\n\n';
      }
    
      // Remove existing changelog section if it exists
      const changelogStart = properContent.indexOf('## 📋 Version History');
      const beforeChangelog = changelogStart !== -1 ? properContent.substring(0, changelogStart) : properContent;
      
      // Write updated content
      const newContent = beforeChangelog + changelogContent;
      fs.writeFileSync(this.changelogPath, newContent);
      
    } catch (error) {
      console.error('Error updating CHANGELOG.md:', error.message);
    }
  }

  generateChangelogMarkdown() {
    const changelog = this.versionData.changelog;
    let content = '## 📋 Version History\n\n';
    
    // Current version
    if (changelog.current) {
      content += this.formatVersionEntry(changelog.current, true);
    }
    
    // Historical versions
    if (changelog.history && changelog.history.length > 0) {
      content += '\n### 📚 Previous Versions\n\n';
      changelog.history.forEach((version, index) => {
        content += this.formatVersionEntry(version, false);
        if (index < changelog.history.length - 1) {
          content += '\n---\n\n';
        }
      });
    }
    
    content += '\n---\n\n*Last updated: ' + new Date().toLocaleDateString() + '*\n';
    
    return content;
  }

  formatVersionEntry(version, isCurrent = false) {
    const emoji = version.type === 'major' ? '🚀' : version.type === 'minor' ? '✨' : '🔧';
    const badge = isCurrent ? ' **[CURRENT]**' : '';
    
    let content = `### ${emoji} Version ${version.version}${badge}\n`;
    content += `**Date:** ${version.date}  \n`;
    content += `**Type:** ${version.type}\n\n`;
    
    if (version.changes && version.changes.length > 0) {
      content += '**Changes:**\n';
      version.changes.forEach(change => {
        content += `- ${change}\n`;
      });
    }
    
    content += '\n';
    return content;
  }

  autoCommit(message) {
    try {
      // Get list of changed files
      let changedFiles = [];
      try {
        const output = execSync('git diff --name-only', { encoding: 'utf8' });
        changedFiles = output.trim().split('\n').filter(f => f.length > 0);
      } catch (error) {
        // No git diff output
      }
      
      // Detect changes for commit message
      const detectedChanges = this.detectChanges();
      
      // Add all changes to git
      execSync('git add .', { stdio: 'inherit' });
      
      // Generate conventional commit message
      let commitMessage;
      
      if (message) {
        commitMessage = message;
      } else {
        // Use conventional commit format
        const versionType = this.versionData.changelog.current?.type || 'patch';
        let scope = 'release';
        
        // Determine scope based on changes
        if (detectedChanges.some(c => c.includes('lambda'))) scope = 'lambda';
        else if (detectedChanges.some(c => c.includes('UI'))) scope = 'ui';
        else if (detectedChanges.some(c => c.includes('API'))) scope = 'api';
        else if (detectedChanges.some(c => c.includes('Version'))) scope = 'build';
        
        const type = versionType === 'major' ? 'feat!' : versionType === 'minor' ? 'feat' : 'fix';
        commitMessage = `${type}(${scope}): release v${this.versionData.version}`;
      }
      
      // Append detected changes for better tracking
      if (detectedChanges.length > 0) {
        const changesList = detectedChanges.map(change => `- ${change}`).join('\n');
        commitMessage += `\n\n${changesList}`;
      }
      
      // Commit with version info
      execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
      
      // Create git tag
      execSync(`git tag v${this.versionData.version}`, { stdio: 'inherit' });
      
      // Push commit and tag to remote
      try {
        execSync('git push --follow-tags', { stdio: 'inherit' });
        console.log(`✅ Pushed v${this.versionData.version} to remote with tags`);
      } catch (pushError) {
        console.warn(`⚠️  Failed to push to remote: ${pushError.message}`);
        console.log(`   Tag created locally. Push manually with: git push --follow-tags`);
      }
      
      console.log(`✅ Auto-committed version ${this.versionData.version}`);
      
    } catch (error) {
      console.error('Error during auto-commit:', error.message);
    }
  }

  getCurrentVersion() {
    return this.versionData.version;
  }

  getChangelog() {
    return this.versionData.changelog;
  }
}

// CLI Interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const versionManager = new VersionManager();
  
  const command = args[0];
  const type = args[1] || 'patch';
  const commitIndex = args.indexOf('--commit');
  const changes = commitIndex !== -1 ? args.slice(2, commitIndex) : args.slice(2);
  
  switch (command) {
    case 'bump':
      if (!args.includes('--commit')) {
        console.error('This project requires each version bump to be tagged. Re-run with --commit to auto-create the git tag.');
        process.exit(1);
      }
      versionManager.incrementVersion(type, changes);
      versionManager.autoCommit();
      break;
      
    case 'current':
      console.log(`Current version: ${versionManager.getCurrentVersion()}`);
      break;
      
    case 'changelog':
      console.log(versionManager.generateChangelogMarkdown());
      break;
      
    case 'commit':
      versionManager.autoCommit(changes.join(' '));
      break;
      
    default:
      console.log('Usage:');
      console.log('  node version-manager.js bump [major|minor|patch] [changes...] [--commit]');
      console.log('  node version-manager.js current');
      console.log('  node version-manager.js changelog');
      console.log('  node version-manager.js commit [message]');
      break;
  }
}

module.exports = VersionManager;
