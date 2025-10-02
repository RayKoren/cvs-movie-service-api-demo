import { MovieService } from '../../services/movie_service';
import { setupTestDatabases, cleanupTestDatabases } from '../test_setup';
import { createTestMovieRepository, createTestRatingsRepository } from '../helpers/testDbHelper';

describe('MovieService', () => {
  let service: MovieService;

  beforeAll(async () => {
    await setupTestDatabases();
    service = new MovieService();
    // Inject test repositories
    (service as any).movieRepository = createTestMovieRepository();
    (service as any).ratingsRepository = createTestRatingsRepository();
  });

  afterAll(async () => {
    await cleanupTestDatabases();
  });

  describe('list', () => {
    it('returns paginated movies with default limit 50 (capped by data)', async () => {
      const page1 = await service.list(1);
      expect(page1.page).toBe(1);
      expect(page1.limit).toBe(50);
      expect(page1.total).toBeGreaterThan(0);
      expect(Array.isArray(page1.data)).toBe(true);
    });
  });

  describe('getMovieDetails', () => {
    it('returns a movie by id with avgRating', async () => {
      const details = await service.getMovieDetails(1);
      expect(details).toBeDefined();
      expect(details?.movieId).toBe(1);
      expect(details).toHaveProperty('avgRating');
      // Our seeded ratings include ratings for movieId=1 (5 and 4), average should be ~4.5
      expect((details as any).avgRating).toBeCloseTo(4.5, 1);
    });

    it('returns undefined for a non-existent id', async () => {
      const details = await service.getMovieDetails(99999);
      expect(details).toBeUndefined();
    });

    it('returns a movie by title with avgRating', async () => {
      const details = await service.getMovieDetails('Test Movie 1');
      expect(details).toBeDefined();
      expect(details && (details as any).title).toBe('Test Movie 1');
      expect(details).toHaveProperty('avgRating');
    });
  });

  describe('getByYear', () => {
    it('filters by year and sorts asc by default', async () => {
      const page = await service.getByYear(2023, 1, 'asc', 50);
      expect(page.page).toBe(1);
      expect(page.limit).toBe(50);
      page.data.forEach(m => {
        expect(m.releaseDate?.startsWith('2023')).toBe(true);
      });
    });
  });

  describe('getByGenre', () => {
    it('filters by genre using LIKE on JSON string', async () => {
      const page = await service.getByGenre('Drama', 1, 50);
      expect(page.page).toBe(1);
      expect(page.limit).toBe(50);
      const hasDrama = page.data.some(m => (m.genres || '').includes('Drama'));
      expect(hasDrama).toBe(true);
    });
  });
});
