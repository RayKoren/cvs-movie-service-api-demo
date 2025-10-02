import nock from 'nock';

// Disable all external HTTP calls by default; allow localhost for Supertest
beforeAll(() => {
  nock.disableNetConnect();
  nock.enableNetConnect((host) => host.includes('127.0.0.1') || host.includes('localhost'));
});

afterEach(() => {
  if (!nock.isDone()) {
    const pending = nock.pendingMocks();
    // eslint-disable-next-line no-console
    console.error('Pending nock mocks:', pending);
    nock.cleanAll();
  }
});

afterAll(() => {
  nock.enableNetConnect();
  nock.cleanAll();
});
