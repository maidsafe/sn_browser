const aliases = require('./.aliases.config');
const aliasesArray = Object.keys(aliases);

module.exports = {
    env: {
        browser: true,
        node: true
    },
    parser: '@typescript-eslint/parser',
    extends: [
        'airbnb-typescript',
        'plugin:@typescript-eslint/recommended',
        'plugin:jest/recommended',
        'plugin:promise/recommended',
        'plugin:unicorn/recommended',
        'prettier',
        'prettier/react',
        'prettier/@typescript-eslint'
    ],
    parserOptions: {
        ecmaFeatures: {
            jsx: true
        },
        useJSXTextNode: false,
        tsconfigRootDir: '.',
        sourceType: 'module',
        allowImportExportEverywhere: false,
        codeFrame: true
    },
    rules: {
        'prefer-destructuring': [
            'error',
            {
                array: false,
                object: true
            },
            {
                enforceForRenamedProperties: false
            }
        ],
        'unicorn/prevent-abbreviations': 'off',
        'unicorn/catch-error-name': 'off',
        'unicorn/filename-case': 'off',
        'unicorn/prefer-exponentiation-operator': 'off',
        'unicorn/prefer-query-selector': 'off',
        'unicorn/prefer-text-content': 'off',
        'unicorn/no-for-loop': 'off',
        'unicorn/throw-new-error': 'off',
        'unicorn/regex-shorthand': 'error',
        'unicorn/no-new-buffer': 'off',
        'unicorn/no-unsafe-regex': 'error',
        'no-prototype-builtins': 'off',
        'unicorn/prefer-type-error': 'off',
        'unicorn/new-for-builtins': 'off',
        'import/no-cycle': 'warn',
        'import/prefer-default-export': 'off',
        'import/no-default-export': 'error',
        'import/no-extraneous-dependencies': [
            'off',
            {
                devDependencies: false,
                optionalDependencies: false,
                peerDependencies: false,
                packageDir: './'
            }
        ],
        'react/prefer-stateless-function': 'off',
        'jsx-a11y/label-has-for': [
            2,
            {
                components: ['Label'],
                required: {
                    every: ['id']
                },
                allowChildren: true
            }
        ],
        'jest/no-jasmine-globals': 'off',
        'jest/valid-describe': 'off',
        'react/destructuring-assignment': 'off',
        'react/sort-comp': [
            1,
            {
                order: [
                    'type-annotations',
                    'static-methods',
                    'lifecycle',
                    '/^on.+$/',
                    'render',
                    'everything-else'
                ]
            }
        ],
        'space-in-parens': ['error', 'always'],
        'react/jsx-filename-extension': 'off',
        'no-shadow': 'error',
        'react/prefer-stateless-function': 'error',
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/array-type': ['error', { default: 'generic' }],
        indent: 'off',
        '@typescript-eslint/indent': ['error', 4]
    },
    overrides: [
        {
            files: ['*config*js', 'internals/**/*'],
            rules: {
                'no-console': 'off',
                'import/no-extraneous-dependencies': 'off',
                'import/no-default-export': 'off',
                '@typescript-eslint/tslint/config': 'off',
                '@typescript-eslint/no-var-requires': 'off',
                'global-require': 'off',
                'unicorn/no-unsafe-regex': 'off',
                'unicorn/no-process-exit': 'off'
            }
        },
        {
            files: ['*.js'],
            rules: {
                '@typescript-eslint/tslint/config': 'off',
                '@typescript-eslint/no-var-requires': 'off'
            }
        },
        {
            files: ['*.spec.*'],
            globals: { fixture: 'readonly' },
            rules: {
                'consistent-return': 'off',
                '@typescript-eslint/explicit-function-return-type': 'off'
            }
        },
        {
            files: ['*.tsx'],
            rules: {
                'react/prop-types': 'off',
                'member-access': 'off',
                '@typescript-eslint/explicit-function-return-type': 'off',
                '@typescript-eslint/explicit-member-accessibility': 'off'
            }
        }
    ],
    plugins: ['@typescript-eslint', 'jest', 'promise', 'import', 'unicorn'],
    settings: {
        'import/core-modules': ['electron'],
        'import/resolver': {
            'babel-module': {
                root: ['.'],
                alias: aliases,
                extensions: ['.js', '.jsx', '.ts', '.tsx']
            }
        }
    }
};
