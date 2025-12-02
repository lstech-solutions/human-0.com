import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host');
  
  // Redirect www to non-www
  if (host?.startsWith('www.')) {
    const newHost = host.replace('www.', '');
    const newUrl = new URL(request.url);
    newUrl.host = newHost;
    
    return NextResponse.redirect(newUrl, 301); // 301 = permanent redirect
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/:path*',
};
