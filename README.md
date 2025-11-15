# DummyImage

An alternative to [dummyimage.com](https://dummyimage.com/) that runs on Cloudflare Workers (free tier).

## Features

- Generate placeholder images with custom dimensions
- Customize background and foreground colors
- Add custom text overlays
- Fast, edge-cached responses via Cloudflare's global network
- Free to deploy and use (within Cloudflare's free tier limits)

## Usage

The service supports various URL patterns:

### Basic Usage

```
/{width}x{height}
```

Example: `/600x400` - generates a 600x400px image with default colors

### With Background Color

```
/{width}x{height}/{bgcolor}
```

Example: `/600x400/ff0000` - generates a 600x400px image with red background

### With Background and Foreground Colors

```
/{width}x{height}/{bgcolor}/{fgcolor}
```

Example: `/600x400/000000/ffffff` - generates a 600x400px image with black background and white text

### With Custom Text

```
/{width}x{height}/{bgcolor}/{fgcolor}/{text}
```

Example: `/600x400/cccccc/969696/Hello%20World` - generates a 600x400px image with custom text

## Color Format

Colors can be specified as 3-character or 6-character hex codes (without the # symbol):

- 3-character: `fff`, `000`, `f00`
- 6-character: `ffffff`, `000000`, `ff0000`

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
- `/800x600/ff6600/000000/Sample%20Image` - Orange background with black text saying "Sample Image"

## Free Tier Limits

Cloudflare Workers free tier includes:
- 100,000 requests per day
- 10ms CPU time per request
- Global distribution on Cloudflare's edge network

This is more than sufficient for most placeholder image use cases.

## License

MIT
