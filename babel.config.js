/* eslint global-require: off */
const developmentEnvironments = ['development', 'test'];
const developmentPlugins = [require( 'react-hot-loader/babel' )];
const productionPlugins = [
    require( 'babel-plugin-dev-expression' ),
    require( '@babel/plugin-transform-react-constant-elements' ),
    require( '@babel/plugin-transform-react-inline-elements' ),
    require( 'babel-plugin-transform-react-remove-prop-types' ),
];

const aliases = require( './.aliases.config' );

module.exports = ( api ) => {
    // see docs about api at https://babeljs.io/docs/en/config-files#apicache

    const development = api.env( developmentEnvironments );

    return {
        presets: [
            '@babel/preset-typescript',
            [
                require( '@babel/preset-env' ),
                {
                    targets: {
                        electron: require( 'electron/package' ).version,
                    },
                    useBuiltIns: 'usage',
                    corejs: 3,
                    // modules     : 'umd'
                },
            ],
            [require( '@babel/preset-react' ), { development }],
        ],
        plugins: [
            require( '@babel/plugin-proposal-object-rest-spread' ),
            'add-module-exports',
            [
                'import',
                {
                    libraryName: 'antd',
                    style: 'css',
                },
            ],
            // Stage 0
            require( '@babel/plugin-proposal-function-bind' ),

            // Stage 1
            require( '@babel/plugin-proposal-export-default-from' ),
            require( '@babel/plugin-proposal-logical-assignment-operators' ),
            [
                require( '@babel/plugin-proposal-optional-chaining' ),
                { loose: false },
            ],
            [
                require( '@babel/plugin-proposal-pipeline-operator' ),
                { proposal: 'minimal' },
            ],
            [
                require( '@babel/plugin-proposal-nullish-coalescing-operator' ),
                { loose: false },
            ],
            require( '@babel/plugin-proposal-do-expressions' ),

            // Stage 2
            [require( '@babel/plugin-proposal-decorators' ), { legacy: true }],
            require( '@babel/plugin-proposal-function-sent' ),
            require( '@babel/plugin-proposal-export-namespace-from' ),
            require( '@babel/plugin-proposal-numeric-separator' ),
            require( '@babel/plugin-proposal-throw-expressions' ),

            // Stage 3
            require( '@babel/plugin-syntax-dynamic-import' ),
            require( '@babel/plugin-syntax-import-meta' ),
            [
                require( '@babel/plugin-proposal-class-properties' ),
                { loose: true },
            ],
            require( '@babel/plugin-proposal-json-strings' ),

            [
                'module-resolver',
                {
                    root: ['.'],
                    alias: aliases,
                },
            ],

            ...( development ? developmentPlugins : productionPlugins ),
        ],
    };
};
