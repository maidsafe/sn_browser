module.exports={
    "parser": "@typescript-eslint/parser",
    "extends": [
        "airbnb-typescript",
        "plugin:@typescript-eslint/recommended",
        "plugin:jest/recommended",
        "plugin:promise/recommended",
        "plugin:unicorn/recommended",
        "prettier",
        "prettier/react",
        "prettier/@typescript-eslint",
    ],
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "useJSXTextNode": false,
        project : "./tsconfig.json",
        tsconfigRootDir: ".",
        sourceType: 'module',
        allowImportExportEverywhere: false,
        codeFrame: true
      },
    "rules": {
        "unicorn/catch-error-name": "off",
        "unicorn/filename-case": "off",
        "unicorn/prefer-exponentiation-operator": "off",
        "unicorn/prefer-query-selector": "off",
        "unicorn/prefer-text-content": "off",
        "unicorn/no-for-loop": "off",
        "unicorn/throw-new-error": "off",
        "unicorn/regex-shorthand": "error",
        "unicorn/no-new-buffer": "off",
        "unicorn/no-unsafe-regex": "error",
        "no-prototype-builtins": "off",
        "unicorn/prefer-type-error": "off",
        "unicorn/new-for-builtins": "off",
        "import/prefer-default-export": "off",
        "import/no-default-export": "error",
        "react/prefer-stateless-function": "off",
        "jest/no-jasmine-globals": "off",
        "jest/valid-describe": "off",
        "react/destructuring-assignment": "off",
        "space-in-parens": ["error", "always"],
        "react/jsx-filename-extension": "off",
        "no-shadow": "error",
        "react/prefer-stateless-function": "error",
        "@typescript-eslint/interface-name-prefix": "off",
        "@typescript-eslint/tslint/config": ["error", {
            "rules": {
                "member-access": [true, "no-public"],
                "file-name-casing": [true, {".tsx": "pascal-case", ".ts": "camel-case"}],
                "no-parameter-reassignment": true,
                "await-promise": true,
                "ban-comma-operator": true,
                "function-constructor": true,
                "no-bitwise": true,
                "no-conditional-assignment": true,
                "no-debugger": true,
                "no-duplicate-super": true,
                "no-duplicate-variable": true,
                "no-empty": true, 
                "no-floating-promises": true,
                "no-implicit-dependencies": [true, "dev"],
                "no-invalid-template-strings": true,
                "no-invalid-this": true,
                "no-return-await": true,
                "no-sparse-arrays": true,
                "no-string-literal": true,
                "no-string-throw": true,
                "no-switch-case-fall-through": true,
                "no-this-assignment": [true, {"allow-destructuring": true}],
                "no-unsafe-any": true,
                "no-unused-expression": true,
                "no-use-before-declare": true,
                "no-var-keyword": true,
                "prefer-object-spread": true,
                "restrict-plus-operands": true,
                "switch-default": true,
                "unnecessary-constructor": true,
                "cyclomatic-complexity": true,
                "deprecation": true,
                "no-default-export": true,
                "no-default-import": [true, {"fromModules": "^palantir-|^_internal-*|^\\./|^\\.\\./"}],
                "no-duplicate-imports": true,
                "prefer-const": true,
                "arrow-return-shorthand": true,
                "no-unnecessary-callback-wrapper": true,
                "no-unnecessary-initializer": true,
                "no-unnecessary-qualifier": true,
                "prefer-method-signature": true,
                "prefer-template": true,
                "return-undefined": true,
                "space-within-parens": false
            },
        }],
        "indent": "off",
        "@typescript-eslint/indent": ["error", 4]
    },
    "overrides": [
        {
          "files": ["*.js"],
          "rules": {
            "@typescript-eslint/tslint/config": "off",
            "@typescript-eslint/no-var-requires": "off",
          }
        },
        {
          "files": ["*.tsx"],
          "rules": {
            "member-access": "off",
            "@typescript-eslint/explicit-function-return-type": "off",
            "@typescript-eslint/explicit-member-accessibility": "off"
          }
        }
      ],
    "plugins": [
        "@typescript-eslint",
        "jest",
        "promise",
        "unicorn",
        "@typescript-eslint/tslint"
    ]
}