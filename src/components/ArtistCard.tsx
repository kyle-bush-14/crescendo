import type { FC } from "react";
import type { Artist } from "../api/types";
import { formatListenersLong } from "../lib/format";

interface ArtistCardProps {
  artist: Artist;
  /** Tint the accent for a losing data point. */
  tone?: "default" | "bad";
}

/** Hover card shown over chart points: image, name, monthly listeners. */
const ArtistCard: FC<ArtistCardProps> = ({ artist, tone = "default" }) => {
  return (
    <div className="flex w-60 items-center gap-3 rounded-2xl border border-white/10 bg-[#1a1030]/95 p-3 shadow-2xl backdrop-blur">
      <img
        src={artist.imageUrl}
        alt={artist.name}
        className="h-14 w-14 shrink-0 rounded-xl object-cover ring-2 ring-white/15"
      />
      <div className="min-w-0">
        <p className="truncate text-base font-semibold text-white">
          {artist.name}
        </p>
        <p
          className={`text-lg font-bold tabular-nums ${
            tone === "bad" ? "text-rose-400" : "text-brand-lime"
          }`}
        >
          {formatListenersLong(artist.monthlyListeners)}
        </p>
        <p className="text-xs text-white/50">monthly listeners</p>
      </div>
    </div>
  );
};

export default ArtistCard;
