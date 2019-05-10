const RELEASE_FOLDER_NAME = require('./releaseName');

let appString = 'SAFE Browser.app';

if (process.platform === 'linux') {
    appString = 'safe-browser';
}

if (process.platform === 'windows') {
    appString = 'safe-browser';
}

module.exports = {
    mainWindowUrl: './app/app.html',
    appPath: '.',
    electronPath: `./release/${RELEASE_FOLDER_NAME}/${appString}`,
    appArgs: ['--debug']
};
