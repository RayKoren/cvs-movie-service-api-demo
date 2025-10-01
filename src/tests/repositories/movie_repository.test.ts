import { MovieRepository } from '../../repositories/movie_repository';
import { setupTestDatabases, cleanupTestDatabases, getTestDbPath } from '../setup';
import { Movie } from '../../types';
import path from 'path';

// Mock the database path to use test databases
jest.mock('../../repositories/movie_repository', () => {
  const originalModule = jest.requireActual('../../repositories/movie_repository');
  return {
    ...originalModule,
    MovieRepository: class extends originalModule.MovieRepository {
      constructor() {
        super();
        // Override database paths to use test databases
        const testDbPath = getTestDbPath();
        this.moviesDb = new (require('sqlite3').Database)(path.join(testDbPath, 'movies.db'));
        this.ratingsDb = new (require('sqlite3').Database)(path.join(testDbPath, 'ratings.db'));
      }
    }
  };
});

describe('MovieRepository Integration Tests', () => {
  let movieRepository: MovieRepository;

  beforeAll(async () => {
    await setupTestDatabases();
    movieRepository = new MovieRepository();
  });

  afterAll(async () => {
    await cleanupTestDatabases();
  });

  describe('findById', () => {
    it('should return a movie by id', async () => {
      const movie = await movieRepository.findById(1) as unknown as Movie;
      
      expect(movie).toBeDefined();
      expect(movie.movieId).toBe(1);
      expect(movie.title).toBe('Test Movie 1');
      expect(movie.imdbId).toBe('tt1234567');
    });

    it('should return undefined for non-existent id', async () => {
      const movie = await movieRepository.findById(999);
      expect(movie).toBeUndefined();
    });
  });

  describe('findAll', () => {
    it('should return paginated movies with default limit', async () => {
      const result = await movieRepository.findAll({ page: 1 });
      
      expect(result).toBeDefined();
      expect(result.data).toHaveLength(3);
      expect(result.total).toBe(3);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.data[0].title).toBe('Test Movie 1');
    });

    it('should return paginated movies with custom limit', async () => {
      const result = await movieRepository.findAll({ page: 1, limit: 2 });
      
      expect(result).toBeDefined();
      expect(result.data).toHaveLength(2);
      expect(result.total).toBe(3);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(2);
    });

    it('should handle pagination correctly', async () => {
      const page1 = await movieRepository.findAll({ page: 1, limit: 2 });
      const page2 = await movieRepository.findAll({ page: 2, limit: 2 });
      
      expect(page1.data).toHaveLength(2);
      expect(page2.data).toHaveLength(1);
      expect(page1.data[0].movieId).not.toBe(page2.data[0].movieId);
    });

    it('should filter movies by genre', async () => {
      const result = await movieRepository.findAll({ 
        page: 1, 
        where: { genres: 'Action,Adventure' } 
      });
      
      expect(result.data).toHaveLength(1);
      expect(result.data[0].title).toBe('Test Movie 1');
      expect(result.total).toBe(1);
    });

    it('should filter movies by language', async () => {
      const result = await movieRepository.findAll({ 
        page: 1, 
        where: { language: 'Spanish' } 
      });
      
      expect(result.data).toHaveLength(1);
      expect(result.data[0].title).toBe('Test Movie 3');
      expect(result.total).toBe(1);
    });

    it('should filter movies by multiple criteria', async () => {
      const result = await movieRepository.findAll({ 
        page: 1, 
        where: { 
          language: 'English',
          status: 'Released'
        } 
      });
      
      expect(result.data).toHaveLength(2);
      expect(result.total).toBe(2);
      result.data.forEach(movie => {
        expect(movie.language).toBe('English');
        expect(movie.status).toBe('Released');
      });
    });

    it('should sort movies by title ascending', async () => {
      const result = await movieRepository.findAll({ 
        page: 1, 
        order: { title: 'asc' } 
      });
      
      expect(result.data[0].title).toBe('Test Movie 1');
      expect(result.data[1].title).toBe('Test Movie 2');
      expect(result.data[2].title).toBe('Test Movie 3');
    });

    it('should sort movies by title descending', async () => {
      const result = await movieRepository.findAll({ 
        page: 1, 
        order: { title: 'desc' } 
      });
      
      expect(result.data[0].title).toBe('Test Movie 3');
      expect(result.data[1].title).toBe('Test Movie 2');
      expect(result.data[2].title).toBe('Test Movie 1');
    });

    it('should sort movies by budget descending', async () => {
      const result = await movieRepository.findAll({ 
        page: 1, 
        order: { budget: 'desc' } 
      });
      
      expect(result.data[0].budget).toBe(2000000);
      expect(result.data[1].budget).toBe(1500000);
      expect(result.data[2].budget).toBe(1000000);
    });

    it('should combine filtering and sorting', async () => {
      const result = await movieRepository.findAll({ 
        page: 1, 
        where: { language: 'English' },
        order: { budget: 'desc' }
      });
      
      expect(result.data).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.data[0].budget).toBe(2000000);
      expect(result.data[1].budget).toBe(1000000);
    });

    it('should return empty result for non-existent filter', async () => {
      const result = await movieRepository.findAll({ 
        page: 1, 
        where: { genres: 'NonExistent' } 
      });
      
      expect(result.data).toHaveLength(0);
      expect(result.total).toBe(0);
    });

    it('should handle page beyond available data', async () => {
      const result = await movieRepository.findAll({ page: 10, limit: 10 });
      
      expect(result.data).toHaveLength(0);
      expect(result.total).toBe(3);
      expect(result.page).toBe(10);
    });
  });
});
