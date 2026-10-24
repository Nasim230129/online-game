"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Play, RotateCcw, Award, Pause, Play as ResumeIcon, ArrowLeft, ArrowRight } from "lucide-react";

interface LaneRacerProps {
  onStartGame: () => void;
  onUpdateScore: (score: number) => void;
  bestScore: number | null;
}

interface Obstacle {
  id: number;
  lane: number; // 0: left, 1: middle, 2: right
  y: number; // 0 to 100 percentage
  speed: number;
  color: string;
}

const LANES = [16.6, 50, 83.3]; // percentage horizontal positions of 3 lanes

export default function LaneRacer({ onStartGame, onUpdateScore, bestScore }: LaneRacerProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [playerLane, setPlayerLane] = useState<number>(1); // starts in middle (1)
  const [score, setScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);

  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const spawnTimerRef = useRef<number>(0);
  const obstacleIdRef = useRef<number>(0);
  const playerLaneRef = useRef<number>(1);

  useEffect(() => {
    playerLaneRef.current = playerLane;
  }, [playerLane]);

  const startGame = () => {
    setScore(0);
    setPlayerLane(1);
    setObstacles([]);
    setGameOver(false);
    setIsPlaying(true);
    setIsPaused(false);
    setHasStarted(true);
    lastTimeRef.current = performance.now();
    spawnTimerRef.current = 0;
    onStartGame();
  };

  const togglePause = () => {
    if (!isPlaying || gameOver) return;
    setIsPaused((p) => !p);
  };

  const moveLeft = () => {
    if (!isPlaying || isPaused || gameOver) return;
    setPlayerLane((l) => Math.max(0, l - 1));
  };

  const moveRight = () => {
    if (!isPlaying || isPaused || gameOver) return;
    setPlayerLane((l) => Math.min(2, l + 1));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        e.preventDefault();
        moveLeft();
      } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        e.preventDefault();
        moveRight();
      } else if (e.key === " " || e.key === "p" || e.key === "P") {
        e.preventDefault();
        togglePause();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, isPaused, gameOver]);

  // Main game loop with requestAnimationFrame
  const gameLoop = useCallback((timestamp: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = timestamp;
    const dt = (timestamp - lastTimeRef.current) / 1000;
    lastTimeRef.current = timestamp;

    spawnTimerRef.current += dt;
    // Spawn rival car every 1.1s, guarantee never blocking all 3 lanes
    if (spawnTimerRef.current > 1.1) {
      spawnTimerRef.current = 0;
      obstacleIdRef.current += 1;
      const lane = Math.floor(Math.random() * 3);
      const colors = ["#EF4444", "#F59E0B", "#EC4899", "#8B5CF6"];
      const newObs: Obstacle = {
        id: obstacleIdRef.current,
        lane,
        y: -15,
        speed: 38 + Math.random() * 12, // speed percentage per second
        color: colors[Math.floor(Math.random() * colors.length)],
      };
      setObstacles((prev) => [...prev, newObs]);
    }

    setObstacles((prev) => {
      const updated: Obstacle[] = [];
      let collision = false;
      const currentLane = playerLaneRef.current;

      for (const obs of prev) {
        const nextY = obs.y + obs.speed * dt;

        // Player is at y ~ 78% with height ~ 14%
        // Collision detection window: obs.y between 68% and 88% in the same lane
        if (obs.lane === currentLane && nextY > 66 && nextY < 86) {
          collision = true;
        }

        if (nextY < 110) {
          updated.push({ ...obs, y: nextY });
        }
      }

      if (collision) {
        setGameOver(true);
        setIsPlaying(false);
      }

      return updated;
    });

    setScore((s) => s + Math.floor(dt * 30));

    animFrameRef.current = requestAnimationFrame(gameLoop);
  }, []);

  useEffect(() => {
    if (isPlaying && !isPaused && !gameOver) {
      lastTimeRef.current = performance.now();
      animFrameRef.current = requestAnimationFrame(gameLoop);
    } else {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    }

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, isPaused, gameOver, gameLoop]);

  // Update best score when game over
  useEffect(() => {
    if (gameOver) {
      onUpdateScore(score);
    }
  }, [gameOver, score, onUpdateScore]);

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-navy-900 rounded-2xl border border-surface-border text-white select-none">
      {/* Top Bar Stats */}
      <div className="flex items-center justify-between w-full max-w-sm mb-4 px-2 text-sm sm:text-base font-semibold">
        <div className="text-gray-300">
          Distance: <span className="text-cyan font-bold text-lg">{score}m</span>
        </div>
        {bestScore !== null && (
          <div className="flex items-center gap-1 text-amber-400">
            <Award className="w-4 h-4" />
            <span>Best: {bestScore}m</span>
          </div>
        )}
      </div>

      {/* Highway Viewport */}
      <div className="relative w-full max-w-[320px] h-[380px] bg-navy-950 rounded-2xl border-2 border-surface-border shadow-2xl overflow-hidden">
        {/* Road Surfaces */}
        <div className="absolute inset-x-4 inset-y-0 bg-[#0F172A] border-x-2 border-slate-700 flex justify-around">
          {/* Lane Divider 1 */}
          <div className="w-1 h-full border-r-2 border-dashed border-amber-400/40" />
          {/* Lane Divider 2 */}
          <div className="w-1 h-full border-r-2 border-dashed border-amber-400/40" />
        </div>

        {/* Rival Cars */}
        {obstacles.map((obs) => (
          <div
            key={obs.id}
            style={{
              left: `${LANES[obs.lane]}%`,
              top: `${obs.y}%`,
              transform: "translate(-50%, 0)",
            }}
            className="absolute w-9 h-14 rounded-lg shadow-lg flex flex-col items-center justify-between p-1 transition-none"
          >
            <div
              className="w-full h-full rounded-md flex flex-col items-center justify-between py-1 shadow"
              style={{ backgroundColor: obs.color }}
            >
              <div className="w-6 h-3 bg-slate-900/80 rounded-sm" />
              <div className="flex justify-between w-full px-1">
                <div className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                <div className="w-1.5 h-1.5 bg-red-400 rounded-full" />
              </div>
            </div>
          </div>
        ))}

        {/* Player Car */}
        {isPlaying && (
          <div
            style={{
              left: `${LANES[playerLane]}%`,
              top: "76%",
              transform: "translate(-50%, 0)",
            }}
            className="absolute w-10 h-16 rounded-lg transition-all duration-100 ease-out flex flex-col items-center justify-between p-1"
          >
            <div className="w-full h-full bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-lg shadow-lg shadow-cyan-500/50 flex flex-col items-center justify-between py-1.5 border border-cyan-200">
              {/* Headlights */}
              <div className="flex justify-between w-full px-1">
                <div className="w-2 h-1.5 bg-white rounded-full shadow-[0_0_8px_#ffffff]" />
                <div className="w-2 h-1.5 bg-white rounded-full shadow-[0_0_8px_#ffffff]" />
              </div>
              {/* Windshield */}
              <div className="w-7 h-4 bg-navy-950 rounded-sm border border-cyan-700" />
              {/* Taillights */}
              <div className="flex justify-between w-full px-1.5">
                <div className="w-2 h-1 bg-rose-500 rounded-xs" />
                <div className="w-2 h-1 bg-rose-500 rounded-xs" />
              </div>
            </div>
          </div>
        )}

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

        {/* Start / Crash Overlay */}
        {(!isPlaying || gameOver) && !isPaused && (
          <div className="absolute inset-0 bg-navy-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            {gameOver ? (
              <>
                <div className="text-4xl mb-2">💥</div>
                <h3 className="text-2xl font-bold text-rose-400 mb-1">Crash!</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Distance Traveled: <span className="text-cyan font-bold text-lg">{score}m</span>
                </p>
                <button
                  onClick={startGame}
                  className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-bold rounded-xl shadow-lg flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" /> Try Again
                </button>
              </>
            ) : (
              <>
                <div className="text-4xl mb-2">🏎️</div>
                <h3 className="text-2xl font-bold text-white mb-1">Lane Racer</h3>
                <p className="text-gray-300 text-sm mb-4 max-w-xs">
                  Switch lanes to weave through oncoming traffic. How far can you go?
                </p>
                <button
                  onClick={startGame}
                  className="px-8 py-3 bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-bold rounded-xl shadow-lg shadow-violet-500/25 flex items-center gap-2 transform active:scale-95 transition"
                >
                  <Play className="w-5 h-5 fill-current" /> Start Engine
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Mobile Touch & On-Screen Controls */}
      <div className="mt-4 flex items-center justify-center gap-6">
        <button
          onClick={moveLeft}
          aria-label="Move Left"
          disabled={!isPlaying || isPaused}
          className="p-4 bg-surface-card hover:bg-surface-elevated active:scale-90 rounded-2xl border border-surface-border text-cyan shadow-lg transition"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        {isPlaying && (
          <button
            onClick={togglePause}
            aria-label="Pause"
            className="p-3 bg-surface-card hover:bg-surface-elevated active:scale-95 rounded-xl border border-surface-border text-gray-300 transition"
          >
            <Pause className="w-5 h-5" />
          </button>
        )}
        <button
          onClick={moveRight}
          aria-label="Move Right"
          disabled={!isPlaying || isPaused}
          className="p-4 bg-surface-card hover:bg-surface-elevated active:scale-90 rounded-2xl border border-surface-border text-cyan shadow-lg transition"
        >
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
      <p className="mt-2 text-xs text-gray-400 text-center">
        Controls: Left/Right Arrow keys, A/D, or on-screen arrows
      </p>
    </div>
  );
}
