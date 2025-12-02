

// TELEGRAM SERVICE CONFIGURATION
// To enable real notifications, replace these empty strings with your data:
// 1. Create a bot via @BotFather and get the token.
// 2. Start a chat with your bot, send a message, and get your Chat ID (via https://api.telegram.org/bot<TOKEN>/getUpdates)
const BOT_TOKEN = ''; 
const CHAT_ID = '';

export const sendTelegramLog = async (message: string): Promise<void> => {
  const cleanMessage = message.replace(/<b>|<\/b>/g, '');
  
  // 1. Dev Logging
  console.log(`[Telegram Log]: ${cleanMessage}`);

  // 2. Real Deployment Logic
  if (BOT_TOKEN && CHAT_ID) {
    try {
      const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
      const params = {
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'HTML',
      };

      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
    } catch (error) {
      console.error('Failed to send Telegram notification:', error);
    }
  }
};