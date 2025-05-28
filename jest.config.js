/** @type {import('jest').Config} */

module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{js,jsx}'],
  coverageDirectory: 'coverage',
  globals: {
    ENVIRONMENT: 'Development',
    MAIN_BASE_URL: 'http://localhost:3000/',
    USERMANAGEMENT_SERVICE_BASE_URL: 'https://jbat-dev.mckesson.com/user-management-service/',
    __CURRENT_ENV__: 'Development',
    __MAIN_BASE_URL__: 'http://localhost:3000/',
    __INACTIVITY_TIMEOUT__: 60
  },
  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/src/$1',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|scss)$': 'identity-obj-proxy'
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js', '@testing-library/jest-dom/extend-expect'],
  testEnvironment: 'jest-environment-jsdom',
  testPathIgnorePatterns: ['/node_modules/'],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
    '^.+\\.scss$': 'jest-transform-stub'
  },
  verbose: true,
  coveragePathIgnorePatterns: ['/src/translations/', '/*/__test__/utils/*'],
};
