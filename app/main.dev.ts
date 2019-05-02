/* eslint global-require: 1, flowtype-errors/show-errors: 0 */
/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 *
 * @flow
 */

import open from 'open';
import os from 'os';
import path from 'path';
import fs from 'fs';

import { app, protocol, ipcMain, BrowserWindow } from 'electron';
import { logger } from '$Logger';

import {
    isRunningUnpacked,
    isRunningDebug,
    isRunningSpectronTestProcess,
    isRunningPackaged,
    isCI,
    CONFIG
} from '$Constants';

import pkg from '$Package';

import { setupBackground } from './setupBackground';

import { openWindow } from './openWindow';
import { configureStore } from './store/configureStore';
import { onReceiveUrl, preAppLoad, onAppReady } from '$Extensions';

// import { createSafeInfoWindow, createTray } from './setupTray';

const initialState = {};
const store = configureStore( initialState );

logger.info( 'Main process starting.' );

global.mainProcessStore = store;

// Needed for windows w/ SAFE browser app login
ipcMain.on( 'open', ( event, data ) => {
    logger.info( 'Opening link in system via open.' );
    open( data );
} );

let mainWindow: BrowserWindow;

// Do any pre app extension work
preAppLoad();

// Apply MockVault if wanted for prealod
if ( process.argv.includes( '--preload' ) ) {
    try {
        const data = fs.readFileSync( CONFIG.PRELOADED_MOCK_VAULT_PATH );

        fs.writeFileSync( path.join( os.tmpdir(), 'MockVault' ), data );
    } catch ( error ) {
        logger.error( 'Error preloading MockVault' );
    }
}

protocol.registerStandardSchemes( pkg.build.protocols.schemes, { secure: true } );

if ( isRunningPackaged ) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const sourceMapSupport = require( 'source-map-support' );
    sourceMapSupport.install();
}

if (
    ( !isCI && !isRunningSpectronTestProcess && isRunningUnpacked ) ||
  isRunningDebug
) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require( 'electron-debug' )();
    const p = path.join( __dirname, '..', 'app', 'node_modules' );
    require( 'module' ).globalPaths.push( p );
}

const installExtensions = async (): Promise<void> => {
    if ( isCI ) return;

    logger.info( 'Installing devtools extensions' );
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const installer = require( 'electron-devtools-installer' );
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
    const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

    await Promise.all(
        extensions.map( ( name ) => installer.default( installer[name], forceDownload ) )
    ).catch( console.log );
};

app.on( 'ready', async () => {
    const obtainedInstanceLock = app.requestSingleInstanceLock();

    if ( !obtainedInstanceLock ) {
        console.error( 'Unable to obtain instance lock. Quitting...' );
        app.quit();
    } else {
        app.on( 'second-instance', ( event, commandLine ) => {
            const uri = commandLine[commandLine.length - 1];

            if ( commandLine.length >= 2 && uri ) {
                onReceiveUrl( store, uri );
            }

            // Someone tried to run a second instance, we should focus our window
            if ( mainWindow ) {
                if ( mainWindow.isMinimized() ) mainWindow.restore();
                mainWindow.focus();
            }
        } );
    }

    logger.info( 'App Ready' );

    onAppReady( store );
    if ( ( !isRunningSpectronTestProcess && isRunningUnpacked ) || isRunningDebug ) {
        await installExtensions();
    }

    if ( process.platform === 'linux' || process.platform === 'win32' ) {
        const uriArg = process.argv[process.argv.length - 1];
        if ( process.argv.length >= 2 && uriArg && uriArg.indexOf( 'safe' ) === 0 ) {
            onReceiveUrl( store, uriArg );

            if ( mainWindow ) {
                mainWindow.show();
            }
        }
    }

    await setupBackground();

    mainWindow = openWindow( store );
} );

app.on( 'open-url', ( e, url ) => {
    onReceiveUrl( store, url );

    if ( mainWindow ) {
        mainWindow.show();
    }
} );

/**
 * Add event listeners...
 */

app.on( 'window-all-closed', () => {
    logger.info( 'All Windows Closed!' );
    app.dock.hide(); // hide the icon

    global.macAllWindowsClosed = true;

    // HACK: Fix this so we can have OSX convention for closing windows.
    // Respect the OSX convention of having the application in memory even
    // after all windows have been closed
    if ( process.platform !== 'darwin' ) {
        app.quit();
    }
} );
