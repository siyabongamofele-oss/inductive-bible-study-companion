# Launch and monetization research

**Status:** research-backed launch plan, not a claim of validated demand or legal advice.

## Market position

YouVersion offers broad, free Scripture reading, audio, plans, notes, offline access, and community at global scale. Its own product page describes more than 710 million installs and 3,500+ Bible versions. IBS Companion should not compete on translation breadth or free Scripture access.

**Recommended positioning:** a guided workflow for serious passage study, especially observation, interpretation, application, and charting. Initial differentiation should be repeatable study templates and high-quality exports, not a new Bible library or generic AI chat.

## Best-paying customer hypotheses

1. **Individual Bible-study learner:** wants structured, repeatable study and a usable archive of notes.
2. **Small-group leader:** wants a proven passage guide, consistent exports, and low-friction preparation.
3. **Church or ministry training team:** wants reusable curricula and guided study formats for a cohort.

These are hypotheses. Do not build billing or promise paid entitlements until interviews show repeat use and willingness to pay.

## No-payment validation

Recruit 20-30 target users for a 2-week pilot.

- Show a participant one empty passage and ask them to complete the full four-step workflow.
- Track study creation, completion, repeat return within seven days, export/backup use, and abandoned steps.
- Interview participants about the one saved artifact or teaching workflow they would pay to preserve or reuse.
- Offer a paid waitlist only after users demonstrate repeated use; do not represent a waitlist as confirmed demand.

## Pricing hypotheses to test

- Free: one local study library, core four-step workflow, Markdown export, JSON backup/restore.
- Individual: reusable templates, PDF or print layout, richer study history, and higher fair-use AI allowance.
- Group: leader-created templates, shared cohort guides, and export controls.
- Organization: volume pricing, branded materials, training, and support.

Use a measured provider cost, fair-use limit, and server-side quota before charging for AI. Never advertise unlimited AI.

## Publication blockers

1. Decide the audience and launch regions. Current Gemini API terms prohibit consumer-directed use, require the API client users to be at least 18, and restrict use to professional or business purposes. Gemini API use in the EEA, UK, and Switzerland requires a Paid Service.
2. Enable Gemini only after legal and provider approval. Keep AI disabled by default. Enable no human-under-18 audience.
3. Obtain permissions for every Bible translation, brand, method, font, and image used in the public or paid product.
4. Publish a real operator identity, privacy notice, terms, support address, refund policy, and data-deletion process.
5. Configure provider billing alerts, quotas, server-side rate limits, abuse monitoring, and a commercial Vercel plan if needed.
6. Run preview tests for mobile, keyboard use, recovery, backup/restore, PWA install, API errors, and AI output review.

## Monetization dependencies

Accounts, server-side study storage, and entitlement enforcement must exist before charging for cross-device or shared content. For web subscriptions, use hosted checkout and verify subscription status on the server. Store tax, refund, cancellation, webhook, support, and cancellation behavior must be implemented deliberately. Apple and Google digital-subscription rules apply if packaging as a native store app.

## Evidence sources

- YouVersion product page: https://www.youversion.com/bible-app
- Gemini API terms: https://ai.google.dev/gemini-api/terms
- Google API terms: https://developers.google.com/terms
- Vercel deployment protection: https://vercel.com/docs/deployment-protection
- Stripe hosted subscriptions: https://docs.stripe.com/billing/subscriptions/build-subscriptions
- Apple App Review Guidelines: https://developer.apple.com/app-store/review/guidelines/
- Google Play billing policy: https://support.google.com/googleplay/android-developer/answer/10281818
