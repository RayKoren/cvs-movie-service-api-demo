import { MovieController } from '../../controllers/movie_controller';
import { getSelectedColumns, formatDollars, formatGenres } from '../helpers/graphql_helpers';
import { GraphQLResolveInfo } from 'graphql';
const movieController = new MovieController();

 

const movieResolvers = {
  Query: {
    movies: async (_: unknown, { page = 1 }: { page?: number }, __: unknown, info: GraphQLResolveInfo) => {
      const select = ['movieId','imdbId','title','genres','releaseDate','budget'];
      const result: any = await movieController.listAllMovies(page, select);
      const { data, total, page: p, limit } = result;
      return {
        data: data.map((m: any) => ({
          movieId: m.movieId,
          imdbId: m.imdbId,
          title: m.title,
          genres: formatGenres(m.genres),
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
    },
    movie: async (_: unknown, { id }: { id: number }, __: unknown, info: GraphQLResolveInfo) => {
      const select = ['movieId','imdbId','title','overview','productionCompanies','releaseDate','budget','runtime','language','genres','status'];
      const m: any = await movieController.getMovieDetails(id, select);
      if (!m) return null;
      return {
        movieId: m.movieId,
        imdbId: m.imdbId,
        title: m.title,
        overview: m.overview,
        productionCompanies: m.productionCompanies,
        releaseDate: m.releaseDate,
        budget: formatDollars(m.budget),
        runtime: m.runtime,
        language: m.language,
        genres: formatGenres(m.genres),
        averageRating: m.avgRating ?? null,
        status: m.status
      };
    },
    moviesByYear: async (_: unknown, { year, page = 1, sort = 'asc' }: any, __: unknown, info: GraphQLResolveInfo) => {
      const select = ['movieId','imdbId','title','genres','releaseDate','budget'];
      const result: any = await movieController.getMoviesByYear(year, page, sort, select);
      const { data, total, page: p, limit } = result;
      return {
        data: data.map((m: any) => ({
          movieId: m.movieId,
          imdbId: m.imdbId,
          title: m.title,
          genres: formatGenres(m.genres),
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
    },
    moviesByGenre: async (_: unknown, { genre, page = 1 }: any, __: unknown, info: GraphQLResolveInfo) => {
      const select = ['movieId','imdbId','title','genres','releaseDate','budget'];
      const result: any = await movieController.getMoviesByGenre(genre, page, select);
      const { data, total, page: p, limit } = result;
      return {
        data: data.map((m: any) => ({
          movieId: m.movieId,
          imdbId: m.imdbId,
          title: m.title,
          genres: formatGenres(m.genres),
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
    }
  }
};

export default movieResolvers;