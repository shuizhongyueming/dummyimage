/**
 * DummyImage - An alternative to dummyimage.com
 * Generates placeholder images with customizable dimensions and colors
 * 
 * URL patterns supported:
 * - /{width}x{height}
 * - /{width}x{height}/{bgcolor}
 * - /{width}x{height}/{bgcolor}/{fgcolor}
 * - /{width}x{height}/{bgcolor}/{fgcolor}/{text}
 * 
 * Example: /600x400/cccccc/969696/Hello%20World
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Parse the URL path
    const match = path.match(/^\/(\d+)x(\d+)(?:\/([0-9a-fA-F]{3,6}))?(?:\/([0-9a-fA-F]{3,6}))?(?:\/(.+))?$/);
    
    if (!match) {
      return new Response('Invalid URL format. Use: /widthxheight/bgcolor/fgcolor/text', {
        status: 400,
        headers: { 'Content-Type': 'text/plain' }
      });
    }

    const [, widthStr, heightStr, bgcolor = 'cccccc', fgcolor = '969696', customText] = match;
    
    const width = parseInt(widthStr, 10);
    const height = parseInt(heightStr, 10);

    // Validate dimensions
    if (width < 1 || width > 5000 || height < 1 || height > 5000) {
      return new Response('Invalid dimensions. Width and height must be between 1 and 5000.', {
        status: 400,
        headers: { 'Content-Type': 'text/plain' }
      });
    }

    // Normalize colors (convert 3-char hex to 6-char)
    const bgColor = normalizeColor(bgcolor);
    const fgColor = normalizeColor(fgcolor);

    // Default text is dimensions
    const text = customText ? decodeURIComponent(customText) : `${width} x ${height}`;

    // Generate SVG
    const svg = generateSVG(width, height, bgColor, fgColor, text);

    // Return SVG as image
    return new Response(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  }
};

/**
 * Normalize color from 3 or 6 character hex to full 6 character hex
 */
function normalizeColor(color) {
  if (color.length === 3) {
    return color.split('').map(c => c + c).join('');
  }
  return color;
}

/**
 * Generate SVG image with specified parameters
 */
function generateSVG(width, height, bgColor, fgColor, text) {
  // Calculate font size based on image dimensions
  const fontSize = Math.min(width, height) / 10;
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" fill="#${bgColor}"/>
  <text x="50%" y="50%" 
        font-family="Arial, sans-serif" 
        font-size="${fontSize}" 
        fill="#${fgColor}" 
        text-anchor="middle" 
        dominant-baseline="middle">${escapeXML(text)}</text>
</svg>`;
}

/**
 * Escape XML special characters
 */
function escapeXML(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
