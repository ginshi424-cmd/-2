export async function sendTelegramLog(message: string) {
  try {
    await fetch('/api/telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'log', message }),
    });
  } catch (err) {
    console.error('sendTelegramLog error', err);
  }
}

export async function sendCheckoutToTelegram(payload: {
  name?: string;
  email?: string;
  phone?: string;
  items?: { id?: string; name: string; quantity: number; price: number; currency?: string }[];
  total?: number;
  note?: string;
}) {
  try {
    const resp = await fetch('/api/telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'checkout', payload }),
    });
    if (!resp.ok) {
      const errText = await resp.text();
      throw new Error(errText || 'Failed to send checkout');
    }
    return true;
  } catch (err) {
    console.error('sendCheckoutToTelegram error', err);
    throw err;
  }
}
