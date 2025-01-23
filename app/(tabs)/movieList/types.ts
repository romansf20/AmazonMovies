export type Movie = {
  id: number;
  title: string;
  vote_average: number;
  genre_ids: number[];
  adult: boolean;
  poster_path: string;
  video_url: string | null;
  parental_rating: string | null;
};

export type Genre = {
  id: number;
  name: string;
};