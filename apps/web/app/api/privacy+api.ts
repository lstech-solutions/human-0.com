import fs from 'fs';
import path from 'path';

// Helper function to get English fallback content
function getEnglishFallback(type: 'privacy' | 'terms'): string {
  const fallbackPath = fs.existsSync(path.resolve(process.cwd(), `docs/${type}.md`))
    ? path.resolve(process.cwd(), `docs/${type}.md`)
    : path.resolve(process.cwd(), `../docs/${type}.md`);
    
  return fs.readFileSync(fallbackPath, 'utf-8');
}

export async function GET(request: Request) {
  try {
    // Get locale from query params, default to 'en'
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';
    
    // Normalize locale (handle variants like es-CO, es-ES, etc.)
    const normalizedLocale = locale.split('-')[0]; // Get base locale (es from es-CO)
    
    // DEBUG: Log environment info
    console.log('=== PRIVACY API DEBUG ===');
    console.log('Locale:', locale, '→ Normalized:', normalizedLocale);
    console.log('Current working directory:', process.cwd());
    console.log('__dirname:', __dirname);
    console.log('Files in current dir:', fs.readdirSync('.').slice(0, 10));
    
    // Determine file path based on locale
    let docsPath: string;
    
    if (normalizedLocale === 'en') {
      // English - use markdown files, try multiple possible locations
      const possiblePaths = [
        path.resolve(process.cwd(), 'docs/privacy.md'),
        path.resolve(process.cwd(), '../docs/privacy.md'),
        path.resolve(__dirname, '../../../docs/privacy.md'),
        path.resolve(__dirname, '../../../../docs/privacy.md')
      ];
      
      console.log('English paths to check:');
      possiblePaths.forEach((p, i) => console.log(`  ${i+1}. ${p} → ${fs.existsSync(p) ? 'EXISTS' : 'NOT FOUND'}`));
      
      docsPath = possiblePaths.find(p => fs.existsSync(p)) || possiblePaths[0];
    } else {
      // Other languages - use proper Docusaurus i18n structure
      const localizedPaths = [
        path.resolve(process.cwd(), `docs/i18n/${normalizedLocale}/docusaurus-plugin-content-docs/current/privacy.md`),
        path.resolve(process.cwd(), `../docs/i18n/${normalizedLocale}/docusaurus-plugin-content-docs/current/privacy.md`),
        path.resolve(__dirname, `../../../docs/i18n/${normalizedLocale}/docusaurus-plugin-content-docs/current/privacy.md`)
      ];
      
      console.log('Localized paths to check:');
      localizedPaths.forEach((p, i) => console.log(`  ${i+1}. ${p} → ${fs.existsSync(p) ? 'EXISTS' : 'NOT FOUND'}`));
      
      docsPath = localizedPaths.find(p => fs.existsSync(p));
      
      // Fallback to English if localized version doesn't exist
      if (!docsPath) {
        const fallbackPaths = [
          path.resolve(process.cwd(), 'docs/privacy.md'),
          path.resolve(process.cwd(), '../docs/privacy.md'),
          path.resolve(__dirname, '../../../docs/privacy.md')
        ];
        console.log('Fallback paths to check:');
        fallbackPaths.forEach((p, i) => console.log(`  ${i+1}. ${p} → ${fs.existsSync(p) ? 'EXISTS' : 'NOT FOUND'}`));
        docsPath = fallbackPaths.find(p => fs.existsSync(p)) || fallbackPaths[0];
      }
    }
    
    // Ensure docsPath is defined (fallback to first option if somehow still undefined)
    if (!docsPath) {
      docsPath = path.resolve(process.cwd(), 'docs/privacy.md');
    }
    
    console.log('Final docsPath:', docsPath);
    console.log('Final docsPath exists:', fs.existsSync(docsPath));
    console.log('=== END DEBUG ===');
    
    const content = fs.readFileSync(docsPath, 'utf-8');
    
    return new Response(content, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        'Content-Language': normalizedLocale,
      },
    });
  } catch (error) {
    return new Response('Privacy policy not found', {
      status: 404,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  }
}
