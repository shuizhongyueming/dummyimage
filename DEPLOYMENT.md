# Quick Deployment Guide

This guide will help you deploy DummyImage to Cloudflare Workers in just a few minutes.

## Prerequisites

- A [Cloudflare account](https://dash.cloudflare.com/sign-up) (free tier works!)
- [Node.js](https://nodejs.org/) version 16 or higher installed

## Step-by-Step Deployment

### 1. Install Dependencies

```bash
npm install
```

### 2. Login to Cloudflare

```bash
npx wrangler login
```

This will open a browser window asking you to authorize Wrangler to access your Cloudflare account.

### 3. Deploy!

```bash
npm run deploy
```

That's it! Wrangler will:
- Bundle your worker
- Upload it to Cloudflare
- Provide you with a URL where your worker is deployed

### 4. Test Your Deployment

Once deployed, you'll see output like:

```
Published dummyimage (X.XX sec)
  https://dummyimage.YOUR-SUBDOMAIN.workers.dev
```

Test it by visiting:
```
https://dummyimage.YOUR-SUBDOMAIN.workers.dev/600x400
```

## Using a Custom Domain (Optional)

If you want to use your own domain instead of `*.workers.dev`:

1. Go to your [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Workers & Pages**
3. Click on your `dummyimage` worker
4. Go to **Settings** → **Triggers** → **Custom Domains**
5. Click **Add Custom Domain** and follow the instructions

## Updating Your Deployment

Whenever you make changes, just run:

```bash
npm run deploy
```

## Local Testing Before Deploy

Always test locally first:

```bash
npm run dev
```

Then visit `http://localhost:8787/600x400` in your browser.

## Free Tier Limits

Cloudflare's free tier includes:
- **100,000 requests per day**
- **10ms CPU time per request**
- **Global edge network**

This is more than enough for most use cases!

## Troubleshooting

### "Not logged in" error
Run `npx wrangler login` again

### "Account not found" error
Make sure you've created a Cloudflare account and verified your email

### "Deploy failed" error
Check that your `wrangler.toml` is correctly configured

## Need Help?

- Check the [README.md](README.md) for more details
- See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup
- Open an issue on GitHub if you encounter problems
