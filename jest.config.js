export default {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    testMatch: ['**/tests/**/*.spec.ts', '**/tests/**/*.spec.tsx'],
    collectCoverageFrom: ['apps/*/src/**/*.ts', 'apps/*/src/**/*.tsx', 'packages/*/src/**/*.ts'],
    coverageDirectory: '<rootDir>/coverage',
    moduleNameMapper: {
        '^@monorepo/contracts$': '<rootDir>/packages/contracts/src/index.ts',
    },
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                tsconfig: {
                    jsx: 'react-jsx',
                    esModuleInterop: true,
                    emitDecoratorMetadata: true,
                    experimentalDecorators: true,
                },
            },
        ],
    },
};