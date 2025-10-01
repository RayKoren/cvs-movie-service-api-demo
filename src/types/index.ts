export interface Movie {
  movieId: number;
  imdbId: string;
  title: string;
  overview: string | null;
  productionCompanies: string | null;
  releaseDate: string | null;
  budget: number | null;
  revenue: number | null;
  runtime: number | null;
  language: string | null;
  genres: string | null;
  status: string | null;
}

export interface Rating {
  ratingId: number;
  userId: number;
  movieId: number;
  rating: number;
  timestamp: number;
}

export interface Paginated<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export type FindAllOptions<T> = {
  page: number;
  limit?: number;
  where?: Partial<T>;
  order?: Record<string, 'asc'|'desc'>;
  select?: (keyof T)[] | string[];
  like?: Record<string, string>;
};
