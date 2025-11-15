# DummyImage

An alternative to [dummyimage.com](https://dummyimage.com/) that runs on Cloudflare Workers (free tier). **Fully compatible with dummyimage.com URL format** for seamless migration.

## Features

- Generate placeholder images with custom dimensions
- Customize background and foreground colors
- Add custom text overlays
- Support for dimension keywords (VGA, HD1080, mediumrectangle, etc.)
- Fast, edge-cached responses via Cloudflare's global network
- Free to deploy and use (within Cloudflare's free tier limits)
- **100% compatible with dummyimage.com** - drop-in replacement

## Usage

The service supports all dummyimage.com URL patterns:

### Basic Usage

```
/{width}x{height}[.ext]
```

Examples: 
- `/600x400` - generates a 600x400px image with default colors
- `/600x400.png` - with file extension (all formats return SVG)

### Dimension Keywords

Supports standard dimension keywords:

**IAB Ad Sizes:**
- `/mediumrectangle` or `/medrect` - 300x250
- `/leaderboard` or `/leadbrd` - 728x90
- `/skyscraper` or `/skyscrpr` - 120x600
- `/wideskyscraper` or `/wiskyscrpr` - 160x600
- And many more...

**Display Standards:**
- `/vga` - 640x480
- `/xga` - 1024x768
- `/hd720` or `/720p` - 1280x720
- `/hd1080` or `/1080p` - 1920x1080
- `/4k` - 3840x2160

[See full list of supported keywords](https://dummyimage.com/)

### With Path-based Colors

```
/{width}x{height}/{bgcolor}[.ext]
/{width}x{height}/{bgcolor}/{fgcolor}[.ext]
```

Examples:
- `/600x400/ff0000` - red background
- `/600x400/ccc/000` - light gray background with black text
- `/600x400/0066cc/ffffff.png` - blue background with white text

**Note:** Extensions can appear anywhere in the path (e.g., `/600x400.png/ff0000/ffffff`)

### With Query Parameters

```
/{width}x{height}[.ext]?text=custom&bg=bgcolor&fg=fgcolor
```

Examples:
- `/600x400?text=Hello+World` - custom text (+ = space)
- `/600x400?bg=ff0000&fg=ffffff` - colors via query parameters
- `/600x400/ccc/000?text=Sample+Image` - combined path colors and query text

### Text Features

- Use `+` for spaces: `?text=Hello+World`
- Use `|` for line breaks: `?text=Line1|Line2`
- Default text shows dimensions with × symbol: `600 × 400`

### Supported Extensions

The following extensions are recognized (all return SVG):
- `.svg`, `.png`, `.jpg` / `.jpeg`, `.gif`, `.webp`

## Color Format

Colors can be specified as 3-character or 6-character hex codes (without the # symbol):

- 3-character: `fff`, `000`, `f00` (automatically expanded to 6 characters)
- 6-character: `ffffff`, `000000`, `ff0000`

Colors can be specified via:
- **Path**: `/{width}x{height}/{bgcolor}/{fgcolor}`
- **Query parameters**: `?bg={bgcolor}&fg={fgcolor}` (overrides path colors)

**Default colors:**
- Background: `ccc` (light gray - #cccccc)
- Foreground: `000` (black - #000000)

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

- `/300x200` - 300x200px with default colors (ccc/000)
- `/vga` - 640x480 using VGA keyword
- `/mediumrectangle` - 300x250 IAB ad size
- `/600x400/0066cc/ffffff` - Blue background with white text
- `/800x600.png?text=Sample+Image` - 800x600 with custom text
- `/400x300/ff6600/000000?text=Line1|Line2` - Multi-line text with | separator

## Free Tier Limits

Cloudflare Workers free tier includes:
- 100,000 requests per day
- 10ms CPU time per request
- Global distribution on Cloudflare's edge network

This is more than sufficient for most placeholder image use cases.

## License

MIT
