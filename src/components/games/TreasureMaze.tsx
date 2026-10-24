"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Play, RotateCcw, Award, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";

interface TreasureMazeProps {
  onStartGame: () => void;
  onUpdateScore: (score: number) => void;
  bestScore: number | null;
}

type CellType = "wall" | "path";

// 9x9 Guaranteed Reachable Maze
// 1 represents Wall, 0 represents Path
const MAZE_LAYOUT = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 1, 1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
];

interface Point {
  x: number;
  y: number;
}

const GEMS_INITIAL: Point[] = [
  { x: 3, y: 1 },
  { x: 5, y: 5 },
  { x: 1, y: 7 },
];

const EXIT_POS: Point = { x: 7, y: 7 };

export default function TreasureMaze({ onStartGame, onUpdateScore, bestScore }: TreasureMazeProps) {
  const [player, setPlayer] = useState<Point>({ x: 1, y: 1 });
  const [gems, setGems] = useState<Point[]>(GEMS_INITIAL);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [won, setWon] = useState<boolean>(false);
  const [steps, setSteps] = useState<number>(0);
  const [score, setScore] = useState<number>(0);

  const startGame = () => {
    setPlayer({ x: 1, y: 1 });
    setGems([...GEMS_INITIAL]);
    setSteps(0);
    setScore(0);
    setWon(false);
    setIsPlaying(true);
    setHasStarted(true);
    onStartGame();
  };

  const movePlayer = useCallback(
    (dx: number, dy: number) => {
      if (!isPlaying || won) return;

      const nextX = player.x + dx;
      const nextY = player.y + dy;

      // Check wall boundary
      if (MAZE_LAYOUT[nextY] && MAZE_LAYOUT[nextY][nextX] === 0) {
        setPlayer({ x: nextX, y: nextY });
        const newSteps = steps + 1;
        setSteps(newSteps);

        // Check Gem collection
        let remainingGems = gems;
        const gemIdx = gems.findIndex((g) => g.x === nextX && g.y === nextY);
        if (gemIdx !== -1) {
          remainingGems = gems.filter((_, idx) => idx !== gemIdx);
          setGems(remainingGems);
          setScore((s) => s + 100);
        }

        // Check Exit Portal
        if (nextX === EXIT_POS.x && nextY === EXIT_POS.y) {
          const gemBonus = (3 - remainingGems.length) * 100;
          const stepEfficiency = Math.max(50, 1000 - newSteps * 15);
          const finalScore = gemBonus + stepEfficiency;

          setScore(finalScore);
          setWon(true);
          setIsPlaying(false);
          onUpdateScore(finalScore);
        }
      }
    },
    [isPlaying, won, player, steps, gems, onUpdateScore]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying || won) return;
      if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
        e.preventDefault();
        movePlayer(0, -1);
      } else if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
        e.preventDefault();
        movePlayer(0, 1);
      } else if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        e.preventDefault();
        movePlayer(-1, 0);
      } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        e.preventDefault();
        movePlayer(1, 0);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, won, movePlayer]);

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-navy-900 rounded-2xl border border-surface-border text-white select-none">
      {/* Top Bar Stats */}
      <div className="flex items-center justify-between w-full max-w-sm mb-4 px-2 text-sm sm:text-base font-semibold">
        <div className="text-gray-300">
          Gems: <span className="text-pink-400 font-bold">{3 - gems.length}/3</span>
        </div>
        <div className="text-gray-300">
          Steps: <span className="text-cyan font-bold">{steps}</span>
        </div>
        {bestScore !== null && (
          <div className="flex items-center gap-1 text-amber-400">
            <Award className="w-4 h-4" />
            <span>Best: {bestScore}</span>
          </div>
        )}
      </div>

      {/* 9x9 Maze Viewport */}
      <div className="relative p-2 bg-navy-950 rounded-2xl border-2 border-surface-border shadow-2xl">
        <div className="grid grid-cols-9 gap-1 w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] bg-slate-950 p-1 rounded-xl">
          {MAZE_LAYOUT.flatMap((row, r) =>
            row.map((cell, c) => {
              const isWall = cell === 1;
              const isPlayer = player.x === c && player.y === r;
              const isGem = gems.some((g) => g.x === c && g.y === r);
              const isExit = EXIT_POS.x === c && EXIT_POS.y === r;

              let content: React.ReactNode = null;
              if (isPlayer) {
                content = (
                  <div className="w-6 h-6 rounded-full bg-cyan-400 shadow-[0_0_10px_#22D3EE] flex items-center justify-center font-bold text-navy-950 text-xs">
                    ●
                  </div>
                );
              } else if (isGem) {
                content = (
                  <div className="w-5 h-5 rounded-sm bg-pink-500 shadow-[0_0_8px_#EC4899] rotate-45 animate-pulse" />
                );
              } else if (isExit) {
                content = (
                  <div className="w-6 h-6 rounded-md bg-amber-500 shadow-[0_0_10px_#F59E0B] flex items-center justify-center text-xs">
                    🏆
                  </div>
                );
              }

              return (
                <div
                  key={`${r}-${c}`}
                  className={`flex items-center justify-center rounded-sm ${
                    isWall ? "bg-slate-800 border border-slate-700/60" : "bg-navy-900/60"
                  }`}
                >
                  {content}
                </div>
              );
            })
          )}
        </div>

        {/* Win Overlay */}
        {won && (
          <div className="absolute inset-0 bg-navy-950/90 rounded-2xl backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <CheckCircle2 className="w-14 h-14 text-emerald-400 mb-2" />
            <h3 className="text-2xl font-bold text-white mb-1">Dungeon Escaped!</h3>
            <p className="text-gray-300 text-sm mb-4">
              Collected all <span className="text-pink-400 font-bold">{3 - gems.length} gems</span> in{" "}
              <span className="text-cyan font-bold">{steps} steps</span>. (Score: {score})
            </p>
            <button
              onClick={startGame}
              className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-bold rounded-xl shadow-lg flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Play Again
            </button>
          </div>
        )}

        {/* Start Overlay */}
        {!isPlaying && !won && (
          <div className="absolute inset-0 bg-navy-950/90 rounded-2xl backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <div className="text-4xl mb-2">🧭</div>
            <h3 className="text-2xl font-bold text-white mb-1">Treasure Maze</h3>
            <p className="text-gray-300 text-sm mb-4 max-w-xs">
              Guide your explorer through the stone labyrinth. Gather glowing gems and reach the gold chest!
            </p>
            <button
              onClick={startGame}
              className="px-8 py-3 bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-bold rounded-xl shadow-lg shadow-violet-500/25 flex items-center gap-2 transform active:scale-95 transition"
            >
              <Play className="w-5 h-5 fill-current" /> Enter Maze
            </button>
          </div>
        )}
      </div>

      {/* D-Pad Controls for Touch / Mobile */}
      <div className="mt-4 flex flex-col items-center gap-2">
        <button
          onClick={() => movePlayer(0, -1)}
          aria-label="Move Up"
          disabled={!isPlaying || won}
          className="p-3 bg-surface-card hover:bg-surface-elevated active:scale-90 rounded-xl border border-surface-border text-cyan shadow"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-6">
          <button
            onClick={() => movePlayer(-1, 0)}
            aria-label="Move Left"
            disabled={!isPlaying || won}
            className="p-3 bg-surface-card hover:bg-surface-elevated active:scale-90 rounded-xl border border-surface-border text-cyan shadow"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => movePlayer(1, 0)}
            aria-label="Move Right"
            disabled={!isPlaying || won}
            className="p-3 bg-surface-card hover:bg-surface-elevated active:scale-90 rounded-xl border border-surface-border text-cyan shadow"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
        <button
          onClick={() => movePlayer(0, 1)}
          aria-label="Move Down"
          disabled={!isPlaying || won}
          className="p-3 bg-surface-card hover:bg-surface-elevated active:scale-90 rounded-xl border border-surface-border text-cyan shadow"
        >
          <ArrowDown className="w-5 h-5" />
        </button>
      </div>

      <p className="mt-2 text-xs text-gray-400 text-center">
        Controls: Arrow Keys, WASD, or on-screen D-Pad.
      </p>
    </div>
  );
}
