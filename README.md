# Movie API

A GraphQL API for movie data built with Node.js, TypeScript, and SQLite.

## Features

- **GraphQL API** with Apollo Server
- **TypeScript** for type safety
- **SQLite** databases for movies and ratings
- **Pagination** support for all list endpoints
- **Filtering and sorting** capabilities
- **Comprehensive testing** with Jest
- **Docker** support for containerization
- **CI/CD** ready with GitHub Actions

## API Endpoints

### GraphQL Queries

- `movies(page: Int)` - List all movies with pagination
- `movie(id: Int, title: String)` - Get movie details by ID or title
- `moviesByYear(year: Int!, page: Int, sort: String)` - Get movies by release year
- `moviesByGenre(genre: String!, page: Int)` - Get movies by genre

## Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Linter
npm run lint
npm run lint:fix

# Run all tests
npm test

# Run unit tests
npm run test:unit

# Run integration tests
npm run test:integration

# Build for production
npm run build

# Start production server
npm start
```

### Docker

```bash
# Build and run DEV with Docker Compose (Compose v2)
docker compose --profile dev up --build app-dev

# Run TEST profile (executes tests, then exits)
docker compose --profile test up --build app-test

# Run PROD with Docker Compose
docker compose --profile prod up --build app-prod

#  Makefile commands
make docker-build
make docker-test
make docker-run
```

### Manual Docker Commands

```bash
# Build test image
docker build --target test -t movie-api:test .

# Build production image
docker build --target runtime -t movie-api:latest .

# Run production container
docker run -it --rm -p 4000:4000 -v $(pwd)/db:/app/db:ro movie-api:latest
```

## Project Structure

```
src/
├── app.ts                 # Express app configuration
├── server.ts              # Server startup
├── controllers/           # Request handlers
├── services/              # Business logic
├── repositories/          # Data access layer
├── graphql/               # GraphQL schema and resolvers
├── helpers/               # Utility functions
├── types/                 # TypeScript type definitions
├── constants/             # Application constants
└── tests/                 # Test files
    ├── test_setup.ts      # Test database setup
    ├── helpers/           # Test utilities
    ├── repositories/      # Repository tests
    ├── services/          # Service tests
    ├── controllers/       # Controller tests
    ├── resolvers/         # Resolver tests
    └── api/               # API integration tests
```

## Database Schema

### Movies Table
- `movieId` (INTEGER PRIMARY KEY)
- `imdbId` (TEXT)
- `title` (TEXT)
- `overview` (TEXT)
- `productionCompanies` (TEXT)
- `releaseDate` (TEXT)
- `budget` (INTEGER)
- `revenue` (INTEGER)
- `runtime` (REAL)
- `language` (TEXT)
- `genres` (TEXT)
- `status` (TEXT)

### Ratings Table
- `ratingId` (INTEGER PRIMARY KEY)
- `userId` (INTEGER)
- `movieId` (INTEGER)
- `rating` (REAL)
- `timestamp` (TEXT)

## Testing

The project includes comprehensive testing:

- **Unit Tests**: Test individual functions and classes
- **Integration Tests**: Test database interactions
- **API Tests**: Test GraphQL endpoints end-to-end

### Test Commands

```bash
# Run all tests
npm test

# Run unit tests only (no database required)
npm run test:unit

# Run integration tests (requires database)
npm run test:integration

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## CI/CD

The project includes GitHub Actions workflow for:

- **Testing**: Runs unit tests on every push/PR
- **Deployment**: Automatic Docker image building and pushing

### GitHub Actions Secrets

- `DOCKER_USERNAME`: Docker Hub username
- `DOCKER_PASSWORD`: Docker Hub password

## Environment Variables

- `NODE_ENV`: Environment (development, test, production)
- `PORT`: Server port (default: 4000)

## Development

### Adding New Features

1. **Repository Layer**: Add data access methods
2. **Service Layer**: Add business logic
3. **Controller Layer**: Add request handling
4. **GraphQL Layer**: Add schema and resolvers
5. **Tests**: Add comprehensive test coverage

### Code Quality

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code linting and formatting
- **Jest**: Testing framework with coverage reporting
- **Docker**: Containerization for consistent environments

## Deployment

### Production Deployment

1. **Build Docker Image**:
   ```bash
   docker build --target runtime -t movie-api:latest .
   ```

2. **Run Container**:
   ```bash
   docker run -d \
     --name movie-api \
     -p 4000:4000 \
     -v /path/to/db:/app/db:ro \
     movie-api:latest
   ```

3. **Environment Variables**:
   ```bash
   docker run -d \
     --name movie-api \
     -p 4000:4000 \
     -e NODE_ENV=production \
     -e PORT=4000 \
     -v /path/to/db:/app/db:ro \
     movie-api:latest
   ```

### Docker Compose

```yaml
version: '3.8'
services:
  movie-api:
    build:
      context: .
      target: runtime
    ports:
      - "4000:4000"
    environment:
      - NODE_ENV=production
      - PORT=4000
    volumes:
      - ./db:/app/db:ro
```

## API Usage Examples

### GraphQL Queries

```graphql
# List movies with pagination
query {
  movies(page: 1) {
    data {
      movieId
      imdbId
      title
      genres
      releaseDate
      budget
    }
    pagination {
      page
      limit
      total
      totalPages
    }
  }
}

# Get movie details
query {
  movie(id: 11) {
    movieId
    imdbId
    title
    overview
    productionCompanies
    releaseDate
    budget
    runtime
    language
    genres
    averageRating
    status
  }
}

# Get movies by year
query {
  moviesByYear(year: 2003, page: 1, sort: "asc") {
    data {
      movieId
      imdbId
      title
      genres
      releaseDate
      budget
    }
    pagination {
      page
      limit
      total
      totalPages
    }
  }
}

# Get movies by genre
query {
  moviesByGenre(genre: "Action", page: 1) {
    data {
      movieId
      imdbId
      title
      genres
      releaseDate
      budget
    }
    pagination {
      page
      limit
      total
      totalPages
    }
  }
}
```

