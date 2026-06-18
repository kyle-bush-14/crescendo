import type { FC } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Artist } from "../api/types";
import { formatListeners } from "../lib/format";
import ArtistCard from "./ArtistCard";

interface GuessChartProps {
  guesses: Artist[];
  /** Index of the losing guess (result === "wentLower"), or -1. */
  failedIndex: number;
}

interface Point {
  index: number;
  label: string;
  listeners: number;
  artist: Artist;
}

const GuessChart: FC<GuessChartProps> = ({ guesses, failedIndex }) => {
  const data: Point[] = guesses.map((artist, index) => ({
    index,
    label: artist.name,
    listeners: artist.monthlyListeners,
    artist,
  }));

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 24, right: 24, left: 8, bottom: 56 }}
        >
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--color-brand-cyan)" />
              <stop offset="50%" stopColor="var(--color-brand-pink)" />
              <stop offset="100%" stopColor="var(--color-brand-amber)" />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.08)"
            vertical={false}
          />
          <XAxis
            dataKey="label"
            interval={0}
            tick={<ArtistTick />}
            tickLine={false}
            axisLine={{ stroke: "rgba(255,255,255,0.15)" }}
            height={56}
          />
          <YAxis
            tickFormatter={(v) => formatListeners(v as number)}
            tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            width={56}
          />
          <Tooltip
            content={<ChartTooltip failedIndex={failedIndex} />}
            cursor={{ stroke: "rgba(255,255,255,0.2)", strokeWidth: 1 }}
          />
          <Line
            type="monotone"
            dataKey="listeners"
            stroke="url(#lineGradient)"
            strokeWidth={3}
            dot={<GuessDot failedIndex={failedIndex} />}
            activeDot={{ r: 7, fill: "#fff" }}
            animationDuration={500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

/** Truncated, angled x-axis label so long artist names stay readable. */
const ArtistTick = (props: {
  x?: number;
  y?: number;
  payload?: { value: string };
}) => {
  const { x = 0, y = 0, payload } = props;
  const value = payload?.value ?? "";
  const text = value.length > 12 ? `${value.slice(0, 11)}…` : value;
  return (
    <text
      x={x}
      y={y + 12}
      transform={`rotate(-25 ${x} ${y + 12})`}
      textAnchor="end"
      fill="rgba(255,255,255,0.6)"
      fontSize={12}
    >
      {text}
    </text>
  );
};

const GuessDot = (props: {
  cx?: number;
  cy?: number;
  index?: number;
  failedIndex: number;
}) => {
  const { cx, cy, index, failedIndex } = props;
  if (cx == null || cy == null) return null;
  const failed = index === failedIndex;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={6}
      fill={failed ? "#fb7185" : "#fff"}
      stroke={failed ? "#fb7185" : "var(--color-brand-pink)"}
      strokeWidth={3}
    />
  );
};

const ChartTooltip = (props: {
  active?: boolean;
  payload?: Array<{ payload: Point }>;
  failedIndex: number;
}) => {
  const { active, payload, failedIndex } = props;
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <ArtistCard
      artist={point.artist}
      tone={point.index === failedIndex ? "bad" : "default"}
    />
  );
};

export default GuessChart;
