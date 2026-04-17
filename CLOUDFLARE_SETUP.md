# Cloudflare Worker Setup for Telegram Proxy

This guide will help you deploy your Telegram proxy server to Cloudflare Workers for secure, always-available message forwarding.

## Prerequisites

1. **Cloudflare Account**: Sign up at [cloudflare.com](https://cloudflare.com) if you don't have one
2. **Node.js**: Install from [nodejs.org](https://nodejs.org) (LTS version)
3. **Wrangler CLI**: Cloudflare's command-line tool

## Step 1: Install Wrangler

Open Command Prompt or PowerShell and run:
```bash
npm install -g wrangler
```

## Step 2: Authenticate with Cloudflare

```bash
wrangler auth login
```
This will open your browser to log in to your Cloudflare account.

## Step 3: Deploy the Worker

1. **Navigate to your project folder**:
   ```bash
   cd path\to\your\project
   ```

2. **Deploy the worker**:
   ```bash
   wrangler deploy
   ```

3. **Set your Telegram credentials** (replace with your actual values):
   ```bash
   wrangler secret put TELEGRAM_BOT_TOKEN
   # When prompted, enter: your_bot_token_here

   wrangler secret put TELEGRAM_CHAT_ID
   # When prompted, enter: your_chat_id_here
   ```

## Step 4: Get Your Worker URL

After deployment, Wrangler will show you the URL, something like:
```
https://telegram-proxy.your-subdomain.workers.dev
```

## Step 5: Update Your Frontend

In your `connection-module/index.html`, replace:
```javascript
const url = `https://your-worker-name.your-subdomain.workers.dev`;
```
With your actual worker URL.

## Step 6: Test the Setup

1. Open your HTML page
2. Submit a test form
3. Check your Telegram chat for the message

## Getting Your Telegram Credentials

### Bot Token
1. Message [@BotFather](https://t.me/botfather) on Telegram
2. Send `/newbot`
3. Follow the prompts to create your bot
4. Copy the token (format: `123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11`)

### Chat ID
1. Send a message to your bot
2. Visit: `https://api.telegram.org/bot<YourBOTToken>/getUpdates`
3. Look for `"chat":{"id":123456789}` in the response
4. The number is your chat ID

## Troubleshooting

### Worker Deployment Issues
- Make sure you're logged in: `wrangler auth status`
- Check your internet connection
- Try `wrangler tail` to see real-time logs

### Telegram Not Receiving Messages
- Verify your bot token is correct
- Check that the chat ID is valid
- Make sure your bot is a member of the chat/group
- Check worker logs: `wrangler tail`

### CORS Issues
- The worker includes CORS headers for all origins
- If you need to restrict domains, modify the `corsHeaders` in the worker

## Security Notes

- ✅ Credentials are stored securely as Cloudflare secrets
- ✅ Never exposed in client-side code
- ✅ All sensitive operations happen server-side
- ✅ Can add authentication if needed

## Cost

- **Free Tier**: 100,000 requests/month
- **Paid**: $0.15 per million requests after free tier
- Very cost-effective for personal use!

## Need Help?

If you encounter issues:
1. Check the worker logs: `wrangler tail`
2. Verify your credentials are set correctly
3. Test the API directly with a tool like Postman

The worker URL will be something like: `https://your-project-name.your-subdomain.workers.dev`