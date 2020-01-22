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
        'prettier/@typescript-eslint',
        'plugin:testcafe/recommended'
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
        'arrow-parens': ['error', 'always'],
        'autofix/no-unused-vars': 'off',
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
        'no-use-before-define': 'off',
        'no-unused-expressions': [
            'error',
            { allowShortCircuit: true, allowTernary: true }
        ],
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
        'unicorn/catch-error-name': 'off',
        'unicorn/filename-case': 'off',
        'unicorn/prefer-exponentiation-operator': 'off',
        'unicorn/prefer-query-selector': 'off',
        'unicorn/prefer-text-content': 'off',
        'unicorn/no-for-loop': 'off',
        'unicorn/throw-new-error': 'off',
        'unicorn/regex-shorthand': 'error',
        'unicorn/no-new-buffer': 'off',
        'unicorn/no-unsafe-regex': 'warn',
        'no-prototype-builtins': 'off',
        'unicorn/prefer-type-error': 'off',
        'unicorn/new-for-builtins': 'off',
        'import/no-cycle': 'warn',
        'import/no-extraneous-dependencies': [
            0,
            {
                devDependencies: true,
                optionalDependencies: true,
                peerDependencies: true
            }
        ],
        'import/prefer-default-export': 'off',
        'import/no-default-export': 'error',
        'import/extensions': ['error', 'never'],
        'import/order': [
            'error',
            {
                groups: [
                    ['builtin', 'external'],
                    ['parent', 'sibling', 'index']
                ],
                'newlines-between': 'always'
            }
        ],
        'import/no-default-export': 'error',
        'react/prefer-stateless-function': 'off',
        'react/static-property-placement': 'off',
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
        'react/static-property-placement': 'off',
        'react/jsx-fragments': ['error', 'element'],
        'react/jsx-props-no-spreading': 'warn',
        'jest/no-jasmine-globals': 'off',
        'jest/valid-describe': 'off',
        'react/destructuring-assignment': 'off',
        'space-in-parens': ['error', 'always'],
        'react/jsx-filename-extension': 'off',
        'no-shadow': 'error',
        'react/prefer-stateless-function': 'error',
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/no-namespace': 'off',
        '@typescript-eslint/no-unused-expressions': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/ban-ts-ignore': 'off',
        '@typescript-eslint/array-type': ['error', { default: 'generic' }],
        indent: 'off',
        '@typescript-eslint/indent': ['error', 4],
        'unicorn/prevent-abbreviations': [
            'error',
            {
                whitelist: {
                    propOverrides: true,
                    props: true
                },
                checkFilenames: false
            }
        ]
    },

    overrides: [
        {
            files: ['*config*js', 'internals/**/*'],
            rules: {
                'global-require': 'off',
                'no-console': 'off',
                'import/no-default-export': 'off',
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
            files: ['*.js'],
            rules: {
                '@typescript-eslint/tslint/config': 'off',
                '@typescript-eslint/no-var-requires': 'off'
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
        },
        {
            files: ['*.e2e.ts', 'helpers.ts'],
            rules: {
                'import/no-extraneous-dependencies': 'off'
            }
        }
    ],
    plugins: [
        '@typescript-eslint',
        'jest',
        'promise',
        'import',
        'unicorn',
        'testcafe',
        'autofix'
    ],
    settings: {
        // 'import/ignore': '*config*.js',
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
