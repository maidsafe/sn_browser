// const RELEASE_FOLDER_NAME = require('./releaseName');
let TEST_UNPACKED = process.env.TEST_UNPACKED;
const pkg = require('./package.json');

let appString = 'safe-browser';
let appResources = 'resources/app.asar';

const { platform } = process;
const MAC_OS = 'darwin';
const LINUX = 'linux';
const WINDOWS = 'win32';

let appChannel = '';
if (pkg.version.includes('-alpha')) {
    appChannel = ' Alpha';
}

if (pkg.version.includes('-beta')) {
    appChannel = ' Beta';
}

if (platform === MAC_OS) {
    PLATFORM_NAME = 'mac';
    appString = `SAFE Browser${appChannel}.app`;
    appResources = 'Contents/Resources/app.asar';
}

if (platform === LINUX) {
    PLATFORM_NAME = 'linux-unpacked';
}

if (platform === WINDOWS) {
    PLATFORM_NAME = 'win-unpacked';
    appString = `SAFE Browser${appChannel}.exe`;
}

const allArgs = ['--ignoreAppLocation'];

// Changing mainWindowURl to that of a tab gets us the browser UI going too.
const config = {
    mainWindowUrl: './app/app.html',
    appPath: '.'
    // electronPath: TEST_UNPACKED ? 'undefined' : `./release/${RELEASE_FOLDER_NAME}/${appString}`,
    // , appArgs: allArgs
    // openDevTools: true
};

if (!TEST_UNPACKED) {
    if (platform === MAC_OS) {
        config.mainWindowUrl = `./release/${PLATFORM_NAME}/${appString}/${appResources}/app/app.html`;
        config.appPath = `./release/${PLATFORM_NAME}/${appString}/${appResources}`;
    }

    config.electronPath = `./release/${PLATFORM_NAME}/${appString}`;
    console.log('Testing packaged app.', config, ' \n');
} else {
    console.log('Testing unpackaged app. ', config, ' \n');
}

module.exports = config;
