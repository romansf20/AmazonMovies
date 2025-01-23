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

const types = {
  Movie: null as unknown as Movie, // Use `null as unknown as` to include types in the object
  Genre: null as unknown as Genre,
};

export default types;