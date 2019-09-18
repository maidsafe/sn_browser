#!/usr/bin/env node
const path = require( 'path' );
const fs = require( 'fs-extra' );

const pkg = require( './package.json' );

const { platform } = process;
const OSX = 'darwin';
const LINUX = 'linux';
const WINDOWS = 'win32';

let CONTAINING_FOLDER;

const targetDir = path.resolve( __dirname, 'release' );

if ( platform === OSX ) CONTAINING_FOLDER = path.resolve( targetDir, 'mac' );

if ( platform === LINUX )
    CONTAINING_FOLDER = path.resolve( targetDir, 'linux-unpacked' );

if ( platform === WINDOWS )
    CONTAINING_FOLDER = path.resolve( targetDir, 'win-unpacked' );

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
