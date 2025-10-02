import { MovieRepository } from '../../repositories/movie_repository';
import { RatingsRepository } from '../../repositories/ratings_repository';
import { getTestDbPath } from '../test_setup';
import path from 'path';
import sqlite3 from 'sqlite3';

// Helper to create a MovieRepository instance configured for test DBs
export const createTestMovieRepository = (): MovieRepository => {
  const testDbPath = getTestDbPath();
  const movieRepository = new MovieRepository();
  // Manually override the database connections to point to the test databases
  (movieRepository as any).moviesDb = new sqlite3.Database(path.join(testDbPath, 'movies.db'));
  (movieRepository as any).ratingsDb = new sqlite3.Database(path.join(testDbPath, 'ratings.db'));
  return movieRepository;
};

// Helper to create a RatingsRepository instance configured for test DBs
export const createTestRatingsRepository = (): RatingsRepository => {
  const testDbPath = getTestDbPath();
  const ratingsRepository = new RatingsRepository();
  // Manually override the database connection to point to the test database
  (ratingsRepository as any).ratingsDb = new sqlite3.Database(path.join(testDbPath, 'ratings.db'));
  return ratingsRepository;
};
