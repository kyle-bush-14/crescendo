/** A Spotify-style artist. The shape returned by the (future) REST API. */
export interface Artist {
  id: string;
  name: string;
  imageUrl: string;
  monthlyListeners: number;
  /** 1 = the most-listened artist. Used as the "you reached #1" end condition. */
  rank: number;
}
