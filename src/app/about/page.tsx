import { Metadata } from "next";
import Link from "next/link";
import { Gamepad2, ShieldCheck, Zap, Layers } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about the PlayNest browser gaming portal, our mission and tech stack.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-cyan">Behind The Portal</span>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">About PlayNest</h1>
        <p className="text-gray-400 text-base max-w-xl mx-auto">
          PlayNest was crafted as an engineering demonstration of a lightweight, responsive browser gaming portal.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-surface-card border border-surface-border space-y-3">
          <div className="w-10 h-10 rounded-xl bg-violet-950 border border-violet-500/30 flex items-center justify-center text-violet-400">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Instant, Zero-Install Play</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Every game on PlayNest launches in milliseconds directly in standard web browsers. There are no app store downloads, mandatory sign-ups, or invasive tracking scripts.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-surface-card border border-surface-border space-y-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Ethical Architecture</h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            We avoid fabricated statistics, dark-pattern ads, and phantom player counts. Scores are saved locally on your device for fast, private recall.
          </p>
        </div>
      </div>

      <div className="p-8 rounded-3xl bg-surface-card border border-surface-border space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan" /> University Web Engineering Lab Project
        </h2>
        <p className="text-sm text-gray-300 leading-relaxed">
          This system is developed with Next.js 14, React 18, Tailwind CSS, and SQLite (via <code className="text-cyan">better-sqlite3</code>). It incorporates a custom server-side game management engine, robust origin-validated embeds, and responsive canvas/HTML5 gameplay mechanics.
        </p>
        <div className="pt-2">
          <Link
            href="/games"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-bold text-xs inline-flex items-center gap-2 shadow"
          >
            <Gamepad2 className="w-4 h-4" /> Start Playing
          </Link>
        </div>
      </div>
    </div>
  );
}
