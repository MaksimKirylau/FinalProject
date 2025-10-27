import eslint from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig([
    globalIgnores(['**/*mock.*']),
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    { ignores: ['dist/*', '*.js'] },
    {
        rules: {
            indent: ['error', 4],
            'linebreak-style': ['error', 'unix'],
            quotes: ['error', 'single'],
            'no-unexpected-multiline': 'error',
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
            'prefer-const': ['error', { ignoreReadBeforeAssign: true }],
        },
    },
]);
