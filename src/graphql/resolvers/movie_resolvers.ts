import { MovieController } from '../../controllers/movie_controller';
import { formatDollars, formatText } from '../helpers/graphql_helpers';
import { MoviePage, MovieListItem, MovieDetails, MovieWithRating, MoviesByYearArgs, MoviesByGenreArgs } from '../../types/graphql';
import { Movie } from '../../types';
import { MOVIE_LIST_FIELDS, MOVIE_DETAILS_FIELDS, DEFAULT_PAGE, DEFAULT_SORT } from '../../constants';
const movieController = new MovieController();

const movieResolvers = {
  Query: {
    movies: async (_: unknown, { page = DEFAULT_PAGE }: { page?: number }): Promise<MoviePage> => {
      try {
        const select = [...MOVIE_LIST_FIELDS];
        const result = await movieController.listAllMovies(page, select);
        const { data, total, page: p, limit } = result;
        return {
          data: data.map((m: Movie): MovieListItem => ({
            movieId: m.movieId,
            imdbId: m.imdbId,
            title: m.title,
            genres: formatText(m.genres),
            releaseDate: m.releaseDate,
            budget: formatDollars(m.budget)
          })),
          pagination: {
            page: p,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
          }
        };
      } catch (err: unknown) {
        const error = err as Error;
        throw new Error(error?.message || 'Failed to fetch movies');
      }
    },
    movie: async (_: unknown, { id, title }: { id?: number, title?: string }): Promise<MovieDetails | null> => {
      try {
        const select = [...MOVIE_DETAILS_FIELDS];
        const key = (typeof id === 'number') ? id : (typeof title === 'string' ? title : undefined);
        if (key === undefined) return null;
        const m = await movieController.getMovieDetails(key, select) as MovieWithRating | undefined;
        if (!m) return null;
        return {
          movieId: m.movieId,
          imdbId: m.imdbId,
          title: m.title,
          overview: m.overview,
          productionCompanies: formatText(m.productionCompanies),
          releaseDate: m.releaseDate,
          budget: formatDollars(m.budget),
          runtime: m.runtime,
          language: m.language,
          genres: formatText(m.genres),
          averageRating: m.avgRating ? m.avgRating.toFixed(2) : null,
          status: m.status
        };
      } catch (err: unknown) {
        const error = err as Error;
        throw new Error(error?.message || 'Failed to fetch movie');
      }
    },
    moviesByYear: async (_: unknown, { year, page = DEFAULT_PAGE, sort = DEFAULT_SORT }: MoviesByYearArgs): Promise<MoviePage> => {
      try {
        const select = [...MOVIE_LIST_FIELDS];
        const result = await movieController.getMoviesByYear(year, page, sort, select);
        const { data, total, page: p, limit } = result;
        return {
          data: data.map((m: Movie): MovieListItem => ({
            movieId: m.movieId,
            imdbId: m.imdbId,
            title: m.title,
            genres: formatText(m.genres),
            releaseDate: m.releaseDate,
            budget: formatDollars(m.budget)
          })),
          pagination: {
            page: p,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
          }
        };
      } catch (err: unknown) {
        const error = err as Error;
        throw new Error(error?.message || 'Failed to fetch movies by year');
      }
    },
    moviesByGenre: async (_: unknown, { genre, page = DEFAULT_PAGE }: MoviesByGenreArgs): Promise<MoviePage> => {
      try {
        const select = [...MOVIE_LIST_FIELDS];
        const result = await movieController.getMoviesByGenre(genre, page, select);
        const { data, total, page: p, limit } = result;
        return {
          data: data.map((m: Movie): MovieListItem => ({
            movieId: m.movieId,
            imdbId: m.imdbId,
            title: m.title,
            genres: formatText(m.genres),
            releaseDate: m.releaseDate,
            budget: formatDollars(m.budget)
          })),
          pagination: {
            page: p,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
          }
        };
      } catch (err: unknown) {
        const error = err as Error;
        throw new Error(error?.message || 'Failed to fetch movies by genre');
      }
    }
  }
};

export default movieResolvers;