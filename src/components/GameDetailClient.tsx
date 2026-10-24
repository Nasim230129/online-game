"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Game } from "@/types";
import { GameCard, AdPlaceholder } from "@/components/Cards";
import {
  Maximize2,
  Minimize2,
  ChevronRight,
  Flame,
  Award,
  Info,
  RotateCcw,
  ShieldAlert,
} from "lucide-react";

// Import the 6 built-in games
import SlidingPuzzle from "./games/SlidingPuzzle";
import TargetTap from "./games/TargetTap";
import LaneRacer from "./games/LaneRacer";
import Snake from "./games/Snake";
import TreasureMaze from "./games/TreasureMaze";
import MemoryMatch from "./games/MemoryMatch";

interface GameDetailClientProps {
  game: Game;
  relatedGames: Game[];
}

export function GameDetailClient({ game, relatedGames }: GameDetailClientProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [launchCount, setLaunchCount] = useState(game.launchCount);
  const [bestScore, setBestScore] = useState<number | null>(null);
  const [hasLaunched, setHasLaunched] = useState(false);
  const playAreaContainerRef = useRef<HTMLDivElement>(null);

  // Load local best score for this device
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`playnest_score_${game.slug}`);
      if (stored !== null) {
        setBestScore(parseInt(stored, 10));
      }
    } catch {
      // LocalStorage access may fail in private mode
    }
  }, [game.slug]);

  // Track launch on first game interaction (NOT on page render!)
  const handleGameStart = async () => {
    if (hasLaunched) return;
    setHasLaunched(true);
    try {
      const res = await fetch(`/api/games/${game.slug}/launch`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setLaunchCount(data.launchCount);
      }
    } catch (err) {
      console.error("Failed to track game launch:", err);
    }
  };

  const handleUpdateScore = (newScore: number) => {
    if (bestScore === null || newScore > bestScore) {
      setBestScore(newScore);
      try {
        localStorage.setItem(`playnest_score_${game.slug}`, newScore.toString());
      } catch (err) {
        console.error("Could not write score to localStorage:", err);
      }
    }
  };

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    if (!playAreaContainerRef.current) return;

    if (!document.fullscreenElement) {
      if (playAreaContainerRef.current.requestFullscreen) {
        playAreaContainerRef.current.requestFullscreen().catch(() => {
          alert("Fullscreen mode is not supported by your browser or environment.");
        });
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  const renderActiveGame = () => {
    if (game.gameType === "external" && game.embedUrl) {
      return (
        <div className="w-full h-full min-h-[480px] rounded-2xl overflow-hidden bg-navy-950 flex flex-col">
          <iframe
            src={game.embedUrl}
            title={game.title}
            sandbox="allow-scripts allow-same-origin allow-forms"
            allow="fullscreen; autoplay"
            className="w-full h-full min-h-[480px] border-0"
            onLoad={handleGameStart}
          />
        </div>
      );
    }

    // Render built-in games
    switch (game.builtinId) {
      case "sliding-puzzle":
        return (
          <SlidingPuzzle
            onStartGame={handleGameStart}
            onUpdateScore={handleUpdateScore}
            bestScore={bestScore}
          />
        );
      case "target-tap":
        return (
          <TargetTap
            onStartGame={handleGameStart}
            onUpdateScore={handleUpdateScore}
            bestScore={bestScore}
          />
        );
      case "lane-racer":
        return (
          <LaneRacer
            onStartGame={handleGameStart}
            onUpdateScore={handleUpdateScore}
            bestScore={bestScore}
          />
        );
      case "snake":
        return (
          <Snake
            onStartGame={handleGameStart}
            onUpdateScore={handleUpdateScore}
            bestScore={bestScore}
          />
        );
      case "treasure-maze":
        return (
          <TreasureMaze
            onStartGame={handleGameStart}
            onUpdateScore={handleUpdateScore}
            bestScore={bestScore}
          />
        );
      case "memory-match":
        return (
          <MemoryMatch
            onStartGame={handleGameStart}
            onUpdateScore={handleUpdateScore}
            bestScore={bestScore}
          />
        );
      default:
        return (
          <div className="p-12 text-center text-gray-400">
            <ShieldAlert className="w-12 h-12 text-rose-400 mx-auto mb-2" />
            <p>Game module configuration pending.</p>
          </div>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-gray-400">
        <Link href="/" className="hover:text-white transition">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
        <Link href="/games" className="hover:text-white transition">
          Games
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
        <Link
          href={`/games?category=${game.categorySlug}`}
          className="capitalize hover:text-white transition"
        >
          {game.categorySlug.replace("-", " ")}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
        <span className="text-gray-200 font-semibold truncate">{game.title}</span>
      </nav>

      {/* Main Play Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Playable Game Container */}
        <div className="lg:col-span-8 space-y-4">
          <div
            ref={playAreaContainerRef}
            className="relative bg-surface-card border border-surface-border rounded-3xl p-4 sm:p-6 shadow-2xl overflow-hidden"
          >
            {/* Game Screen Controls Toolbar */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-surface-border">
              <div className="flex items-center gap-3">
                <h1 className="text-xl sm:text-2xl font-black text-white">{game.title}</h1>
                <span className="text-xs uppercase font-bold px-2 py-0.5 rounded-full bg-navy-950 border border-surface-border text-cyan">
                  {game.categorySlug}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleFullscreen}
                  title="Toggle Fullscreen"
                  aria-label="Toggle Fullscreen"
                  className="p-2 bg-navy-950 hover:bg-navy-900 border border-surface-border rounded-xl text-gray-300 hover:text-cyan transition"
                >
                  {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Active Game Component */}
            <div className="flex items-center justify-center min-h-[360px] sm:min-h-[440px]">
              {renderActiveGame()}
            </div>
          </div>

          {/* Game Description & Instructions */}
          <div className="rounded-3xl bg-surface-card border border-surface-border p-6 space-y-4">
            <div>
              <h2 className="text-lg font-bold text-white mb-2">About {game.title}</h2>
              <p className="text-sm text-gray-300 leading-relaxed">{game.shortDescription}</p>
            </div>

            <div className="pt-4 border-t border-surface-border">
              <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <Info className="w-4 h-4 text-cyan" /> Instructions & Controls
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed bg-navy-950 p-3 rounded-xl border border-surface-border">
                {game.instructions}
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar Info, High Scores & Labelled Ad */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Stats & Device Score */}
          <div className="rounded-3xl bg-surface-card border border-surface-border p-5 space-y-4">
            <h3 className="font-bold text-white text-sm">Game Metrics</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-navy-950 rounded-xl border border-surface-border">
                <span className="text-[11px] text-gray-400 block">Total Plays</span>
                <span className="text-lg font-extrabold text-cyan">{launchCount}</span>
              </div>
              <div className="p-3 bg-navy-950 rounded-xl border border-surface-border">
                <span className="text-[11px] text-gray-400 block">Your Device Best</span>
                <span className="text-lg font-extrabold text-amber-400">
                  {bestScore !== null ? bestScore : "—"}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-gray-400 leading-normal">
              High scores are saved to your local browser storage. Gameplay launch counts increment only when a game is actively started.
            </p>
          </div>

          {/* Labelled Advertising Slot */}
          <AdPlaceholder slot="sidebar" />

          {/* Related Games in Same Category */}
          {relatedGames.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white">More Games to Explore</h3>
              <div className="space-y-3">
                {relatedGames.slice(0, 3).map((rel) => (
                  <Link
                    key={rel.id}
                    href={`/games/${rel.slug}`}
                    className="flex items-center gap-3 p-2.5 rounded-2xl bg-surface-card hover:bg-surface-elevated border border-surface-border transition group"
                  >
                    <div className="w-16 h-12 rounded-lg bg-navy-950 overflow-hidden shrink-0">
                      <div className="w-full h-full flex items-center justify-center text-xs font-bold text-cyan">
                        🎮
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-white group-hover:text-cyan truncate transition-colors">
                        {rel.title}
                      </h4>
                      <span className="text-[10px] text-gray-400 capitalize">
                        {rel.categorySlug.replace("-", " ")}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
