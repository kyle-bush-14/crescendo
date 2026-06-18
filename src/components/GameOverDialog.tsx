import { useEffect, useRef } from "react";
import type { FC } from "react";
import { motion } from "motion/react";
import confetti from "canvas-confetti";
import type { GameResult } from "../hooks/useGame";

interface GameOverDialogProps {
  streak: number;
  bestStreak: number;
  isNewBest: boolean;
  result: GameResult;
  onRestart: () => void;
}

const GameOverDialog: FC<GameOverDialogProps> = ({
  streak,
  bestStreak,
  isNewBest,
  result,
  onRestart,
}) => {
  const restartRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    restartRef.current?.focus();
    if (isNewBest || result === "reachedTop") {
      confetti({
        particleCount: 140,
        spread: 75,
        origin: { y: 0.6 },
        colors: ["#22d3ee", "#ec4899", "#fbbf24", "#a3e635"],
      });
    }
  }, [isNewBest, result]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onRestart();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onRestart]);

  const headline =
    result === "reachedTop"
      ? "You reached #1! 🏆"
      : streak === 0
        ? "Off-key start 🎵"
        : "Run over! 🎧";

  const subtitle =
    result === "reachedTop"
      ? "A flawless climb to the most-streamed artist on the planet."
      : "That pick had fewer monthly listeners. The streak stops here.";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onRestart}
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Game over"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", stiffness: 320, damping: 26 }}
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#1a1030] p-8 text-center shadow-2xl"
      >
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-brand-cyan via-brand-pink to-brand-amber" />

        {isNewBest && (
          <motion.div
            initial={{ scale: 0, rotate: -12 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 400, damping: 12 }}
            className="mx-auto mb-4 inline-flex items-center gap-1.5 rounded-full bg-brand-lime/20 px-3 py-1 text-sm font-bold text-brand-lime ring-1 ring-brand-lime/40"
          >
            ⭐ New Personal Best!
          </motion.div>
        )}

        <h2 className="font-display text-3xl font-bold text-white">{headline}</h2>
        <p className="mx-auto mt-2 max-w-xs text-sm text-white/60">{subtitle}</p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Stat label="This run" value={streak} highlight />
          <Stat label="Best ever" value={bestStreak} />
        </div>

        <button
          ref={restartRef}
          onClick={onRestart}
          className="mt-7 w-full rounded-full bg-gradient-to-r from-brand-pink to-brand-amber px-6 py-3.5 text-lg font-bold text-[#1a1030] shadow-lg transition-transform hover:scale-[1.03] focus:outline-none focus:ring-4 focus:ring-brand-amber/40 active:scale-95"
        >
          Play again ↻
        </button>
        <p className="mt-3 text-xs text-white/40">Press Esc to restart</p>
      </motion.div>
    </div>
  );
};

const Stat: FC<{ label: string; value: number; highlight?: boolean }> = ({
  label,
  value,
  highlight,
}) => (
  <div
    className={`rounded-2xl p-4 ${
      highlight ? "bg-white/10 ring-1 ring-white/15" : "bg-white/5"
    }`}
  >
    <div
      className={`font-display text-4xl font-bold tabular-nums ${
        highlight ? "text-brand-lime" : "text-white"
      }`}
    >
      {value}
    </div>
    <div className="mt-1 text-xs uppercase tracking-wide text-white/50">
      {label}
    </div>
  </div>
);

export default GameOverDialog;
