import { useEffect, useRef, useState } from "react";
import { searchArtists } from "../api/artists";
import type { Artist } from "../api/types";

const DEBOUNCE_MS = 150;

/**
 * Debounced artist search. `exclude` (already-guessed ids) is filtered out so
 * the player can't pick the same artist twice. The first result is the best
 * match and is what the SearchBar auto-highlights.
 */
export function useArtistSearch(query: string, exclude: Set<string>) {
  const [found, setFound] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(false);
  const reqId = useRef(0);

  // `exclude` is a fresh Set each render; key the effect on its contents.
  const excludeKey = [...exclude].join(",");
  const q = query.trim();

  useEffect(() => {
    if (!q) return;

    const id = ++reqId.current;
    // All state updates happen inside the (async) timer callback, never
    // synchronously in the effect body.
    const timer = setTimeout(async () => {
      setLoading(true);
      const artists = await searchArtists(q);
      // Drop stale responses if a newer query has been issued.
      if (id !== reqId.current) return;
      setFound(artists.filter((a) => !exclude.has(a.id)));
      setLoading(false);
    }, DEBOUNCE_MS);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, excludeKey]);

  // Derive the empty-query state instead of clearing via setState in an effect.
  return q
    ? { results: found, loading }
    : { results: [] as Artist[], loading: false };
}
