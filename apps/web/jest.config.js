module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    testMatch: ['**/tests/**/*.spec.ts', '**/tests/**/*.spec.tsx'],
    setupFiles: ['<rootDir>/tests/jest.polyfills.js'],
    moduleNameMapper: {
        '^@monorepo/contracts$': '<rootDir>/../../packages/contracts/src/index.ts',
        '^(\\.{1,2}/.*)\\.js$': '$1',
        '\\.(css|less|scss)$': '<rootDir>/tests/__mocks__/styleMock.js',
    },
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                tsconfig: {
                    jsx: 'react-jsx',
                    esModuleInterop: true,
                },
            },
        ],
    },
};
