/**
 * Build config for electron renderer process
 */

import path from 'path';
import webpack from 'webpack';
// import ExtractTextPlugin from 'extract-text-webpack-plugin';
import merge from 'webpack-merge';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';

import baseConfig from './webpack.config.base';

export default merge.smart( baseConfig, {
    devtool : 'source-map',

    target : 'electron-renderer',
    mode: 'production',

    entry : ['./app/webPreload.development'],

    output : {
        path       : __dirname,
        filename : './app/webPreload.js'
    },

    stats : 'errors-only',

    plugins : [
    /**
     * Create global constants which can be configured at compile time.
     *
     * Useful for allowing different behaviour between development builds and
     * release builds
     *
     * NODE_ENV should be production so that modules do not perform certain
     * development checks
     */
        new webpack.DefinePlugin( {
            'process.env.NODE_ENV' : JSON.stringify( process.env.NODE_ENV || 'production' )
        } ),

    ],
} );
