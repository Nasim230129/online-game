import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "PlayNest Privacy Policy - Transparent data storage and cookie practices.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-gray-300">
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-white">Privacy Policy</h1>
        <p className="text-xs text-gray-400">Effective Date: October 2026</p>
      </div>

      <div className="space-y-6 text-sm leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">1. Data Storage & Local Persistence</h2>
          <p>
            PlayNest prioritizes player privacy. Gameplay high scores and session preferences are stored locally in your browser using standard HTML5 <code className="text-cyan">localStorage</code>. This data never leaves your device unless you explicitly interact with a future cloud feature.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">2. Server-Side Data Collection</h2>
          <p>
            When games are actively launched, an anonymous launch counter increment request is submitted to our local SQLite database. No personal identifying information (PII) is associated with gameplay counters.
          </p>
          <p>
            If you submit a message via the Contact page, your provided name, email address, subject, and message content are securely stored in the database for administrator review.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">3. Cookies & Session Management</h2>
          <p>
            Public visitors browsing games receive zero tracking cookies. For administrative users, an <code className="text-cyan">httpOnly</code> session cookie is issued upon verified login to protect dashboard mutations against Cross-Site Scripting (XSS).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">4. Advertising Placeholders</h2>
          <p>
            Any current advertising areas displayed across the portal are non-functional static layout placeholders. No third-party ad networks or tracking pixels are currently embedded.
          </p>
        </section>
      </div>
    </div>
  );
}
