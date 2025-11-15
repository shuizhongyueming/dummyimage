/**
 * DummyImage - An alternative to dummyimage.com
 * Generates placeholder images with customizable dimensions and colors
 * 
 * Fully compatible with dummyimage.com URL format:
 * - /{width}x{height}[.ext]
 * - /{width}x{height}/{bgcolor}[.ext]
 * - /{width}x{height}/{bgcolor}/{fgcolor}[.ext]
 * - Supports query parameters: ?text=, ?bg=, ?fg=
 * - Supports dimension keywords: vga, hd1080, mediumrectangle, etc.
 * - Extensions can appear anywhere in the path
 * 
 * Examples:
 * - /600x400
 * - /600x400.png
 * - /vga
 * - /600x400/000/fff
 * - /600x400?text=Hello+World
 * - /600x400/ccc/000.png&text=Sample
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

    // Parse the entire path, mimicking PHP's approach
    let path = url.pathname.replace(/^\/+|\/+$/g, ''); // Strip leading/trailing slashes
    
    // Detect file format from anywhere in the path (matches PHP behavior)
    let fileFormat = 'png';
    const formatMatch = path.match(/\.(webp|gif|jpg|jpeg|png|svg)/i);
    if (formatMatch) {
      fileFormat = formatMatch[1].toLowerCase();
      if (fileFormat === 'jpeg') fileFormat = 'jpg';
    }
    
    // Split path into segments
    const segments = path.split('/');
    
    // Parse dimensions from first segment (supports keywords)
    const dimensionKeywords = {
      // IAB Standard ad sizes
      'mediumrectangle': '300x250', 'medrect': '300x250',
      'squarepopup': '250x250', 'sqrpop': '250x250',
      'verticalrectangle': '240x400', 'vertrec': '240x400',
      'largerectangle': '336x280', 'lrgrec': '336x280',
      'rectangle': '180x150', 'rec': '180x150',
      'popunder': '720x300', 'pop': '720x300',
      'fullbanner': '468x60', 'fullban': '468x60',
      'halfbanner': '234x60', 'halfban': '234x60',
      'microbar': '88x31', 'mibar': '88x31',
      'button1': '120x90', 'but1': '120x90',
      'button2': '120x60', 'but2': '120x60',
      'verticalbanner': '120x240', 'vertban': '120x240',
      'squarebutton': '125x125', 'sqrbut': '125x125',
      'leaderboard': '728x90', 'leadbrd': '728x90',
      'wideskyscraper': '160x600', 'wiskyscrpr': '160x600',
      'skyscraper': '120x600', 'skyscrpr': '120x600',
      'halfpage': '300x600', 'hpge': '300x600',
      // Display standards
      'cga': '320x200', 'qvga': '320x240', 'vga': '640x480',
      'wvga': '800x480', 'svga': '800x600', 'wsvga': '1024x600',
      'xga': '1024x768', 'wxga': '1280x800', 'sxga': '1280x1024',
      'wsxga': '1440x900', 'uxga': '1600x1200', 'wuxga': '1920x1200',
      'qxga': '2048x1536', 'wqxga': '2560x1600', 'qsxga': '2560x2048',
      'wqsxga': '3200x2048', 'quxga': '3200x2400', 'wquxga': '3840x2400',
      // Video standards
      'ntsc': '720x480', 'pal': '768x576',
      'hd720': '1280x720', '720p': '1280x720',
      'hd1080': '1920x1080', '1080p': '1920x1080',
      '2k': '2560x1440', '4k': '3840x2160'
    };
    
    let dimensionSegment = segments[0] || '300x150';
    // Remove extension from dimension segment
    dimensionSegment = dimensionSegment.replace(/\.(webp|gif|jpg|jpeg|png|svg)$/i, '');
    
    // Check if it's a keyword
    const lowerDim = dimensionSegment.toLowerCase();
    if (dimensionKeywords[lowerDim]) {
      dimensionSegment = dimensionKeywords[lowerDim];
    }
    
    // Parse width x height
    const dimensions = dimensionSegment.split('x');
    let width = 300, height = 150;
    
    if (dimensions.length >= 1) {
      const parsedWidth = parseFloat(dimensions[0].replace(/[^\d.]/g, ''));
      if (!isNaN(parsedWidth) && parsedWidth > 0) {
        width = parsedWidth;
      }
    }
    
    if (dimensions.length >= 2) {
      const parsedHeight = parseFloat(dimensions[1].replace(/[^\d.]/g, ''));
      if (!isNaN(parsedHeight) && parsedHeight > 0) {
        height = parsedHeight;
      }
    } else {
      height = width; // Square if only width provided
    }
    
    // Limit dimensions (matching PHP: max area of 33,177,600 or max dimension 9999)
    const area = width * height;
    if (area > 33177600 || width > 9999 || height > 9999) {
      return new Response('Too big of an image!', {
        status: 400,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
    
    if (width < 1 || height < 1) {
      return new Response('Too small of an image!', {
        status: 400,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
    
    // Round to 3 decimal places
    width = Math.round(width * 1000) / 1000;
    height = Math.round(height * 1000) / 1000;
    
    // Parse background color (second segment)
    let bgColor = 'ccc'; // Default matches PHP
    if (segments[1]) {
      const bgSegment = segments[1].replace(/\.(webp|gif|jpg|jpeg|png|svg)$/i, '');
      if (bgSegment) {
        bgColor = bgSegment;
      }
    }
    
    // Parse foreground color (third segment)
    let fgColor = '000'; // Default matches PHP (was '969696' in PHP but code shows '000')
    if (segments[2]) {
      const fgSegment = segments[2].replace(/\.(webp|gif|jpg|jpeg|png|svg)$/i, '');
      if (fgSegment) {
        fgColor = fgSegment;
      }
    }
    
    // Query parameters can override path-based colors
    const params = url.searchParams;
    if (params.get('bg')) {
      bgColor = params.get('bg');
    }
    if (params.get('fg')) {
      fgColor = params.get('fg');
    }
    
    // Sanitize colors
    const bg = sanitizeColor(bgColor);
    const fg = sanitizeColor(fgColor);
    
    // Parse text parameter
    // PHP supports both ?text= and &text= (legacy format from URL rewrite)
    let text = params.get('text');
    
    if (!text && text !== '0') {
      // Default text uses multiplication sign like PHP
      text = `${width} × ${height}`;
    } else {
      // Handle + as space and | as newline (PHP behavior)
      text = text.replace(/\+/g, ' ').replace(/\|/g, '\n');
    }
    
    // Escape text for safe XML rendering
    const safeText = escapeXml(text);
    
    // Calculate font size (matching PHP's approach more closely)
    // PHP: max(min($width / strlen($text) * 1.15, $height * 0.5), 5)
    const textLength = text.replace(/\n/g, '').length;
    let fontSize = Math.min(
      width / textLength * 1.15,
      height * 0.5
    );
    fontSize = Math.max(5, Math.min(200, fontSize)); // Add reasonable bounds
    
    // Generate SVG (matching PHP output structure)
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
 * Matches PHP behavior
 */
function sanitizeColor(c) {
  if (!c) return 'cccccc';
  // Remove non-hex characters
  const cleaned = String(c).replace(/[^0-9a-fA-F]/g, '');
  // Expand 3-char to 6-char hex
  if (cleaned.length === 3) {
    return cleaned.split('').map(ch => ch + ch).join('');
  }
  if (cleaned.length === 6) {
    return cleaned;
  }
  // If length doesn't match, take first 6 chars or fallback
  if (cleaned.length > 6) {
    return cleaned.slice(0, 6);
  }
  // Fallback for invalid lengths
  return 'cccccc';
}

/**
 * Escape XML/HTML special characters (prevent injection)
 */
function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
