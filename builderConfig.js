const env = process.env.NODE_ENV || 'production';
const isBuildingDev = env.startsWith( 'dev' );

const path = require( 'path' );
const fs = require( 'fs-extra' );

const RELEASE_FOLDER_NAME = require( './releaseName' );

const pkg = require( './package.json' );

const targetDir = path.resolve( __dirname, 'release' );

const { platform } = process;
const OSX = 'darwin';
const LINUX = 'linux';
const WINDOWS = 'win32';

// let PLATFORM_NAME;
let CONTAINING_FOLDER;

// eslint-disable-next-line consistent-return
const crustFilePath = () => {
    if ( platform === OSX ) {
        return '../../Frameworks/SAFE Browser Helper.app/Contents/MacOS/SAFE Browser Helper.crust.config';
    }
    if ( platform === LINUX ) {
        return 'safe-browser.crust.config';
    }
    if ( platform === WINDOWS ) {
        return 'SAFE Browser.crust.config';
    }
};

// eslint-disable-next-line consistent-return
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

const LOGS = 'log.toml';

const buildConfig = {
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
        'package.json'
    ],
    extraFiles: [
        {
            from: 'resources/crust.config',
            to: `${crustFilePath()}`
        },
        {
            from: 'resources/log.toml',
            to: `${logFilePath()}`
        }
    ],
    extraResources: [
        {
            from: 'resources/favicon.ico',
            to: 'favicon.ico'
        },
        {
            from: 'resources/PreloadDevVault',
            to: 'PreloadDevVault'
        },
        {
            from: 'resources/locales',
            to: 'locales'
        },
        {
            from: 'app/extensions/safe/dist',
            to: 'extensions/safe/dist'
        },
        {
            from: 'app/extensions/safe/iconfont',
            to: 'extensions/safe/iconfont'
        },
        {
            from: 'app/extensions/safe/auth-web-app/dist',
            to: 'extensions/safe/auth-web-app/dist'
        },
        {
            from: 'node_modules/nessie-ui/dist/styles.css',
            to: 'nessie-styles.css'
        }
    ],
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
        artifactName: `\${name}-\${version}-\${arch}-${env}.\${ext}`
    },
    protocols: {
        name: 'SAFE Network URL',
        schemes: ['safe', 'safe-auth']
    },
    win: {
        target: ['nsis', 'zip'],
        extraFiles: [
            {
                from: 'resources/crust.config',
                to: `\${productName}.crust.config`
            }
        ]
    },
    nsis: {
        artifactName: `\${name}-\${version}-\${arch}-${env}.\${ext}`
    },
    linux: {
        target: ['AppImage', 'zip'],
        category: 'Development',
        extraFiles: [
            {
                from: 'resources/crust.config',
                to: `\${name}.crust.config`
            }
        ]
    },
    appImage: {
        artifactName: `\${name}-\${version}-\${arch}-${env}.\${ext}`
    },
    target: ['dmg', 'pkg', 'zip'],
    directories: {
        buildResources: 'resources',
        output: 'release'
    },
    publish: {
        provider: 'github',
        owner: 'manavbp',
        repo: 'safe_browser'
    }
};

if ( isBuildingDev ) {
    buildConfig.extraResources.push( {
        from: 'resources/startAsMock',
        to: 'startAsMock'
    } );
}

module.exports = buildConfig;
