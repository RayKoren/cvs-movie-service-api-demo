import { setupTestDatabases, cleanupTestDatabases } from '../test_setup';
import { createTestRatingsRepository } from '../helpers/testDbHelper';

describe('RatingsRepository Edge Cases', () => {
  let ratingsRepository: any;

  beforeAll(async () => {
    await setupTestDatabases();
    ratingsRepository = createTestRatingsRepository();
  });

  afterAll(async () => {
    await cleanupTestDatabases();
  });

  test('should handle getAverageForMovie with no ratings', async () => {
    const result = await ratingsRepository.getAverageForMovie(999999);
    expect(result).toBeNull();
  });

  test('should handle getAverageForMovie with single rating', async () => {
    const result = await ratingsRepository.getAverageForMovie(1);
    expect(typeof result).toBe('number');
    expect(result).toBeGreaterThan(0);
  });

  test('should handle findAll with empty where conditions', async () => {
    const result = await ratingsRepository.findAll({ 
      page: 1, 
      limit: 10, 
      where: {} 
    });
    
    expect(result.data.length).toBeGreaterThan(0);
    expect(result.total).toBeGreaterThan(0);
  });

  test('should handle findAll with empty like conditions', async () => {
    const result = await ratingsRepository.findAll({ 
      page: 1, 
      limit: 10, 
      like: {} 
    });
    
    expect(result.data.length).toBeGreaterThan(0);
    expect(result.total).toBeGreaterThan(0);
  });

  test('should handle findAll with null values in where', async () => {
    const result = await ratingsRepository.findAll({ 
      page: 1, 
      limit: 10, 
      where: { rating: null, userId: undefined } 
    });
    
    // Null/undefined values are filtered out, so it returns all records
    expect(result.data.length).toBeGreaterThan(0);
    expect(result.total).toBeGreaterThan(0);
  });

  test('should handle findAll with empty string in like', async () => {
    const result = await ratingsRepository.findAll({ 
      page: 1, 
      limit: 10, 
      like: { userId: '' } 
    });
    
    expect(result.data.length).toBeGreaterThan(0);
    expect(result.total).toBeGreaterThan(0);
  });

  test('should handle findAll with zero limit', async () => {
    const result = await ratingsRepository.findAll({ 
      page: 1, 
      limit: 0 
    });
    
    expect(result.data.length).toBe(0);
    expect(result.total).toBeGreaterThan(0);
  });

  test('should handle findAll with negative page', async () => {
    const result = await ratingsRepository.findAll({ 
      page: -1, 
      limit: 10 
    });
    
    // Negative page results in negative offset, which SQLite handles gracefully
    expect(result.data.length).toBeGreaterThan(0);
    expect(result.page).toBe(-1);
  });

  test('should handle findAll with very large page number', async () => {
    const result = await ratingsRepository.findAll({ 
      page: 999999, 
      limit: 10 
    });
    
    expect(result.data.length).toBe(0);
    expect(result.page).toBe(999999);
  });
});
