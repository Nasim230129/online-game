import React from "react";
import Link from "next/link";
import { Game } from "@/types";
import { GameThumbnail } from "./GameThumbnail";
import { Play, Flame, Sparkles } from "lucide-react";

interface GameCardProps {
  game: Game;
  isNew?: boolean;
}

export function GameCard({ game, isNew }: GameCardProps) {
  return (
    <div className="group relative flex flex-col bg-surface-card hover:bg-surface-elevated border border-surface-border hover:border-violet-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-violet-950/30 hover:-translate-y-1">
      {/* Thumbnail Container */}
      <div className="relative aspect-[16/10] w-full bg-navy-950 overflow-hidden">
        <GameThumbnail
          type={game.thumbnailSvg || game.builtinId || game.slug}
          title={game.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badges based on real data */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10">
          {game.isFeatured && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-violet-600 text-white shadow-md flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-amber-300" /> Featured
            </span>
          )}
          {isNew && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-600 text-white shadow-md">
              New
            </span>
          )}
          {game.launchCount > 250 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-600 text-white shadow-md flex items-center gap-1">
              <Flame className="w-2.5 h-2.5" /> Hot
            </span>
          )}
        </div>

        {/* Overlay Play Icon on Hover */}
        <div className="absolute inset-0 bg-navy-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
          <div className="w-12 h-12 rounded-full bg-cyan-500 text-navy-950 flex items-center justify-center shadow-lg shadow-cyan-500/50 transform scale-75 group-hover:scale-100 transition-transform">
            <Play className="w-6 h-6 fill-current ml-0.5" />
          </div>
        </div>
      </div>

      {/* Info Container */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-cyan-400">
              {game.categorySlug.replace("-", " ")}
            </span>
            <span className="text-[11px] text-gray-400 font-medium">
              {game.launchCount} plays
            </span>
          </div>
          <h3 className="font-bold text-base text-white group-hover:text-cyan transition-colors line-clamp-1">
            {game.title}
          </h3>
          <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
            {game.shortDescription}
          </p>
        </div>

        {/* Action Link */}
        <div className="mt-4 pt-3 border-t border-surface-border/60 flex items-center justify-between">
          <Link
            href={`/games/${game.slug}`}
            className="w-full py-2 px-3 rounded-xl bg-navy-900 group-hover:bg-gradient-to-r group-hover:from-violet-600 group-hover:to-cyan-600 text-gray-200 group-hover:text-white font-semibold text-xs text-center border border-surface-border transition-all flex items-center justify-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Play Now</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

interface AdPlaceholderProps {
  slot: "sidebar" | "leaderboard" | "inline";
  className?: string;
}

export function AdPlaceholder({ slot, className = "" }: AdPlaceholderProps) {
  let dimensions = "h-64";
  let label = "Display Banner (300x250)";

  if (slot === "leaderboard") {
    dimensions = "h-24 sm:h-28";
    label = "Header/Footer Banner (728x90)";
  } else if (slot === "inline") {
    dimensions = "h-32";
    label = "In-Feed Sponsor Slot";
  }

  return (
    <div
      className={`w-full rounded-2xl border border-dashed border-surface-border/80 bg-navy-950/60 p-4 flex flex-col items-center justify-center text-center relative overflow-hidden ${dimensions} ${className}`}
    >
      <div className="absolute top-2 right-2 px-2 py-0.5 rounded text-[9px] uppercase tracking-wider font-bold bg-navy-900 border border-surface-border text-gray-400">
        Advertisement
      </div>
      <div className="flex flex-col items-center gap-1 text-gray-500">
        <span className="text-xs font-semibold text-gray-400">{label}</span>
        <span className="text-[11px] max-w-xs text-gray-400">
          Monetization placeholder. Integration depends on advertising network approval (e.g. AdSense).
        </span>
      </div>
    </div>
  );
}
