import type { Artist } from "./types";
import { MOCK_ARTISTS } from "./mockArtists";

export type { Artist } from "./types";

const MAX_RESULTS = 6;

/** Simulate a little network latency so loading states are exercised. */
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * The single seam between the app and its data source. Today it searches the
 * local mock dataset; later, swap the body for a `fetch` against the REST API.
 * Crucially, results never expose `monthlyListeners` to the UI's search list —
 * that stays the puzzle — but the field is present for the game logic.
 */
export async function searchArtists(query: string): Promise<Artist[]> {
  await delay(120);

  const q = query.trim().toLowerCase();
  if (!q) return [];

  const matches = MOCK_ARTISTS.filter((a) => a.name.toLowerCase().includes(q));

  // Prefix matches first, then by popularity for ties — best match leads.
  matches.sort((a, b) => {
    const aStarts = a.name.toLowerCase().startsWith(q) ? 0 : 1;
    const bStarts = b.name.toLowerCase().startsWith(q) ? 0 : 1;
    if (aStarts !== bStarts) return aStarts - bStarts;
    return a.rank - b.rank;
  });

  return matches.slice(0, MAX_RESULTS);
}
