"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Play, RotateCcw, Award, Pause, Play as ResumeIcon, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";

interface SnakeProps {
  onStartGame: () => void;
  onUpdateScore: (score: number) => void;
  bestScore: number | null;
}

type Point = { x: number; y: number };
type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

const GRID_SIZE = 16; // 16x16 grid

export default function Snake({ onStartGame, onUpdateScore, bestScore }: SnakeProps) {
  const [snake, setSnake] = useState<Point[]>([
    { x: 8, y: 8 },
    { x: 7, y: 8 },
    { x: 6, y: 8 },
  ]);
  const [food, setFood] = useState<Point>({ x: 12, y: 8 });
  const [direction, setDirection] = useState<Direction>("RIGHT");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);

  const directionRef = useRef<Direction>("RIGHT");
  const lastMoveDirectionRef = useRef<Direction>("RIGHT");
  const gameIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  const spawnFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    let collision = true;
    while (collision) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      collision = currentSnake.some((segment) => segment.x === newFood.x && segment.y === newFood.y);
      if (!collision) return newFood;
    }
    return { x: 5, y: 5 };
  }, []);

  const startGame = () => {
    const initialSnake = [
      { x: 8, y: 8 },
      { x: 7, y: 8 },
      { x: 6, y: 8 },
    ];
    setSnake(initialSnake);
    setDirection("RIGHT");
    directionRef.current = "RIGHT";
    lastMoveDirectionRef.current = "RIGHT";
    setFood(spawnFood(initialSnake));
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setIsPlaying(true);
    setHasStarted(true);
    onStartGame();
  };

  const togglePause = () => {
    if (!isPlaying || gameOver) return;
    setIsPaused((p) => !p);
  };

  const changeDirection = (newDir: Direction) => {
    if (!isPlaying || isPaused || gameOver) return;
    const lastDir = lastMoveDirectionRef.current;
    if (
      (newDir === "UP" && lastDir !== "DOWN") ||
      (newDir === "DOWN" && lastDir !== "UP") ||
      (newDir === "LEFT" && lastDir !== "RIGHT") ||
      (newDir === "RIGHT" && lastDir !== "LEFT")
    ) {
      setDirection(newDir);
      directionRef.current = newDir;
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") {
        e.preventDefault();
        changeDirection("UP");
      } else if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
        e.preventDefault();
        changeDirection("DOWN");
      } else if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        e.preventDefault();
        changeDirection("LEFT");
      } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        e.preventDefault();
        changeDirection("RIGHT");
      } else if (e.key === " " || e.key === "p" || e.key === "P") {
        e.preventDefault();
        togglePause();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, isPaused, gameOver]);

  // Snake step tick
  const stepSnake = useCallback(() => {
    setSnake((prevSnake) => {
      const currentDir = directionRef.current;
      lastMoveDirectionRef.current = currentDir;
      const head = prevSnake[0];
      const newHead: Point = { ...head };

      if (currentDir === "UP") newHead.y -= 1;
      if (currentDir === "DOWN") newHead.y += 1;
      if (currentDir === "LEFT") newHead.x -= 1;
      if (currentDir === "RIGHT") newHead.x += 1;

      // Check wall collision
      if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
        setGameOver(true);
        setIsPlaying(false);
        return prevSnake;
      }

      // Check self collision
      if (prevSnake.some((seg) => seg.x === newHead.x && seg.y === newHead.y)) {
        setGameOver(true);
        setIsPlaying(false);
        return prevSnake;
      }

      const nextSnake = [newHead, ...prevSnake];

      // Check food eating
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 10);
        setFood(spawnFood(nextSnake));
      } else {
        nextSnake.pop(); // remove tail if no food eaten
      }

      return nextSnake;
    });
  }, [food, spawnFood]);

  useEffect(() => {
    if (isPlaying && !isPaused && !gameOver) {
      gameIntervalRef.current = setInterval(stepSnake, 130);
    }
    return () => {
      if (gameIntervalRef.current) clearInterval(gameIntervalRef.current);
    };
  }, [isPlaying, isPaused, gameOver, stepSnake]);

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
          Score: <span className="text-cyan font-bold text-lg">{score}</span>
        </div>
        {bestScore !== null && (
          <div className="flex items-center gap-1 text-amber-400">
            <Award className="w-4 h-4" />
            <span>Best: {bestScore}</span>
          </div>
        )}
      </div>

      {/* Grid Canvas */}
      <div className="relative p-2 bg-navy-950 rounded-2xl border-2 border-surface-border shadow-2xl">
        <div className="grid grid-cols-16 gap-[2px] w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] bg-slate-900/60 rounded-xl overflow-hidden p-1">
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, idx) => {
            const x = idx % GRID_SIZE;
            const y = Math.floor(idx / GRID_SIZE);

            const isHead = snake[0].x === x && snake[0].y === y;
            const isBody = !isHead && snake.some((s) => s.x === x && s.y === y);
            const isFood = food.x === x && food.y === y;

            let cellClass = "rounded-xs ";
            if (isHead) {
              cellClass += "bg-emerald-400 shadow-[0_0_8px_#34D399]";
            } else if (isBody) {
              cellClass += "bg-emerald-600/90";
            } else if (isFood) {
              cellClass += "bg-rose-500 rounded-full shadow-[0_0_8px_#F43F5E] animate-pulse";
            } else {
              cellClass += "bg-navy-900/40";
            }

            return <div key={idx} className={cellClass} />;
          })}
        </div>

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
        {(!isPlaying || gameOver) && !isPaused && (
          <div className="absolute inset-0 bg-navy-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            {gameOver ? (
              <>
                <div className="text-4xl mb-2">💀</div>
                <h3 className="text-2xl font-bold text-rose-400 mb-1">Game Over</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Final Length: <span className="text-cyan font-bold text-lg">{snake.length}</span> (
                  {score} pts)
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
                <div className="text-4xl mb-2">🐍</div>
                <h3 className="text-2xl font-bold text-white mb-1">Snake Classic</h3>
                <p className="text-gray-300 text-sm mb-4 max-w-xs">
                  Guide the hungry serpent, gather glowing fruit, and avoid wall collisions.
                </p>
                <button
                  onClick={startGame}
                  className="px-8 py-3 bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-bold rounded-xl shadow-lg shadow-violet-500/25 flex items-center gap-2 transform active:scale-95 transition"
                >
                  <Play className="w-5 h-5 fill-current" /> Start Game
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* D-Pad Controls for Touch / Mobile */}
      <div className="mt-4 flex flex-col items-center gap-2">
        <button
          onClick={() => changeDirection("UP")}
          aria-label="Up"
          className="p-3 bg-surface-card hover:bg-surface-elevated active:scale-90 rounded-xl border border-surface-border text-cyan shadow"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-4">
          <button
            onClick={() => changeDirection("LEFT")}
            aria-label="Left"
            className="p-3 bg-surface-card hover:bg-surface-elevated active:scale-90 rounded-xl border border-surface-border text-cyan shadow"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={togglePause}
            aria-label="Pause / Resume"
            className="p-3 bg-surface-card hover:bg-surface-elevated active:scale-90 rounded-xl border border-surface-border text-gray-300 shadow text-xs font-bold"
          >
            {isPaused ? "▶" : "⏸"}
          </button>
          <button
            onClick={() => changeDirection("RIGHT")}
            aria-label="Right"
            className="p-3 bg-surface-card hover:bg-surface-elevated active:scale-90 rounded-xl border border-surface-border text-cyan shadow"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
        <button
          onClick={() => changeDirection("DOWN")}
          aria-label="Down"
          className="p-3 bg-surface-card hover:bg-surface-elevated active:scale-90 rounded-xl border border-surface-border text-cyan shadow"
        >
          <ArrowDown className="w-5 h-5" />
        </button>
      </div>

      <p className="mt-2 text-xs text-gray-400 text-center">
        Controls: Arrow Keys, WASD, or on-screen D-Pad. Press Space or P to pause.
      </p>
    </div>
  );
}
