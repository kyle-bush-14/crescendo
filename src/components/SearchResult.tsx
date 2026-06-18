import type { FC } from "react";
import type { Artist } from "../api/types";

interface SearchResultProps {
  artist: Artist;
  active: boolean;
  onSelect: () => void;
  onHover: () => void;
}

/** One row in the search dropdown: image + name (listeners hidden on purpose). */
const SearchResult: FC<SearchResultProps> = ({
  artist,
  active,
  onSelect,
  onHover,
}) => {
  return (
    <li
      role="option"
      aria-selected={active}
      onMouseDown={(e) => {
        // Prevent the input from blurring before the click registers.
        e.preventDefault();
        onSelect();
      }}
      onMouseEnter={onHover}
      className={`flex cursor-pointer items-center gap-3 px-4 py-2.5 transition-colors ${
        active ? "bg-white/15" : "hover:bg-white/5"
      }`}
    >
      <img
        src={artist.imageUrl}
        alt=""
        className="h-10 w-10 shrink-0 rounded-lg object-cover ring-1 ring-white/10"
      />
      <span className="truncate font-medium text-white">{artist.name}</span>
      {active && (
        <span className="ml-auto rounded-md bg-brand-lime/20 px-2 py-0.5 text-xs font-semibold text-brand-lime">
          ↵ Enter
        </span>
      )}
    </li>
  );
};

export default SearchResult;
