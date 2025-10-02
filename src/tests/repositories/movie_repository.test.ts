import { setupTestDatabases, cleanupTestDatabases } from '../test_setup';
import { createTestMovieRepository } from '../helpers/testDbHelper';
import { Movie } from '../../types';

describe('MovieRepository Integration Tests', () => {
  let movieRepository: any;

  beforeAll(async () => {
    await setupTestDatabases();
    movieRepository = createTestMovieRepository();
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
      result.data.forEach((movie: any) => {
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

    test('should handle LIKE queries with special characters', async () => {
      const result = await movieRepository.findAll({ 
        page: 1, 
        limit: 10, 
        like: { title: '%Test%' } 
      });
      
      expect(result.data.length).toBeGreaterThan(0);
      result.data.forEach((movie: any) => {
        expect(movie.title).toContain('Test');
      });
    });

    test('should handle complex WHERE and LIKE combinations', async () => {
      const result = await movieRepository.findAll({ 
        page: 1, 
        limit: 10, 
        where: { language: 'English' },
        like: { title: '%Test%' }
      });
      
      expect(result.data.length).toBeGreaterThan(0);
      result.data.forEach((movie: any) => {
        expect(movie.language).toBe('English');
        expect(movie.title).toContain('Test');
      });
    });

    test('should handle custom select fields', async () => {
      const result = await movieRepository.findAll({ 
        page: 1, 
        limit: 3, 
        select: ['movieId', 'title', 'budget'] 
      });
      
      expect(result.data.length).toBe(3);
      result.data.forEach((movie: any) => {
        expect(movie).toHaveProperty('movieId');
        expect(movie).toHaveProperty('title');
        expect(movie).toHaveProperty('budget');
        expect(movie).not.toHaveProperty('overview');
      });
    });

    test('should handle sorting by multiple fields', async () => {
      const result = await movieRepository.findAll({ 
        page: 1, 
        limit: 3, 
        order: { title: 'asc' }
      });
      
      expect(result.data.length).toBe(3);
      // Verify titles are in ascending order
      const titles = result.data.map((m: any) => m.title);
      const sortedTitles = [...titles].sort();
      expect(titles).toEqual(sortedTitles);
    });
  });
});
