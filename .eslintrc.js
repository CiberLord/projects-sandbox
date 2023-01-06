module.exports = {
    root: true,
    overrides: [
        {
            files: ['**/*.js'],
            env: {
                node: true,
                commonjs: true,
                es6: true,
            },
            extends: ['plugin:prettier/recommended'],

            plugins: ['prettier'],
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
            rules: {
                'no-var': 'error',
                'no-empty': ['error'],
                'no-empty-pattern': ['error'],
                'no-empty-function': ['error'],
                'prefer-const': 'error',
                'no-console': 'error',
                'arrow-spacing': ['error', { before: true, after: true }],
                'no-use-before-define': [
                    'error',
                    {
                        functions: false,
                        classes: true,
                        variables: true,
                        allowNamedExports: false,
                    },
                ],
                eqeqeq: 'error',
                quotes: ['error', 'single'],
                'no-unused-vars': ['error', { vars: 'all', args: 'none', ignoreRestSiblings: true }],
            },
        },
        {
            files: ['**/*.ts', '**/*.tsx'],
            env: {
                node: true,
                es6: true,
            },
            extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],

            parser: '@typescript-eslint/parser',

            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },

            plugins: ['@typescript-eslint', 'prettier'],
            rules: {
                'no-var': 'error',
                'no-empty': ['error'],
                'no-empty-pattern': ['error'],
                'prefer-const': 'error',
                'no-console': 'error',
                'arrow-spacing': ['error', { before: true, after: true }],
                'no-use-before-define': [
                    'error',
                    {
                        functions: false,
                        classes: true,
                        variables: true,
                        allowNamedExports: false,
                    },
                ],
                eqeqeq: 'error',
                quotes: ['error', 'single'],
                '@typescript-eslint/no-unused-vars': ['error', { vars: 'all', args: 'none', ignoreRestSiblings: true }],
            },
        },
    ],
};
