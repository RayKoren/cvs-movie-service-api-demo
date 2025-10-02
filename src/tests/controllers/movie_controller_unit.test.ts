import { MovieController } from '../../controllers/movie_controller';
import { MovieService } from '../../services/movie_service';

// Mock the MovieService
jest.mock('../../services/movie_service');

const MockMovieService = MovieService as jest.MockedClass<typeof MovieService>;

describe('MovieController Unit Tests', () => {
  let controller: MovieController;
  let mockMovieService: jest.Mocked<MovieService>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockMovieService = new MockMovieService() as jest.Mocked<MovieService>;
    controller = new MovieController();

    (controller as any).movieService = mockMovieService;
  });

  describe('listAllMovies', () => {
    it('should delegate to movieService.list with correct parameters', async () => {
      const mockResult = {
        data: [],
        total: 0,
        page: 1,
        limit: 50
      };
      
      mockMovieService.list.mockResolvedValue(mockResult);
      
      const result = await controller.listAllMovies(2, ['title', 'budget']);
      
      expect(mockMovieService.list).toHaveBeenCalledWith(2, 50, ['title', 'budget']);
      expect(result).toEqual(mockResult);
    });

    it('should use default page when not provided', async () => {
      const mockResult = {
        data: [],
        total: 0,
        page: 1,
        limit: 50
      };
      
      mockMovieService.list.mockResolvedValue(mockResult);
      
      await controller.listAllMovies(1, ['title']);
      
      expect(mockMovieService.list).toHaveBeenCalledWith(1, 50, ['title']);
    });

    it('should handle service errors', async () => {
      const error = new Error('Service error');
      mockMovieService.list.mockRejectedValue(error);
      
      await expect(controller.listAllMovies(1, ['title'])).rejects.toThrow('Service error');
    });

    it('should handle empty select array', async () => {
      const mockResult = {
        data: [],
        total: 0,
        page: 1,
        limit: 50
      };
      
      mockMovieService.list.mockResolvedValue(mockResult);
      
      await controller.listAllMovies(1, []);
      
      expect(mockMovieService.list).toHaveBeenCalledWith(1, 50, []);
    });
  });

  describe('getMovieDetails', () => {
    it('should delegate to movieService.getMovieDetails with ID', async () => {
      const mockResult = {
        movieId: 1,
        imdbId: 'tt1234567',
        title: 'Test Movie',
        overview: 'Test overview',
        productionCompanies: 'Test Company',
        releaseDate: '2023-01-01',
        budget: 1000000,
        revenue: 2000000,
        runtime: 120,
        language: 'English',
        genres: '[{"name": "Action"}]',
        status: 'Released',
        avgRating: 4.5
      };
      
      mockMovieService.getMovieDetails.mockResolvedValue(mockResult);
      
      const result = await controller.getMovieDetails(123, ['title', 'overview']);
      
      expect(mockMovieService.getMovieDetails).toHaveBeenCalledWith(123, ['title', 'overview']);
      expect(result).toEqual(mockResult);
    });

    it('should delegate to movieService.getMovieDetails with title', async () => {
      const mockResult = {
        movieId: 1,
        imdbId: 'tt1234567',
        title: 'Test Movie',
        overview: 'Test overview',
        productionCompanies: 'Test Company',
        releaseDate: '2023-01-01',
        budget: 1000000,
        revenue: 2000000,
        runtime: 120,
        language: 'English',
        genres: '[{"name": "Action"}]',
        status: 'Released',
        avgRating: 4.5
      };
      
      mockMovieService.getMovieDetails.mockResolvedValue(mockResult);
      
      const result = await controller.getMovieDetails('Test Movie', ['title']);
      
      expect(mockMovieService.getMovieDetails).toHaveBeenCalledWith('Test Movie', ['title']);
      expect(result).toEqual(mockResult);
    });

    it('should handle service returning undefined', async () => {
      mockMovieService.getMovieDetails.mockResolvedValue(undefined);
      
      const result = await controller.getMovieDetails(999, ['title']);
      
      expect(result).toBeUndefined();
    });

    it('should handle service errors', async () => {
      const error = new Error('Movie not found');
      mockMovieService.getMovieDetails.mockRejectedValue(error);
      
      await expect(controller.getMovieDetails(999, ['title'])).rejects.toThrow('Movie not found');
    });
  });

  describe('getMoviesByYear', () => {
    it('should delegate to movieService.getByYear with all parameters', async () => {
      const mockResult = {
        data: [],
        total: 0,
        page: 1,
        limit: 50
      };
      
      mockMovieService.getByYear.mockResolvedValue(mockResult);
      
      const result = await controller.getMoviesByYear(2023, 2, 'desc', ['title', 'releaseDate']);
      
      expect(mockMovieService.getByYear).toHaveBeenCalledWith(2023, 2, 'desc', 50, ['title', 'releaseDate']);
      expect(result).toEqual(mockResult);
    });

    it('should use default sort when not provided', async () => {
      const mockResult = {
        data: [],
        total: 0,
        page: 1,
        limit: 50
      };
      
      mockMovieService.getByYear.mockResolvedValue(mockResult);
      
      await controller.getMoviesByYear(2023, 1, 'asc', ['title']);
      
      expect(mockMovieService.getByYear).toHaveBeenCalledWith(2023, 1, 'asc', 50, ['title']);
    });

    it('should handle service errors', async () => {
      const error = new Error('Year filter failed');
      mockMovieService.getByYear.mockRejectedValue(error);
      
      await expect(controller.getMoviesByYear(2023, 1, 'asc', ['title'])).rejects.toThrow('Year filter failed');
    });

    it('should handle invalid year parameter', async () => {
      const mockResult = {
        data: [],
        total: 0,
        page: 1,
        limit: 50
      };
      
      mockMovieService.getByYear.mockResolvedValue(mockResult);
      
      await controller.getMoviesByYear(0, 1, 'asc', ['title']);
      
      expect(mockMovieService.getByYear).toHaveBeenCalledWith(0, 1, 'asc', 50, ['title']);
    });
  });

  describe('getMoviesByGenre', () => {
    it('should delegate to movieService.getByGenre with all parameters', async () => {
      const mockResult = {
        data: [],
        total: 0,
        page: 1,
        limit: 50
      };
      
      mockMovieService.getByGenre.mockResolvedValue(mockResult);
      
      const result = await controller.getMoviesByGenre('Action', 3, ['title', 'genres']);
      
      expect(mockMovieService.getByGenre).toHaveBeenCalledWith('Action', 3, 50, ['title', 'genres']);
      expect(result).toEqual(mockResult);
    });

    it('should use default page when not provided', async () => {
      const mockResult = {
        data: [],
        total: 0,
        page: 1,
        limit: 50
      };
      
      mockMovieService.getByGenre.mockResolvedValue(mockResult);
      
      await controller.getMoviesByGenre('Drama', 1, ['title']);
      
      expect(mockMovieService.getByGenre).toHaveBeenCalledWith('Drama', 1, 50, ['title']);
    });

    it('should handle service errors', async () => {
      const error = new Error('Genre filter failed');
      mockMovieService.getByGenre.mockRejectedValue(error);
      
      await expect(controller.getMoviesByGenre('Action', 1, ['title'])).rejects.toThrow('Genre filter failed');
    });

    it('should handle empty genre string', async () => {
      const mockResult = {
        data: [],
        total: 0,
        page: 1,
        limit: 50
      };
      
      mockMovieService.getByGenre.mockResolvedValue(mockResult);
      
      await controller.getMoviesByGenre('', 1, ['title']);
      
      expect(mockMovieService.getByGenre).toHaveBeenCalledWith('', 1, 50, ['title']);
    });

    it('should handle special characters in genre', async () => {
      const mockResult = {
        data: [],
        total: 0,
        page: 1,
        limit: 50
      };
      
      mockMovieService.getByGenre.mockResolvedValue(mockResult);
      
      await controller.getMoviesByGenre('Sci-Fi', 1, ['title']);
      
      expect(mockMovieService.getByGenre).toHaveBeenCalledWith('Sci-Fi', 1, 50, ['title']);
    });
  });

  describe('parameter validation', () => {
    it('should handle null parameters gracefully', async () => {
      const mockResult = {
        data: [],
        total: 0,
        page: 1,
        limit: 50
      };
      
      mockMovieService.list.mockResolvedValue(mockResult);
      
      await controller.listAllMovies(null as any, null as any);
      
      expect(mockMovieService.list).toHaveBeenCalledWith(null, 50, null);
    });

    it('should handle undefined parameters gracefully', async () => {
      const mockResult = {
        data: [],
        total: 0,
        page: 1,
        limit: 50
      };
      
      mockMovieService.getByYear.mockResolvedValue(mockResult);
      
      await controller.getMoviesByYear(2023, 1, 'asc', ['title']);
      
      expect(mockMovieService.getByYear).toHaveBeenCalledWith(2023, 1, 'asc', 50, ['title']);
    });
  });

  describe('error handling', () => {
    it('should propagate service errors without modification', async () => {
      const originalError = new Error('Original service error');
      mockMovieService.list.mockRejectedValue(originalError);
      
      try {
        await controller.listAllMovies(1, ['title']);
        fail('Expected error to be thrown');
      } catch (error) {
        expect(error).toBe(originalError);
        expect((error as Error).message).toBe('Original service error');
      }
    });

    it('should handle multiple consecutive errors', async () => {
      const error1 = new Error('First error');
      const error2 = new Error('Second error');
      
      mockMovieService.list
        .mockRejectedValueOnce(error1)
        .mockRejectedValueOnce(error2);
      
      await expect(controller.listAllMovies(1, ['title'])).rejects.toThrow('First error');
      await expect(controller.listAllMovies(1, ['title'])).rejects.toThrow('Second error');
    });
  });
});
