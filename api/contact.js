export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    let body = req.body || {};

    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        const params = new URLSearchParams(body);
        body = Object.fromEntries(params.entries());
      }
    }

    const {
      name = '',
      phone = '',
      email = '',
      service = '',
      preferred_language = '',
      message = '',
      page = '',
      _gotcha = ''
    } = body;

    // Anti-spam honeypot
    if (_gotcha) {
      return res.status(200).json({ success: true });
    }

    if (!name || !phone || !email || !service || !message) {
      return res.status(400).json({
        error: 'Uzupełnij wszystkie wymagane pola.'
      });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.error('Brak konfiguracji RESEND_API_KEY w Vercel Environment Variables.');
      return res.status(500).json({
        error: 'Błąd konfiguracji serwera: brak RESEND_API_KEY.'
      });
    }

    const fromEmail = process.env.RESEND_FROM_EMAIL || 'B&B Legal <onboarding@resend.dev>';
    const toEmail = process.env.RESEND_TO_EMAIL || 'kontakt@bb-legal.dev';

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #c5a059; border-radius: 12px; background-color: #140d08; color: #f4ebe1;">
        <h2 style="color: #f7e7b4; margin-top: 0; font-size: 20px;">Nowe zgłoszenie kontaktowe — B&amp;B Legal</h2>
        <hr style="border: none; border-top: 1px solid rgba(197, 160, 89, 0.4); margin: 16px 0;" />
        <p style="margin: 8px 0;"><strong style="color: #f7e7b4;">Imię i nazwisko:</strong> ${escapeHtml(name)}</p>
        <p style="margin: 8px 0;"><strong style="color: #f7e7b4;">Telefon:</strong> <a href="tel:${escapeHtml(phone)}" style="color: #f7e7b4; text-decoration: underline;">${escapeHtml(phone)}</a></p>
        <p style="margin: 8px 0;"><strong style="color: #f7e7b4;">E-mail:</strong> <a href="mailto:${escapeHtml(email)}" style="color: #f7e7b4; text-decoration: underline;">${escapeHtml(email)}</a></p>
        <p style="margin: 8px 0;"><strong style="color: #f7e7b4;">Rodzaj sprawy:</strong> ${escapeHtml(service)}</p>
        <p style="margin: 8px 0;"><strong style="color: #f7e7b4;">Preferowany język:</strong> ${escapeHtml(preferred_language || 'pl')}</p>
        <p style="margin: 8px 0;"><strong style="color: #f7e7b4;">Strona zgłoszenia:</strong> ${escapeHtml(page || 'Formularz kontaktowy')}</p>
        <div style="margin-top: 16px; padding: 16px; background: rgba(255, 255, 255, 0.05); border-left: 4px solid #c5a059; border-radius: 4px;">
          <strong style="color: #f7e7b4; display: block; margin-bottom: 8px;">Opis sytuacji:</strong>
          <div style="white-space: pre-wrap; line-height: 1.5;">${escapeHtml(message)}</div>
        </div>
        <hr style="border: none; border-top: 1px solid rgba(197, 160, 89, 0.2); margin: 24px 0 12px 0;" />
        <p style="font-size: 12px; color: #a39385; margin: 0;">Zgoda RODO oraz Regulamin zostały zaakceptowane przez nadawcę w formularzu.</p>
      </div>
    `;

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: email,
        subject: `[Formularz] Nowe zgłoszenie: ${service} - ${name}`,
        html: htmlContent
      })
    });

    const resendData = await resendResponse.json();

    if (!resendResponse.ok) {
      console.error('Resend API error:', resendData);
      return res.status(resendResponse.status).json({
        error: resendData.message || 'Nie udało się wysłać e-maila.'
      });
    }

    return res.status(200).json({ success: true, id: resendData.id });
  } catch (error) {
    console.error('Serverless function error:', error);
    return res.status(500).json({ error: 'Wystąpił błąd serwera.' });
  }
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
