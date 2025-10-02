import { setupTestDatabases, cleanupTestDatabases } from '../test_setup';
import { createTestMovieRepository } from '../helpers/testDbHelper';

describe('MovieRepository Edge Cases', () => {
  let movieRepository: any;

  beforeAll(async () => {
    await setupTestDatabases();
    movieRepository = createTestMovieRepository();
  });

  afterAll(async () => {
    await cleanupTestDatabases();
  });

  test('should handle findById with zero id', async () => {
    const result = await movieRepository.findById(0);
    expect(result).toBeUndefined();
  });

  test('should handle findById with negative id', async () => {
    const result = await movieRepository.findById(-1);
    expect(result).toBeUndefined();
  });

  test('should handle findAll with empty where conditions', async () => {
    const result = await movieRepository.findAll({ 
      page: 1, 
      limit: 10, 
      where: {} 
    });
    
    expect(result.data.length).toBeGreaterThan(0);
    expect(result.total).toBeGreaterThan(0);
  });

  test('should handle findAll with empty like conditions', async () => {
    const result = await movieRepository.findAll({ 
      page: 1, 
      limit: 10, 
      like: {} 
    });
    
    expect(result.data.length).toBeGreaterThan(0);
    expect(result.total).toBeGreaterThan(0);
  });

  test('should handle findAll with null values in where', async () => {
    const result = await movieRepository.findAll({ 
      page: 1, 
      limit: 10, 
      where: { title: null, budget: undefined } 
    });
    
    // Null/undefined values are filtered out, so it returns all records
    expect(result.data.length).toBeGreaterThan(0);
    expect(result.total).toBeGreaterThan(0);
  });

  test('should handle findAll with empty string in like', async () => {
    const result = await movieRepository.findAll({ 
      page: 1, 
      limit: 10, 
      like: { title: '' } 
    });
    
    expect(result.data.length).toBeGreaterThan(0);
    expect(result.total).toBeGreaterThan(0);
  });

  test('should handle findAll with zero limit', async () => {
    const result = await movieRepository.findAll({ 
      page: 1, 
      limit: 0 
    });
    
    expect(result.data.length).toBe(0);
    expect(result.total).toBeGreaterThan(0);
  });

  test('should handle findAll with negative page', async () => {
    const result = await movieRepository.findAll({ 
      page: -1, 
      limit: 10 
    });
    
    // Negative page results in negative offset, which SQLite handles gracefully
    expect(result.data.length).toBeGreaterThan(0);
    expect(result.page).toBe(-1);
  });

  test('should handle findAll with very large page number', async () => {
    const result = await movieRepository.findAll({ 
      page: 999999, 
      limit: 10 
    });
    
    expect(result.data.length).toBe(0);
    expect(result.page).toBe(999999);
  });

  test('should handle findAll with empty select array', async () => {
    const result = await movieRepository.findAll({ 
      page: 1, 
      limit: 3, 
      select: [] 
    });
    
    expect(result.data.length).toBe(3);
    // Should return all fields when select is empty
    result.data.forEach((movie: any) => {
      expect(movie).toHaveProperty('movieId');
      expect(movie).toHaveProperty('title');
    });
  });

  test('should handle findAll with invalid select fields', async () => {
    // This test expects an error to be thrown for invalid fields
    await expect(movieRepository.findAll({ 
      page: 1, 
      limit: 3, 
      select: ['invalidField', 'anotherInvalidField'] 
    })).rejects.toThrow();
  });
});
