const RELEASE_FOLDER_NAME = require('./releaseName');

let appString = 'SAFE Browser.app';

if (process.platform === 'linux') {
    appString = 'safe-browser';
}

if (process.platform === 'windows') {
    appString = 'safe-browser';
}

const allArgs = ['--mock'];

const testAuthenticator = process.env.TEST_CAFE_TEST_AUTH;

if (testAuthenticator) {
    // TODO setup proper app structure for testing of webpages using SAFE BROWSER
    // this check can act like a placeholder for now
    allArgs.push('--testCafeURL');
    allArgs.push(AUTH_TAB);
}

// Changing mainWindowURl to that of a tab gets us the browser UI going too.
module.exports = {
    mainWindowUrl: './app/app.html',
    appPath: '.',
    // electronPath: `./release/${RELEASE_FOLDER_NAME}/${appString}`,
    appArgs: allArgs
    // openDevTools: true
};
