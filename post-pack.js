#!/usr/bin/env node
const path = require( 'path' );
const fs = require( 'fs-extra' );

const RELEASE_FOLDER_NAME = require( './releaseName' );

const pkg = require( './package.json' );

const env = process.env.NODE_ENV || 'production';
const isBuildingDev = env.startsWith( 'dev' );

const targetDir = path.resolve( __dirname, 'release' );

const { platform } = process;
const OSX = 'darwin';
const LINUX = 'linux';
const WINDOWS = 'win32';

// let PLATFORM_NAME;
let CONTAINING_FOLDER;

const LOGS = 'log.toml';
if ( platform === OSX ) {
    CONTAINING_FOLDER = path.resolve( targetDir, 'mac' );
    const PERUSE_FOLDER = path.resolve( CONTAINING_FOLDER, 'SAFE Browser.app' );
    const PERUSE_CONTENTS_FOLDER = path.resolve( PERUSE_FOLDER, 'Contents' );
    const PERUSE_RESOURCES_FOLDER = path.resolve(
        PERUSE_CONTENTS_FOLDER,
        'Resources'
    );
    const PERUSE_CONFIG_FOLDER = path.resolve(
        PERUSE_FOLDER,
        'Contents/Frameworks/SAFE Browser Helper.app/Contents/MacOS'
    );

    fs.moveSync(
        path.resolve( PERUSE_RESOURCES_FOLDER, 'SAFE Browser.crust.config' ),
        path.resolve( PERUSE_CONFIG_FOLDER, 'SAFE Browser Helper.crust.config' ),
        { overwrite: true }
    );

    fs.moveSync(
        path.resolve( PERUSE_RESOURCES_FOLDER, LOGS ),
        path.resolve( PERUSE_CONFIG_FOLDER, LOGS ),
        { overwrite: true }
    );

    // PLATFORM_NAME = 'osx';

    if ( isBuildingDev ) {
        fs.writeFileSync(
            path.resolve( PERUSE_RESOURCES_FOLDER, 'startAsMock' ),
            'unimportantContents'
        );
    }
}

if ( platform === LINUX ) {
    CONTAINING_FOLDER = path.resolve( targetDir, 'linux-unpacked' );

    // PLATFORM_NAME = LINUX;

    const PERUSE_RESOURCES_FOLDER = path.resolve(
        CONTAINING_FOLDER,
        'resources'
    );

    fs.moveSync(
        path.resolve( PERUSE_RESOURCES_FOLDER, 'SAFE Browser.crust.config' ),
        path.resolve( CONTAINING_FOLDER, 'safe-browser.crust.config' ),
        { overwrite: true }
    );

    fs.moveSync(
        path.resolve( PERUSE_RESOURCES_FOLDER, LOGS ),
        path.resolve( CONTAINING_FOLDER, LOGS ),
        { overwrite: true }
    );
}

if ( platform === WINDOWS ) {
    CONTAINING_FOLDER = path.resolve( targetDir, 'win-unpacked' );
    const PERUSE_RESOURCES_FOLDER = path.resolve(
        CONTAINING_FOLDER,
        'resources'
    );
    fs.copySync(
        path.resolve( PERUSE_RESOURCES_FOLDER, 'SAFE Browser.crust.config' ),
        path.resolve( CONTAINING_FOLDER, 'SAFE Browser.crust.config' ),
        { overwrite: true }
    );
    fs.unlinkSync(
        path.resolve( PERUSE_RESOURCES_FOLDER, 'SAFE Browser.crust.config' )
    );
    // PLATFORM_NAME = 'win';
}

if ( isBuildingDev && ( platform === WINDOWS || platform === LINUX ) ) {
    fs.writeFileSync(
        path.resolve( CONTAINING_FOLDER, 'resources', 'startAsMock' ),
        'unimportantContents'
    );
}

// add version file
fs.outputFileSync( path.resolve( CONTAINING_FOLDER, 'version' ), pkg.version );

// remove licenses
const removalArray = [
    'LICENSE.electron.txt',
    'LICENSES.chromium.html',
    'LICENSE'
];

removalArray.forEach( file => {
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
