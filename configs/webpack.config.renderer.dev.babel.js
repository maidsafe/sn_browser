/* eslint global-require: off, import/no-dynamic-require: off */

/**
 * Build config for development electron renderer process that uses
 * Hot-Module-Replacement
 *
 * https://webpack.js.org/concepts/hot-module-replacement/
 */

import path from 'path';
import fs from 'fs';
import webpack from 'webpack';
import chalk from 'chalk';
import { merge } from 'webpack-merge';
import { spawn, execSync } from 'child_process';

import baseConfig from './webpack.config.base';
// import CheckNodeEnv from '../internals/scripts/CheckNodeEnv';

const CircularDependencyPlugin = require( 'circular-dependency-plugin' );

// CheckNodeEnv( 'development' );

const port = process.env.PORT || 1212;
const publicPath = `http://localhost:${port}/dist`;
const dll = path.join( __dirname, '..', 'dll' );
const manifest = path.resolve( dll, 'renderer.json' );
const requiredByDLLConfig = module.parent.filename.includes(
    'webpack.config.renderer.dev.dll'
);

/**
 * Warn if the DLL is not built
 */
if ( !requiredByDLLConfig && !( fs.existsSync( dll ) && fs.existsSync( manifest ) ) ) {
    console.info(
        chalk.black.bgYellow.bold(
            'The DLL files are missing. Sit back while we build them for you with "yarn build-dll"'
        )
    );
    execSync( 'yarn build-dll' );
}

export default merge( baseConfig, {
    devtool: 'inline-source-map',

    mode: 'development',

    target: 'electron-renderer',

    entry: {
        patch: 'react-hot-loader/patch',
        devserver: `webpack-dev-server/client?http://localhost:${port}/`,
        only: 'webpack/hot/only-dev-server',
        renderer: require.resolve( '../app/index.tsx' ),
        background: require.resolve( '../app/background.ts' ),
        // ,
        // browserPreload : require.resolve( '../app/browserPreload' )
    },

    output: {
        publicPath: `http://localhost:${port}/dist/`,
        filename: '[name].dev.js',
    },

    module: {
        rules: [
            {
                test: /node_modules[/\\](iconv-lite)[/\\].+/,
                resolve: {
                    aliasFields: ['main'],
                },
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                    },
                },
            },
            {
                test: /\.global\.css$/,
                use: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                        },
                    },
                ],
            },
            {
                test: /^((?!\.global).)*\.css$/,
                use: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                mode: 'local',
                                localIdentName: '[name]__[local]',
                            },
                            sourceMap: true,
                            importLoaders: 1,
                        },
                    },
                ],
            },
            // Add LESS support  - compile all other .less files and pipe it to style.css
            {
                test: /^((?!\.global).)*\.less/,
                use: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader',
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            lessOptions: {
                                javascriptEnabled: true,
                            },
                        },
                    },
                ],
            },
            // WOFF Font
            {
                test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        mimetype: 'application/font-woff',
                    },
                },
            },
            // WOFF2 Font
            {
                test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        mimetype: 'application/font-woff',
                    },
                },
            },
            // TTF Font
            {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        mimetype: 'application/octet-stream',
                    },
                },
            },
            // EOT Font
            {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                use: 'file-loader',
            },

            // SVG Font
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        mimetype: 'image/svg+xml',
                    },
                },
            },
            // Common Image Formats
            {
                test: /\.(?:ico|gif|png|jpg|jpeg|webp)$/,
                use: 'url-loader',
            },
        ],
    },

    plugins: [
        requiredByDLLConfig
            ? null
            : new webpack.DllReferencePlugin( {
                  context: path.join( __dirname, '..', 'dll' ),
                  manifest: require( manifest ),
                  sourceType: 'var',
              } ),

        new webpack.HotModuleReplacementPlugin( {
            multiStep: true,
        } ),

        new webpack.NoEmitOnErrorsPlugin(),

        /**
         * Create global constants which can be configured at compile time.
         *
         * Useful for allowing different behaviour between development builds and
         * release builds
         *
         * NODE_ENV should be production so that modules do not perform certain
         * development checks
         *
         * By default, use 'development' as NODE_ENV. This can be overriden with
         * 'staging', for example, by changing the ENV variables in the npm scripts
         */
        new webpack.EnvironmentPlugin( {
            NODE_ENV: 'development',
            IS_UNPACKED: true,
        } ),

        new webpack.LoaderOptionsPlugin( {
            debug: true,
        } ),

        new CircularDependencyPlugin( {
            // exclude detection of files based on a RegExp
            // exclude          : /a\.js|node_modules/,
            // add errors to webpack instead of warnings
            failOnError: false,
            // allow import cycles that include an asyncronous import,
            // e.g. via import(/* webpackMode: "weak" */ './file.js')
            allowAsyncCycles: false,
            // set the current working directory for displaying module paths
            cwd: process.cwd(),
        } ),
    ],

    node: {
        __dirname: false,
        __filename: false,
    },

    devServer: {
        port,
        publicPath,
        compress: true,
        noInfo: true,
        stats: 'errors-only',
        inline: true,
        lazy: false,
        hot: true,
        headers: { 'Access-Control-Allow-Origin': '*' },
        contentBase: path.join( __dirname, 'dist' ),
        watchOptions: {
            aggregateTimeout: 300,
            ignored: /node_modules/,
            poll: 100,
        },
        historyApiFallback: {
            verbose: true,
            disableDotRule: false,
        },
        before() {
            if ( process.env.START_HOT ) {
                console.info(
                    'Starting Main Process... nodeenv',
                    process.env.NODE_ENV
                );
                spawn( 'npm', ['run', 'start-main-dev'], {
                    shell: true,
                    env: process.env,
                    stdio: 'inherit',
                } )
                    // eslint-disable-next-line unicorn/no-process-exit
                    .on( 'close', ( code ) => process.exit( code ) )
                    .on( 'error', ( spawnError ) => console.error( spawnError ) );
            }
        },
    },
} );
