import { MovieService } from '../services/movie_service';
import type { Movie } from '../types';
import { DEFAULT_PAGE_SIZE } from '../constants';

export class MovieController {
  private movieService = new MovieService();

  async listAllMovies(page: number, select?: (keyof Movie)[] | string[]) { 
    return this.movieService.list(page, DEFAULT_PAGE_SIZE, select); 
}

  async getMovieDetails(idOrTitle: number | string, select?: (keyof Movie)[] | string[]) { 
    return this.movieService.getMovieDetails(idOrTitle, select); 
}

  async getMoviesByYear(year: number, page: number, sort: 'asc'|'desc', select?: (keyof Movie)[] | string[]) {
    return this.movieService.getByYear(year, page, sort, DEFAULT_PAGE_SIZE, select);
  }
  
  async getMoviesByGenre(genre: string, page: number, select?: (keyof Movie)[] | string[]) {
    return this.movieService.getByGenre(genre, page, DEFAULT_PAGE_SIZE, select);
  }
}