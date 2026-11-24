import React from 'react';
import { AlertTriangle, Database, Download, Sparkles } from 'lucide-react';

const PrivacyLaunch: React.FC = () => (
  <div className="h-full overflow-y-auto px-4 py-6 sm:p-8">
    <article className="mx-auto max-w-4xl space-y-8">
      <header className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-700">Privacy &amp; launch</p>
        <h2 className="font-serif text-3xl font-bold text-slate-900">Your studies, your browser</h2>
        <p className="max-w-3xl text-slate-600">
          Here is what this version of IBS Companion does with your study data, what it does not offer yet,
          and what to know before using its AI features.
        </p>
      </header>

      <section aria-labelledby="data-heading" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex items-center gap-3">
          <span className="rounded-xl bg-indigo-50 p-2 text-indigo-700"><Database size={20} aria-hidden="true" /></span>
          <h3 id="data-heading" className="text-xl font-semibold text-slate-900">Where your data goes</h3>
        </div>
        <dl className="grid gap-5 sm:grid-cols-2">
          <div>
            <dt className="font-semibold text-slate-800">Study library</dt>
            <dd className="mt-1 text-sm leading-6 text-slate-600">
              Studies are saved in this browser on this device. This version has no accounts or cloud sync.
              Your browser or device protections apply; the app does not provide a separate encrypted account vault.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-800">AI features</dt>
            <dd className="mt-1 text-sm leading-6 text-slate-600">
              AI features are disabled unless the deployment explicitly enables them. When enabled, the relevant
              passage, notes, or chat messages are sent to this app&apos;s server endpoint and forwarded to Google Gemini.
              AI requires an internet connection.
              Review current provider and hosting policies before sending sensitive information; this app does not
              make a data-retention guarantee.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-800">No accounts or payments</dt>
            <dd className="mt-1 text-sm leading-6 text-slate-600">
              There is currently no sign-in, cloud storage, subscription, checkout, or paid-feature access control.
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-800">Backups are yours to manage</dt>
            <dd className="mt-1 text-sm leading-6 text-slate-600">
              Exports are downloaded to a location you choose. They are not synced or deleted by this app when
              browser data is cleared or a study is deleted.
            </dd>
          </div>
        </dl>
      </section>

      <section aria-labelledby="manage-heading" className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-4 flex items-center gap-3">
          <span className="rounded-xl bg-emerald-50 p-2 text-emerald-700"><Download size={20} aria-hidden="true" /></span>
          <h3 id="manage-heading" className="text-xl font-semibold text-slate-900">Manage or protect your data</h3>
        </div>
        <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600 marker:text-emerald-700">
          <li>From the Dashboard, choose <strong>Back up all studies</strong> to download a JSON copy you can keep somewhere safe.</li>
          <li>Choose <strong>Restore backup</strong> on the Dashboard to import a backup. Existing studies are kept; matching study IDs are replaced.</li>
          <li>Delete an individual study from its Dashboard card. Deletion cannot be undone unless you have an earlier backup.</li>
          <li>Clearing this site&apos;s browser data can remove studies from this browser. Export first, and keep in mind that a backup file may still contain the data.</li>
          <li>Use a trusted device and avoid including sensitive personal details in study notes or AI prompts.</li>
        </ul>
      </section>

      <section aria-labelledby="ai-heading" className="rounded-2xl border border-amber-300 bg-amber-50 p-5 sm:p-6">
        <div className="mb-3 flex items-center gap-3">
          <span className="rounded-xl bg-amber-100 p-2 text-amber-800"><Sparkles size={20} aria-hidden="true" /></span>
          <h3 id="ai-heading" className="text-xl font-semibold text-amber-950">Use AI as a study aid, not an authority</h3>
        </div>
        <p className="text-sm leading-6 text-amber-950">
          AI-generated titles, themes, historical background, and chat responses can be inaccurate or reflect
          disputed interpretations. Check suggestions against the scripture text and reliable sources. Only enter
          or submit scripture text you have permission to use, including when sending it to an AI service.
        </p>
        <a
          href="https://ai.google.dev/gemini-api/terms"
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex min-h-11 items-center gap-2 font-medium text-amber-950 underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-800"
        >
          Review Google Gemini API terms <span className="sr-only">(opens in a new tab)</span>
        </a>
      </section>

      <section aria-labelledby="launch-heading" className="rounded-2xl border border-slate-200 bg-slate-900 p-5 text-slate-100 sm:p-6">
        <div className="mb-4 flex items-center gap-3">
          <span className="rounded-xl bg-slate-800 p-2 text-amber-300"><AlertTriangle size={20} aria-hidden="true" /></span>
          <h3 id="launch-heading" className="text-xl font-semibold text-white">Not yet ready for unrestricted public launch</h3>
        </div>
        <p className="mb-4 text-sm leading-6 text-slate-300">
          This screen and the linked pages are launch drafts, not a substitute for legal review. Complete these
          steps in order; keep AI disabled until the audience, region, provider terms, and data handling are approved.
        </p>
        <ol className="list-decimal space-y-3 pl-5 text-sm leading-6 text-slate-200 marker:font-semibold marker:text-amber-300">
          <li><strong>Choose the first audience and launch regions.</strong> Google&apos;s current Gemini API terms limit use to professional or business purposes, prohibit clients directed to or likely to be accessed by people under 18, and require Paid Services for users in the EEA, UK, and Switzerland. This consumer-facing study app should not enable Gemini unless the actual use is permitted; keep <code>AI_ENABLED=false</code> or select a suitable provider.</li>
          <li><strong>Clear content and brand rights.</strong> Obtain permission for the exact Bible translation, method references, fonts, images, and marketing copy used, including commercial use and sending text to an AI provider.</li>
          <li><strong>Finalize operator policies and support.</strong> Replace the linked draft pages with accurate privacy, terms, support, contact, and data deletion/refund information. Document local browser storage, AI disclosures, hosting logs, retention, and how users can reach the operator.</li>
          <li><strong>Control production risk and cost.</strong> Add reliable server-side rate limits, abuse monitoring, provider quotas and budget alerts. The current endpoint limits requests but does not provide production-grade abuse or cost control.</li>
          <li><strong>Test a production preview.</strong> Verify HTTPS/PWA install, mobile and keyboard access, study recovery, backup/restore, error states, and AI-off behavior. Review any enabled AI output and confirm its privacy and provider terms.</li>
          <li><strong>Launch the web/PWA pilot first.</strong> Use a commercial-eligible hosting plan if operating commercially. This project is not configured as a native iOS or Android store submission; packaging for stores requires native work, store accounts, metadata, assets, review access, and platform-specific policy checks.</li>
        </ol>
        <div className="mt-5 rounded-xl border border-slate-700 bg-slate-800/70 p-4">
          <h4 className="font-semibold text-white">Monetize only after the pilot proves demand</h4>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Keep the core study workflow free while interviewing learners and small-group leaders and measuring repeat use.
            Test paid templates, polished exports, or leader-prepared group guides as hypotheses—not promises. The app has no
            accounts, shared storage, checkout, or paid-feature enforcement today, so do not sell cloud sync or group access
            until those capabilities and their privacy, tax, refund, and cancellation flows exist. Avoid unlimited AI.
          </p>
        </div>
        <div className="mt-5 flex flex-wrap gap-4 text-sm">
          <a href={`${import.meta.env.BASE_URL}privacy.html`} className="underline underline-offset-4">Privacy notice</a>
          <a href={`${import.meta.env.BASE_URL}terms.html`} className="underline underline-offset-4">Terms of use</a>
          <a href={`${import.meta.env.BASE_URL}support.html`} className="underline underline-offset-4">Support</a>
        </div>
      </section>
    </article>
  </div>
);

export default PrivacyLaunch;
