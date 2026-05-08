import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
    globalIgnores([
        'dist',
        'build',
        'coverage',
        'node_modules',
        '**/node_modules',
        'packages/*/dist',
        'packages/*/build',
        '*.config.js',
        '*.config.ts',
        'prettier.config.js',
        '**/vite.config.ts',
        '**/vite.config.js',
        '**/nest-cli.json',
    ]),
    {
        files: ['packages/api/src/**/*.ts'],
        extends: [js.configs.recommended, ...tseslint.configs.recommended, eslintPluginPrettierRecommended],
        languageOptions: {
            ecmaVersion: 2020,
            globals: {
                ...globals.node,
                ...globals.jest,
            },
            sourceType: 'module',
        },
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-floating-promises': 'off',
            '@typescript-eslint/no-unsafe-argument': 'off',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    destructuredArrayIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                },
            ],
            'prettier/prettier': [
                'error',
                {
                    endOfLine: 'auto',
                    tabWidth: 4,
                    useTabs: false,
                },
            ],
        },
    },
    {
        files: ['packages/app/src/**/*.{ts,tsx,js,jsx}'],
        extends: [js.configs.recommended, ...tseslint.configs.recommended, reactHooks.configs.flat?.recommended || {}, reactRefresh.configs?.vite || {}, eslintPluginPrettierRecommended],
        languageOptions: {
            ecmaVersion: 2020,
            globals: {
                ...globals.browser,
                ...globals.node,
            },
            sourceType: 'module',
        },
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    destructuredArrayIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                },
            ],
            'no-control-regex': 'off',
            'prettier/prettier': [
                'error',
                {
                    endOfLine: 'auto',
                    tabWidth: 4,
                    useTabs: false,
                },
            ],
        },
    },
]);
