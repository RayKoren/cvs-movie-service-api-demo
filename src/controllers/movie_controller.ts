import { MovieService } from '../services/movie_service';
import type { Movie } from '../types';

export class MovieController {
  private movieService = new MovieService();

  async listAllMovies(page: number, select?: (keyof Movie)[] | string[]) { 
    return this.movieService.list(page, 50, select); 
}

  async getMovieDetails(idOrTitle: number | string, select?: (keyof Movie)[] | string[]) { 
    return this.movieService.getMovieDetails(idOrTitle, select); 
}

  async getMoviesByYear(year: number, page: number, sort: 'asc'|'desc', select?: (keyof Movie)[] | string[]) {
    return this.movieService.getByYear(year, page, sort, 50, select);
  }
  
  async getMoviesByGenre(genre: string, page: number, select?: (keyof Movie)[] | string[]) {
    return this.movieService.getByGenre(genre, page, 50, select);
  }
}