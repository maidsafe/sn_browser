const pkg = require( './package.json' );

const { platform } = process;
const allPassedArguments = process.argv;
const OSX = 'darwin';
const LINUX = 'linux';
const WINDOWS = 'win32';

// eslint-disable-next-line consistent-return, @typescript-eslint/explicit-function-return-type
const publishedFilePath = () => {
    const { name } = pkg;

    if ( platform === LINUX ) {
        return `${name}-linux`;
    }
    if ( platform === WINDOWS ) {
        return `${name}-win`;
    }

    return `${name}-mac`;
};

// eslint-disable-next-line consistent-return, @typescript-eslint/explicit-function-return-type
const getProductName = () => {
    let { productName } = pkg;

    if ( pkg.version.includes( '-alpha' ) ) {
        productName = `${productName} Alpha`;
    }

    if ( pkg.version.includes( '-beta' ) ) {
        productName = `${productName} Beta`;
    }

    return productName;
};

const buildConfig = {
    appId: 'com.electron.safe-browser',
    generateUpdatesFilesForAllChannels: true,
    artifactName: `${pkg.name}-v\${version}-\${os}-x64.\${ext}`,
    afterPack: './afterPack.js',
    afterSign: './afterSign.js',
    productName: getProductName(),
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
    extraResources: [
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
        ]
    },
    win: {
        target: ['nsis', 'msi']
    },

    linux: {
        target: ['AppImage', 'zip'],
        category: 'Development'
    },
    mac: {
        target: ['dmg', 'pkg', 'zip'],
        hardenedRuntime: true,
        entitlements: 'resources/entitlements.mac.plist',
        entitlementsInherit: 'resources/entitlements.mac.plist',
        extendInfo: {
            // hide dock icon by default for auto updating
            LSUIElement: 1
        }
    },
    directories: {
        buildResources: 'resources',
        output: 'release'
    },
    publish: {
        provider: 's3',
        bucket: 'safe-browser',
        path: publishedFilePath()
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
