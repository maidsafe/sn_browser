#!/usr/bin/env node
const exec = require( 'child_process' ).exec;
const path = require( 'path' );
const fs = require( 'fs-extra' );
const archiver = require( 'archiver' );

const pkg = require( './package.json' );

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

const RELEASE_FOLDER_NAME = `${pkgName}-v${pkg.version}-${PLATFORM_NAME}-x64`;


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

// create a file to stream archive data to.
// const output = fs.createWriteStream( path.resolve( targetDir, `${RELEASE_FOLDER_NAME}.zip` ) );
// const archive = archiver( 'zip', {
//     zlib : { level: 4 } // Sets the compression level.
// } );

// listen for all archive data to be written
// output.on( 'close', () =>
// {
//     console.log( `${archive.pointer()} total bytes` );
//     console.log( 'archiver has been finalized and the output file descriptor has closed.' );
//
//     // // remove osx junk
//     // if ( platform === OSX )
//     // {
//     //     console.log( 'run to remove zipped nonsense: zip -d release/web-hosting-manager-v0.4.1-osx-x64.zip  *.DS_Store' );
//     //
//     //     exec( `zip -d ${targetDir}/${RELEASE_FOLDER_NAME}.zip *.DS_Store`, ( error, stdout, stderr ) =>
//     //     {
//     //         if ( error )
//     //         {
//     //             console.error( `exec error: ${error}` );
//     //             return;
//     //         }
//     //         console.log( `stdout: ${stdout}` );
//     //         console.log( `stderr: ${stderr}` );
//     //     } );
//     // }
// } );

// console.log( 'Zipping...' );
//
// archive.on( 'warning', ( err ) =>
// {
//     if ( err.code === 'ENOENT' )
//     {
//         console.warn( err );
//     }
//     else
//     {
//         console.error( err );
//         throw err;
//     }
// } );
//
// console.log('CONTAINING_FOLDER', CONTAINING_FOLDER);
// console.log('RELEASE_FOLDER_NAME', RELEASE_FOLDER_NAME);
// // pipe archive data to the file
// archive.pipe( output );
// archive.directory( CONTAINING_FOLDER, RELEASE_FOLDER_NAME );
// archive.finalize();
