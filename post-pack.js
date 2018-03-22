#!/usr/bin/env node
const exec = require( 'child_process' ).exec;
const path = require( 'path' );
const fs = require( 'fs-extra' );
const archiver = require( 'archiver' );

const pkg = require( './package.json' );
const env = process.env.NODE_ENV || 'production';
const isBuildingDev = /^dev/.test( env );

const targetDir = path.resolve( __dirname, 'release' );

const platform = process.platform;
const OSX = 'darwin';
const LINUX = 'linux';
const WINDOWS = 'win32';
const pkgName = pkg.name;

let PLATFORM_NAME;
let CONTAINING_FOLDER;

if ( platform === OSX )
{
    CONTAINING_FOLDER = path.resolve( targetDir, 'mac' );
    const PERUSE_FOLDER = path.resolve( CONTAINING_FOLDER, 'Peruse.app' );
    const PERUSE_RESOURCES_FOLDER = path.resolve( PERUSE_FOLDER, 'Contents/Resources' );
    const PERUSE_CONFIG_FOLDER = path.resolve( PERUSE_FOLDER, 'Contents/Frameworks/Peruse Helper.app/Contents/MacOS' );

    const LOGS = 'log.toml';

    fs.moveSync( path.resolve( PERUSE_RESOURCES_FOLDER, 'Peruse.crust.config' ), path.resolve( PERUSE_CONFIG_FOLDER, 'Peruse Helper.crust.config' ), { overwrite: true } );
    fs.moveSync( path.resolve( PERUSE_RESOURCES_FOLDER, LOGS ), path.resolve( PERUSE_CONFIG_FOLDER, LOGS ), { overwrite: true } );

    PLATFORM_NAME = 'osx';
}

if ( platform === LINUX )
{
    CONTAINING_FOLDER = path.resolve( targetDir, 'linux-unpacked' );

    PLATFORM_NAME = LINUX;
}

if ( platform === WINDOWS )
{
    CONTAINING_FOLDER = path.resolve( targetDir, 'win-unpacked' );

    PLATFORM_NAME = 'win';
}

let devModifier = '';
if( isBuildingDev )
{
    devModifier = 'dev-'
}

const RELEASE_FOLDER_NAME = `${devModifier}${pkgName}-v${pkg.version}-${PLATFORM_NAME}-x64`;


// add version file
fs.outputFileSync( path.resolve( CONTAINING_FOLDER, 'version' ), pkg.version );

// remove licenses
const removalArray = ['LICENSE.electron.txt', 'LICENSES.chromium.html', 'LICENSE'];

removalArray.forEach( ( file ) =>
{
    fs.removeSync( `${CONTAINING_FOLDER}/${file}` );
} );

console.log( 'Renaming package to:', path.resolve( targetDir, `${RELEASE_FOLDER_NAME}` ) );
// rename release folder
fs.moveSync( CONTAINING_FOLDER, path.resolve( targetDir, `${RELEASE_FOLDER_NAME}` ), { overwrite: true } );
