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
    
    console.log('Privacy API called with locale:', locale, 'normalized:', normalizedLocale);
    console.log('Current working directory:', process.cwd());
    
    // Determine file path based on locale
    let docsPath: string;
    
    if (normalizedLocale === 'en') {
      // English - use markdown files
      const path1 = path.resolve(process.cwd(), 'docs/privacy.md');
      const path2 = path.resolve(process.cwd(), '../docs/privacy.md');
      console.log('Checking English paths:', path1, path2);
      console.log('Path1 exists:', fs.existsSync(path1));
      console.log('Path2 exists:', fs.existsSync(path2));
      
      if (fs.existsSync(path1)) {
        docsPath = path1;
      } else {
        docsPath = path2;
      }
    } else {
      // Other languages - use proper Docusaurus i18n structure
      const localizedPath = path.resolve(process.cwd(), `docs/i18n/${normalizedLocale}/docusaurus-plugin-content-docs/current/privacy.md`);
      const devLocalizedPath = path.resolve(process.cwd(), `../docs/i18n/${normalizedLocale}/docusaurus-plugin-content-docs/current/privacy.md`);
      
      console.log('Checking localized paths:', localizedPath, devLocalizedPath);
      console.log('Localized path exists:', fs.existsSync(localizedPath));
      console.log('Dev localized path exists:', fs.existsSync(devLocalizedPath));
      
      if (fs.existsSync(localizedPath)) {
        docsPath = localizedPath;
      } else if (fs.existsSync(devLocalizedPath)) {
        docsPath = devLocalizedPath;
      } else {
        // Fallback to English if localized version doesn't exist
        const fallbackPath1 = path.resolve(process.cwd(), 'docs/privacy.md');
        const fallbackPath2 = path.resolve(process.cwd(), '../docs/privacy.md');
        console.log('Checking fallback paths:', fallbackPath1, fallbackPath2);
        
        if (fs.existsSync(fallbackPath1)) {
          docsPath = fallbackPath1;
        } else {
          docsPath = fallbackPath2;
        }
      }
    }
    
    console.log('Final docsPath:', docsPath);
    console.log('Final docsPath exists:', fs.existsSync(docsPath));
    
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
