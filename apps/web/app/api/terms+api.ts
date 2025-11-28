import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  try {
    // Get locale from query params, default to 'en'
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'en';
    
    // Determine file path based on locale
    let docsPath: string;
    
    if (locale === 'en') {
      // English - check deployed location first, fallback to development
      if (fs.existsSync(path.resolve(process.cwd(), 'docs/terms.md'))) {
        docsPath = path.resolve(process.cwd(), 'docs/terms.md');
      } else {
        docsPath = path.resolve(process.cwd(), '../docs/terms.md');
      }
    } else {
      // Other languages - check deployed location first, fallback to development
      const localizedPath = path.resolve(process.cwd(), `docs/i18n/${locale}/terms.md`);
      const devLocalizedPath = path.resolve(process.cwd(), `../docs/i18n/${locale}/docusaurus-plugin-content-docs/current/terms.md`);
      
      if (fs.existsSync(localizedPath)) {
        docsPath = localizedPath;
      } else if (fs.existsSync(devLocalizedPath)) {
        docsPath = devLocalizedPath;
      } else {
        // Fallback to English if localized version doesn't exist
        if (fs.existsSync(path.resolve(process.cwd(), 'docs/terms.md'))) {
          docsPath = path.resolve(process.cwd(), 'docs/terms.md');
        } else {
          docsPath = path.resolve(process.cwd(), '../docs/terms.md');
        }
      }
    }
    
    const content = fs.readFileSync(docsPath, 'utf-8');
    
    return new Response(content, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        'Content-Language': locale,
      },
    });
  } catch (error) {
    return new Response('Terms of service not found', {
      status: 404,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  }
}
