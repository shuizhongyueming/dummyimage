/**
 * DummyImage - An alternative to dummyimage.com
 * Generates placeholder images with customizable dimensions and colors
 * 
 * URL patterns supported (matching dummyimage.com spec):
 * - /{width}x{height}[.ext]
 * - /{width}x{height}/{bgcolor}[.ext]
 * - /{width}x{height}/{bgcolor}/{fgcolor}[.ext]
 * - /{width}x{height}[.ext]?text=custom&bg=color&fg=color
 * 
 * Examples:
 * - /600x400
 * - /600x400.png
 * - /600x400/000/fff
 * - /600x400?text=Hello+World
 * - /600x400/000/fff.png?text=aa+bb
 */

export default {
  async fetch(request, env, ctx) {
    // Only allow GET and HEAD requests
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method not allowed', { 
        status: 405,
        headers: { 'Content-Type': 'text/plain' }
      });
    }

    const url = new URL(request.url);

    // Use Cloudflare edge cache
    const cache = caches.default;
    const cacheKey = new Request(request.url, request);
    const cached = await cache.match(cacheKey);
    if (cached) return cached;

    // Parse path: remove leading/trailing slashes and optional extension
    const path = url.pathname.replace(/^\/+|\/+$/g, '');
    const pathWithoutExt = path.replace(/\.(svg|png|jpg|jpeg|gif|webp)$/i, '');
    
    // Parse size and optional colors from path: {width}x{height}[/bgcolor[/fgcolor]]
    const pathMatch = pathWithoutExt.match(/^(\d{1,4})x(\d{1,4})(?:\/([0-9a-fA-F]{3}|[0-9a-fA-F]{6}))?(?:\/([0-9a-fA-F]{3}|[0-9a-fA-F]{6}))?$/);
    
    // Default dimensions
    let width = 300, height = 150;
    let bgFromPath, fgFromPath;
    
    if (pathMatch) {
      width = Math.min(2000, Math.max(1, parseInt(pathMatch[1], 10)));
      height = Math.min(2000, Math.max(1, parseInt(pathMatch[2], 10)));
      bgFromPath = pathMatch[3];
      fgFromPath = pathMatch[4];
    }

    // Query parameters (can override path-based colors)
    const params = url.searchParams;
    const bg = sanitizeColor(params.get('bg') || bgFromPath || 'dddddd');
    const fg = sanitizeColor(params.get('fg') || fgFromPath || '777777');
    
    // Text parameter: + represents space
    let text = params.get('text');
    if (text) {
      // Replace + with space (URL encoding for spaces in query params)
      text = text.replace(/\+/g, ' ');
    } else {
      text = `${width}×${height}`;
    }

    // Escape text for safe XML rendering
    const safeText = escapeXml(text);

    // Calculate responsive font size with bounds
    const fontSize = Math.max(12, Math.min(200, Math.round(Math.min(width, height) / 6)));

    // Generate SVG
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${safeText}">
  <rect width="100%" height="100%" fill="#${bg}" />
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
        font-family="system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
        font-size="${fontSize}"
        fill="#${fg}">${safeText}</text>
</svg>`;

    const headers = {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Access-Control-Allow-Origin': '*'
    };

    const resp = new Response(svg, { status: 200, headers });
    
    // Asynchronously cache the response (doesn't block return)
    ctx.waitUntil(cache.put(cacheKey, resp.clone()));
    
    return resp;
  }
};

/**
 * Sanitize color input (allows 3/6 digit hex, prevents injection)
 */
function sanitizeColor(c) {
  if (!c) return 'dddddd';
  // Remove non-hex characters
  const cleaned = (c || '').replace(/[^0-9a-fA-F]/g, '');
  // Expand 3-char to 6-char hex
  if (cleaned.length === 3) {
    return cleaned.split('').map(ch => ch + ch).join('');
  }
  if (cleaned.length === 6) {
    return cleaned;
  }
  // Fallback for invalid lengths
  return 'dddddd';
}

/**
 * Escape XML/HTML special characters (prevent injection)
 */
function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
