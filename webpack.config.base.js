/**
 * Base webpack config used across other specific configs
 */

import path from 'path';
import webpack from 'webpack';
import { dependencies as externals } from './app/package.json';

export default {
    externals : Object.keys( externals || {} ),

    module : {
        rules : [{
            test    : /\.jsx?$/,
            exclude : /node_modules/,
            use     : {
                loader  : 'babel-loader',
                options : {
                    cacheDirectory : true
                }
            }
        }]
    },

    output : {
        path          : path.join( __dirname, 'app' ),
        filename      : 'bundle.js',
    // https://github.com/webpack/webpack/issues/1114
        libraryTarget : 'commonjs2'
    },

  /**
   * Determine the array of extensions that should be used to resolve modules.
   */
    resolve : {
        extensions : ['.js', '.jsx', '.json'],
        alias      :
        {
            components : path.join( __dirname, 'app/components' ),
            containers : path.join( __dirname, 'app/containers' ),
            reducers   : path.join( __dirname, 'app/reducers' )
        },
        modules : [
            path.join( __dirname, 'app' ),
            'node_modules',
        ],
    },

    plugins : [
        new webpack.NamedModulesPlugin(),
    ],
};
