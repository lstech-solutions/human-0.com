#!/usr/bin/env node

// Test script to verify legal document URL generation
const fs = require('fs');
const path = require('path');

// Load version data
const versionData = JSON.parse(fs.readFileSync(path.join(__dirname, '../version.json'), 'utf8'));

console.log('🔗 Testing Legal Document URL Generation');
console.log('==========================================\n');

// Test different scenarios
const testCases = [
  {
    name: 'Terms - Docs (English, Light)',
    documentType: 'terms',
    context: 'docs',
    options: { locale: 'en', isDark: false }
  },
  {
    name: 'Terms - Docs (Spanish, Dark)',
    documentType: 'terms', 
    context: 'docs',
    options: { locale: 'es', isDark: true }
  },
  {
    name: 'Privacy - Docs (French, Light)',
    documentType: 'privacy',
    context: 'docs', 
    options: { locale: 'fr', isDark: false }
  },
  {
    name: 'Terms - GitHub Source',
    documentType: 'terms',
    context: 'github'
  },
  {
    name: 'Privacy - Web Version',
    documentType: 'privacy',
    context: 'web',
    options: { locale: 'es', isDark: true }
  }
];

// Helper function to create versioned URLs
function createVersionedUrl(baseUrl, path, version, params) {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const url = `${baseUrl}/${cleanPath}`;
  const searchParams = new URLSearchParams();
  
  if (version) {
    searchParams.append('version', version);
  }
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value);
      }
    });
  }
  
  const paramString = searchParams.toString();
  return paramString ? `${url}?${paramString}` : url;
}

// Helper function to get legal document URL
function getLegalDocumentUrl(documentType, context, version, options) {
  const versionToUse = version || versionData.version;
  const githubBaseUrl = 'https://github.com/lstech-solutions/human-0.com';
  const docsBaseUrl = 'https://human-0.com/documentation';
  const webBaseUrl = 'https://human-0.com';

  switch (context) {
    case 'github':
      return `${githubBaseUrl}/blob/main/apps/docs/${documentType}.md`;
    
    case 'docs':
      return createVersionedUrl(docsBaseUrl, documentType, versionToUse, {
        locale: options?.locale,
        dark: options?.isDark?.toString()
      });
    
    case 'web':
      return createVersionedUrl(webBaseUrl, documentType, versionToUse, {
        locale: options?.locale,
        dark: options?.isDark?.toString()
      });
    
    default:
      return `${docsBaseUrl}/${documentType}`;
  }
}

function getLegalDocumentHistoryUrl(documentType) {
  const githubBaseUrl = 'https://github.com/lstech-solutions/human-0.com';
  return `${githubBaseUrl}/commits/main/apps/docs/${documentType}.md`;
}

testCases.forEach((testCase, index) => {
  console.log(`${index + 1}. ${testCase.name}`);
  
  try {
    const url = getLegalDocumentUrl(
      testCase.documentType,
      testCase.context,
      versionData.version,
      testCase.options
    );
    
    console.log(`   🔗 ${url}`);
    console.log('');
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    console.log('');
  }
});

console.log('📋 GitHub History URLs:');
console.log(`   Terms: ${getLegalDocumentHistoryUrl('terms')}`);
console.log(`   Privacy: ${getLegalDocumentHistoryUrl('privacy')}`);

console.log('\n✅ URL generation test completed!');
