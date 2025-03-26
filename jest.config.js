export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/src/$1'
  },
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  transform: {
    '^.+\\.ts?$': 'ts-jest'
  },
  collectCoverageFrom: [
    "**/*.test.ts"
  ],
  setupFiles: ['<rootDir>/tests/jest.setup.ts']
};
