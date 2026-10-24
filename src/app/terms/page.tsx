import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "PlayNest Terms of Service and acceptable use conditions.",
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-gray-300">
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-white">Terms of Service</h1>
        <p className="text-xs text-gray-400">Effective Date: October 2026</p>
      </div>

      <div className="space-y-6 text-sm leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">1. Acceptable Use</h2>
          <p>
            PlayNest provides free, lightweight browser games for educational, recreational, and demonstration purposes. Users agree not to attempt denial-of-service attacks, automated credential brute-forcing, or unauthorized tampering with database endpoints.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">2. Intellectual Property & Built-in Games</h2>
          <p>
            All built-in starter games (Sliding Puzzle, Target Tap, Lane Racer, Snake Classic, Treasure Maze, and Memory Match) are original custom implementations built specifically for this demonstration.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">3. External Embed Policy</h2>
          <p>
            Where external game embeds are linked, third-party content remains the intellectual property of their respective creators and publishers. PlayNest strictly sandboxes external iframes to prevent unauthorized scripts and cookie access.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">4. University Project Disclaimer</h2>
          <p>
            This website is presented as a university Web Engineering laboratory deliverable. Services are provided "as is" without commercial warranty.
          </p>
        </section>
      </div>
    </div>
  );
}
