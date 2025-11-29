import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  try {
    // Get locale from query params, default to 'en'
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';
    
    // Normalize locale - handle all supported variants
    let normalizedLocale = locale.split('-')[0]; // Get base locale (es from es-CO)
    
    // Map of supported locales to Docusaurus i18n directories
    const localeMapping: Record<string, string> = {
      'en': 'en',
      'de': 'de',           // German
      'es': 'es',           // Spanish (generic)
      'pt': 'pt',           // Portuguese (Brazil)
      'fr': 'fr',           // French
      'ar': 'ar',           // Arabic
      'zh': 'zh',           // Chinese (Simplified)
    };
    
    const docusaurusLocale = localeMapping[normalizedLocale] || 'en';
    
    // Determine file path based on locale - use Docusaurus i18n structure
    let docsPath: string | undefined;
    
    if (docusaurusLocale === 'en') {
      // English - use main docs directory (updated path)
      const possiblePaths = [
        path.resolve(process.cwd(), 'docs/docs/privacy.md'),  // Production: docs/docs next to server
        path.resolve(process.cwd(), 'docs/privacy.md'),  // Production: fallback
        path.resolve(process.cwd(), '../docs/docs/privacy.md'),  // Development
        path.resolve(__dirname, '../../../docs/docs/privacy.md'),  // Alternative
        path.resolve(__dirname, '../docs/docs/privacy.md'),  // Lambda: docs/docs next to server
      ];
      
      docsPath = possiblePaths.find(p => fs.existsSync(p)) || possiblePaths[0];
    } else {
      // Other languages - use Docusaurus i18n structure
      const localizedPaths = [
        path.resolve(process.cwd(), `docs/i18n/${docusaurusLocale}/docusaurus-plugin-content-docs/current/privacy.md`),  // Production
        path.resolve(process.cwd(), `../docs/i18n/${docusaurusLocale}/docusaurus-plugin-content-docs/current/privacy.md`),  // Dev
        path.resolve(__dirname, `../../../docs/i18n/${docusaurusLocale}/docusaurus-plugin-content-docs/current/privacy.md`),  // Alternative
        path.resolve(__dirname, `../docs/i18n/${docusaurusLocale}/docusaurus-plugin-content-docs/current/privacy.md`),  // Lambda
      ];
      
      docsPath = localizedPaths.find(p => fs.existsSync(p));
      
      // Fallback to English if localized version doesn't exist
      if (!docsPath) {
        const fallbackPaths = [
          path.resolve(process.cwd(), 'docs/docs/privacy.md'),  // Production: docs/docs next to server
          path.resolve(process.cwd(), 'docs/privacy.md'),  // Production: fallback
          path.resolve(process.cwd(), '../docs/docs/privacy.md'),  // Development
          path.resolve(__dirname, '../../../docs/docs/privacy.md'),  // Alternative
          path.resolve(__dirname, '../docs/docs/privacy.md'),  // Lambda: docs/docs next to server
        ];
        docsPath = fallbackPaths.find(p => fs.existsSync(p)) || fallbackPaths[0];
      }
    }
    
    // Ensure docsPath is defined (fallback to first option if somehow still undefined)
    if (!docsPath) {
      docsPath = path.resolve(process.cwd(), 'docs/docs/privacy.md');  // Production: docs/docs next to server
    }
    
    const content = fs.readFileSync(docsPath, 'utf-8');
    
    return new Response(content, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        'Content-Language': docusaurusLocale,
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
