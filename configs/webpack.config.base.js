/**
 * Base webpack config used across other specific configs
 */

import path from 'path';
import webpack from 'webpack';

import { dependencies } from '../package';

export default {
    externals: [...Object.keys( dependencies || {} )],
    module: {
        rules: [
            {
                test: /\.[jt|]sx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                    },
                },
            },
            // NODE Files
            {
                test: /\.node(\?v=\d+\.\d+\.\d+)?$/,
                use: {
                    loader: 'native-ext-loader',
                },
            },
        ],
    },

    output: {
        path: path.join( __dirname, '..', 'app' ),
        // https://github.com/webpack/webpack/issues/1114
        libraryTarget: 'commonjs2',
    },

    /**
     * Determine the array of extensions that should be used to resolve modules.
     */
    resolve: {
        extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    },
    optimization: { moduleIds: 'named' },
    plugins: [
        new webpack.EnvironmentPlugin( {
            NODE_ENV: 'production',
        } ),
    ],
};
