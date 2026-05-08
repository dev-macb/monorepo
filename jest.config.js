export default {
    preset: 'ts-jest',
    testEnvironment: 'jsdom', // Mude de 'node' para 'jsdom'
    testMatch: ['**/tests/**/*.spec.ts', '**/tests/**/*.spec.tsx'],
    collectCoverageFrom: ['packages/*/src/**/*.ts', 'packages/*/src/**/*.tsx'],
    coverageDirectory: '<rootDir>/coverage',
    moduleNameMapper: {
        '^@shared/(.*)$': '<rootDir>/packages/shared/src/$1',
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
