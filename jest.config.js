module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePaths: ['<rootDir>/src/'],
  testMatch: ['<rootDir>/src/**/*.test.*s'],
  coveragePathIgnorePatterns: ['<rootDir>/src/test/'],
  verbose: true,
  reporters: ['default', 'jest-junit'],
};
