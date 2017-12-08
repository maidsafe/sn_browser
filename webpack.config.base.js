/**
 * Base webpack config used across other specific configs
 */

import path from 'path';
import webpack from 'webpack';
import { dependencies as externals } from './app/package.json';

export default {
    externals : Object.keys( externals || {} ),

    stats : 'errors-only',

    /**
   * Determine the array of extensions that should be used to resolve modules.
   */
    resolve : {
        extensions : ['.js', '.jsx', '.json'],
        alias      :
        {
            actions      : path.join( __dirname, 'app/actions' ),
            appPackage   : path.join( __dirname, 'package.json' ),
            components   : path.join( __dirname, 'app/components' ),
            containers   : path.join( __dirname, 'app/containers' ),
            appConstants : path.join( __dirname, 'app/constants' ),
            extensions   : path.join( __dirname, 'app/extensions' ),
            logger       : path.join( __dirname, 'app/logger' ),
            store        : path.join( __dirname, 'app/store' ),
            utils        : path.join( __dirname, 'app/utils' ),
            reducers     : path.join( __dirname, 'app/reducers' )
        },
        modules : [
            path.join( __dirname, 'app' ),
            'node_modules',
        ],
    },

    module : {
        rules :
        [
            {
                test    : /\.jsx?$/,
                exclude : /node_modules/,
                use     : {
                    loader  : 'babel-loader',
                    options : {
                        cacheDirectory : true
                    }
                }
            },
            {
                test : /\.ejs$/,
                use  : 'ejs-loader'
            },
            {
                test : /\.global\.css$/,
                use  : [
                    {
                        loader : 'style-loader'
                    },
                    {
                        loader  : 'css-loader',
                        options : {
                            sourceMap : true,
                        },
                    }
                ]
            },
            {
                test : /^((?!\.global).)*\.css$/,
                use  : [
                    {
                        loader : 'style-loader'
                    },
                    {
                        loader  : 'css-loader',
                        options : {
                            modules        : true,
                            sourceMap      : true,
                            importLoaders  : 1,
                            localIdentName : '[name]__[local]', // remove for now for nessie styles
                            // localIdentName : '[name]__[local]__[hash:base64:5]',
                        }
                    },
                ]
            },
            // Add SASS support  - compile all .global.scss files and pipe it to style.css
            {
                test : /\.global\.scss$/,
                use  : [
                    {
                        loader : 'style-loader'
                    },
                    {
                        loader  : 'css-loader',
                        options : {
                            sourceMap : true,
                        },
                    },
                    {
                        loader : 'sass-loader'
                    }
                ]
            },
            // Add SASS support  - compile all other .scss files and pipe it to style.css
            {
                test : /^((?!\.global).)*\.scss$/,
                use  : [
                    {
                        loader : 'style-loader'
                    },
                    {
                        loader  : 'css-loader',
                        options : {
                            modules        : true,
                            sourceMap      : true,
                            importLoaders  : 1,
                            localIdentName : '[name]__[local]__[hash:base64:5]',
                        }
                    },
                    {
                        loader : 'sass-loader'
                    }
                ]
            },
            // WOFF Font
            {
                test : /\.woff(\?v=\d+\.\d+\.\d+)?$/,
                use  : {
                    loader  : 'url-loader',
                    options : {
                        limit    : 10000,
                        mimetype : 'application/font-woff',
                    }
                },
            },
            // WOFF2 Font
            {
                test : /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
                use  : {
                    loader  : 'url-loader',
                    options : {
                        limit    : 10000,
                        mimetype : 'application/font-woff',
                    }
                }
            },
            // TTF Font
            {
                test : /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                use  : {
                    loader  : 'url-loader',
                    options : {
                        limit    : 10000,
                        mimetype : 'application/octet-stream'
                    }
                }
            },
            // EOT Font
            {
                test : /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                use  : 'file-loader',
            },
            // SVG Font
            {
                test : /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                use  : {
                    loader  : 'url-loader',
                    options : {
                        limit    : 10000,
                        mimetype : 'image/svg+xml',
                    }
                }
            },
            // Common Image Formats
            {
                test : /\.(?:ico|gif|png|jpg|jpeg|webp)$/,
                use  : 'url-loader',
            }
        ]
    },

    output : {
        path          : path.join( __dirname, 'app' ),
        filename      : 'bundle.js',
        // https://github.com/webpack/webpack/issues/1114
        libraryTarget : 'commonjs2'
    },

    plugins : [
        new webpack.NamedModulesPlugin()
    ]
};
