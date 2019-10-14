const RELEASE_PACKAGE_NAME = require( './releaseName' );

const { platform } = process;
const OSX = 'darwin';
const LINUX = 'linux';
const WINDOWS = 'win32';

// eslint-disable-next-line consistent-return, @typescript-eslint/explicit-function-return-type
const logFilePath = () => {
    if ( platform === OSX ) {
        return '../../Frameworks/SAFE Browser Helper.app/Contents/MacOS/log.toml';
    }
    if ( platform === LINUX ) {
        return 'log.toml';
    }
    if ( platform === WINDOWS ) {
        return 'log.toml';
    }
};

// eslint-disable-next-line consistent-return, @typescript-eslint/explicit-function-return-type
const publishedFilePath = () => {
    if ( platform === OSX ) {
        return `safe-browser-osx`;
        // return `safe-browser-osx-${env}`;
    }
    if ( platform === LINUX ) {
        return `safe-browser-linux`;
        // return `safe-browser-linux-${env}`;
    }
    if ( platform === WINDOWS ) {
        return `safe-browser-win`;
        // return `safe-browser-win-${env}`;
    }
};

const LOGS = 'log.toml';

const buildConfig = {
    appId: 'maidsafe.safe.browser.app',
    artifactName: `safe-browser-v\${version}-\${os}-x64.\${ext}`,
    afterPack: './afterPack.js',
    afterSign: './afterSignHook.js',
    productName: 'SAFE Browser',
    files: [
        'app/dist/',
        'locales',
        'app/locales',
        'app/app.html',
        'app/bg.html',
        'app/background.prod.js',
        'app/background.prod.js.map',
        'app/webPreload.prod.js',
        'app/webPreload.prod.js.map',
        'app/main.prod.js',
        'app/main.prod.js.map',
        'package.json',
        'app/extensions/safe/defaultNewSite/index.html'
    ],
    extraFiles: [
        {
            from: 'resources/log.toml',
            to: `${logFilePath()}`
        }
    ],
    extraResources: [
        {
            from: 'resources/log.toml',
            to: 'log.toml'
        },
        {
            from: 'resources/favicon.ico',
            to: 'favicon.ico'
        },
        {
            from: 'resources/locales',
            to: 'locales'
        },
        {
            from: 'node_modules/nessie-ui/dist/styles.css',
            to: 'nessie-styles.css'
        }
    ],
    protocols: {
        name: 'SAFE Network URL',
        schemes: ['safe']
    },
    dmg: {
        contents: [
            {
                x: 130,
                y: 220
            },
            {
                x: 410,
                y: 220,
                type: 'link',
                path: '/Applications'
            }
        ],
        artifactName: `${RELEASE_PACKAGE_NAME}.\${ext}`
    },
    win: {
        target: ['nsis', 'msi']
    },
    nsis: {
        artifactName: `${RELEASE_PACKAGE_NAME}.\${ext}`
    },
    linux: {
        target: ['AppImage', 'zip'],
        category: 'Development'
    },
    appImage: {
        artifactName: `${RELEASE_PACKAGE_NAME}.\${ext}`
    },
    mac: {
        target: ['dmg', 'pkg', 'zip'],
        hardenedRuntime: true,
        entitlements: 'resources/entitlements.mac.plist',
        entitlementsInherit: 'resources/entitlements.mac.plist'
    },
    directories: {
        buildResources: 'resources',
        output: 'release'
    },
    publish: {
        provider: 's3',
        bucket: 'safe-browser',
        path: `${publishedFilePath()}`
    }
};

// commented out for when we need to build dev
/*
if ( isBuildingDev ) {
    buildConfig.extraResources.push( {
        from: 'resources/startAsMock',
        to: 'startAsMock'
    } );
}
*/

module.exports = buildConfig;
