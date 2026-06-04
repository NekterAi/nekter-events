# Nekter AI — Webinar Landing Page

## Register
brand

This is a marketing surface, not a product UI. Design IS the product. The page's
job is to convert visitors into webinar registrants (free) or VIP buyers ($25).

## Product purpose

A monthly live 60-minute webinar — **"The 5 AI Tools Every Business Owner Should
Actually Use"** — taught by Spencer Simonson (Co-Founder, Nekter AI) and Jodie
Sacco (revenue strategy partner). The five tools: Claude, ChatGPT, Higgsfield,
Gemini Deep Research, NotebookLM. The session ends with a 10-minute live
homework block where attendees build a real ad for their business.

Two upsell paths off the registration:
1. Free webinar registration → confirmation email + auto-add to nurture
2. VIP $25 (Stripe) → access to a private post-session "VIP room" where Spencer
   reviews attendee homework live + priority audit booking

## Users

Business owners across verticals — explicitly NOT enterprise / NOT engineers.
Form options surface the actual industry mix:
- Home services (HVAC, plumbing, general)
- Legal, medical (healthcare flagged for compliance), med spa
- Hospitality (restaurant, hotel)
- Real estate, insurance/financial services
- Retail, e-commerce
- Marketing/agency
- Other

Team size: solo founder → 50+. Most are 2-15. Typical attendee runs a service
business between $500k-$2M/yr and is drowning in admin work they think AI
*should* handle but can't figure out how.

What they're skeptical of when they land:
- "This is a sales pitch in disguise" — they've been burned by GHL/HubSpot demos
- "I'm not technical enough" — they assume AI tools require coding
- "Show me a real result, not a feature list"

## Brand voice

**Operators, not consultants.** We sound like we built the thing, not like we
advise on building things. Specific numbers, not adjectives. Concrete examples,
not categories.

Direct. Conversational. No corporate hedge. No buzzwords (literally banned:
"unlock", "leverage", "transform", "revolutionize"). No em-dashes. Sentences
short. Specific dollar figures and time savings where possible:
"90 minutes becomes 8 minutes" beats "save time on proposals."

Confident without being smug. Funny in a dry way. Skeptical of hype, even our
own. We respect that the reader is busy.

Sample lines that hit the tone:
- "Stop watching AI tutorials. Start using AI like a pro."
- "60 minutes. 5 tools. You leave with a real ad."
- "Built by operators. Not consultants."
- "Hey Name, you mentioned your team spends 6 hours a week on follow-ups. We did this for Moza Bella last quarter and freed up 14 hours/wk."

Sample lines that DON'T:
- Anything with "unlock", "leverage", "transform"
- "Comprehensive AI-powered solutions for the modern business"
- "Join the AI revolution"

## Strategic principles

1. **The deck IS the proof.** The page should look like Spencer would actually
   deliver this — same energy, same conviction, same specificity. If the page
   feels glossier than the talk, it's a lie.

2. **Two CTAs, one priority.** Free registration is the funnel top. VIP $25 is
   the qualifier. Don't make both equally loud — Free wins the visual hierarchy,
   VIP earns a clear upsell moment.

3. **Audit is the real backend.** The $10k-$50k audit is what we actually want
   to book. The webinar is the trojan horse.

4. **No date until we have one.** Site has supported "date TBA" mode from day
   one. First confirmed session: Thursday June 25, 2026. Time still TBA at time
   of writing.

5. **Multi-vertical, single deck.** Examples in copy lean toward service-business
   owners doing $500k-$2M, but the deck is intentionally universal so we don't
   fragment monthly delivery.

## Anti-references (DO NOT look like)

This is the most important section. The current site (v1) leans dark-navy +
purple-gradient and tested as "feels like every other AI company's deck."
Explicit feedback from Spencer: "no navy, no AI slop colors."

**Forbidden visual families:**
- **SaaS AI slop**: dark navy bg + purple-to-pink gradient + glassmorphism cards
- **HubSpot/GoHighLevel template**: rounded teal cards, friendly icons, marketing-ese copy
- **Corporate consultancy**: navy + gold, stock-photo executives, "We help you..."
- **AI revolution rhetoric**: "transform your business", "unlock potential"
- **Gradient text** on headings (banned by impeccable's absolute bans too)
- **Identical card grids** of features (currently the page has two such grids)

**Reference we ARE chasing:** cook.ai / Serge Gatari's webby workshop landing
(saved as `webby-reference-full.jpeg` in repo root). What it does right:
- VSL as the hero, not feature cards
- Sticky countdown banner at top
- Long-form chapter copy ("PART I · THE PROBLEM", "PART II · THE STAKES", ...)
- Specific numbers everywhere ($200K→$1M in 5 weeks, $30-50 delivery cost on $8K-15K services)
- Single CTA repeated ("Register Now →")
- Authority anchors (Sequoia citation)
- Fit check ("This is for you if / not for you if")
- Pure black + mint/teal accent
- Editorial sans + serif italic for emphasis

**What we ARE NOT copying from cook.ai:**
- Their exact mint/teal palette (would look derivative). We need our own
  accent that's anti-AI-slop without literally cribbing them.
- The single-founder framing — we have Jodie + Spencer, not one host
- The 90-min agency pivot framing — we're a 60-min tools workshop

## Conversion architecture

The page exists to do exactly two things, in priority order:
1. **Drive free registrations** (Tally-style form, lives in a popup modal)
2. **Drive VIP purchases** (Stripe Payment Link, $25 one-time)

Both flows hit the NekterCRM `/api/intake` endpoint already wired up. Resend
sends the confirmation email. None of that backend should be touched by the
redesign — only the page chrome around the form.

## Out of scope

- Pricing change (Free + VIP $25 are fixed)
- Form fields (locked by CRM schema)
- Speaker bios (Spencer + Jodie + Noah + Sam confirmed)
- Backend (CRM intake, Resend, Stripe webhook) — already in production
