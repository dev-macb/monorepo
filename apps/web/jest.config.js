module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    testMatch: ['**/tests/**/*.spec.ts', '**/tests/**/*.spec.tsx'],
    moduleNameMapper: {
        '^@monorepo/contracts$': '<rootDir>/../../packages/contracts/src/index.ts',
        '^(\\.{1,2}/.*)\\.js$': '$1',
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
