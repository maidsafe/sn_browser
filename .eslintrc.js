const aliases = require('./.aliases.js');

module.exports = {
    "parser": "@typescript-eslint/parser",
    "extends": ['airbnb', "plugin:@typescript-eslint/recommended"],
    env: {
        browser: true,
        node: true,
        'jest/globals': true
    },
    parserOptions: {
        'ecmaFeatures.jsx' : true,
        project : 'tsconfig.json',
        tsconfigRootDir: '.',
        sourceType: 'module',
        allowImportExportEverywhere: false,
        codeFrame: true,
        ecmaFeatures: {
            jsx: true
        }
    },
    globals: {
        peruseStore: true,
        should: true
    },
    rules: {
        'array-bracket-spacing': ["error", "always"],
        'arrow-parens': ['error', 'as-needed'],
        'template-curly-spacing': ['error', 'always'],
        'max-len': 'off',
        'no-plusplus': 'off',
        'brace-style': ['error', 'allman', { allowSingleLine: true }],
        'no-param-reassign': ['error', { props: false }],
        'compat/compat': 'error',
        'consistent-return': 'warn',
        'no-undef': 'warn',
        'no-trailing-spaces': ['error', { ignoreComments: true }],
        'comma-dangle': ['error', 'only-multiline'],
        'generator-star-spacing': ['error', { before: true, after: false }],
        'no-underscore-dangle': 'off',
        'no-useless-escape': 'warn',
        'key-spacing': [
            'error',
            {
                singleLine: {
                    beforeColon: false,
                    afterColon: true
                },
                multiLine: {
                    beforeColon: true,
                    afterColon: true,
                    align: 'colon'
                }
            }
        ],
        'import/no-unresolved': 'off',
        'implicit-arrow-linebreak': 'off',
        'import/first': 'off',
        'no-await-in-loop': 'warn',
        'import/no-duplicates': 'warn',
       "import/prefer-default-export": "off",
        'import/no-extraneous-dependencies': 'warn',
        'import/no-named-as-default': 'warn',
        'import/extensions': 'warn',
        'import/no-named-as-default-member': 'warn',
        indent: ['error', 4, { SwitchCase: 1 }],
        'no-console': 'off',
        'no-use-before-define': 'off',
        'no-multi-assign': 'off',
        'object-curly-spacing' : [ 'error', 'always' ],
        'promise/param-names': 'error',
        'promise/always-return': 'warn',
        'no-prototype-builtins': 'off',
        'promise/catch-or-return': 'warn',
        'promise/no-native': 'off',
        'react/sort-comp': [
            'error',
            {
                order: [
                    'type-annotations',
                    'static-methods',
                    'lifecycle',
                    'everything-else',
                    'render'
                ]
            }
        ],
        'react/jsx-no-bind': 'off',
        'react/jsx-curly-spacing': ['error', 'always'],
        'react/jsx-indent-props': ['error', 4],
        'react/jsx-indent': ['error', 4],
        'react/jsx-filename-extension': [
            'error',
            { extensions: ['.js', '.jsx', '.ts', '.tsx'] }
        ],
        'react/prefer-stateless-function': 'off',
        'space-in-parens': ['error', 'always'],
        'jest/no-disabled-tests': 'warn',
        'jest/no-focused-tests': 'error',
        'jest/no-identical-title': 'error',
        'jest/valid-expect': 'error',
        // eg ts linting
        // "@typescript-eslint/rule-name": "error",
        //eg tslint plugins
    //     "@typescript-eslint/tslint/config": ["warn", {
    //   "lintFile": "", // path to tslint.json of your project
    //   "rules": {
    //     // tslint rules (will be used if `lintFile` is not specified)
    //   },
    //   "rulesDirectory": [
    //     // array of paths to directories with rules, e.g. 'node_modules/tslint/lib/rules' (will be used if `lintFile` is not specified)
    //   ]
    // }],
    },
    plugins: ['import', 'promise', 'compat', 'react', 'jest', "@typescript-eslint"],
    settings: {
        'import/resolver': {
            'babel-module': {
                alias: aliases
            }
        }
    }
};
