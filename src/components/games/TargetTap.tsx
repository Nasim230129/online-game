"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Play, RotateCcw, Award, Zap, Pause, Play as ResumeIcon } from "lucide-react";

interface TargetTapProps {
  onStartGame: () => void;
  onUpdateScore: (score: number) => void;
  bestScore: number | null;
}

interface Target {
  id: number;
  x: number; // percentage
  y: number; // percentage
  size: number; // px
  type: "normal" | "gold";
  expiresAt: number;
}

export default function TargetTap({ onStartGame, onUpdateScore, bestScore }: TargetTapProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(30); // 30 second frenzy
  const [targets, setTargets] = useState<Target[]>([]);
  const [combo, setCombo] = useState<number>(0);

  const gameAreaRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const spawnRef = useRef<NodeJS.Timeout | null>(null);
  const targetIdCounter = useRef<number>(0);

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setCombo(0);
    setTargets([]);
    setIsPlaying(true);
    setIsPaused(false);
    setHasStarted(true);
    onStartGame();
  };

  const togglePause = () => {
    if (!isPlaying) return;
    setIsPaused((p) => !p);
  };

  const spawnTarget = useCallback(() => {
    if (!isPlaying || isPaused) return;

    targetIdCounter.current += 1;
    const isGold = Math.random() < 0.2; // 20% golden bonus target
    const size = isGold ? 48 : 56;
    const x = 10 + Math.random() * 80; // keep within 10% to 90%
    const y = 15 + Math.random() * 70; // keep within 15% to 85%

    const newTarget: Target = {
      id: targetIdCounter.current,
      x,
      y,
      size,
      type: isGold ? "gold" : "normal",
      expiresAt: Date.now() + (isGold ? 1200 : 1600), // quick reaction window
    };

    setTargets((prev) => [...prev.slice(-4), newTarget]);
  }, [isPlaying, isPaused]);

  // Main game clock
  useEffect(() => {
    if (isPlaying && !isPaused && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsPlaying(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      spawnRef.current = setInterval(() => {
        spawnTarget();
      }, 700);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (spawnRef.current) clearInterval(spawnRef.current);
    };
  }, [isPlaying, isPaused, timeLeft, spawnTarget]);

  // Handle Game Over score update
  useEffect(() => {
    if (hasStarted && !isPlaying && timeLeft === 0) {
      onUpdateScore(score);
    }
  }, [hasStarted, isPlaying, timeLeft, score, onUpdateScore]);

  // Remove expired targets loop
  useEffect(() => {
    if (!isPlaying || isPaused) return;
    const cleaner = setInterval(() => {
      const now = Date.now();
      setTargets((prev) => {
        const remaining = prev.filter((t) => t.expiresAt > now);
        if (remaining.length < prev.length) {
          // A target timed out without being tapped -> reset combo
          setCombo(0);
        }
        return remaining;
      });
    }, 100);

    return () => clearInterval(cleaner);
  }, [isPlaying, isPaused]);

  const handleTap = (targetId: number, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    if (!isPlaying || isPaused) return;

    const hit = targets.find((t) => t.id === targetId);
    if (!hit) return;

    const newCombo = combo + 1;
    setCombo(newCombo);

    const basePoints = hit.type === "gold" ? 50 : 20;
    const bonus = Math.min(newCombo * 5, 50);
    setScore((s) => s + basePoints + bonus);

    // Remove hit target
    setTargets((prev) => prev.filter((t) => t.id !== targetId));
  };

  const handleMiss = () => {
    if (!isPlaying || isPaused) return;
    setCombo(0);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-navy-900 rounded-2xl border border-surface-border text-white select-none">
      {/* Top Bar Stats */}
      <div className="flex items-center justify-between w-full max-w-md mb-4 px-2 text-sm sm:text-base font-semibold">
        <div className="flex items-center gap-1.5 text-gray-300">
          <Zap className="w-4 h-4 text-cyan" />
          Score: <span className="text-cyan font-bold text-lg">{score}</span>
        </div>
        <div className="text-gray-300">
          Time: <span className={`font-bold ${timeLeft <= 5 ? "text-rose-400 animate-pulse" : "text-white"}`}>{timeLeft}s</span>
        </div>
        {bestScore !== null && (
          <div className="flex items-center gap-1 text-amber-400">
            <Award className="w-4 h-4" />
            <span>Best: {bestScore}</span>
          </div>
        )}
      </div>

      {/* Play Area */}
      <div
        ref={gameAreaRef}
        onClick={handleMiss}
        className="relative w-full max-w-md h-[320px] sm:h-[380px] bg-navy-950 rounded-2xl border border-surface-border shadow-2xl overflow-hidden cursor-crosshair"
      >
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:2rem_2rem]" />

        {/* Combo indicator */}
        {combo > 1 && (
          <div className="absolute top-3 left-3 px-2.5 py-1 bg-violet-950/80 border border-violet-500/50 rounded-full text-violet-300 text-xs font-bold animate-bounce">
            {combo}x Combo!
          </div>
        )}

        {/* Spawned Targets */}
        {isPlaying &&
          !isPaused &&
          targets.map((t) => (
            <button
              key={t.id}
              onClick={(e) => handleTap(t.id, e)}
              onTouchStart={(e) => handleTap(t.id, e)}
              style={{
                left: `${t.x}%`,
                top: `${t.y}%`,
                width: `${t.size}px`,
                height: `${t.size}px`,
                transform: "translate(-50%, -50%)",
              }}
              aria-label="Target"
              className={`absolute rounded-full flex items-center justify-center transition-transform active:scale-90 shadow-xl ${
                t.type === "gold"
                  ? "bg-gradient-to-tr from-amber-500 to-yellow-300 border-2 border-white shadow-amber-500/50 animate-pulse"
                  : "bg-gradient-to-tr from-rose-600 to-rose-400 border-2 border-white shadow-rose-500/50"
              }`}
            >
              <div
                className={`w-3 h-3 rounded-full ${
                  t.type === "gold" ? "bg-amber-900" : "bg-white"
                }`}
              />
            </button>
          ))}

        {/* Pause Overlay */}
        {isPaused && (
          <div className="absolute inset-0 bg-navy-950/85 backdrop-blur-sm flex flex-col items-center justify-center">
            <h3 className="text-2xl font-bold text-white mb-2">Game Paused</h3>
            <button
              onClick={togglePause}
              className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-bold rounded-xl flex items-center gap-2"
            >
              <ResumeIcon className="w-4 h-4" /> Resume
            </button>
          </div>
        )}

        {/* Start / Game Over Overlay */}
        {!isPlaying && !isPaused && (
          <div className="absolute inset-0 bg-navy-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            {hasStarted ? (
              <>
                <Award className="w-12 h-12 text-amber-400 mb-2" />
                <h3 className="text-2xl font-bold text-white mb-1">Time's Up!</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Final Score: <span className="text-cyan font-bold text-lg">{score}</span>
                </p>
                <button
                  onClick={startGame}
                  className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-bold rounded-xl shadow-lg flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" /> Play Again
                </button>
              </>
            ) : (
              <>
                <Zap className="w-12 h-12 text-cyan mb-2 animate-bounce" />
                <h3 className="text-2xl font-bold text-white mb-1">Target Tap</h3>
                <p className="text-gray-300 text-sm mb-4 max-w-xs">
                  Tap glowing circles quickly before they vanish. Golden targets yield big bonuses!
                </p>
                <button
                  onClick={startGame}
                  className="px-8 py-3 bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-bold rounded-xl shadow-lg shadow-violet-500/25 flex items-center gap-2 transform active:scale-95 transition"
                >
                  <Play className="w-5 h-5 fill-current" /> Start Challenge
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Control Buttons */}
      {isPlaying && (
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={togglePause}
            className="px-4 py-2 bg-surface-card hover:bg-surface-elevated text-gray-200 border border-surface-border rounded-xl flex items-center gap-2 text-sm"
          >
            <Pause className="w-4 h-4" /> Pause
          </button>
          <button
            onClick={startGame}
            className="px-4 py-2 bg-surface-card hover:bg-surface-elevated text-gray-200 border border-surface-border rounded-xl flex items-center gap-2 text-sm"
          >
            <RotateCcw className="w-4 h-4" /> Restart
          </button>
        </div>
      )}
    </div>
  );
}
