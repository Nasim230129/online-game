"use client";

import React, { useState, useEffect } from "react";
import { Play, RotateCcw, Award, CheckCircle2 } from "lucide-react";

interface MemoryMatchProps {
  onStartGame: () => void;
  onUpdateScore: (score: number) => void;
  bestScore: number | null;
}

interface Card {
  id: number;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const SYMBOLS = ["⚡", "⭐", "💎", "🔥", "🚀", "🪐"]; // 6 pairs = 12 cards

export default function MemoryMatch({ onStartGame, onUpdateScore, bestScore }: MemoryMatchProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [moves, setMoves] = useState<number>(0);
  const [won, setWon] = useState<boolean>(false);
  const [lockBoard, setLockBoard] = useState<boolean>(false);

  const initGame = () => {
    const deck: Card[] = [];
    const paired = [...SYMBOLS, ...SYMBOLS].sort(() => Math.random() - 0.5);

    paired.forEach((symbol, index) => {
      deck.push({
        id: index,
        symbol,
        isFlipped: false,
        isMatched: false,
      });
    });

    setCards(deck);
    setFlippedIndices([]);
    setMoves(0);
    setWon(false);
    setLockBoard(false);
    setIsPlaying(true);
    setHasStarted(true);
    onStartGame();
  };

  const handleCardClick = (index: number) => {
    if (!isPlaying || won || lockBoard) return;
    if (cards[index].isFlipped || cards[index].isMatched) return;

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [firstIdx, secondIdx] = newFlipped;

      if (cards[firstIdx].symbol === cards[secondIdx].symbol) {
        // Matched!
        setTimeout(() => {
          setCards((prev) => {
            const updated = prev.map((c, i) =>
              i === firstIdx || i === secondIdx ? { ...c, isMatched: true } : c
            );
            const allMatched = updated.every((c) => c.isMatched);
            if (allMatched) {
              setWon(true);
              setIsPlaying(false);
              // Score based on moves (ideal is 6, max score ~ 1000)
              const finalScore = Math.max(100, 1000 - (moves + 1) * 35);
              onUpdateScore(finalScore);
            }
            return updated;
          });
          setFlippedIndices([]);
        }, 500);
      } else {
        // No match -> flip back after delay
        setLockBoard(true);
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c, i) =>
              i === firstIdx || i === secondIdx ? { ...c, isFlipped: false } : c
            )
          );
          setFlippedIndices([]);
          setLockBoard(false);
        }, 900);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-navy-900 rounded-2xl border border-surface-border text-white select-none">
      {/* Top Bar Stats */}
      <div className="flex items-center justify-between w-full max-w-sm mb-4 px-2 text-sm sm:text-base font-semibold">
        <div className="text-gray-300">
          Moves: <span className="text-cyan font-bold">{moves}</span>
        </div>
        <div className="text-gray-300">
          Pairs:{" "}
          <span className="text-violet-400 font-bold">
            {cards.filter((c) => c.isMatched).length / 2} / {SYMBOLS.length}
          </span>
        </div>
        {bestScore !== null && (
          <div className="flex items-center gap-1 text-amber-400">
            <Award className="w-4 h-4" />
            <span>Best: {bestScore}</span>
          </div>
        )}
      </div>

      {/* Cards Grid: 4 columns x 3 rows */}
      <div className="relative p-3 bg-navy-950 rounded-2xl border-2 border-surface-border shadow-2xl">
        <div className="grid grid-cols-4 gap-2.5 sm:gap-3 w-[280px] h-[220px] sm:w-[340px] sm:h-[260px]">
          {cards.length > 0 ? (
            cards.map((card, idx) => (
              <button
                key={card.id}
                onClick={() => handleCardClick(idx)}
                disabled={card.isFlipped || card.isMatched || !isPlaying}
                aria-label={`Card ${idx + 1}`}
                className={`relative w-full h-full rounded-xl transition-all duration-300 transform perspective-1000 flex items-center justify-center text-2xl sm:text-3xl font-bold border ${
                  card.isMatched
                    ? "bg-emerald-950/60 border-emerald-500/50 text-emerald-300 opacity-80"
                    : card.isFlipped
                    ? "bg-gradient-to-br from-violet-600 to-indigo-700 border-violet-400 text-amber-300 shadow-lg scale-95"
                    : "bg-surface-card hover:bg-surface-elevated border-surface-border text-violet-400 cursor-pointer active:scale-95"
                }`}
              >
                {card.isFlipped || card.isMatched ? (
                  card.symbol
                ) : (
                  <span className="text-xs sm:text-sm font-semibold opacity-40">?</span>
                )}
              </button>
            ))
          ) : (
            Array.from({ length: 12 }).map((_, idx) => (
              <div
                key={idx}
                className="w-full h-full rounded-xl bg-surface-card/50 border border-surface-border/50 flex items-center justify-center text-gray-600 text-xs"
              >
                ✦
              </div>
            ))
          )}
        </div>

        {/* Win Overlay */}
        {won && (
          <div className="absolute inset-0 bg-navy-950/90 rounded-2xl backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <CheckCircle2 className="w-14 h-14 text-emerald-400 mb-2" />
            <h3 className="text-2xl font-bold text-white mb-1">Excellent Memory!</h3>
            <p className="text-gray-300 text-sm mb-4">
              Matched all pairs in <span className="text-cyan font-bold">{moves} moves</span>.
            </p>
            <button
              onClick={initGame}
              className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-bold rounded-xl shadow-lg flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Play Again
            </button>
          </div>
        )}

        {/* Start Overlay */}
        {!isPlaying && !won && (
          <div className="absolute inset-0 bg-navy-950/90 rounded-2xl backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <div className="text-4xl mb-2">🧠</div>
            <h3 className="text-2xl font-bold text-white mb-1">Memory Match</h3>
            <p className="text-gray-300 text-sm mb-4 max-w-xs">
              Flip cards and find all identical pairs in the fewest moves possible.
            </p>
            <button
              onClick={initGame}
              className="px-8 py-3 bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-bold rounded-xl shadow-lg shadow-violet-500/25 flex items-center gap-2 transform active:scale-95 transition"
            >
              <Play className="w-5 h-5 fill-current" /> Start Challenge
            </button>
          </div>
        )}
      </div>

      {/* Control Buttons */}
      <div className="mt-4 flex items-center justify-center gap-3">
        {hasStarted && (
          <button
            onClick={initGame}
            className="px-5 py-2 bg-surface-card hover:bg-surface-elevated text-gray-200 border border-surface-border rounded-xl flex items-center gap-2 text-sm transition"
          >
            <RotateCcw className="w-4 h-4" /> Reshuffle & Restart
          </button>
        )}
      </div>

      <p className="mt-2 text-xs text-gray-400 text-center">
        Click or tap any two cards to reveal them and match pairs.
      </p>
    </div>
  );
}
