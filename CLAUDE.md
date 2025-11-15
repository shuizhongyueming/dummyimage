# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Cloudflare Workers** application that generates placeholder images (SVG format) as a drop-in replacement for dummyimage.com. The entire application is implemented in a single TypeScript file (`src/index.ts`) that handles HTTP requests and generates customizable placeholder images.

## Essential Commands

```bash
# Development
npm run dev          # Start local development server (http://localhost:8787)
npm run start        # Alternative: start development server

# Testing
npm run test         # Run tests with Vitest

# Deployment
npm run deploy       # Deploy to Cloudflare Workers
npm run cf-typegen   # Generate Cloudflare types
```

## Architecture

**Single-file Cloudflare Worker** (`src/index.ts` ~9KB):
- **URL Parser**: Handles multiple URL patterns for dimensions, colors, and text
- **Dimension Keywords**: 50+ predefined aliases (VGA, HD1080, mediumrectangle, etc.)
- **Color Processing**: Hex color validation and expansion (3-char to 6-char)
- **SVG Generator**: Creates responsive SVG images with text overlays
- **Request Handler**: Main entry point that processes incoming requests

**Key Functions**:
- `sanitizeColor()`: Validates and normalizes hex colors
- `escapeXml()`: Escapes XML entities for safe SVG generation
- `isSupportedFormat()`: Validates supported file extensions
- Default export: Main request handler implementing the worker logic

## URL Pattern Support

The worker supports these URL patterns (100% compatible with dummyimage.com):
- `/{width}x{height}[.ext]` - Basic dimensions
- `/{width}x{height}/{bgcolor}[.ext]` - With background color
- `/{width}x{height}/{bgcolor}/{fgcolor}[.ext]` - With both colors
- `/{dimension_keyword}[.ext]` - Using predefined keywords (vga, hd1080, etc.)
- Query parameters: `?text=custom+text&bg=ff0000&fg=ffffff`

## Development Notes

- **Package Manager**: Use PNPM (pnpm-lock.yaml present)
- **TypeScript**: Strict mode enabled, targets ES2021
- **Testing**: Vitest with Cloudflare Workers pool
- **Formatting**: Prettier and EditorConfig configured
- **Extensions**: All extensions (.svg, .png, .jpg, .gif, .webp) return SVG format

## Testing Approach

1. **Local Development**: Use `npm run dev` and test with curl or browser
2. **Visual Testing**: Open `examples.html` in browser for visual examples
3. **Unit Tests**: Run `npm run test` (currently has basic template tests)
4. **Manual Testing Examples**:
   ```bash
   curl http://localhost:8787/600x400
   curl http://localhost:8787/vga
   curl http://localhost:8787/600x400/ff0000/ffffff
   curl "http://localhost:8787/600x400?text=Hello+World"
   ```

## Cloudflare Workers Context

- **Free Tier**: 100,000 requests/day, 10ms CPU time per request
- **Global Edge**: Automatic caching and global distribution
- **Entry Point**: `src/index.ts` (configured in wrangler.jsonc)
- **Compatibility Date**: 2025-11-15