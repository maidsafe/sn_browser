// const RELEASE_FOLDER_NAME = require('./releaseName');
let TEST_UNPACKED = process.env.TEST_UNPACKED;

let appString = 'safe-browser';
let appResources = 'resources/app.asar';

const { platform } = process;
const MAC_OS = 'darwin';
const LINUX = 'linux';
const WINDOWS = 'win32';

if (platform === MAC_OS) {
    PLATFORM_NAME = 'mac';
    appString = 'SAFE Browser.app';
    appResources = 'Contents/Resources/app.asar';
}

if (platform === LINUX) {
    PLATFORM_NAME = 'linux-unpacked';
}

if (platform === WINDOWS) {
    PLATFORM_NAME = 'win-unpacked';
}

const allArgs = ['--mock', '--ignoreAppLocation'];

// Changing mainWindowURl to that of a tab gets us the browser UI going too.
const config = {
    mainWindowUrl: './app/app.html',
    appPath: '.',
    // electronPath: TEST_UNPACKED ? 'undefined' : `./release/${RELEASE_FOLDER_NAME}/${appString}`,
    appArgs: allArgs
    // openDevTools: true
};

if (!TEST_UNPACKED) {
    console.log('Testing packaged app. \n');

    if (platform === MAC_OS) {
        config.mainWindowUrl = `./release/${PLATFORM_NAME}/${appString}/${appResources}/app/app.html`;
        config.appPath = `./release/${PLATFORM_NAME}/${appString}/${appResources}`;
    }

    config.electronPath = `./release/${PLATFORM_NAME}/${appString}`;
} else {
    console.log('Testing unpackaged app. \n');
}

module.exports = config;
