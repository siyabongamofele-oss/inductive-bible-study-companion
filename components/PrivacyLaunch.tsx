import React from 'react';
import { AlertTriangle, BookOpenCheck, Database, Download, ShieldCheck, Sparkles } from 'lucide-react';

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
          This screen is an explanation of the current prototype, not a published privacy policy, terms of service,
          or support channel. Before public use, the product owner still needs to:
        </p>
        <ul className="space-y-3 text-sm leading-6 text-slate-200">
          <li className="flex gap-2"><ShieldCheck size={18} className="mt-1 shrink-0 text-amber-300" aria-hidden="true" /><span>Publish accurate privacy, terms, and support information, including applicable data handling and deletion details.</span></li>
          <li className="flex gap-2"><Sparkles size={18} className="mt-1 shrink-0 text-amber-300" aria-hidden="true" /><span>Do not launch the current consumer-facing AI features on Gemini API without confirming an allowed use. Google&apos;s current terms describe API use as professional or business use, not consumer use, and prohibit clients directed to or likely to be accessed by people under 18. Choose a provider and audience the product is permitted to serve.</span></li>
          <li className="flex gap-2"><BookOpenCheck size={18} className="mt-1 shrink-0 text-amber-300" aria-hidden="true" /><span>Confirm permissions for scripture translations and other content used in the actual experience.</span></li>
          <li className="flex gap-2"><AlertTriangle size={18} className="mt-1 shrink-0 text-amber-300" aria-hidden="true" /><span>Add server-side abuse prevention, rate limiting, and provider cost controls before exposing AI features to public traffic.</span></li>
        </ul>
        <div className="mt-5 flex flex-wrap gap-4 text-sm">
          <a href="/privacy.html" className="underline underline-offset-4">Privacy notice</a>
          <a href="/terms.html" className="underline underline-offset-4">Terms of use</a>
          <a href="/support.html" className="underline underline-offset-4">Support</a>
        </div>
      </section>
    </article>
  </div>
);

export default PrivacyLaunch;
