const setupFilesAfterEnv = ['<rootDir>/jest.setup.ts']

module.exports = {
  maxWorkers: '70%',

  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],

  setupFilesAfterEnv,

  snapshotSerializers: [
    '@emotion/jest/serializer', /* if needed other snapshotSerializers should go here */
  ],

  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy',

    '\\.(jpg|jpeg|png|svg)$': '<rootDir>/__mocks__/file.mock.ts',
  },

  projects: [
    {
      displayName: 'test',
      setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
      testMatch: ['<rootDir>/packages/*/src/**/__tests__/*.spec.ts'],
    },
  ],

  testPathIgnorePatterns: [
    '\\.snap$',
    '/node_modules/',
    '(/__tests__/.*|(\\.|/)(test|spec))\\.d.ts$',
  ],
}
