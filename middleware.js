// middleware.js – Vercel Edge Middleware for advanced security

// This works for static sites deployed on Vercel, providing protection against bots hotlinking, and forced downloads.
export function middleware(request) {
  const url = request.nextUrl;
  const headers = request.headers;
  const userAgent = headers.get('user-agent') || '';
  const referer = headers.get('referer') || '';

  // ---------------------------------------------------------------
  // 1. Block malicious bots / download tools (User‑Agent filtering)
  // ---------------------------------------------------------------
  const blockedAgents = [
    'wget', 'curl', 'libcurl', 'HTTrack', 'clshttp', 'archiver',
    'loader', 'email', 'harvest', 'extract', 'grab', 'miner',
    'scrapy', 'sucker', 'ia_archiver', 'archive.org_bot', 'wayback'
  ];

  const lowerUA = userAgent.toLowerCase();
  if (blockedAgents.some(agent => lowerUA.includes(agent))) {
    return new Response('Access Denied', { status: 403 });
  }

  // Block requests with completely empty user agent (often bots)
  if (!userAgent || userAgent.trim() === '') {
    return new Response('Access Denied', { status: 403 });
  }

  // ---------------------------------------------------------------
  // 2. Prevent image hotlinking (Referer‑based)
  // ---------------------------------------------------------------
  const protectedExtensions = /\.(jpg|jpeg|png|gif|webp|avif|svg|ico|bmp|tiff)$/i;
  if (protectedExtensions.test(url.pathname)) {
    const allowedReferers = [
      'iscjava.online',
      'www.iscjava.online',
      'localhost'
    ];

    let refererHost = '';
    try {
      if (referer) {
        refererHost = new URL(referer).hostname;
      }
    } catch (e) {
      // Malformed referer – block it
      return new Response('Hotlinking not allowed', { status: 403 });
    }

    // Allow if referer is empty (direct access) or from allowed domain
    if (refererHost && !allowedReferers.some(allowed => refererHost.includes(allowed))) {
      return new Response('Hotlinking not allowed', { status: 403 });
    }
  }

  // ---------------------------------------------------------------
  // 3. Block suspicious query parameters (prevent forced downloads)
  // ---------------------------------------------------------------
  const queryString = url.search.toLowerCase();
  const blockedQueryParams = ['download', 'save', 'get', 'dl', 'zip', 'tar', 'gz'];
  const sensitiveExt = /\.(html|css|js|jpg|jpeg|png|gif|pdf|doc|docx)$/i;

  if (blockedQueryParams.some(param => queryString.includes(param)) && sensitiveExt.test(url.pathname)) {
    return new Response('Access Denied', { status: 403 });
  }

  // Allow the request to proceed normally
  return new Response(null, {
    status: 200,
    headers: {
      'x-middleware-next': '1'   // Required to continue to static files
    }
  });
}

// Apply middleware to all routes except internal Next.js assets and favicon
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};