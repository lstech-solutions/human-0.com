#!/usr/bin/env node

const { execSync } = require('child_process');

// Get actual Git commit info for a file
function getFileGitInfo(filePath) {
  try {
    const gitDate = execSync(`git log -1 --format="%ci" -- "${filePath}"`, { 
      encoding: 'utf8' 
    }).trim();
    
    const gitHash = execSync(`git log -1 --format="%H" -- "${filePath}"`, { 
      encoding: 'utf8' 
    }).trim();
    
    const author = execSync(`git log -1 --format="%an" -- "${filePath}"`, { 
      encoding: 'utf8' 
    }).trim();
    
    const message = execSync(`git log -1 --format="%s" -- "${filePath}"`, { 
      encoding: 'utf8' 
    }).trim();
    
    return {
      date: new Date(gitDate),
      hash: gitHash,
      author,
      message,
      shortHash: gitHash.substring(0, 7)
    };
  } catch (error) {
    console.error(`Error getting Git info for ${filePath}:`, error.message);
    return null;
  }
}

// Test with our legal documents
if (require.main === module) {
  const files = ['apps/docs/terms.md', 'apps/docs/privacy.md'];
  
  files.forEach(file => {
    console.log(`\n📄 ${file}`);
    const info = getFileGitInfo(file);
    
    if (info) {
      console.log(`  📅 Date: ${info.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`);
      console.log(`  🔖 Hash: ${info.shortHash}`);
      console.log(`  👤 Author: ${info.author}`);
      console.log(`  📝 Message: ${info.message}`);
      console.log(`  🔗 GitHub: https://github.com/lstech-solutions/human-0.com/commits/main/${file}`);
    } else {
      console.log(`  ❌ Could not get Git info`);
    }
  });
}

module.exports = { getFileGitInfo };
