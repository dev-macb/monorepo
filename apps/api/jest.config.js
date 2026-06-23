module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.spec.ts'],
    moduleNameMapper: {
        '^@monorepo/contracts$': '<rootDir>/../../packages/contracts/src/index.ts',
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    setupFiles: ['<rootDir>/tests/setup.ts'],
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                diagnostics: false,
                tsconfig: {
                    esModuleInterop: true,
                    emitDecoratorMetadata: true,
                    experimentalDecorators: true,
                },
            },
        ],
    },
};
