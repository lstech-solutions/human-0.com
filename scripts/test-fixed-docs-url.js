#!/usr/bin/env node

// Test the fixed getDocsUrl function
console.log('🔧 Testing FIXED Docs URL Generation');
console.log('====================================\n');

// Simulate the NEW getDocsUrl function logic
function simulateFixedGetDocsUrl(path, locale, isDark) {
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
  
  // NEW: Always include locale parameter (even for English)
  if (locale) {
    params.append('locale', locale);
    console.log(`  ✅ Locale added: ${locale}`);
  } else {
    console.log(`  ❌ Locale NOT added (undefined)`);
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

// Test scenarios
console.log('🧪 Testing Fixed Function:\n');

// Test 1: English (now should include locale)
simulateFixedGetDocsUrl('/', 'en', false);

// Test 2: Spanish
simulateFixedGetDocsUrl('/', 'es', false);

// Test 3: Undefined locale
simulateFixedGetDocsUrl('/', undefined, true);

// Test 4: French, dark theme
simulateFixedGetDocsUrl('/', 'fr', true);

console.log('✅ Expected URLs After Fix:');
console.log('  English: http://localhost:3001/documentation/?locale=en&dark=false');
console.log('  Spanish:  http://localhost:3001/documentation/?locale=es&dark=false');
console.log('  French:   http://localhost:3001/documentation/?locale=fr&dark=true');
console.log('  Undefined: http://localhost:3001/documentation/?dark=true');
