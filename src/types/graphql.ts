import { Movie } from './index';

export interface MovieListItem {
  movieId: number;
  imdbId: string;
  title: string;
  genres: string | null;
  releaseDate: string | null;
  budget: string | null;
}

export interface MovieDetails {
  movieId: number;
  imdbId: string;
  title: string;
  overview: string | null;
  productionCompanies: string | null;
  releaseDate: string | null;
  budget: string | null; // Formatted as currency string
  runtime: number | null;
  language: string | null;
  genres: string | null; // Formatted as comma-separated string
  averageRating: string | null; // Formatted as string
  status: string | null;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface MoviePage {
  data: MovieListItem[];
  pagination: Pagination;
}

export interface MovieWithRating extends Movie {
  avgRating: number | null;
}

export interface MoviesByYearArgs {
  year: number;
  page?: number;
  sort?: 'asc' | 'desc';
}

export interface MoviesByGenreArgs {
  genre: string;
  page?: number;
}
