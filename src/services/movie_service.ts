import { MovieRepository } from '../repositories/movie_repository';
import { RatingsRepository } from '../repositories/ratings_repository';
import { Paginated, Movie } from '../types';

export class MovieService {
  private movieRepository = new MovieRepository();
  private ratingsRepository = new RatingsRepository();

  async list(page: number, limit: number = 50, select?: (keyof Movie)[] | string[]): Promise<Paginated<Movie>> { 
    return this.movieRepository.findAll({ page, limit, select }); 
  }

  async getMovieDetails(idOrTitle: number | string, select?: (keyof Movie)[] | string[]) { 
    let movie: Movie | undefined;
    if (typeof idOrTitle === 'number') {
      const result = await this.movieRepository.findAll({ page: 1, limit: 1, where: { movieId: idOrTitle }, select });
      movie = result.data[0];
    } else {
      const result = await this.movieRepository.findAll({ page: 1, limit: 1, where: { title: idOrTitle }, select });
      movie = result.data[0];
    }

    if (!movie) return undefined;

    const avgRating = await this.ratingsRepository.getAverageForMovie(movie.movieId);
    return { ...movie, avgRating } as Movie & { avgRating: number | null };
  }

  async getByYear(year: number, page: number, sort: 'asc'|'desc', limit: number = 50, select?: (keyof Movie)[] | string[]): Promise<Paginated<Movie>> {
    return this.movieRepository.findAll({ 
      page, 
      limit, 
      where: { releaseDate: year.toString() },
      order: { releaseDate: sort },
      select
    });
  }
  
  async getByGenre(genre: string, page: number, limit: number = 50, select?: (keyof Movie)[] | string[]): Promise<Paginated<Movie>> {
    return this.movieRepository.findAll({ 
      page, 
      limit, 
      like: { genres: `%${genre}%` },
      select
    });
  }
  
}