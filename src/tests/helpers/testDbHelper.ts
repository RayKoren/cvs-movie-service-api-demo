import { MovieRepository } from '../../repositories/movie_repository';
import { RatingsRepository } from '../../repositories/ratings_repository';
import { getTestDbPath } from '../test_setup';
import path from 'path';
import sqlite3 from 'sqlite3';

export const createTestMovieRepository = (): MovieRepository => {
  const testDbPath = getTestDbPath();
  const movieRepository = new MovieRepository();

  (movieRepository as any).moviesDb = new sqlite3.Database(path.join(testDbPath, 'movies.db'));
  (movieRepository as any).ratingsDb = new sqlite3.Database(path.join(testDbPath, 'ratings.db'));
  return movieRepository;
};

export const createTestRatingsRepository = (): RatingsRepository => {
  const testDbPath = getTestDbPath();
  const ratingsRepository = new RatingsRepository();

  (ratingsRepository as any).ratingsDb = new sqlite3.Database(path.join(testDbPath, 'ratings.db'));
  return ratingsRepository;
};
