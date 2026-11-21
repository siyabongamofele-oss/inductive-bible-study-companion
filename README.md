# Inductive Bible Study Companion

A browser-based workspace for studying a passage through observation, interpretation, application, and charting. Studies are saved in the current browser, can be exported individually as Markdown, and can be backed up or restored together as a versioned JSON file. If saved data cannot be read, the app offers a download before allowing the library to be replaced. Gemini-powered coaching and suggestions run through a server-side API route so the provider key is not included in the browser bundle.

## Run locally

**Prerequisites:** Node.js `^20.19.0` or `>=22.12.0`.

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env.local`. Set `GEMINI_API_KEY` there and set `AI_ENABLED=true` only if your provider permits your intended audience and use case. Keep the key server-side; never add a `VITE_` prefix. With AI disabled, the study workspace remains usable and AI requests return a clear unavailable message.
3. Run `npx vercel dev` so both the Vite app and `/api/ai` serverless function are available locally.
4. Open the local URL printed by Vercel CLI.

`npm run dev` starts only the Vite frontend; AI requests need the serverless route. `npm run build` runs the TypeScript check and creates the static frontend in `dist`.

## Deploy the web app

1. Put the project in a Git repository and push it to a private or public GitHub repository.
2. Import that repository into Vercel. The checked-in `vercel.json` selects Vite, `npm run build`, and `dist`.
3. Keep `AI_ENABLED` unset or set it to `false` in Vercel until you have confirmed the provider's terms permit your intended audience and use case. If approved, set `AI_ENABLED=true` and add `GEMINI_API_KEY` in the Vercel project's server-side Environment Variables. Do not put the key in client-side environment variables.
4. Deploy a Preview first. Verify creating/editing/reloading/exporting studies, backing up and restoring a library, and each AI feature; confirm installation over HTTPS and offline app-shell loading after an initial online visit. Browsers without an automatic install prompt show manual instructions; AI features require an internet connection.
5. Promote the verified deployment to Production and attach a domain. A PWA install is a web app, not an iOS App Store or Google Play submission.
6. Before sharing publicly, set provider quotas/billing alerts and add abuse prevention/rate limiting to `/api/ai`. The function protects the API key but is not, by itself, a cost-control or user-authentication system.

## Before public launch

- **Privacy and audience:** Publish a privacy policy and terms before enabling AI. Google API terms require the policy to explain what user information is collected, used, and shared with Google or other third parties. Explain that studies stay in the current browser unless exported, while content submitted to AI is sent to Google Gemini; accurately describe deletion, retention, analytics, and future account data. Review the current [Gemini API Terms](https://ai.google.dev/gemini-api/terms): users must be at least 18, API clients must not be directed to or likely to be accessed by people under 18, and Paid Services are required for user-facing clients in the EEA, UK, and Switzerland. Do not assume a paid tier alone makes every public consumer-facing use permitted. Unpaid-service content may be used to improve Google's products and reviewed by humans; do not send sensitive or confidential information using unpaid services. Confirm audience, allowed regions, provider terms, and service tier before enabling public AI access. See [Google APIs Terms](https://developers.google.com/terms).
- **Scripture and other content rights:** The app asks people to paste a passage; do not assume that makes any translation free for commercial display or AI processing. Review the actual text used in marketing, examples, saved demos, and future features. Obtain permission for the translation and intended commercial, online, and AI use, or use content whose license clearly allows it. Crossway's [ESV permissions](https://www.crossway.org/permissions/) restrict certain ESV uses in AI systems; its [ESV API terms](https://www.esv.org/api/) describe non-commercial API use. Get written permission before using ESV text commercially or sending it to AI.
- **Commercial hosting:** Vercel's [Hobby terms](https://vercel.com/legal/terms) limit that plan to personal, non-commercial use. If operating this app commercially, select a Vercel plan that permits the intended use and budget for its current charges.
- **AI safeguards and costs:** Test output quality across all study steps, label suggestions as fallible study aids, provide a report/contact path, cap request sizes, and configure provider-side quotas, budgets, and alerts. Add production-grade rate limiting and abuse monitoring before public traffic.
- **Accessibility and quality:** Test keyboard navigation, small screens, current browsers, empty/error states, saved-data recovery, and a clean deployment. Add automated component/API tests and monitoring before taking payments.
- **Ownership and disclosures:** Confirm rights for app branding, any IBS method/manual references, images, fonts, and other copied content. Avoid implying endorsement by a school, publisher, or translation owner without permission.

The app is an independent study aid and is not an official publication of or endorsed by any Bible translation owner or Bible-study organization.

## Monetization path

1. **Validate first:** Interview Bible-study learners, leaders, and small groups; observe whether they repeatedly use the workflow and which problem they would pay to solve. Start with a web launch and a no-payment pilot rather than building billing into this prototype.
2. **Test a simple offer:** Keep basic personal studies free; test a paid individual plan for reusable study templates and richer exports, plus a group/church plan for shared curricula and leader tools. These are hypotheses, not validated demand or implemented entitlements. The current app has no accounts, cloud sync, or payment system, so do not promise cross-device storage or paid access controls until those exist. Avoid unlimited AI; set fair-use limits from measured provider cost.
3. **Add billing only after demand:** For web subscriptions, use hosted checkout (for example, [Stripe Checkout](https://docs.stripe.com/billing/subscriptions/build-subscriptions.md?payment-ui=checkout&ui=stripe-hosted)), then verify subscription status server-side before granting paid features. Plan for sales tax, refunds, cancellation, support, and billing webhooks. Review [Stripe Tax](https://docs.stripe.com/tax) and local requirements. Your own paid subscription does not itself make Gemini API access a Google Paid Service; check the Cloud project's billing status and Google's regional requirements separately.
4. **Re-check scripture licenses:** Confirm any paid tier, group sharing, caching, or generated study material is within the translation license. An otherwise viable subscription can still be blocked by content rights.

**Positioning to validate:** YouVersion describes its Bible App as free and already offers Scripture reading and audio, plans, notes, offline access, and community ([official product page](https://www.youversion.com/bible-app)). Do not compete by building another Bible-text library or charging for translation access. Test whether users value this app's narrower promise—a guided observation → interpretation → application → charting workflow—enough to pay for reusable study templates, leader-prepared group guides, and high-quality exports. Group collaboration and leader dashboards should wait until accounts and shared storage exist. Treat this positioning and every paid feature as a hypothesis until interviews or a pilot show repeat use and willingness to pay; avoid advertising against private study notes.

**Research tools (optional):** For further store-market validation, the Agent Finder surfaced [GetAppNiche MCP](https://api.mcp.github.com/v0.1/servers/com.getappniche%2Fmcp/versions/1.2.2) for app discovery, reviews, and keyword difficulty; [ScreensDesign](https://api.mcp.github.com/v0.1/servers/com.screensdesign%2Fscreensdesign/versions/1.0.1) for competitor flows, paywalls, and reviews; [App Store Tracker](https://api.mcp.github.com/v0.1/servers/com.appstoretracker%2Fmcp/versions/1.0.1) for iOS rankings, reviews, and revenue estimates; and [ASO Atlas MCP](https://api.mcp.github.com/v0.1/servers/com.asoatlas%2Fmcp/versions/1.1.0) for keyword and listing research. For a future native iOS submission, the [Apple App Store Reviewer agent skill](https://github.com/github/awesome-copilot/tree/a06ba06d11f41b996f8c246e2a452e1bf3a17950/skills/apple-appstore-reviewer) can assess source code and metadata for common review risks. These are optional third-party integrations, not installed or verified by this project; independently review their terms, data sources, and credentials before use. Agent Finder relevance scores are not trust or safety ratings.

## App stores

This project is currently a web app; it is not an iOS or Android app and no store submission is configured. A responsive website/PWA can be published on the web without an app-store listing. For web publication, the remaining launch items include a real deployment/domain, privacy policy and terms, contact/support path, eligibility and paid-service decisions for Gemini, scripture/brand licensing, API abuse and cost controls, and preview testing. If packaging it for stores later, this project will also need native packaging, developer accounts, store assets/metadata, review access, and policy-specific payment/privacy/account-deletion work. Review the current [Apple App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/) and [Google Play billing policy](https://support.google.com/googleplay/android-developer/answer/10281818); store rules and exceptions depend on storefront and app design.

## Recommended publication order

1. Decide the intended audience and launch regions. The current [Gemini API terms](https://ai.google.dev/gemini-api/terms) require users to be 18 or older and prohibit API clients directed to or likely to be accessed by people under 18. Do not launch Gemini AI unless its terms permit the actual audience and use; otherwise keep `AI_ENABLED=false` or choose a provider and service tier that allow the product.
2. Confirm scripture, branding, and method-related content rights for the exact free and paid experience.
3. Publish accurate privacy, terms, support, and data-deletion information. The current local-only app has no account deletion feature; document browser data clearing and exported backups honestly.
4. Add server-side abuse controls and budget alerts before exposing `/api/ai` publicly. Do not treat the hidden API key or request-size checks as rate limiting.
5. Test recovery, backup/restore, mobile layouts, accessibility, offline behavior, and every AI/error state on a Vercel Preview; fix issues before launch.
6. Publish the web/PWA first and run a no-payment pilot. Measure repeat use and willingness to pay before building accounts, entitlements, or billing.
7. If monetizing through Vercel, confirm the hosting plan permits commercial use; the Hobby plan is limited to personal, non-commercial use. Consider native store packages only after the web product is proven. In-app digital subscriptions generally trigger Apple and Google store-specific purchase rules; review the current guidelines for the exact app design, markets, and any applicable exceptions before implementing a checkout.
