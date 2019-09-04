const path = require( 'path' );

const pkg = require( './package.json' );

const env = process.env.NODE_ENV || 'production';
const isBuildingDev = /^(dev|test)/.test( env );

const targetDir = path.resolve( __dirname, 'release' );

const { platform } = process;
const OSX = 'darwin';
const LINUX = 'linux';
const WINDOWS = 'win32';
const pkgName = pkg.name;

let PLATFORM_NAME;

if ( platform === OSX ) {
    PLATFORM_NAME = 'mac';
}

if ( platform === LINUX ) {
    PLATFORM_NAME = LINUX;
}

if ( platform === WINDOWS ) {
    PLATFORM_NAME = 'win';
}

let devModifier = '';
if ( isBuildingDev ) {
    devModifier = '-dev';
}

const RELEASE_FOLDER_NAME = `${pkgName}-v${pkg.version}-${PLATFORM_NAME}-x64${devModifier}`;

module.exports = RELEASE_FOLDER_NAME;
