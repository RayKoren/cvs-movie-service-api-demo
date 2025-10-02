import { MovieController } from '../../controllers/movie_controller';


describe('MovieController', () => {
  let controller: MovieController;
  let movieServiceMock: any;

  beforeEach(() => {
    controller = new MovieController();
    movieServiceMock = {
      list: jest.fn().mockResolvedValue({ data: [], total: 0, page: 1, limit: 50 }),
      getMovieDetails: jest.fn().mockResolvedValue({ movieId: 1, title: 'Ariel' }),
      getByYear: jest.fn().mockResolvedValue({ data: [], total: 0, page: 1, limit: 50 }),
      getByGenre: jest.fn().mockResolvedValue({ data: [], total: 0, page: 1, limit: 50 })
    };
    (controller as any).movieService = movieServiceMock;
  });

  test('listAllMovies delegates to service.list with page and select', async () => {
    const select = ['imdbId', 'title'];
    await controller.listAllMovies(2, select);
    expect(movieServiceMock.list).toHaveBeenCalledWith(2, 50, select);
  });

  test('getMovieDetails delegates to service.getMovieDetails with idOrTitle and select', async () => {
    const select = ['title'];
    await controller.getMovieDetails(123, select);
    expect(movieServiceMock.getMovieDetails).toHaveBeenCalledWith(123, select);
  });

  test('getMoviesByYear delegates to service.getByYear with year, page, sort, limit, select', async () => {
    const select = ['title'];
    await controller.getMoviesByYear(1999, 3, 'desc', select);
    expect(movieServiceMock.getByYear).toHaveBeenCalledWith(1999, 3, 'desc', 50, select);
  });

  test('getMoviesByGenre delegates to service.getByGenre with genre, page, limit, select', async () => {
    const select = ['title'];
    await controller.getMoviesByGenre('Drama', 4, select);
    expect(movieServiceMock.getByGenre).toHaveBeenCalledWith('Drama', 4, 50, select);
  });
});
