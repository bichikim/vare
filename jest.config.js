module.exports = {
  maxWorkers: '70%',

  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],

  setupFilesAfterEnv: [
  ],

  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy',

    '\\.(jpg|jpeg|png|svg)$': '<rootDir>/__mocks__/file.mock.ts',
  },

  projects: [
    '<rootDir>/packages/*/jest.config.js',
  ],

  testPathIgnorePatterns: [
    '\\.snap$',
    '/node_modules/',
    '(/__tests__/.*|(\\.|/)(test|spec))\\.d.ts$',
  ],
}
