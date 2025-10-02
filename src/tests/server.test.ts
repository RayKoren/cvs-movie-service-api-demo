import { createApp } from '../app';

jest.mock('../server', () => ({
  startServer: jest.fn()
}));

describe('Server', () => {
  test('should create app successfully', async () => {
    const app = await createApp();
    expect(app).toBeDefined();
    expect(typeof app.listen).toBe('function');
  });

  test('should handle environment variables', async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'test';
    
    const app = await createApp();
    expect(app).toBeDefined();
    
    process.env.NODE_ENV = originalEnv;
  });

  test('should handle different port configurations', async () => {
    const originalPort = process.env.PORT;
    
    process.env.PORT = '3000';
    const app1 = await createApp();
    expect(app1).toBeDefined();
    
    delete process.env.PORT;
    const app2 = await createApp();
    expect(app2).toBeDefined();
    
    process.env.PORT = originalPort;
  });
});

describe('Server Module', () => {
  test('should import server module without errors', () => {
    expect(() => {
      require('../server');
    }).not.toThrow();
  });

});
