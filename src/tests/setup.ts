import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';

const TEST_DB_DIR = path.join(__dirname, '../../test-db');

// Ensure test database directory exists
if (!fs.existsSync(TEST_DB_DIR)) {
  fs.mkdirSync(TEST_DB_DIR, { recursive: true });
}

export const setupTestDatabases = async () => {
  const moviesDbPath = path.join(TEST_DB_DIR, 'movies.db');
  const ratingsDbPath = path.join(TEST_DB_DIR, 'ratings.db');

  // Create movies test database
  const moviesDb = new sqlite3.Database(moviesDbPath);
  await new Promise<void>((resolve, reject) => {
    moviesDb.serialize(() => {
      moviesDb.run(`
        CREATE TABLE IF NOT EXISTS movies (
          movieId INTEGER PRIMARY KEY,
          imdbId TEXT,
          title TEXT,
          overview TEXT,
          productionCompanies TEXT,
          releaseDate TEXT,
          budget INTEGER,
          revenue INTEGER,
          runtime INTEGER,
          language TEXT,
          genres TEXT,
          status TEXT
        )
      `, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  });

  // Insert test movies
  const testMovies = [
    {
      movieId: 1,
      imdbId: 'tt1234567',
      title: 'Test Movie 1',
      overview: 'A test movie',
      productionCompanies: 'Test Studios',
      releaseDate: '2023-01-01',
      budget: 1000000,
      revenue: 2000000,
      runtime: 120,
      language: 'English',
      genres: 'Action,Adventure',
      status: 'Released'
    },
    {
      movieId: 2,
      imdbId: 'tt2345678',
      title: 'Test Movie 2',
      overview: 'Another test movie',
      productionCompanies: 'Test Studios 2',
      releaseDate: '2023-02-01',
      budget: 2000000,
      revenue: 3000000,
      runtime: 90,
      language: 'English',
      genres: 'Comedy',
      status: 'Released'
    },
    {
      movieId: 3,
      imdbId: 'tt3456789',
      title: 'Test Movie 3',
      overview: 'Third test movie',
      productionCompanies: 'Test Studios 3',
      releaseDate: '2022-12-01',
      budget: 1500000,
      revenue: 2500000,
      runtime: 110,
      language: 'Spanish',
      genres: 'Drama',
      status: 'Released'
    }
  ];

  for (const movie of testMovies) {
    await new Promise<void>((resolve, reject) => {
      moviesDb.run(`
        INSERT OR REPLACE INTO movies (movieId, imdbId, title, overview, productionCompanies, releaseDate, budget, revenue, runtime, language, genres, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        movie.movieId, movie.imdbId, movie.title, movie.overview,
        movie.productionCompanies, movie.releaseDate, movie.budget,
        movie.revenue, movie.runtime, movie.language, movie.genres, movie.status
      ], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  moviesDb.close();

  // Create ratings test database
  const ratingsDb = new sqlite3.Database(ratingsDbPath);
  await new Promise<void>((resolve, reject) => {
    ratingsDb.serialize(() => {
      ratingsDb.run(`
        CREATE TABLE IF NOT EXISTS ratings (
          ratingId INTEGER PRIMARY KEY,
          userId INTEGER,
          movieId INTEGER,
          rating INTEGER,
          timestamp INTEGER
        )
      `, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  });

  // Insert test ratings
  const testRatings = [
    { ratingId: 1, userId: 1, movieId: 1, rating: 5, timestamp: 1640995200 },
    { ratingId: 2, userId: 2, movieId: 1, rating: 4, timestamp: 1640995300 },
    { ratingId: 3, userId: 1, movieId: 2, rating: 3, timestamp: 1640995400 },
    { ratingId: 4, userId: 3, movieId: 2, rating: 5, timestamp: 1640995500 },
    { ratingId: 5, userId: 2, movieId: 3, rating: 2, timestamp: 1640995600 }
  ];

  for (const rating of testRatings) {
    await new Promise<void>((resolve, reject) => {
      ratingsDb.run(`
        INSERT OR REPLACE INTO ratings (ratingId, userId, movieId, rating, timestamp)
        VALUES (?, ?, ?, ?, ?)
      `, [rating.ratingId, rating.userId, rating.movieId, rating.rating, rating.timestamp], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  ratingsDb.close();
};

export const cleanupTestDatabases = async () => {
  const moviesDbPath = path.join(TEST_DB_DIR, 'movies.db');
  const ratingsDbPath = path.join(TEST_DB_DIR, 'ratings.db');

  if (fs.existsSync(moviesDbPath)) {
    fs.unlinkSync(moviesDbPath);
  }
  if (fs.existsSync(ratingsDbPath)) {
    fs.unlinkSync(ratingsDbPath);
  }
};

export const getTestDbPath = () => TEST_DB_DIR;
