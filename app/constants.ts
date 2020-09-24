import path from 'path';
import fs from 'fs-extra';
import { remote, app } from 'electron';
import getPort from 'get-port';

// eslint-disable-next-line import/extensions
import { CLASSES, GET_DOM_EL_CLASS } from './constants/classes';

import pkg from '$Package';

export const { platform } = process;

export { CLASSES, GET_DOM_EL_CLASS };

const allPassedArguments = process.argv;

let shouldRunMockNetwork = fs.existsSync(
    path.resolve( __dirname, '../..', 'startAsMock' )
);

let hasDebugFlag = false;
let triggerUpdate = false;
let shouldBuildTestPackages = false;

export const isRunningTestCafeProcess =
  remote && remote.getGlobal
      ? remote.getGlobal( 'isRunningTestCafeProcess' )
      : process.env.TEST_CAFE || false;

export const isRunningSpectronTestProcess =
  remote && remote.getGlobal
      ? remote.getGlobal( 'isRunningSpectronTestProcess' )
      : process.env.SPECTRON_TEST || false;

const appIsPackaged = app ? app.isPackaged : false;

export const isRunningPackaged =
  remote && remote.getGlobal
      ? remote.getGlobal( 'isRunningPackaged' )
      : appIsPackaged;

export const isRunningUnpacked = !isRunningPackaged;
export const isRunningSpectronTestProcessingPackagedApp =
  remote && remote.getGlobal
      ? remote.getGlobal( 'isRunningSpectronTestProcessingPackagedApp' )
      : isRunningSpectronTestProcess && isRunningPackaged;

export const inBgProcess = !!(
    typeof document !== 'undefined' && document.title.startsWith( 'Background' )
);
// override for spectron dev mode
if (
    isRunningSpectronTestProcess &&
  !isRunningSpectronTestProcessingPackagedApp
) {
    shouldRunMockNetwork = true;
}

if ( allPassedArguments.includes( '--mock' ) ) {
    shouldRunMockNetwork = true;
}

if ( allPassedArguments.includes( '--live' ) ) {
    shouldRunMockNetwork = false;
}

if ( allPassedArguments.includes( '--debug' ) ) {
    hasDebugFlag = true;
}

if ( allPassedArguments.includes( '--trigger-update' ) ) {
    triggerUpdate = true;
}

if (
    allPassedArguments.includes( `--testPackages` ) ||
  process.env.TEST_PACKAGES
) {
    shouldBuildTestPackages = true;
}

export const useTestPackages = shouldBuildTestPackages;
let testCafeUrlString = null;

if ( allPassedArguments.includes( '--testCafeURL' ) ) {
    const cafeUrlIndex =
    allPassedArguments.findIndex(
        ( argument ): boolean => argument === '--testCafeURL'
    ) + 1;

    testCafeUrlString = allPassedArguments[cafeUrlIndex];
}

export const testCafeURL = testCafeUrlString;

let ignoreAppLocationMacOs = false;

if ( allPassedArguments.includes( '--ignoreAppLocation' ) ) {
    ignoreAppLocationMacOs = true;
}

export const ignoreAppLocation = ignoreAppLocationMacOs;

let forcedPort;
if ( allPassedArguments.includes( '--port' ) ) {
    const index = allPassedArguments.indexOf( '--port' );

    forcedPort = allPassedArguments[index + 1];
}

export const shouldStartAsMockFromFlagsOrPackage = shouldRunMockNetwork;

// eslint-disable-next-line unicorn/prevent-abbreviations
export const env = shouldStartAsMockFromFlagsOrPackage
    ? 'development'
    : process.env.NODE_ENV || 'production';

export const isRunningDevelopment = env.startsWith( 'dev' );

export const isCI =
  remote && remote.getGlobal ? remote.getGlobal( 'isCI' ) : process.env.CI;
export const travisOS = process.env.TRAVIS_OS_NAME || '';
// other considerations?
export const isHot = process.env.HOT || 0;

// const startAsMockNetwork = shouldStartAsMockFromFlagsOrPackage;
const startAsMockNetwork = shouldStartAsMockFromFlagsOrPackage;

// only to be used for inital store setting in main process. Not guaranteed correct for renderers.
export const startedRunningMock =
  remote && remote.getGlobal
      ? remote.getGlobal( 'startedRunningMock' )
      : startAsMockNetwork || env.startsWith( 'dev' );
export const startedRunningProduction = !startedRunningMock;
// eslint-disable-next-line unicorn/prevent-abbreviations
export const isRunningNodeEnvTest = env.startsWith( 'test' );
export const isRunningDebug = hasDebugFlag || isRunningSpectronTestProcess;
export const isHandlingSilentUpdate = triggerUpdate;
export const inRendererProcess = typeof window !== 'undefined';
export const inMainProcess = typeof remote === 'undefined';
const currentWindow =
  remote && remote.getCurrentWindow ? remote.getCurrentWindow() : undefined;
export const currentWindowId = currentWindow ? currentWindow.id : undefined;

export const inTabProcess = inRendererProcess && !currentWindow;

// Set global for tab preload.
// Adds app folder for asar packaging (space before app is important).
const preloadLocation = isRunningUnpacked ? '' : '../';

let safeNodeAppPathModifier = '..';

if ( isRunningPackaged && !isRunningNodeEnvTest ) {
    safeNodeAppPathModifier = '../../safe_nodejs/';
}

// HACK: Prevent jest dying due to no electron globals
const safeNodeAppPath = () => {
    if ( !remote || !remote.app ) {
        return '';
    }

    return isRunningUnpacked
        ? [remote.process.execPath, `${remote.getGlobal( 'appDir' )}/main.prod.js`]
        : [remote.app.getPath( 'exe' )];
};

export const I18N_CONFIG = {
    locales: ['en'],
    directory: path.resolve( __dirname, 'locales' ),
    objectNotation: true
};

export const PROTOCOLS = {
    SAFE: 'safe',
    SAFE_LOGS: 'safe-logs',
    INTERNAL_PAGES: 'safe-browser'
};

export const INTERNAL_PAGES = {
    HISTORY: 'history',
    BOOKMARKS: 'bookmarks'
};

const getRandomPort = async () => {
    let port = await getPort();
    if ( forcedPort ) {
        port = forcedPort;
    }

    global.port = port;

    return port;
};

export const CONFIG = {
    PORT: remote ? remote.getGlobal( 'port' ) : getRandomPort(),
    SAFE_PARTITION: 'persist:safe-tab',
    APP_HTML_PATH: path.resolve( __dirname, './app.html' ),
    DATE_FORMAT: 'h:MM-mmm dd',
    NET_STATUS_CONNECTED: 'Connected',
    STATE_KEY: 'safeBrowserState',
    BROWSER_TYPE_TAG: 8467,
    PRELOADED_MOCK_NODE_PATH: path.join( __dirname, '..', 'PreloadDevNode' )
};

if ( inMainProcess ) {
    const developmentPort = process.env.PORT || 1212;

    global.isRunningPackaged = isRunningPackaged;
    global.preloadFile = `file://${__dirname}/webPreload.prod.js`;
    global.appDir = __dirname;
    global.isCI = isCI;
    global.startedRunningMock = startedRunningMock;
    global.shouldStartAsMockFromFlagsOrPackage = shouldStartAsMockFromFlagsOrPackage;
    global.SAFE_NODE_LIB_PATH = CONFIG.SAFE_NODE_LIB_PATH;
    global.isRunningSpectronTestProcessingPackagedApp = isRunningSpectronTestProcessingPackagedApp;
    global.isRunningSpectronTestProcess = isRunningSpectronTestProcess;
    global.isRunningTestCafeProcess = isRunningTestCafeProcess;
}

// if( isRunningUnpacked )
// {
//     CONFIG.CONFIG_PATH = path.resolve( __dirname, '../resources' );
// }

const appInfo = {
    info: {
        id: pkg.identifier,
        scope: null,
        name: pkg.productName,
        vendor: pkg.author.name,
        customExecPath: safeNodeAppPath()
    },
    opts: {
        own_container: true
    },
    permissions: {
        _public: ['Read', 'Insert', 'Update', 'Delete']
    // _publicNames : ['Read', 'Insert', 'Update', 'Delete']
    }
};
//
// // OSX: Add bundle for electron in dev mode
// if ( isRunningUnpacked && process.platform === 'darwin' ) {
//     appInfo.info.bundle = 'com.github.electron';
// } else if ( process.platform === 'darwin' ) {
//     appInfo.info.bundle = 'com.electron.safe-browser';
// }

export const APP_INFO = appInfo;
