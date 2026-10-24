"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Play, RotateCcw, Award, CheckCircle } from "lucide-react";

interface SlidingPuzzleProps {
  onStartGame: () => void;
  onUpdateScore: (score: number) => void;
  bestScore: number | null;
}

// 3x3 Board = tiles 1..8 and 0 (empty slot)
type Board = number[];

// Helper to check solvability of 3x3 sliding puzzle
function countInversions(arr: number[]): number {
  const filtered = arr.filter((x) => x !== 0);
  let inv = 0;
  for (let i = 0; i < filtered.length - 1; i++) {
    for (let j = i + 1; j < filtered.length; j++) {
      if (filtered[i] > filtered[j]) inv++;
    }
  }
  return inv;
}

function generateSolvableBoard(): Board {
  const target = [1, 2, 3, 4, 5, 6, 7, 8, 0];
  let shuffled: number[];
  do {
    shuffled = [...target].sort(() => Math.random() - 0.5);
  } while (countInversions(shuffled) % 2 !== 0 || isSolved(shuffled));
  return shuffled;
}

function isSolved(board: Board): boolean {
  for (let i = 0; i < 8; i++) {
    if (board[i] !== i + 1) return false;
  }
  return board[8] === 0;
}

export default function SlidingPuzzle({ onStartGame, onUpdateScore, bestScore }: SlidingPuzzleProps) {
  const [board, setBoard] = useState<Board>([1, 2, 3, 4, 5, 6, 7, 8, 0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [moves, setMoves] = useState<number>(0);
  const [timeSeconds, setTimeSeconds] = useState<number>(0);
  const [won, setWon] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startGame = () => {
    const newBoard = generateSolvableBoard();
    setBoard(newBoard);
    setMoves(0);
    setTimeSeconds(0);
    setWon(false);
    setIsPlaying(true);
    setHasStarted(true);
    onStartGame();
  };

  // Timer loop
  useEffect(() => {
    if (isPlaying && !won) {
      timerRef.current = setInterval(() => {
        setTimeSeconds((s) => s + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, won]);

  const moveTile = useCallback(
    (index: number) => {
      if (!isPlaying || won) return;

      const emptyIndex = board.indexOf(0);
      const row = Math.floor(index / 3);
      const col = index % 3;
      const emptyRow = Math.floor(emptyIndex / 3);
      const emptyCol = emptyIndex % 3;

      const isAdjacent =
        (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
        (Math.abs(col - emptyCol) === 1 && row === emptyRow);

      if (isAdjacent) {
        const nextBoard = [...board];
        nextBoard[emptyIndex] = board[index];
        nextBoard[index] = 0;
        setBoard(nextBoard);
        const newMoves = moves + 1;
        setMoves(newMoves);

        if (isSolved(nextBoard)) {
          setWon(true);
          setIsPlaying(false);
          // Score is calculated based on moves (fewer is better, score = 10000 - moves*100 - seconds*10)
          const finalScore = Math.max(100, 10000 - newMoves * 100 - timeSeconds * 10);
          onUpdateScore(finalScore);
        }
      }
    },
    [board, isPlaying, won, moves, timeSeconds, onUpdateScore]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying || won) return;
      const emptyIndex = board.indexOf(0);
      const emptyRow = Math.floor(emptyIndex / 3);
      const emptyCol = emptyIndex % 3;

      let targetIndex = -1;
      if ((e.key === "ArrowUp" || e.key === "w" || e.key === "W") && emptyRow < 2) {
        targetIndex = (emptyRow + 1) * 3 + emptyCol; // Move tile below into empty slot
      } else if ((e.key === "ArrowDown" || e.key === "s" || e.key === "S") && emptyRow > 0) {
        targetIndex = (emptyRow - 1) * 3 + emptyCol; // Move tile above into empty slot
      } else if ((e.key === "ArrowLeft" || e.key === "a" || e.key === "A") && emptyCol < 2) {
        targetIndex = emptyRow * 3 + (emptyCol + 1); // Move tile right into empty slot
      } else if ((e.key === "ArrowRight" || e.key === "d" || e.key === "D") && emptyCol > 0) {
        targetIndex = emptyRow * 3 + (emptyCol - 1); // Move tile left into empty slot
      }

      if (targetIndex !== -1) {
        e.preventDefault();
        moveTile(targetIndex);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, won, board, moveTile]);

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-navy-900 rounded-2xl border border-surface-border text-white select-none">
      {/* Top Bar Stats */}
      <div className="flex items-center justify-between w-full max-w-sm mb-4 px-2 text-sm sm:text-base font-semibold">
        <div className="text-gray-300">
          Moves: <span className="text-cyan font-bold">{moves}</span>
        </div>
        <div className="text-gray-300">
          Time: <span className="text-cyan font-bold">{timeSeconds}s</span>
        </div>
        {bestScore !== null && (
          <div className="flex items-center gap-1 text-amber-400">
            <Award className="w-4 h-4" />
            <span>Best: {bestScore}</span>
          </div>
        )}
      </div>

      {/* 3x3 Puzzle Board */}
      <div className="relative p-3 bg-navy-950 rounded-2xl border border-surface-border shadow-2xl">
        <div className="grid grid-cols-3 gap-2 sm:gap-3 w-[260px] h-[260px] sm:w-[320px] sm:h-[320px]">
          {board.map((tile, idx) => {
            if (tile === 0) {
              return (
                <div
                  key={idx}
                  className="rounded-xl bg-navy-900/60 border border-dashed border-cyan/40 flex items-center justify-center"
                />
              );
            }
            return (
              <button
                key={idx}
                onClick={() => moveTile(idx)}
                disabled={!isPlaying || won}
                aria-label={`Tile ${tile}`}
                className="rounded-xl bg-gradient-to-br from-violet-500 to-violet-700 text-white font-extrabold text-2xl sm:text-3xl shadow-lg border border-violet-400/40 hover:from-violet-400 hover:to-violet-600 active:scale-95 transition-all flex items-center justify-center focus-visible:outline-cyan"
              >
                {tile}
              </button>
            );
          })}
        </div>

        {/* Win Overlay */}
        {won && (
          <div className="absolute inset-0 bg-navy-950/90 rounded-2xl backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-fade-in">
            <CheckCircle className="w-14 h-14 text-emerald-400 mb-2" />
            <h3 className="text-2xl font-bold text-white mb-1">Puzzle Solved!</h3>
            <p className="text-gray-300 text-sm mb-4">
              Completed in <span className="text-cyan font-bold">{moves}</span> moves and{" "}
              <span className="text-cyan font-bold">{timeSeconds}s</span>!
            </p>
            <button
              onClick={startGame}
              className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-bold rounded-xl shadow-lg flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Play Again
            </button>
          </div>
        )}
      </div>

      {/* Control Buttons & Instructions */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        {!hasStarted ? (
          <button
            onClick={startGame}
            className="px-8 py-3 bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-bold rounded-xl shadow-lg shadow-violet-500/25 flex items-center gap-2 transform active:scale-95 transition"
          >
            <Play className="w-5 h-5 fill-current" /> Start Game
          </button>
        ) : (
          <button
            onClick={startGame}
            className="px-6 py-2.5 bg-surface-card hover:bg-surface-elevated text-gray-200 border border-surface-border rounded-xl flex items-center gap-2 transition"
          >
            <RotateCcw className="w-4 h-4" /> Reset Puzzle
          </button>
        )}
      </div>

      <p className="mt-4 text-xs text-gray-400 text-center max-w-sm">
        Click or tap tiles adjacent to the empty square to slide them. You can also use Arrow keys or WASD.
      </p>
    </div>
  );
}
