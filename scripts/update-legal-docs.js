#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const VersionManager = require('./version-manager.js');

class LegalDocumentUpdater {
  constructor() {
    this.versionManager = new VersionManager();
    this.rootDir = path.join(__dirname, '..');
    this.legalFiles = [
      'apps/docs/terms.md',
      'apps/docs/privacy.md'
    ];
  }

  // Get actual Git commit date for a specific file
  getFileCommitDate(filePath) {
    try {
      const fullPath = path.join(this.rootDir, filePath);
      const gitDate = execSync(`git log -1 --format="%ci" -- "${fullPath}"`, { 
        encoding: 'utf8',
        cwd: this.rootDir 
      }).trim();
      
      if (gitDate) {
        const date = new Date(gitDate);
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }
    } catch (error) {
      console.warn(`Could not get Git date for ${filePath}: ${error.message}`);
    }
    
    // Fallback to file system date
    try {
      const fullPath = path.join(this.rootDir, filePath);
      const stats = fs.statSync(fullPath);
      return stats.mtime.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  }

  // Get Git commit hash for a specific file
  getFileCommitHash(filePath) {
    try {
      const fullPath = path.join(this.rootDir, filePath);
      const gitHash = execSync(`git log -1 --format="%H" -- "${fullPath}"`, { 
        encoding: 'utf8',
        cwd: this.rootDir 
      }).trim();
      
      return gitHash || 'main';
    } catch (error) {
      console.warn(`Could not get Git hash for ${filePath}: ${error.message}`);
      return 'main';
    }
  }

  // Generate GitHub URL to file's commit history
  getFileHistoryUrl(filePath) {
    const githubBaseUrl = 'https://github.com/lstech-solutions/human-0.com';
    return `${githubBaseUrl}/commits/main/${filePath}`;
  }

  // Generate GitHub URL to specific commit
  getFileCommitUrl(filePath, commitHash) {
    const githubBaseUrl = 'https://github.com/lstech-solutions/human-0.com';
    return `${githubBaseUrl}/commit/${commitHash}`;
  }

  updateLegalDocuments() {
    const versionData = this.versionManager.versionData;
    const currentVersion = versionData.version;
    const githubBaseUrl = 'https://github.com/lstech-solutions/human-0.com';
    const docsBaseUrl = 'https://human-0.com/documentation';

    console.log(`📅 Updating legal documents with actual Git commit dates...`);
    console.log(`🔖 Current app version: ${currentVersion}`);

    this.legalFiles.forEach(filePath => {
      const fullPath = path.join(this.rootDir, filePath);
      
      if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf8');
        
        // Get actual file commit date
        const actualDate = this.getFileCommitDate(filePath);
        const historyUrl = this.getFileHistoryUrl(filePath);
        
        console.log(`📄 ${filePath}: last modified ${actualDate}`);
        
        // Update "Last updated" line with actual commit date and history link
        if (filePath.includes('terms.md')) {
          const newLastUpdated = `_Last updated: ${actualDate} ([view history](${historyUrl}))_`;
          content = content.replace(/_Last updated:.*?_/g, newLastUpdated);
        } else if (filePath.includes('privacy.md')) {
          const newLastUpdated = `_[Last updated: ${actualDate}](${docsBaseUrl}/privacy?version=${currentVersion})_`;
          // Handle the case where there might be multiple links
          content = content.replace(/_\[Last updated:.*?\]_.*?/g, newLastUpdated);
        }
        
        fs.writeFileSync(fullPath, content);
        console.log(`✅ Updated ${filePath}`);
      } else {
        console.warn(`⚠️  File not found: ${filePath}`);
      }
    });

    console.log(`✨ Legal documents updated with actual Git commit dates!`);
  }

  // Generate GitHub-aware version links
  generateVersionLinks() {
    const versionData = this.versionManager.versionData;
    const githubBaseUrl = 'https://github.com/lstech-solutions/human-0.com';
    
    return {
      currentRelease: `${githubBaseUrl}/releases/tag/v${versionData.version}`,
      sourceCode: `${githubBaseUrl}/blob/main/apps/docs/terms.md`,
      docsVersioned: `https://human-0.com/documentation/terms?version=${versionData.version}`,
      webVersioned: `https://human-0.com/terms?version=${versionData.version}`
    };
  }

  // Update version.json with legal document metadata
  updateVersionMetadata() {
    const versionData = this.versionManager.versionData;
    
    if (!versionData.metadata.legal) {
      versionData.metadata.legal = {};
    }
    
    versionData.metadata.legal = {
      lastUpdated: new Date().toISOString(),
      documentsVersioned: true,
      autoUpdateEnabled: true
    };
    
    this.versionManager.saveVersion();
    console.log(`✅ Updated version.json with legal metadata`);
  }
}

// CLI interface
if (require.main === module) {
  const updater = new LegalDocumentUpdater();
  
  console.log('🔧 Starting legal document update...');
  updater.updateLegalDocuments();
  updater.updateVersionMetadata();
  
  console.log('\n📊 Generated version links:');
  console.log(JSON.stringify(updater.generateVersionLinks(), null, 2));
}

module.exports = LegalDocumentUpdater;
