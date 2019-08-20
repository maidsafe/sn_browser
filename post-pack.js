#!/usr/bin/env node
const path = require( 'path' );
const fs = require( 'fs-extra' );

const env = process.env.NODE_ENV || 'production';

const RELEASE_FOLDER_NAME = require( './releaseName' );

const pkg = require( './package.json' );

const targetDir = path.resolve( __dirname, `safe-browser-${env}` );
const newTargetDir = path.resolve( __dirname, `release/safe-browser-${env}` );

const { platform } = process;
const OSX = 'darwin';
const LINUX = 'linux';
const WINDOWS = 'win32';

// let PLATFORM_NAME;
let CONTAINING_FOLDER;

if ( platform === OSX ) {
    CONTAINING_FOLDER = path.resolve( targetDir, 'mac' );
}

if ( platform === LINUX ) {
    CONTAINING_FOLDER = path.resolve( targetDir, 'linux-unpacked' );
}

if ( platform === WINDOWS ) {
    CONTAINING_FOLDER = path.resolve( targetDir, 'win-unpacked' );
}

// add version file
fs.outputFileSync( path.resolve( CONTAINING_FOLDER, 'version' ), pkg.version );

// remove licenses
const removalArray = [
    'LICENSE.electron.txt',
    'LICENSES.chromium.html',
    'LICENSE'
];

removalArray.forEach( ( file ) => {
    fs.removeSync( `${CONTAINING_FOLDER}/${file}` );
} );

console.info(
    'Renaming package to:',
    path.resolve( targetDir, `${RELEASE_FOLDER_NAME}` )
);
// rename release folder
fs.moveSync(
    CONTAINING_FOLDER,
    path.resolve( targetDir, `${RELEASE_FOLDER_NAME}` ),
    { overwrite: true }
);

fs.moveSync( targetDir, newTargetDir );
