import { useEffect, useRef, useState } from "react";
import type { FC, KeyboardEvent } from "react";
import type { Artist } from "../api/types";
import { useArtistSearch } from "../hooks/useArtistSearch";
import SearchResult from "./SearchResult";

interface SearchBarProps {
  exclude: Set<string>;
  onSelect: (artist: Artist) => void;
  compact?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
}

const SearchBar: FC<SearchBarProps> = ({
  exclude,
  onSelect,
  compact = false,
  autoFocus = false,
  placeholder = "Search for an artist…",
}) => {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { results, loading } = useArtistSearch(query, exclude);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  const open = focused && query.trim().length > 0;
  // Keep the highlight in range as async results arrive; row 0 is the best match.
  const active = results.length ? Math.min(activeIndex, results.length - 1) : 0;

  const choose = (artist: Artist) => {
    onSelect(artist);
    setQuery("");
    setActiveIndex(0);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const pick = results[active];
      if (pick) choose(pick);
    } else if (e.key === "Escape") {
      setQuery("");
    }
  };

  return (
    <div className="relative w-full">
      <div
        className={`flex items-center gap-3 rounded-full border border-white/15 bg-white/10 backdrop-blur-xl transition-all focus-within:border-brand-lime/60 focus-within:bg-white/15 focus-within:ring-4 focus-within:ring-brand-lime/20 ${
          compact ? "px-5 py-3 text-base" : "px-6 py-4 text-lg shadow-2xl"
        }`}
      >
        <SearchIcon className={compact ? "h-5 w-5" : "h-6 w-6"} />
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveIndex(0);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className="w-full bg-transparent text-white placeholder-white/40 outline-none"
        />
        {loading && open && (
          <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        )}
      </div>

      {open && (
        <ul
          role="listbox"
          className="absolute z-30 mt-2 max-h-80 w-full overflow-auto rounded-2xl border border-white/10 bg-[#160d2b]/95 py-2 shadow-2xl backdrop-blur-xl"
        >
          {results.length === 0 && !loading ? (
            <li className="px-4 py-3 text-sm text-white/50">
              No artists found for “{query}”.
            </li>
          ) : (
            results.map((artist, i) => (
              <SearchResult
                key={artist.id}
                artist={artist}
                active={i === active}
                onSelect={() => choose(artist)}
                onHover={() => setActiveIndex(i)}
              />
            ))
          )}
        </ul>
      )}
    </div>
  );
};

const SearchIcon: FC<{ className?: string }> = ({ className }) => (
  <svg
    className={`shrink-0 text-white/50 ${className ?? ""}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

export default SearchBar;
