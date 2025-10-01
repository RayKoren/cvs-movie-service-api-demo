import { RatingsRepository } from '../../repositories/ratings_repository';
import { setupTestDatabases, cleanupTestDatabases, getTestDbPath } from '../setup';
import { Rating } from '../../types';
import path from 'path';

// Mock the database path to use test databases
jest.mock('../../repositories/ratings_repository', () => {
  const originalModule = jest.requireActual('../../repositories/ratings_repository');
  return {
    ...originalModule,
    RatingsRepository: class extends originalModule.RatingsRepository {
      constructor() {
        super();
        // Override database path to use test database
        const testDbPath = getTestDbPath();
        this.ratingsDb = new (require('sqlite3').Database)(path.join(testDbPath, 'ratings.db'));
      }
    }
  };
});

describe('RatingsRepository Integration Tests', () => {
  let ratingsRepository: RatingsRepository;

  beforeAll(async () => {
    await setupTestDatabases();
    ratingsRepository = new RatingsRepository();
  });

  afterAll(async () => {
    await cleanupTestDatabases();
  });

  describe('findById', () => {
    it('should return a rating by id', async () => {
      const rating = await ratingsRepository.findById(1) as unknown as Rating;
      
      expect(rating).toBeDefined();
      expect(rating.ratingId).toBe(1);
      expect(rating.userId).toBe(1);
      expect(rating.movieId).toBe(1);
      expect(rating.rating).toBe(5);
    });

    it('should return undefined for non-existent id', async () => {
      const rating = await ratingsRepository.findById(999);
      expect(rating).toBeUndefined();
    });
  });

  describe('findAll', () => {
    it('should return paginated ratings with default limit', async () => {
      const result = await ratingsRepository.findAll({ page: 1 });
      
      expect(result).toBeDefined();
      expect(result.data).toHaveLength(5);
      expect(result.total).toBe(5);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });

    it('should return paginated ratings with custom limit', async () => {
      const result = await ratingsRepository.findAll({ page: 1, limit: 3 });
      
      expect(result).toBeDefined();
      expect(result.data).toHaveLength(3);
      expect(result.total).toBe(5);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(3);
    });

    it('should handle pagination correctly', async () => {
      const page1 = await ratingsRepository.findAll({ page: 1, limit: 3 });
      const page2 = await ratingsRepository.findAll({ page: 2, limit: 3 });
      
      expect(page1.data).toHaveLength(3);
      expect(page2.data).toHaveLength(2);
      expect(page1.data[0].ratingId).not.toBe(page2.data[0].ratingId);
    });

    it('should filter ratings by userId', async () => {
      const result = await ratingsRepository.findAll({ 
        page: 1, 
        where: { userId: 1 } 
      });
      
      expect(result.data).toHaveLength(2);
      expect(result.total).toBe(2);
      result.data.forEach(rating => {
        expect(rating.userId).toBe(1);
      });
    });

    it('should filter ratings by movieId', async () => {
      const result = await ratingsRepository.findAll({ 
        page: 1, 
        where: { movieId: 1 } 
      });
      
      expect(result.data).toHaveLength(2);
      expect(result.total).toBe(2);
      result.data.forEach(rating => {
        expect(rating.movieId).toBe(1);
      });
    });

    it('should filter ratings by rating value', async () => {
      const result = await ratingsRepository.findAll({ 
        page: 1, 
        where: { rating: 5 } 
      });
      
      expect(result.data).toHaveLength(2);
      expect(result.total).toBe(2);
      result.data.forEach(rating => {
        expect(rating.rating).toBe(5);
      });
    });

    it('should filter ratings by multiple criteria', async () => {
      const result = await ratingsRepository.findAll({ 
        page: 1, 
        where: { 
          userId: 1,
          rating: 5
        } 
      });
      
      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.data[0].userId).toBe(1);
      expect(result.data[0].rating).toBe(5);
    });

    it('should sort ratings by rating ascending', async () => {
      const result = await ratingsRepository.findAll({ 
        page: 1, 
        order: { rating: 'asc' } 
      });
      
      expect(result.data[0].rating).toBe(2);
      expect(result.data[1].rating).toBe(3);
      expect(result.data[2].rating).toBe(4);
      expect(result.data[3].rating).toBe(5);
      expect(result.data[4].rating).toBe(5);
    });

    it('should sort ratings by rating descending', async () => {
      const result = await ratingsRepository.findAll({ 
        page: 1, 
        order: { rating: 'desc' } 
      });
      
      expect(result.data[0].rating).toBe(5);
      expect(result.data[1].rating).toBe(5);
      expect(result.data[2].rating).toBe(4);
      expect(result.data[3].rating).toBe(3);
      expect(result.data[4].rating).toBe(2);
    });

    it('should sort ratings by timestamp ascending', async () => {
      const result = await ratingsRepository.findAll({ 
        page: 1, 
        order: { timestamp: 'asc' } 
      });
      
      expect(result.data[0].timestamp).toBe(1640995200);
      expect(result.data[1].timestamp).toBe(1640995300);
      expect(result.data[2].timestamp).toBe(1640995400);
    });

    it('should sort ratings by timestamp descending', async () => {
      const result = await ratingsRepository.findAll({ 
        page: 1, 
        order: { timestamp: 'desc' } 
      });
      
      expect(result.data[0].timestamp).toBe(1640995600);
      expect(result.data[1].timestamp).toBe(1640995500);
      expect(result.data[2].timestamp).toBe(1640995400);
    });

    it('should combine filtering and sorting', async () => {
      const result = await ratingsRepository.findAll({ 
        page: 1, 
        where: { movieId: 1 },
        order: { rating: 'desc' }
      });
      
      expect(result.data).toHaveLength(2);
      expect(result.total).toBe(2);
      expect(result.data[0].rating).toBe(5);
      expect(result.data[1].rating).toBe(4);
    });

    it('should return empty result for non-existent filter', async () => {
      const result = await ratingsRepository.findAll({ 
        page: 1, 
        where: { userId: 999 } 
      });
      
      expect(result.data).toHaveLength(0);
      expect(result.total).toBe(0);
    });

    it('should handle page beyond available data', async () => {
      const result = await ratingsRepository.findAll({ page: 10, limit: 10 });
      
      expect(result.data).toHaveLength(0);
      expect(result.total).toBe(5);
      expect(result.page).toBe(10);
    });

    it('should filter ratings by rating range (high ratings)', async () => {
      const result = await ratingsRepository.findAll({ 
        page: 1, 
        where: { rating: 5 } 
      });
      
      expect(result.data).toHaveLength(2);
      expect(result.total).toBe(2);
      result.data.forEach(rating => {
        expect(rating.rating).toBe(5);
      });
    });

    it('should filter ratings by rating range (low ratings)', async () => {
      const result = await ratingsRepository.findAll({ 
        page: 1, 
        where: { rating: 2 } 
      });
      
      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.data[0].rating).toBe(2);
    });
  });
});
