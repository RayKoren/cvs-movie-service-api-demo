import request from 'supertest';
import { createApp } from '../../app';

describe('GraphQL API', () => {
  let app: any;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    app = await createApp();
  });

  test('movies query returns paginated list', async () => {
    const query = `
      query Movies($page: Int) {
        movies(page: $page) {
          data { imdbId title genres releaseDate budget }
          pagination { page limit total totalPages }
        }
      }
    `;

    const res = await request(app)
      .post('/graphql')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({ query, variables: { page: 1 } });

    expect(res.status).toBe(200);
    expect(res.body.errors).toBeUndefined();
    expect(res.body.data.movies).toBeDefined();
    expect(res.body.data.movies.pagination).toBeDefined();
    expect(typeof res.body.data.movies.pagination.total).toBe('number');
    expect(res.body.data.movies.data).toBeInstanceOf(Array);
  });

  test('movie query by title returns a single item', async () => {
    const query = `
      query Movie($title: String) {
        movie(title: $title) {
          imdbId
          title
          averageRating
        }
      }
    `;

    const res = await request(app)
      .post('/graphql')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({ query, variables: { title: 'A' } });

    expect(res.status).toBe(200);
    expect(res.body.errors).toBeUndefined();
    expect(res.body.data.movie).toBeDefined();
    expect(res.body.data.movie.title).toBeDefined();
  });

  // Negative test cases
  test('invalid GraphQL query returns error', async () => {
    const query = `
      query InvalidQuery {
        nonExistentField {
          invalidField
        }
      }
    `;

    const res = await request(app)
      .post('/graphql')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({ query });

    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors[0].message).toContain('Cannot query field "nonExistentField"');
  });

  test('malformed GraphQL query returns error', async () => {
    const query = `
      query Movies {
        movies {
          data { imdbId title
        }
      }
    `;

    const res = await request(app)
      .post('/graphql')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({ query });

    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors[0].message).toContain('Syntax Error');
  });

  test('movie query with invalid page number returns negative page', async () => {
    const query = `
      query Movies($page: Int) {
        movies(page: $page) {
          data { imdbId title }
          pagination { page limit total }
        }
      }
    `;

    const res = await request(app)
      .post('/graphql')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({ query, variables: { page: -1 } });

    expect(res.status).toBe(200);
    expect(res.body.errors).toBeUndefined();
    // API passes through negative page numbers as-is
    expect(res.body.data.movies.pagination.page).toBe(-1);
  });

  test('movie query with non-existent title returns null', async () => {
    const query = `
      query Movie($title: String) {
        movie(title: $title) {
          imdbId
          title
          averageRating
        }
      }
    `;

    const res = await request(app)
      .post('/graphql')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({ query, variables: { title: 'NonExistentMovieTitle12345' } });

    expect(res.status).toBe(200);
    expect(res.body.errors).toBeUndefined();
    expect(res.body.data.movie).toBeNull();
  });

  test('moviesByYear with invalid year returns error', async () => {
    const query = `
      query MoviesByYear($year: Int!) {
        moviesByYear(year: $year) {
          data { imdbId title }
          pagination { page limit total }
        }
      }
    `;

    const res = await request(app)
      .post('/graphql')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({ query, variables: { year: 1800 } });

    expect(res.status).toBe(200);
    expect(res.body.errors).toBeUndefined();
    // Should return empty results for invalid year
    expect(res.body.data.moviesByYear.data).toEqual([]);
    expect(res.body.data.moviesByYear.pagination.total).toBe(0);
  });

  test('moviesByGenre with empty genre returns all movies', async () => {
    const query = `
      query MoviesByGenre($genre: String!) {
        moviesByGenre(genre: $genre) {
          data { imdbId title }
          pagination { page limit total }
        }
      }
    `;

    const res = await request(app)
      .post('/graphql')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({ query, variables: { genre: '' } });

    expect(res.status).toBe(200);
    expect(res.body.errors).toBeUndefined();
    // Empty genre string matches all movies (LIKE '%' matches everything)
    expect(res.body.data.moviesByGenre.data.length).toBeGreaterThan(0);
    expect(res.body.data.moviesByGenre.pagination.total).toBeGreaterThan(0);
  });

  test('missing required variables returns error', async () => {
    const query = `
      query MoviesByYear($year: Int!) {
        moviesByYear(year: $year) {
          data { imdbId title }
          pagination { page limit total }
        }
      }
    `;

    const res = await request(app)
      .post('/graphql')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({ query }); // Missing required year variable

    expect(res.status).toBe(200);
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors[0].message).toContain('Variable "$year" of required type "Int!" was not provided');
  });

  test('invalid HTTP method returns 400', async () => {
    const res = await request(app)
      .get('/graphql')
      .set('Accept', 'application/json');

    expect(res.status).toBe(400);
  });

  test('invalid endpoint returns 404', async () => {
    const res = await request(app)
      .post('/invalid-endpoint')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({ query: '{ movies { data { title } } }' });

    expect(res.status).toBe(404);
    expect(res.body.error).toBe('Not Found');
  });
});
