import { MovieService } from '../../services/movie_service';
import { MovieRepository } from '../../repositories/movie_repository';
import { RatingsRepository } from '../../repositories/ratings_repository';
import { Movie, Rating, Paginated } from '../../types';

// Mock the repositories
jest.mock('../../repositories/movie_repository');
jest.mock('../../repositories/ratings_repository');

const MockMovieRepository = MovieRepository as jest.MockedClass<typeof MovieRepository>;
const MockRatingsRepository = RatingsRepository as jest.MockedClass<typeof RatingsRepository>;

describe('MovieService Unit Tests', () => {
  let movieService: MovieService;
  let mockMovieRepository: jest.Mocked<MovieRepository>;
  let mockRatingsRepository: jest.Mocked<RatingsRepository>;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Create mock instances
    mockMovieRepository = new MockMovieRepository() as jest.Mocked<MovieRepository>;
    mockRatingsRepository = new MockRatingsRepository() as jest.Mocked<RatingsRepository>;
    
    // Create service instance
    movieService = new MovieService();
    
    // Inject mocks
    (movieService as any).movieRepository = mockMovieRepository;
    (movieService as any).ratingsRepository = mockRatingsRepository;
  });

  describe('list', () => {
    it('should call movieRepository.findAll with correct parameters', async () => {
      const mockResult: Paginated<Movie> = {
        data: [],
        total: 0,
        page: 1,
        limit: 50
      };
      
      mockMovieRepository.findAll.mockResolvedValue(mockResult);
      
      const result = await movieService.list(1, 25, ['title', 'budget']);
      
      expect(mockMovieRepository.findAll).toHaveBeenCalledWith({
        page: 1,
        limit: 25,
        select: ['title', 'budget']
      });
      expect(result).toEqual(mockResult);
    });

    it('should use default limit when not provided', async () => {
      const mockResult: Paginated<Movie> = {
        data: [],
        total: 0,
        page: 1,
        limit: 50
      };
      
      mockMovieRepository.findAll.mockResolvedValue(mockResult);
      
      await movieService.list(1);
      
      expect(mockMovieRepository.findAll).toHaveBeenCalledWith({
        page: 1,
        limit: 50,
        select: undefined
      });
    });

    it('should handle repository errors', async () => {
      const error = new Error('Database connection failed');
      mockMovieRepository.findAll.mockRejectedValue(error);
      
      await expect(movieService.list(1)).rejects.toThrow('Database connection failed');
    });
  });

  describe('getMovieDetails', () => {
    const mockMovie: Movie = {
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
      status: 'Released'
    };

    it('should get movie by ID and include average rating', async () => {
      const mockResult: Paginated<Movie> = {
        data: [mockMovie],
        total: 1,
        page: 1,
        limit: 1
      };
      
      mockMovieRepository.findAll.mockResolvedValue(mockResult);
      mockRatingsRepository.getAverageForMovie.mockResolvedValue(4.5);
      
      const result = await movieService.getMovieDetails(1, ['title', 'overview']);
      
      expect(mockMovieRepository.findAll).toHaveBeenCalledWith({
        page: 1,
        limit: 1,
        where: { movieId: 1 },
        select: ['title', 'overview']
      });
      expect(mockRatingsRepository.getAverageForMovie).toHaveBeenCalledWith(1);
      expect(result).toEqual({
        ...mockMovie,
        avgRating: 4.5
      });
    });

    it('should get movie by title using LIKE search', async () => {
      const mockResult: Paginated<Movie> = {
        data: [mockMovie],
        total: 1,
        page: 1,
        limit: 1
      };
      
      mockMovieRepository.findAll.mockResolvedValue(mockResult);
      mockRatingsRepository.getAverageForMovie.mockResolvedValue(3.8);
      
      const result = await movieService.getMovieDetails('Test Movie', ['title']);
      
      expect(mockMovieRepository.findAll).toHaveBeenCalledWith({
        page: 1,
        limit: 1,
        like: { title: '%Test Movie%' },
        select: ['title']
      });
      expect(result).toEqual({
        ...mockMovie,
        avgRating: 3.8
      });
    });

    it('should return undefined when movie not found', async () => {
      const mockResult: Paginated<Movie> = {
        data: [],
        total: 0,
        page: 1,
        limit: 1
      };
      
      mockMovieRepository.findAll.mockResolvedValue(mockResult);
      
      const result = await movieService.getMovieDetails(999);
      
      expect(result).toBeUndefined();
      expect(mockRatingsRepository.getAverageForMovie).not.toHaveBeenCalled();
    });

    it('should handle null average rating', async () => {
      const mockResult: Paginated<Movie> = {
        data: [mockMovie],
        total: 1,
        page: 1,
        limit: 1
      };
      
      mockMovieRepository.findAll.mockResolvedValue(mockResult);
      mockRatingsRepository.getAverageForMovie.mockResolvedValue(null);
      
      const result = await movieService.getMovieDetails(1);
      
      expect(result).toEqual({
        ...mockMovie,
        avgRating: null
      });
    });

    it('should handle repository errors', async () => {
      const error = new Error('Database error');
      mockMovieRepository.findAll.mockRejectedValue(error);
      
      await expect(movieService.getMovieDetails(1)).rejects.toThrow('Database error');
    });
  });

  describe('getByYear', () => {
    it('should filter by year using LIKE prefix match', async () => {
      const mockResult: Paginated<Movie> = {
        data: [],
        total: 0,
        page: 1,
        limit: 50
      };
      
      mockMovieRepository.findAll.mockResolvedValue(mockResult);
      
      await movieService.getByYear(2023, 1, 'desc', 25, ['title']);
      
      expect(mockMovieRepository.findAll).toHaveBeenCalledWith({
        page: 1,
        limit: 25,
        like: { releaseDate: '2023-%' },
        order: { releaseDate: 'desc' },
        select: ['title']
      });
    });

    it('should use default sort order when not provided', async () => {
      const mockResult: Paginated<Movie> = {
        data: [],
        total: 0,
        page: 1,
        limit: 50
      };
      
      mockMovieRepository.findAll.mockResolvedValue(mockResult);
      
      await movieService.getByYear(2023, 1, 'asc');
      
      expect(mockMovieRepository.findAll).toHaveBeenCalledWith({
        page: 1,
        limit: 50,
        like: { releaseDate: '2023-%' },
        order: { releaseDate: 'asc' },
        select: undefined
      });
    });

    it('should handle repository errors', async () => {
      const error = new Error('Query failed');
      mockMovieRepository.findAll.mockRejectedValue(error);
      
      await expect(movieService.getByYear(2023, 1, 'asc')).rejects.toThrow('Query failed');
    });
  });

  describe('getByGenre', () => {
    it('should filter by genre using LIKE search', async () => {
      const mockResult: Paginated<Movie> = {
        data: [],
        total: 0,
        page: 1,
        limit: 50
      };
      
      mockMovieRepository.findAll.mockResolvedValue(mockResult);
      
      await movieService.getByGenre('Action', 2, 25, ['title', 'genres']);
      
      expect(mockMovieRepository.findAll).toHaveBeenCalledWith({
        page: 2,
        limit: 25,
        like: { genres: '%Action%' },
        select: ['title', 'genres']
      });
    });

    it('should use default page and limit when not provided', async () => {
      const mockResult: Paginated<Movie> = {
        data: [],
        total: 0,
        page: 1,
        limit: 50
      };
      
      mockMovieRepository.findAll.mockResolvedValue(mockResult);
      
      await movieService.getByGenre('Drama', 1);
      
      expect(mockMovieRepository.findAll).toHaveBeenCalledWith({
        page: 1,
        limit: 50,
        like: { genres: '%Drama%' },
        select: undefined
      });
    });

    it('should handle repository errors', async () => {
      const error = new Error('Search failed');
      mockMovieRepository.findAll.mockRejectedValue(error);
      
      await expect(movieService.getByGenre('Action', 1)).rejects.toThrow('Search failed');
    });
  });

  describe('edge cases', () => {
    it('should handle empty select array', async () => {
      const mockResult: Paginated<Movie> = {
        data: [],
        total: 0,
        page: 1,
        limit: 50
      };
      
      mockMovieRepository.findAll.mockResolvedValue(mockResult);
      
      await movieService.list(1, 50, []);
      
      expect(mockMovieRepository.findAll).toHaveBeenCalledWith({
        page: 1,
        limit: 50,
        select: []
      });
    });

    it('should handle zero limit', async () => {
      const mockResult: Paginated<Movie> = {
        data: [],
        total: 0,
        page: 1,
        limit: 0
      };
      
      mockMovieRepository.findAll.mockResolvedValue(mockResult);
      
      await movieService.list(1, 0);
      
      expect(mockMovieRepository.findAll).toHaveBeenCalledWith({
        page: 1,
        limit: 0,
        select: undefined
      });
    });

    it('should handle negative page number', async () => {
      const mockResult: Paginated<Movie> = {
        data: [],
        total: 0,
        page: -1,
        limit: 50
      };
      
      mockMovieRepository.findAll.mockResolvedValue(mockResult);
      
      await movieService.list(-1);
      
      expect(mockMovieRepository.findAll).toHaveBeenCalledWith({
        page: -1,
        limit: 50,
        select: undefined
      });
    });
  });
});
