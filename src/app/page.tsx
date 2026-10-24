import Link from "next/link";
import { getFeaturedGame, getPublishedGames, getAllCategories } from "@/lib/db";
import { GameCard, AdPlaceholder } from "@/components/Cards";
import { GameThumbnail } from "@/components/GameThumbnail";
import {
  Play,
  Sparkles,
  Trophy,
  Flame,
  ArrowRight,
  Puzzle,
  Crosshair,
  Car,
  Gamepad2,
  Compass,
  Brain,
  CheckCircle,
} from "lucide-react";

// Server rendered page
export const revalidate = 0; // Fresh database reads

export default function HomePage() {
  const featuredGame = getFeaturedGame();
  const allGames = getPublishedGames();
  const categories = getAllCategories();

  // Deterministic popular games by launchCount DESC, tie breaker title
  const popularGames = [...allGames]
    .sort((a, b) => b.launchCount - a.launchCount || a.title.localeCompare(b.title))
    .slice(0, 4);

  // New games by createdAt DESC
  const newGames = [...allGames]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 4);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case "Puzzle":
        return <Puzzle className="w-5 h-5 text-violet-400" />;
      case "Crosshair":
        return <Crosshair className="w-5 h-5 text-rose-400" />;
      case "Car":
        return <Car className="w-5 h-5 text-cyan-400" />;
      case "Gamepad2":
        return <Gamepad2 className="w-5 h-5 text-emerald-400" />;
      case "Compass":
        return <Compass className="w-5 h-5 text-amber-400" />;
      case "Brain":
        return <Brain className="w-5 h-5 text-pink-400" />;
      default:
        return <Gamepad2 className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <div className="space-y-16 pb-12">
      {/* SECTION B: Featured Game Hero Banner */}
      {featuredGame && (
        <section className="relative overflow-hidden pt-6 sm:pt-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-3xl bg-gradient-to-r from-navy-900 via-navy-850 to-navy-900 border border-surface-border p-6 sm:p-10 lg:p-12 shadow-2xl overflow-hidden">
              {/* Background ambient glow */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-10 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                {/* Left content */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/80 border border-violet-500/40 text-violet-300 text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    Featured Spotlight
                  </div>
                  <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                    {featuredGame.title}
                  </h1>
                  <p className="text-base sm:text-lg text-gray-300 max-w-xl leading-relaxed">
                    {featuredGame.shortDescription}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 pt-4">
                    <Link
                      href={`/games/${featuredGame.slug}`}
                      className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-extrabold text-base shadow-xl shadow-violet-600/25 flex items-center gap-2.5 active:scale-95 transition-all"
                    >
                      <Play className="w-5 h-5 fill-current" /> Play Now
                    </Link>
                    <Link
                      href="/games"
                      className="px-6 py-3.5 rounded-2xl bg-surface-card hover:bg-surface-elevated text-gray-200 font-semibold text-base border border-surface-border transition-all"
                    >
                      Explore All Games
                    </Link>
                  </div>

                  <div className="flex items-center gap-6 pt-2 text-xs text-gray-400">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" /> Instant HTML5 Play
                    </span>
                    <span>• No Download Required</span>
                    <span>• {featuredGame.launchCount} Plays</span>
                  </div>
                </div>

                {/* Right Hero Artwork */}
                <div className="lg:col-span-5">
                  <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border-2 border-violet-500/30 shadow-2xl shadow-violet-950/50 group">
                    <GameThumbnail
                      type={featuredGame.thumbnailSvg || featuredGame.slug}
                      title={featuredGame.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-transparent flex items-end p-4">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-navy-900/80 backdrop-blur-sm text-cyan">
                        {featuredGame.categorySlug.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SECTION C: Categories */}
      <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Explore Categories</h2>
            <p className="text-sm text-gray-400">Pick your favourite genre and start playing immediately</p>
          </div>
          <Link
            href="/games"
            className="text-xs sm:text-sm font-semibold text-cyan hover:underline flex items-center gap-1"
          >
            All Genres <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/games?category=${cat.slug}`}
              className="flex flex-col items-center justify-center p-4 rounded-2xl bg-surface-card hover:bg-surface-elevated border border-surface-border hover:border-violet-500/40 text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="w-12 h-12 rounded-xl bg-navy-900 flex items-center justify-center mb-2.5 shadow">
                {getCategoryIcon(cat.iconName)}
              </div>
              <h3 className="font-bold text-sm text-white">{cat.name}</h3>
              <span className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">{cat.description}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* SECTION D: Popular Games (Deterministic Order) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Popular Games</h2>
              <p className="text-sm text-gray-400">Ranked by actual tracked player launches</p>
            </div>
          </div>
          <Link
            href="/games?sort=popular"
            className="text-xs sm:text-sm font-semibold text-cyan hover:underline flex items-center gap-1"
          >
            View More <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </section>

      {/* SECTION F: Mid-page Advertising Placeholder Area */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdPlaceholder slot="leaderboard" />
      </section>

      {/* SECTION E: New Games */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">New Additions</h2>
              <p className="text-sm text-gray-400">Latest titles added to the PlayNest library</p>
            </div>
          </div>
          <Link
            href="/games?sort=newest"
            className="text-xs sm:text-sm font-semibold text-cyan hover:underline flex items-center gap-1"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newGames.map((game) => (
            <GameCard key={game.id} game={game} isNew={true} />
          ))}
        </div>
      </section>

      {/* SECTION G & H: Premium Concept & Local Device Scores */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Section G: Premium Preview */}
          <div id="premium" className="rounded-3xl bg-surface-card border border-surface-border p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-violet-950 text-violet-300 border border-violet-500/30">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Premium Pass
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-violet-900/60 text-violet-300 border border-violet-700/50">
                  Coming Soon
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white">Ad-Free Gaming Experience</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                In a future update, PlayNest will introduce an optional ad-free membership with exclusive arcade avatars and priority cloud save synchronization.
              </p>
              <ul className="space-y-2 pt-2 text-xs text-gray-300">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-cyan" /> 100% zero banner or interstitial advertisements
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-cyan" /> Access to experimental experimental game prototypes
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-cyan" /> Support independent browser game developers
                </li>
              </ul>
            </div>
            <div className="mt-6 pt-4 border-t border-surface-border">
              <button
                disabled
                className="w-full py-2.5 rounded-xl bg-navy-900 border border-surface-border text-gray-400 text-xs font-semibold cursor-not-allowed opacity-80"
              >
                Membership Preview Only (No Checkout)
              </button>
            </div>
          </div>

          {/* Section H: Device High Scores (Local High-Score Feature) */}
          <div className="rounded-3xl bg-surface-card border border-surface-border p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Your Device High Scores</h3>
                  <p className="text-xs text-gray-400">Stored privately in your current browser</p>
                </div>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">
                Track personal bests across PlayNest games. High scores below belong strictly to this device and browser profile.
              </p>

              {/* Score List Demo */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-navy-950 border border-surface-border text-xs">
                  <span className="font-semibold text-white">Lane Racer</span>
                  <span className="text-cyan font-bold">Personal Best Saved Per Session</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-navy-950 border border-surface-border text-xs">
                  <span className="font-semibold text-white">Target Tap</span>
                  <span className="text-cyan font-bold">Reflex Score Saved Per Session</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-navy-950 border border-surface-border text-xs">
                  <span className="font-semibold text-white">Snake Classic</span>
                  <span className="text-cyan font-bold">High Score Saved Per Session</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-surface-border text-center">
              <span className="text-[11px] text-gray-400">
                Play any game to set or beat your device records!
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
