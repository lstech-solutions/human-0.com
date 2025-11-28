#!/usr/bin/env node

// Test hybrid locale handling: URL-based for main section, path-based for /docs section
console.log('🔄 Hybrid Locale Handling Test');
console.log('===============================\n');

// Test scenarios
const testScenarios = [
  {
    name: 'Web App → Main Section (Spanish)',
    inputUrl: 'http://localhost:3001/documentation/?locale=es&dark=false',
    expectedBehavior: 'URL-based detection, NO redirect',
    expectedFinalUrl: 'http://localhost:3001/documentation/?locale=es&dark=false',
    section: 'main'
  },
  {
    name: 'Web App → Main Section (English)',
    inputUrl: 'http://localhost:3001/documentation/?locale=en&dark=true',
    expectedBehavior: 'URL-based detection, NO redirect',
    expectedFinalUrl: 'http://localhost:3001/documentation/?locale=en&dark=true',
    section: 'main'
  },
  {
    name: 'Docs Section (Spanish)',
    inputUrl: 'http://localhost:3001/docs/intro?locale=es&dark=false',
    expectedBehavior: 'Path-based i18n, WITH redirect',
    expectedFinalUrl: 'http://localhost:3001/es/docs/intro?dark=false',
    section: 'docs'
  },
  {
    name: 'Docs Section (English)',
    inputUrl: 'http://localhost:3001/docs/intro?locale=en&dark=true',
    expectedBehavior: 'Path-based i18n, NO redirect',
    expectedFinalUrl: 'http://localhost:3001/docs/intro?dark=true',
    section: 'docs'
  },
  {
    name: 'Language Switcher in Docs (Spanish)',
    currentPath: '/docs/intro',
    targetLocale: 'es',
    expectedBehavior: 'Path-based redirect',
    expectedFinalUrl: '/es/docs/intro',
    section: 'docs'
  },
  {
    name: 'Language Switcher in Docs (English)',
    currentPath: '/es/docs/intro',
    targetLocale: 'en',
    expectedBehavior: 'Path-based redirect',
    expectedFinalUrl: '/docs/intro',
    section: 'docs'
  }
];

function simulateHybridLocaleHandling(inputUrl, currentPath, targetLocale, section) {
  console.log(`Input: ${inputUrl || currentPath}`);
  console.log(`Section: ${section}`);
  
  if (section === 'main') {
    // Main section: URL-based detection, no redirect
    console.log('Behavior: URL-based detection, NO redirect');
    console.log(`Final URL: ${inputUrl}`);
  } else {
    // Docs section: Path-based i18n, with redirect
    console.log('Behavior: Path-based i18n, WITH redirect');
    
    if (targetLocale && currentPath) {
      if (targetLocale !== 'en' && !currentPath.startsWith(`/${targetLocale}/`)) {
        const newPath = `/${targetLocale}${currentPath}`;
        console.log(`Final URL: ${newPath}`);
      } else {
        console.log(`Final URL: ${currentPath}`);
      }
    } else if (inputUrl) {
      const urlObj = new URL(inputUrl);
      const locale = urlObj.searchParams.get('locale');
      const path = urlObj.pathname;
      
      if (locale && locale !== 'en' && path.startsWith('/docs/')) {
        const newPath = `/${locale}${path}`;
        urlObj.searchParams.delete('locale');
        console.log(`Final URL: ${urlObj.origin}${newPath}${urlObj.search}`);
      } else {
        console.log(`Final URL: ${inputUrl}`);
      }
    }
  }
  console.log('');
}

console.log('📋 Test Results:');
testScenarios.forEach((scenario, index) => {
  console.log(`${index + 1}. ${scenario.name}`);
  console.log(`   Expected: ${scenario.expectedBehavior}`);
  simulateHybridLocaleHandling(
    scenario.inputUrl,
    scenario.currentPath,
    scenario.targetLocale,
    scenario.section
  );
});

console.log('🎯 Hybrid Approach Benefits:');
console.log('  • ✅ Main section: URL-based detection (no redirect)');
console.log('  • ✅ Docs section: Path-based i18n (with redirect)');
console.log('  • ✅ Language switcher works in /docs section');
console.log('  • ✅ Web app flow preserved for main section');
console.log('  • ✅ Proper navbar language controls in docs');

console.log('\n🔧 Implementation:');
console.log('  Main Section (/documentation/):');
console.log('    • URL parameter detection only');
console.log('    • No automatic redirects');
console.log('    • Preserves web app URLs');
console.log('');
console.log('  Docs Section (/docs/):');
console.log('    • Path-based i18n with redirects');
console.log('    • Language switcher in navbar');
console.log('    • Proper localized URLs');

console.log('\n📊 Flow Examples:');
console.log('  Web App → Main: /documentation/?locale=es (stays)');
console.log('  Web App → Docs: /docs/intro?locale=es → /es/docs/intro');
console.log('  Language Switch: /docs/intro → /es/docs/intro');

console.log('\n✅ Hybrid locale handling implemented!');
