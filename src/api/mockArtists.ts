import type { Artist } from "./types";

/**
 * Local stand-in for the real Spotify dataset. Numbers are plausible monthly
 * listener counts (not exact). When the real REST API lands, this file and the
 * fetch in `artists.ts` are the only things that change.
 *
 * Images are deterministic SVG avatars (DiceBear) keyed by id so every artist
 * has a stable, colorful picture without bundling real assets.
 */
const RAW: Array<Pick<Artist, "id" | "name" | "monthlyListeners">> = [
  { id: "the-weeknd", name: "The Weeknd", monthlyListeners: 112_400_000 },
  { id: "taylor-swift", name: "Taylor Swift", monthlyListeners: 104_800_000 },
  { id: "bad-bunny", name: "Bad Bunny", monthlyListeners: 92_100_000 },
  { id: "drake", name: "Drake", monthlyListeners: 86_500_000 },
  { id: "billie-eilish", name: "Billie Eilish", monthlyListeners: 84_300_000 },
  { id: "ariana-grande", name: "Ariana Grande", monthlyListeners: 81_700_000 },
  { id: "dua-lipa", name: "Dua Lipa", monthlyListeners: 78_900_000 },
  { id: "ed-sheeran", name: "Ed Sheeran", monthlyListeners: 77_200_000 },
  { id: "sabrina-carpenter", name: "Sabrina Carpenter", monthlyListeners: 75_600_000 },
  { id: "bruno-mars", name: "Bruno Mars", monthlyListeners: 74_100_000 },
  { id: "post-malone", name: "Post Malone", monthlyListeners: 71_800_000 },
  { id: "kanye-west", name: "Kanye West", monthlyListeners: 69_500_000 },
  { id: "rihanna", name: "Rihanna", monthlyListeners: 68_200_000 },
  { id: "coldplay", name: "Coldplay", monthlyListeners: 66_700_000 },
  { id: "kendrick-lamar", name: "Kendrick Lamar", monthlyListeners: 64_900_000 },
  { id: "travis-scott", name: "Travis Scott", monthlyListeners: 62_300_000 },
  { id: "olivia-rodrigo", name: "Olivia Rodrigo", monthlyListeners: 60_500_000 },
  { id: "eminem", name: "Eminem", monthlyListeners: 58_800_000 },
  { id: "sza", name: "SZA", monthlyListeners: 56_400_000 },
  { id: "lana-del-rey", name: "Lana Del Rey", monthlyListeners: 54_900_000 },
  { id: "justin-bieber", name: "Justin Bieber", monthlyListeners: 53_200_000 },
  { id: "harry-styles", name: "Harry Styles", monthlyListeners: 51_700_000 },
  { id: "imagine-dragons", name: "Imagine Dragons", monthlyListeners: 50_100_000 },
  { id: "doja-cat", name: "Doja Cat", monthlyListeners: 48_600_000 },
  { id: "maroon-5", name: "Maroon 5", monthlyListeners: 47_200_000 },
  { id: "beyonce", name: "Beyoncé", monthlyListeners: 45_900_000 },
  { id: "queen", name: "Queen", monthlyListeners: 44_300_000 },
  { id: "lady-gaga", name: "Lady Gaga", monthlyListeners: 42_800_000 },
  { id: "katy-perry", name: "Katy Perry", monthlyListeners: 41_100_000 },
  { id: "shakira", name: "Shakira", monthlyListeners: 39_700_000 },
  { id: "adele", name: "Adele", monthlyListeners: 38_200_000 },
  { id: "j-balvin", name: "J Balvin", monthlyListeners: 36_900_000 },
  { id: "twenty-one-pilots", name: "Twenty One Pilots", monthlyListeners: 35_400_000 },
  { id: "khalid", name: "Khalid", monthlyListeners: 34_000_000 },
  { id: "the-beatles", name: "The Beatles", monthlyListeners: 32_700_000 },
  { id: "michael-jackson", name: "Michael Jackson", monthlyListeners: 31_300_000 },
  { id: "nicki-minaj", name: "Nicki Minaj", monthlyListeners: 29_900_000 },
  { id: "shawn-mendes", name: "Shawn Mendes", monthlyListeners: 28_600_000 },
  { id: "miley-cyrus", name: "Miley Cyrus", monthlyListeners: 27_400_000 },
  { id: "sia", name: "Sia", monthlyListeners: 26_100_000 },
  { id: "selena-gomez", name: "Selena Gomez", monthlyListeners: 24_900_000 },
  { id: "calvin-harris", name: "Calvin Harris", monthlyListeners: 23_500_000 },
  { id: "linkin-park", name: "Linkin Park", monthlyListeners: 22_200_000 },
  { id: "marshmello", name: "Marshmello", monthlyListeners: 21_000_000 },
  { id: "future", name: "Future", monthlyListeners: 19_800_000 },
  { id: "21-savage", name: "21 Savage", monthlyListeners: 18_500_000 },
  { id: "metallica", name: "Metallica", monthlyListeners: 17_300_000 },
  { id: "lewis-capaldi", name: "Lewis Capaldi", monthlyListeners: 16_100_000 },
  { id: "halsey", name: "Halsey", monthlyListeners: 14_900_000 },
  { id: "camila-cabello", name: "Camila Cabello", monthlyListeners: 13_700_000 },
  { id: "david-guetta", name: "David Guetta", monthlyListeners: 12_600_000 },
  { id: "cardi-b", name: "Cardi B", monthlyListeners: 11_400_000 },
  { id: "tame-impala", name: "Tame Impala", monthlyListeners: 10_300_000 },
  { id: "arctic-monkeys", name: "Arctic Monkeys", monthlyListeners: 9_200_000 },
  { id: "lorde", name: "Lorde", monthlyListeners: 8_100_000 },
  { id: "the-killers", name: "The Killers", monthlyListeners: 7_000_000 },
  { id: "tyler-the-creator", name: "Tyler, The Creator", monthlyListeners: 6_000_000 },
  { id: "frank-ocean", name: "Frank Ocean", monthlyListeners: 5_100_000 },
  { id: "vampire-weekend", name: "Vampire Weekend", monthlyListeners: 4_200_000 },
  { id: "phoebe-bridgers", name: "Phoebe Bridgers", monthlyListeners: 3_400_000 },
];

const imageFor = (id: string) =>
  `https://api.dicebear.com/9.x/shapes/svg?seed=${encodeURIComponent(
    id,
  )}&backgroundType=gradientLinear`;

/** Sorted descending by listeners, with rank assigned (1 = most popular). */
export const MOCK_ARTISTS: Artist[] = [...RAW]
  .sort((a, b) => b.monthlyListeners - a.monthlyListeners)
  .map((a, i) => ({ ...a, rank: i + 1, imageUrl: imageFor(a.id) }));
