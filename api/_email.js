// Confirmation email rendered + sent via Resend.
//
// Edit the copy/HTML here and redeploy — the email is versioned with the
// repo, no Tally/n8n round-trips required.

const FROM = 'Spencer at Nekter AI <admin@nekter.ai>';
const REPLY_TO = 'hello@nekter.ai';

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderHtml({ firstName, sessionLabel, sessionTime, meetLink, requestedAudit }) {
  const safeName = escapeHtml(firstName || 'there');
  const safeSession = escapeHtml(sessionLabel || 'the next live session');
  const safeTime = escapeHtml(sessionTime || '');
  const meetBlock = meetLink
    ? `<p style="margin:0 0 18px"><a href="${escapeHtml(meetLink)}" style="display:inline-block;background:#6C47FF;color:#ffffff;text-decoration:none;font-weight:700;padding:14px 28px;border-radius:100px">Join on Google Meet &rarr;</a></p>`
    : `<p style="margin:0 0 18px;color:#475569">You'll get the Google Meet link in a reminder email an hour before we go live.</p>`;
  const auditBlock = requestedAudit
    ? `<div style="background:#F1F5FF;border:1px solid #DBE3FF;border-radius:14px;padding:18px 22px;margin:24px 0"><p style="margin:0;color:#1E3A8A;font-size:14px;line-height:1.6"><strong>Heads up:</strong> you ticked the free AI audit. We'll reach out within 1&ndash;2 business days to schedule it &mdash; you get priority scheduling for mentioning the webinar.</p></div>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>You're in &mdash; Nekter AI Webinar</title>
</head>
<body style="margin:0;padding:0;background:#F8FAFF;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#0F172A">
  <div style="max-width:560px;margin:0 auto;padding:40px 24px">
    <p style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#6C47FF;font-weight:700;margin:0 0 8px">Nekter AI &middot; Monthly Webinar</p>
    <h1 style="font-size:30px;font-weight:900;letter-spacing:-.02em;line-height:1.15;margin:0 0 18px">You're in, ${safeName}.</h1>
    <p style="font-size:16px;line-height:1.7;color:#334155;margin:0 0 22px">Thanks for registering for <strong>The 5 AI Tools Every Business Owner Should Actually Use</strong>. You're confirmed for ${safeSession}${safeTime ? ` at ${safeTime}` : ''}.</p>

    ${meetBlock}

    <h2 style="font-size:18px;font-weight:800;letter-spacing:-.01em;margin:32px 0 12px">Before we go live</h2>
    <ul style="font-size:15px;line-height:1.75;color:#334155;padding-left:20px;margin:0 0 24px">
      <li>Have a real business problem in mind &mdash; you'll build an ad for it live.</li>
      <li>Free accounts for Claude, ChatGPT, Gemini, and NotebookLM (Higgsfield is optional, we'll demo it).</li>
      <li>60 minutes. Camera optional. Live Q&amp;A at the end.</li>
    </ul>

    ${auditBlock}

    <p style="font-size:14px;line-height:1.7;color:#64748B;margin:32px 0 0">Reply directly to this email if you have questions before the session. See you soon.</p>
    <p style="font-size:14px;line-height:1.7;color:#0F172A;margin:18px 0 0"><strong>Spencer Simonson</strong><br>Co-Founder &amp; CTO, Nekter AI</p>

    <hr style="border:none;border-top:1px solid #E2E8F0;margin:36px 0 20px">
    <p style="font-size:12px;color:#94A3B8;line-height:1.6;margin:0">Nekter AI &middot; Las Vegas, NV &middot; <a href="mailto:hello@nekter.ai" style="color:#6C47FF;text-decoration:none">hello@nekter.ai</a></p>
  </div>
</body>
</html>`;
}

function renderText({ firstName, sessionLabel, sessionTime, meetLink, requestedAudit }) {
  const lines = [
    `Hey ${firstName || 'there'},`,
    '',
    `You're confirmed for "The 5 AI Tools Every Business Owner Should Actually Use" — ${sessionLabel || 'the next live session'}${sessionTime ? ` at ${sessionTime}` : ''}.`,
    '',
    meetLink
      ? `Join on Google Meet: ${meetLink}`
      : `You'll get the Google Meet link in a reminder email an hour before we go live.`,
    '',
    'Before we go live:',
    '  • Have a real business problem in mind — you\'ll build an ad for it live.',
    '  • Free accounts for Claude, ChatGPT, Gemini, and NotebookLM (Higgsfield is optional).',
    '  • 60 minutes. Camera optional. Live Q&A at the end.',
    '',
  ];
  if (requestedAudit) {
    lines.push(
      'Heads up: you ticked the free AI audit. We\'ll reach out within 1–2 business days to schedule it — priority scheduling for mentioning the webinar.',
      '',
    );
  }
  lines.push(
    'Reply to this email if you have questions before the session. See you soon.',
    '',
    'Spencer Simonson',
    'Co-Founder & CTO, Nekter AI',
    'hello@nekter.ai',
  );
  return lines.join('\n');
}

export async function sendConfirmationEmail({
  to,
  firstName,
  sessionLabel,
  sessionTime,
  meetLink,
  requestedAudit,
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY not configured');
  }

  const payload = {
    from: FROM,
    to: [to],
    reply_to: REPLY_TO,
    subject: `You're in — ${sessionLabel || 'Nekter AI Webinar'}`,
    html: renderHtml({ firstName, sessionLabel, sessionTime, meetLink, requestedAudit }),
    text: renderText({ firstName, sessionLabel, sessionTime, meetLink, requestedAudit }),
  };

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend API error ${res.status}: ${body}`);
  }

  return res.json();
}
