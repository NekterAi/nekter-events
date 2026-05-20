// Webinar registration endpoint.
//
// Flow:
//   1. Validate the form payload.
//   2. POST to NekterCRM /api/intake (source: "webinar") so the lead lands
//      in the CRM. CRM does upsert-on-email, so re-registrations don't dupe.
//   3. Send the confirmation email via Resend.
//   4. Return { ok: true } so the frontend can show the success state.
//
// CRM failures DO NOT block the email — we still want the user to get their
// confirmation. Failures are logged for follow-up via Vercel logs.

import { sendConfirmationEmail } from './_email.js';

const REQUIRED_STRING_FIELDS = ['firstName', 'lastName', 'email', 'phone', 'company', 'jobTitle', 'teamSize', 'industry', 'painPoint', 'referralSource'];

function bad(res, status, message, details) {
  res.status(status).json({ ok: false, error: message, details });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return bad(res, 405, 'Method not allowed');
  }

  // Vercel parses JSON automatically when content-type is application/json,
  // but guard against raw bodies and bad payloads.
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return bad(res, 400, 'Invalid JSON body');
    }
  }
  if (!body || typeof body !== 'object') {
    return bad(res, 400, 'Missing body');
  }

  // Coerce + validate
  const fields = {};
  for (const key of REQUIRED_STRING_FIELDS) {
    const v = body[key];
    if (typeof v !== 'string' || !v.trim()) {
      return bad(res, 400, `Missing required field: ${key}`);
    }
    fields[key] = v.trim();
  }
  const requestedAudit = body.requestedAudit === true || body.requestedAudit === 'true';
  const sessionIso = typeof body.sessionIso === 'string' ? body.sessionIso : null;
  const sessionLabel = typeof body.sessionLabel === 'string' ? body.sessionLabel : null;
  const sessionTime = typeof body.sessionTime === 'string' ? body.sessionTime : null;
  const tier = body.tier === 'vip' ? 'vip' : 'free';
  // Free signup => "webinar". VIP starts as "webinar-vip-pending"; the Stripe
  // webhook bumps it to a confirmed VIP activity once payment lands.
  const crmSource = tier === 'vip' ? 'webinar-vip-pending' : 'webinar';

  // Basic email sanity check (Resend will reject obvious garbage anyway)
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    return bad(res, 400, 'Invalid email address');
  }

  // 1) Forward to CRM (don't block email on failure, but capture for response)
  const crmUrl = process.env.CRM_INTAKE_URL;
  const crmSecret = process.env.CRM_INTAKE_SECRET;
  let crmResult = { ok: false, skipped: 'not_configured' };
  if (crmUrl) {
    try {
      const crmRes = await fetch(crmUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(crmSecret ? { 'x-intake-secret': crmSecret } : {}),
        },
        body: JSON.stringify({
          first_name: fields.firstName,
          last_name: fields.lastName,
          email: fields.email,
          phone: fields.phone,
          company: fields.company,
          role: fields.jobTitle,
          team_size: fields.teamSize,
          industry: fields.industry,
          description: fields.painPoint,
          source: crmSource,
          referral_source: fields.referralSource,
          requested_audit: requestedAudit,
          webinar_session_iso: sessionIso,
        }),
      });
      const crmJson = await crmRes.json().catch(() => ({}));
      if (!crmRes.ok) {
        console.error('[register] CRM intake failed', crmRes.status, crmJson);
        crmResult = { ok: false, status: crmRes.status, error: crmJson };
      } else {
        crmResult = { ok: true, ...crmJson };
      }
    } catch (err) {
      console.error('[register] CRM intake threw', err);
      crmResult = { ok: false, error: err instanceof Error ? err.message : String(err) };
    }
  }

  // 2) Send confirmation email — only on the free path. VIP users get
  //    Stripe's hosted receipt after payment + their welcome email fires once
  //    the Stripe webhook hits the CRM. Sending a "you're in!" email mid-flow
  //    to a Stripe redirect would be confusing.
  if (tier !== 'vip') {
    try {
      await sendConfirmationEmail({
        to: fields.email,
        firstName: fields.firstName,
        sessionLabel,
        sessionTime,
        meetLink: process.env.WEBINAR_MEET_LINK || null,
        requestedAudit,
      });
    } catch (err) {
      console.error('[register] Resend email failed', err);
      // If the email fails AND the CRM also failed, this is a hard error.
      if (!crmResult.ok) {
        return bad(res, 500, 'Registration failed — please try again or email hello@nekter.ai');
      }
      // CRM saved the lead, so we can recover later. Tell the user we got them
      // but the confirmation may be delayed.
      return res.status(200).json({
        ok: true,
        tier,
        emailSent: false,
        crm: crmResult.ok,
        message: 'Registered, but the confirmation email failed to send. Check your inbox shortly — if nothing arrives, email hello@nekter.ai.',
      });
    }
  }

  return res.status(200).json({ ok: true, tier, emailSent: tier !== 'vip', crm: crmResult.ok });
}
