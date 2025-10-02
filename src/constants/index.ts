// GraphQL 
export const MOVIE_LIST_FIELDS = [
  'movieId',
  'imdbId', 
  'title',
  'genres',
  'releaseDate',
  'budget'
] as const;

export const MOVIE_DETAILS_FIELDS = [
  'movieId',
  'imdbId',
  'title',
  'overview',
  'productionCompanies',
  'releaseDate',
  'budget',
  'runtime',
  'language',
  'genres',
  'status'
] as const;

// Pagination
export const DEFAULT_PAGE_SIZE = 50;
export const DEFAULT_PAGE = 1;
export const DEFAULT_SORT = 'asc' as const;

// Server
export const DEFAULT_PORT = 4000;
