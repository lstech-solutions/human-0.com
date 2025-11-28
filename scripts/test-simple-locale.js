#!/usr/bin/env node

// Test simple locale detection approach
console.log('🔍 Simple Locale Detection Test');
console.log('==============================\n');

// Simulate URL parsing
function simulateLocaleDetection(url) {
  const urlObj = new URL(url);
  const locale = urlObj.searchParams.get('locale');
  const dark = urlObj.searchParams.get('dark');
  
  console.log(`Input URL: ${url}`);
  console.log(`Detected locale: ${locale || 'en'}`);
  console.log(`Detected theme: ${dark === 'true' ? 'dark' : 'light'}`);
  
  // Simple redirect logic
  if (locale && locale !== 'en') {
    const newPath = `/${locale}/documentation/`;
    const urlObj2 = new URL(url);
    urlObj2.searchParams.delete('locale');
    const finalUrl = `${urlObj2.origin}${newPath}${urlObj2.search}`;
    console.log(`Should redirect to: ${finalUrl}`);
  } else {
    console.log('Stay on: /documentation/');
  }
  console.log('');
}

// Test cases
const testUrls = [
  'http://localhost:3001/documentation/?locale=en&dark=false',
  'http://localhost:3001/documentation/?locale=es&dark=false', 
  'http://localhost:3001/documentation/?locale=de-DE&dark=true',
  'http://localhost:3001/documentation/?locale=fr-FR&dark=false',
  'http://localhost:3001/documentation/', // No locale
  'http://localhost:3001/documentation/?dark=true' // No locale
];

console.log('📋 Test Results:');
testUrls.forEach((url, index) => {
  console.log(`${index + 1}. Testing URL:`);
  simulateLocaleDetection(url);
});

console.log('🎯 Simple Approach Benefits:');
console.log('  • ✅ Uses existing i18n package');
console.log('  • ✅ Minimal code, less complexity');
console.log('  • ✅ Direct locale detection from URL');
console.log('  • ✅ Simple redirect logic');
console.log('  • ✅ No need to override Docusaurus behavior');

console.log('\n🔧 Implementation:');
console.log('  1. Detect locale from URL parameter');
console.log('  2. Use existing i18n package for validation');
console.log('  3. Apply theme from URL parameter');
console.log('  4. Simple redirect if needed');
console.log('  5. Store preferences in localStorage');

console.log('\n✅ Simple locale detection ready!');
