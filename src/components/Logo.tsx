import type { FC } from "react";

interface LogoProps {
  size?: "sm" | "lg";
}

/** Playful "Crescendo" wordmark with a rising bar-graph glyph. */
const Logo: FC<LogoProps> = ({ size = "lg" }) => {
  const text = size === "lg" ? "text-5xl sm:text-6xl" : "text-2xl";
  const bars = size === "lg" ? "h-10 w-10" : "h-6 w-6";
  return (
    <div className="flex items-center gap-3">
      <svg
        className={bars}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <rect x="2" y="14" width="4" height="8" rx="1.5" fill="var(--color-brand-cyan)" />
        <rect x="8.5" y="9" width="4" height="13" rx="1.5" fill="var(--color-brand-pink)" />
        <rect x="15" y="4" width="4" height="18" rx="1.5" fill="var(--color-brand-amber)" />
      </svg>
      <span
        className={`font-display font-bold tracking-tight ${text} bg-gradient-to-r from-brand-cyan via-brand-pink to-brand-amber bg-clip-text text-transparent`}
      >
        Crescendo
      </span>
    </div>
  );
};

export default Logo;
