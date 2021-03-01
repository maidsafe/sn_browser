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
import { enforceMacOSAppLocation } from 'electron-util';
import { app, ipcMain, BrowserWindow } from 'electron';

import { setupBackground } from './setupBackground';
import { openWindow } from './openWindow';
import { configureStore } from './store/configureStore';
import { AppUpdater } from './autoUpdate';

import {
    ignoreAppLocation,
    isRunningUnpacked,
    isRunningDebug,
    isHandlingSilentUpdate,
    isRunningTestCafeProcess,
    isRunningPackaged,
    isCI,
    CONFIG,
} from '$Constants';
// eslint-disable-next-line import/extensions
import pkg from '$Package';
import { getMostRecentlyActiveWindow } from '$Utils/getMostRecentlyActiveWindow';
import { onReceiveUrl, preAppLoad, onAppReady } from '$Extensions/mainProcess';
import { logger } from '$Logger';

const initialState = {};
const store = configureStore( initialState );
const browserUpdater = new AppUpdater( store );

app.allowRendererProcessReuse = false;

logger.info( 'Main process starting.' );

// global.mainProcessStore = store;

// Needed for windows w/ SAFE browser app login
ipcMain.on( 'open', ( event, data ) => {
    logger.info( 'Opening link in system via open.' );
    open( data );
} );

let mainWindow: BrowserWindow;

// Do any pre app extension work
preAppLoad( store );

if ( isRunningPackaged ) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires,global-require
    const sourceMapSupport = require( 'source-map-support' );
    sourceMapSupport.install();
}

if (
    ( !isCI && !isRunningTestCafeProcess && isRunningUnpacked ) ||
  isRunningDebug
) {
    /* eslint-disable @typescript-eslint/no-var-requires,global-require */
    require( 'electron-debug' )();
    const p = path.join( __dirname, '..', 'app', 'node_modules' );
    require( 'module' ).globalPaths.push( p );
    /* eslint-enable @typescript-eslint/no-var-requires,global-require */
}

const installExtensions = async (): Promise<void> => {
    if ( isCI ) return;

    logger.info( 'Installing devtools extensions' );
    // eslint-disable-next-line @typescript-eslint/no-var-requires,global-require
    const installer = require( 'electron-devtools-installer' );
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
    const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

    await Promise.all(
        extensions.map( ( name ) => installer.default( installer[name], forceDownload ) )
    ).catch( console.log );
};

app.on( 'ready', async () => {
    if ( !ignoreAppLocation && !isRunningTestCafeProcess ) {
        enforceMacOSAppLocation();
    }

    const obtainedInstanceLock = app.requestSingleInstanceLock();

    if ( !obtainedInstanceLock ) {
        logger.info(
            'Another process already exists. Cannot obtain instance lock. Quitting.'
        );
        app.quit();
    } else {
        app.on( 'second-instance', ( event, commandLine ) => {
            const uri = commandLine[commandLine.length - 1];

            // TODO: trigger window/focus on current active....
            const target = getMostRecentlyActiveWindow( store );
            // Someone tried to run a second instance, we should focus our window
            if ( target ) {
                if ( target.isMinimized() ) target.restore();
                target.focus();
            }

            if ( commandLine.length >= 2 && uri ) {
                onReceiveUrl( store, uri );
            }

            if ( commandLine.includes( '--trigger-update' ) ) {
                browserUpdater.checkForUpdate();
            }
        } );
    }

    logger.info( 'App Ready' );

    onAppReady( store );
    if ( ( !isRunningTestCafeProcess && isRunningUnpacked ) || isRunningDebug ) {
        await installExtensions();
    }

    if ( process.platform === 'linux' || process.platform === 'win32' ) {
        const uriArgument = process.argv[process.argv.length - 1];
        if (
            process.argv.length >= 2 &&
      uriArgument &&
      uriArgument.indexOf( 'safe' ) === 0
        ) {
            onReceiveUrl( store, uriArgument );

            if ( mainWindow ) {
                mainWindow.show();
            }
        }
    }

    if ( !isHandlingSilentUpdate ) {
        if ( app.dock ) {
            app.dock.show();
        }

        await setupBackground();

        mainWindow = openWindow( store );
    }

    if ( !isRunningTestCafeProcess && !isRunningUnpacked ) {
        browserUpdater.checkForUpdate();
    }
} );

app.on( 'open-url', ( error, url ) => {
    const target = getMostRecentlyActiveWindow( store );

    if ( target ) {
        if ( target.isMinimized() ) target.restore();
        target.focus();
    }

    onReceiveUrl( store, url );
} );

/**
 * Add event listeners...
 */

app.on( 'window-all-closed', () => {
    logger.info( 'All Windows Closed!' );
    app.dock.hide(); // hide the icon

    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    global.macAllWindowsClosed = true;

    // HACK: Fix this so we can have OSX convention for closing windows.
    // Respect the OSX convention of having the application in memory even
    // after all windows have been closed
    if ( process.platform !== 'darwin' ) {
        app.quit();
    }
} );
