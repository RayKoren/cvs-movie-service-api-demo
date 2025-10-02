import { createApp } from '../../app';
import request from 'supertest';

describe('Movie Resolvers Error Handling', () => {
  let app: any;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    app = await createApp();
  });

  test('should handle errors in movies resolver', async () => {
    const query = `
      query {
        movies(page: -999) {
          data { title }
          pagination { total }
        }
      }
    `;

    const res = await request(app)
      .post('/graphql')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({ query });

    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();
  });

  test('should handle errors in movie resolver with invalid input', async () => {
    const query = `
      query {
        movie(id: 999999) {
          title
          averageRating
        }
      }
    `;

    const res = await request(app)
      .post('/graphql')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({ query });

    expect(res.status).toBe(200);
    expect(res.body.data.movie).toBeNull();
  });

  test('should handle errors in moviesByYear resolver', async () => {
    const query = `
      query {
        moviesByYear(year: 1800) {
          data { title }
          pagination { total }
        }
      }
    `;

    const res = await request(app)
      .post('/graphql')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({ query });

    expect(res.status).toBe(200);
    expect(res.body.data.moviesByYear.data).toEqual([]);
    expect(res.body.data.moviesByYear.pagination.total).toBe(0);
  });

  test('should handle errors in moviesByGenre resolver', async () => {
    const query = `
      query {
        moviesByGenre(genre: "NonExistentGenre") {
          data { title }
          pagination { total }
        }
      }
    `;

    const res = await request(app)
      .post('/graphql')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({ query });

    expect(res.status).toBe(200);
    expect(res.body.data.moviesByGenre.data).toEqual([]);
    expect(res.body.data.moviesByGenre.pagination.total).toBe(0);
  });

  test('should handle movie resolver with both id and title undefined', async () => {
    const query = `
      query {
        movie {
          title
          averageRating
        }
      }
    `;

    const res = await request(app)
      .post('/graphql')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({ query });

    expect(res.status).toBe(200);
    expect(res.body.data.movie).toBeNull();
  });
});
