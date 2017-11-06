/** Used in .babelrc for 'test' environment */

// for babel-plugin-webpack-loaders
require( 'babel-register' );
const nodeExternals = require( 'webpack-node-externals' );


const devConfig = require( './webpack.config.renderer.dev' );

module.exports = {
    target : 'node',
    output : {
        libraryTarget : 'commonjs2'
    },
    module : {
        // Use base + development loaders, but exclude 'babel-loader'
        rules : devConfig.module.rules
    },
    resolve   : devConfig.resolve,
    externals : [nodeExternals()], // in order to ignore all modules in node_modules folder
    devtool   : 'inline-cheap-module-source-map'
};
