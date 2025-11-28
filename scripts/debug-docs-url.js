#!/usr/bin/env node

// Debug script to check URL generation
console.log('🔍 Debugging Docs URL Generation');
console.log('================================\n');

// Simulate the getDocsUrl function logic
function simulateGetDocsUrl(path, locale, isDark) {
  const baseUrl = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3001/documentation' 
    : '/documentation';
    
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const cleanPath = normalizedPath.replace('/docs/', '/');
  
  const url = `${baseUrl}${cleanPath}`;
  const params = new URLSearchParams();
  
  console.log(`📋 Input:`);
  console.log(`  Path: ${path}`);
  console.log(`  Locale: ${locale}`);
  console.log(`  IsDark: ${isDark}`);
  console.log(`  BaseUrl: ${baseUrl}`);
  console.log(`  CleanPath: ${cleanPath}`);
  
  // Only add locale if not English (this is the issue!)
  if (locale && locale !== 'en') {
    params.append('locale', locale);
    console.log(`  ✅ Locale added: ${locale}`);
  } else {
    console.log(`  ❌ Locale NOT added (English or undefined)`);
  }
  
  if (isDark !== undefined) {
    params.append('dark', isDark.toString());
    console.log(`  ✅ Dark theme added: ${isDark}`);
  }
  
  const paramString = params.toString();
  const finalUrl = paramString ? `${url}?${paramString}` : url;
  
  console.log(`  Final URL: ${finalUrl}`);
  console.log('');
  
  return finalUrl;
}

// Test different scenarios
console.log('🧪 Testing Different Scenarios:\n');

// Test 1: English (default) - this is what you're seeing
simulateGetDocsUrl('/', 'en', false);

// Test 2: Spanish - should include locale
simulateGetDocsUrl('/', 'es', false);

// Test 3: Undefined locale - should not include locale
simulateGetDocsUrl('/', undefined, true);

// Test 4: French, dark theme - should include both
simulateGetDocsUrl('/', 'fr', true);

console.log('🔧 Issue Analysis:');
console.log('  • The function only adds locale parameter for non-English languages');
console.log('  • For English users, only the dark parameter is added');
console.log('  • This is actually correct behavior for English (default language)');
console.log('  • The URL you see is correct: http://localhost:3001/documentation/?dark=false');
console.log('');
console.log('💡 If you want to ALWAYS include locale:');
console.log('  • Remove the "&& locale !== \'en\'" condition');
console.log('  • Or use a different approach for language handling');
