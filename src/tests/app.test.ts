import request from 'supertest';
import { createApp } from '../app';

describe('App', () => {
  let app: any;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    app = await createApp();
  });

  test('should handle 404 for unknown routes', async () => {
    const res = await request(app)
      .get('/unknown-route')
      .expect(404);

    expect(res.body).toEqual({ error: 'Not Found' });
  });

  test('should handle GraphQL endpoint', async () => {
    const query = `
      query {
        movies {
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
    expect(res.body.data).toBeDefined();
  });

  test('should handle CORS headers', async () => {
    const res = await request(app)
      .options('/graphql')
      .expect(204);

    expect(res.headers['access-control-allow-origin']).toBeDefined();
  });

  test('should handle JSON parsing errors', async () => {
    const res = await request(app)
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .send('invalid json');

    expect(res.status).toBe(400);
  });

  test('should handle malformed GraphQL queries', async () => {
    const query = `
      query {
        movies {
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
  });
});
