/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/__tests__/**/*.spec.ts'],
  roots: ['<rootDir>'],
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1',
  },
};
