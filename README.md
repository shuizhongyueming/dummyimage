# DummyImage

An alternative to [dummyimage.com](https://dummyimage.com/) that runs on Cloudflare Workers (free tier).

## Features

- Generate placeholder images with custom dimensions
- Customize background and foreground colors
- Add custom text overlays
- Fast, edge-cached responses via Cloudflare's global network
- Free to deploy and use (within Cloudflare's free tier limits)
- Compatible with dummyimage.com URL format

## Usage

The service supports the same URL patterns as dummyimage.com:

### Basic Usage

```
/{width}x{height}[.ext]
```

Example: `/600x400` or `/600x400.png` - generates a 600x400px image with default colors

### With Path-based Colors

```
/{width}x{height}/{bgcolor}[.ext]
/{width}x{height}/{bgcolor}/{fgcolor}[.ext]
```

Examples:
- `/600x400/ff0000` - red background
- `/600x400/000/fff` - black background with white text
- `/600x400/0066cc/ffffff.png` - blue background with white text (as PNG)

### With Query Parameters

```
/{width}x{height}[.ext]?text=custom&bg=bgcolor&fg=fgcolor
```

Examples:
- `/600x400?text=Hello+World` - custom text (+ represents space)
- `/600x400?bg=ff0000&fg=ffffff` - colors via query parameters
- `/600x400/000/fff?text=Sample+Image` - combined path colors and query text

### Supported Extensions

The following extensions are recognized (all return SVG):
- `.svg`
- `.png`
- `.jpg` / `.jpeg`
- `.gif`
- `.webp`

## Color Format

Colors can be specified as 3-character or 6-character hex codes (without the # symbol):

- 3-character: `fff`, `000`, `f00` (automatically expanded to 6 characters)
- 6-character: `ffffff`, `000000`, `ff0000`

Colors can be specified via:
- **Path**: `/{width}x{height}/{bgcolor}/{fgcolor}`
- **Query parameters**: `?bg={bgcolor}&fg={fgcolor}` (overrides path colors)

Default colors:
- Background: `dddddd` (light gray)
- Foreground: `777777` (medium gray)

## Text Parameter

Custom text can be added via the `text` query parameter:
- Use `+` for spaces: `?text=Hello+World`
- Default text shows dimensions: `600×400`

## Deployment on Cloudflare

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later)
- A [Cloudflare account](https://dash.cloudflare.com/sign-up) (free tier is sufficient)

### Setup

1. Clone this repository:
   ```bash
   git clone https://github.com/shuizhongyueming/dummyimage.git
   cd dummyimage
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Login to Cloudflare:
   ```bash
   npx wrangler login
   ```

4. Deploy to Cloudflare Workers:
   ```bash
   npm run deploy
   ```

### Local Development

To test the worker locally:

```bash
npm run dev
```

This will start a local server (typically at http://localhost:8787) where you can test the image generation.

## Examples

- `/300x200` - 300x200px with default gray colors
- `/600x400/0066cc/ffffff` - Blue background with white text
- `/800x600.png?text=Sample+Image` - 800x600 with custom text
- `/400x300/ff6600/000000?text=Orange+Banner` - Orange background with black text

## Free Tier Limits

Cloudflare Workers free tier includes:
- 100,000 requests per day
- 10ms CPU time per request
- Global distribution on Cloudflare's edge network

This is more than sufficient for most placeholder image use cases.

## License

MIT
