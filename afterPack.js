#!/usr/bin/env node
const path = require( 'path' );
const fs = require( 'fs-extra' );

const pkg = require( './package.json' );

const { platform } = process;
const MAC = 'darwin';
const LINUX = 'linux';
const WINDOWS = 'win32';

// let CONTAINING_FOLDER;

// AfterPackContext {
//   outDir: string
//   appOutDir: string
//   packager: PlatformPackager<any>
//   electronPlatformName: string
//   arch: Arch
//   targets: Array<Target>
// }

module.exports = async ( AfterPackContext ) => {
    const targetDir = path.resolve( __dirname, 'release' );

    const CONTAINING_FOLDER = AfterPackContext.appOutDir;

    let APP_ITSELF_DIR = AfterPackContext.appOutDir;

    if ( platform === MAC )
        APP_ITSELF_DIR = path.resolve(
            AfterPackContext.appOutDir,
            'SAFE Browser.app/Contents/Resources'
        );

    // add version file
    fs.outputFileSync( path.resolve( APP_ITSELF_DIR, 'version' ), pkg.version );

    // remove licenses
    const removalArray = [
        'LICENSE.electron.txt',
        'LICENSES.chromium.html',
        'LICENSE'
    ];

    removalArray.forEach( ( file ) => {
        fs.removeSync( `${CONTAINING_FOLDER}/${file}` );
    } );
};
