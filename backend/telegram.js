const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;
const BOT_TOKEN = process.env.BOT_TOKEN; // telegram bot token (hide this, don't put in frontend)
const CHAT_ID = process.env.CHAT_ID;     // telegram chat id

app.use(cors());
app.use(express.json());

if (!BOT_TOKEN || !CHAT_ID) {
  console.warn('WARNING: BOT_TOKEN or CHAT_ID not set in environment!');
}

function buildCheckoutMessage(payload) {
  const { name, email, phone, items, total, note } = payload;
  const itemsText = (items || []).map(i => `${i.quantity}× ${i.name} — ${i.price}${i.currency ?? '€'}`).join('\n');
  return `\n<b>💰 New order received</b>\n\n<b>Buyer:</b> ${escapeHtml(name || '-')}\n<b>Email:</b> ${escapeHtml(email || '-')}\n<b>Phone:</b> ${escapeHtml(phone || '-')}\n<b>Total:</b> ${escapeHtml(String(total || 0))}\n<b>Items:</b>\n${escapeHtml(itemsText || '-')}\n${note ? `\n<b>Note:</b> ${escapeHtml(note)}` : ''}\n`.trim();
}

function escapeHtml(text = '') {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

app.post('/api/telegram', async (req, res) => {
  try {
    if (!BOT_TOKEN || !CHAT_ID) {
      return res.status(500).json({ ok: false, error: 'BOT_TOKEN or CHAT_ID not configured on server.' });
    }

    const { type, message, payload } = req.body || {};

    let text = '';
    if (type === 'log' && message) {
      text = message; // message expected to be already HTML-safe or simple text
    } else if (type === 'checkout' && payload) {
      text = buildCheckoutMessage(payload);
    } else {
      return res.status(400).json({ ok: false, error: 'Invalid body. Expect {type: "checkout"|"log", payload/message}.' });
    }

    // Use global fetch (Node 18+) or fall back to node-fetch if not available
    const fetchFn = (typeof fetch !== 'undefined') ? fetch : (await import('node-fetch')).default;

    const tgResp = await fetchFn(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        parse_mode: 'HTML',
        text,
      }),
    });

    const tgJson = await tgResp.json();
    if (!tgJson.ok) {
      return res.status(502).json({ ok: false, error: 'Telegram API error', details: tgJson });
    }

    return res.json({ ok: true, result: tgJson.result });
  } catch (err) {
    console.error('Error in /api/telegram', err);
    return res.status(500).json({ ok: false, error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Telegram relay server running on port ${PORT}`);
  if (!BOT_TOKEN || !CHAT_ID) {
    console.log('Make sure to set BOT_TOKEN and CHAT_ID in environment variables.');
  }
});
