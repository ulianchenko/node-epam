/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable global-require */
import { validateEnv } from '../../config';

describe('[Production-Ready Node.js Applications] Configuration and Environment Validation', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env = {};
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should load .env.production when NODE_ENV is production', () => {
    process.env.NODE_ENV = 'production';

    const { config } = require('../../config');
    expect(config).toEqual(expect.objectContaining({
      PORT: '8000',
      NODE_ENV: 'production',
      LOG_LEVEL: 'info',
    }));
  });

  test('should load .env.test when NODE_ENV is test', () => {
    process.env.NODE_ENV = 'test';

    const { config } = require('../../config');
    expect(config).toEqual(expect.objectContaining({
      PORT: '8000',
      NODE_ENV: 'test',
      LOG_LEVEL: 'debug',
    }));
  });

  test('should fallback to .env.test when NODE_ENV is not defined', () => {
    const { config: { NODE_ENV } } = require('../../config');
    expect(NODE_ENV).toEqual('test');
  });

  test('should use default values for config when environment variables are missing', () => {
    const { config } = require('../../config');
    expect(config).toEqual(expect.objectContaining({
      PORT: '8000',
      NODE_ENV: 'test',
      LOG_LEVEL: 'debug',
    }));
  });

  test('should throw an error if a required environment variable is missing', () => {
    process.env.PORT = '3000';
    process.env.NODE_ENV = 'test';

    expect(() => validateEnv()).toThrow();
  });

  test('should not throw an error when all required variables are present', () => {
    process.env.PORT = '3000';
    process.env.NODE_ENV = 'production';
    process.env.LOG_LEVEL = 'info';

    expect(() => validateEnv()).not.toThrow();
  });
});
