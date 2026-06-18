import { useCallback, useMemo, useReducer } from "react";
import type { Artist } from "../api/types";

export type GameStatus = "idle" | "playing" | "over";
export type GameResult = "reachedTop" | "wentLower" | null;

interface GameState {
  guesses: Artist[];
  status: GameStatus;
  result: GameResult;
}

type Action = { type: "submit"; artist: Artist } | { type: "reset" };

const initialState: GameState = { guesses: [], status: "idle", result: null };

/**
 * Pure win/lose evaluation for adding `artist` after the existing `guesses`.
 * Shared by the reducer and the App's guess handler (which needs to know the
 * outcome up-front to commit the best streak the moment a run ends).
 */
export function evaluateGuess(
  guesses: Artist[],
  artist: Artist,
): { status: GameStatus; result: GameResult } {
  // First guess seeds the run — always valid.
  if (guesses.length === 0) return { status: "playing", result: null };

  const last = guesses[guesses.length - 1];

  // Equal listeners counts as a loss (must be strictly more popular).
  if (artist.monthlyListeners <= last.monthlyListeners) {
    return { status: "over", result: "wentLower" };
  }

  // A higher guess that happens to be #1 caps the run as a perfect finish.
  if (artist.rank === 1) return { status: "over", result: "reachedTop" };

  return { status: "playing", result: null };
}

/** Artists correctly placed in a run — the failing final guess doesn't count. */
export function streakOf(guesses: Artist[], result: GameResult): number {
  return result === "wentLower" ? guesses.length - 1 : guesses.length;
}

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "reset":
      return initialState;

    case "submit": {
      if (state.status === "over") return state;
      const { artist } = action;
      const guesses = [...state.guesses, artist];
      const { status, result } = evaluateGuess(state.guesses, artist);
      return { guesses, status, result };
    }
  }
}

export function useGame() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const submitGuess = useCallback(
    (artist: Artist) => dispatch({ type: "submit", artist }),
    [],
  );
  const reset = useCallback(() => dispatch({ type: "reset" }), []);

  // The final wrong guess is shown on the chart but doesn't count toward the streak.
  const streak = streakOf(state.guesses, state.result);

  const guessedIds = useMemo(
    () => new Set(state.guesses.map((a) => a.id)),
    [state.guesses],
  );

  const lastArtist = state.guesses[state.guesses.length - 1] ?? null;

  return {
    ...state,
    streak,
    guessedIds,
    lastArtist,
    submitGuess,
    reset,
  };
}
