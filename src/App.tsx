import { useCallback, useState } from "react";
import type { FC } from "react";
import { AnimatePresence, motion } from "motion/react";
import { evaluateGuess, streakOf, useGame } from "./hooks/useGame";
import { useBestStreak } from "./hooks/useBestStreak";
import type { Artist } from "./api/types";
import SearchBar from "./components/SearchBar";
import GuessChart from "./components/GuessChart";
import GameOverDialog from "./components/GameOverDialog";
import Logo from "./components/Logo";

const App: FC = () => {
  const {
    guesses,
    status,
    result,
    streak,
    guessedIds,
    submitGuess,
    reset,
  } = useGame();
  const { bestStreak, commitStreak } = useBestStreak();

  // Captured in the guess handler the instant a run ends, before `commitStreak`
  // raises `bestStreak` (which would otherwise make `streak > bestStreak` false).
  const [isNewBest, setIsNewBest] = useState(false);
  const displayBest = Math.max(streak, bestStreak);

  // Submitting a guess: if it ends the run, persist the streak (and remember
  // whether it's a new best) at that moment — all in the event, no effect.
  const handleGuess = useCallback(
    (artist: Artist) => {
      const { status: next, result: nextResult } = evaluateGuess(guesses, artist);
      if (next === "over") {
        const finalStreak = streakOf([...guesses, artist], nextResult);
        setIsNewBest(commitStreak(finalStreak));
      }
      submitGuess(artist);
    },
    [guesses, commitStreak, submitGuess],
  );

  const handleRestart = useCallback(() => {
    setIsNewBest(false);
    reset();
  }, [reset]);

  const failedIndex = result === "wentLower" ? guesses.length - 1 : -1;
  const isIdle = status === "idle";

  return (
    <div className="relative flex min-h-screen flex-col px-4 py-5 sm:px-8">
      {isIdle ? (
        <HeroView bestStreak={bestStreak}>
          <motion.div layoutId="search" className="w-full max-w-2xl">
            <SearchBar exclude={guessedIds} onSelect={handleGuess} autoFocus />
          </motion.div>
        </HeroView>
      ) : (
        <div className="flex flex-1 flex-col gap-5">
          <header className="flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={handleRestart}
              className="transition-opacity hover:opacity-80"
              aria-label="Restart game"
            >
              <Logo size="sm" />
            </button>
            <div className="flex items-center gap-2.5">
              <StatPill label="Streak" value={streak} accent />
              <StatPill label="Best" value={bestStreak} />
            </div>
          </header>

          <motion.div layoutId="search" className="mx-auto w-full max-w-2xl">
            <SearchBar
              exclude={guessedIds}
              onSelect={handleGuess}
              compact
              autoFocus
              placeholder="Guess a more popular artist…"
            />
          </motion.div>

          <section className="relative min-h-0 flex-1 rounded-3xl border border-white/10 bg-white/5">
            <div className="absolute inset-0 p-3 sm:p-4">
              <GuessChart guesses={guesses} failedIndex={failedIndex} />
            </div>
          </section>
        </div>
      )}

      <AnimatePresence>
        {status === "over" && (
          <GameOverDialog
            streak={streak}
            bestStreak={displayBest}
            isNewBest={isNewBest}
            result={result}
            onRestart={handleRestart}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const HeroView: FC<{ bestStreak: number; children: React.ReactNode }> = ({
  bestStreak,
  children,
}) => (
  <div className="flex flex-1 flex-col items-center justify-center gap-7 text-center">
    <div className="animate-float">
      <Logo size="lg" />
    </div>
    <p className="max-w-md text-balance text-lg text-white/70">
      Guess an artist with{" "}
      <span className="font-semibold text-brand-lime">more monthly listeners</span>{" "}
      than your last. How high can you climb? 🎵
    </p>
    {children}
    {bestStreak > 0 && (
      <p className="text-sm text-white/50">
        🏆 Your best streak: <span className="font-bold text-white">{bestStreak}</span>
      </p>
    )}
  </div>
);

const StatPill: FC<{ label: string; value: number; accent?: boolean }> = ({
  label,
  value,
  accent,
}) => (
  <div
    className={`flex items-baseline gap-1.5 rounded-full px-3.5 py-1.5 ${
      accent
        ? "bg-brand-lime/15 ring-1 ring-brand-lime/30"
        : "bg-white/10 ring-1 ring-white/10"
    }`}
  >
    <span className="text-xs uppercase tracking-wide text-white/50">{label}</span>
    <span
      className={`font-display text-lg font-bold tabular-nums ${
        accent ? "text-brand-lime" : "text-white"
      }`}
    >
      {value}
    </span>
  </div>
);

export default App;
