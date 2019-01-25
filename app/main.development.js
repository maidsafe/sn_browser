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

import opn from 'opn';
import os from 'os';
import path from 'path';
import fs from 'fs';

import { app, protocol, ipcMain, shell } from 'electron';
import logger from 'logger';

import {
    isRunningUnpacked,
    isRunningDebug,
    isRunningSpectronTestProcess,
    isRunningPackaged,
    isCI,
    travisOS,
    I18N_CONFIG,
    PROTOCOLS,
    CONFIG
} from 'appConstants';

import pkg from 'appPackage';

import setupBackground from './setupBackground';

import openWindow from './openWindow';
import { configureStore } from './store/configureStore';
import { onReceiveUrl, preAppLoad, onAppReady } from 'extensions';

// import { createSafeInfoWindow, createTray } from './setupTray';

const initialState = {};
let bgProcessWindow = null;

// Add middleware from extensions here.
const loadMiddlewarePackages = [];

const store = configureStore( initialState, loadMiddlewarePackages );

logger.info( 'Main process starting.' );

global.mainProcessStore = store;

// renderer error notifications
ipcMain.on( 'errorInWindow', ( event, data ) =>
{
    logger.error( data );
} );


// Needed for windows w/ SAFE browser app login
ipcMain.on( 'opn', ( event, data ) =>
{
    logger.info( 'Opening link in system via opn.' );
    shell.openExternal( data );
} );


let mainWindow = null;

// Do any pre app extension work
preAppLoad();

// Apply MockVault if wanted for prealod
if ( process.argv.includes( '--preload' ) )
{
    try
    {
        const data = fs.readFileSync( CONFIG.PRELOADED_MOCK_VAULT_PATH );

        fs.writeFileSync( path.join( os.tmpdir(), 'MockVault' ), data );
    }
    catch ( error )
    {
        logger.error( 'Error preloading MockVault' );
    }
}

protocol.registerStandardSchemes( pkg.build.protocols.schemes, { secure: true } );

if ( isRunningPackaged )
{
    const sourceMapSupport = require( 'source-map-support' );
    sourceMapSupport.install();
}

if ( !isCI && !isRunningSpectronTestProcess && isRunningUnpacked || isRunningDebug )
{
    require( 'electron-debug' )();
    const path = require( 'path' );
    const p = path.join( __dirname, '..', 'app', 'node_modules' );
    require( 'module' ).globalPaths.push( p );
}

const installExtensions = async () =>
{
    if ( isCI ) return;

    logger.verbose( 'Installing devtools extensions' );
    const installer = require( 'electron-devtools-installer' );
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
    const extensions = [
        'REACT_DEVELOPER_TOOLS',
        'REDUX_DEVTOOLS'
    ];

    return Promise
        .all( extensions.map( name => installer.default( installer[name], forceDownload ) ) )
        .catch( console.log );
};


const shouldQuit = app.makeSingleInstance( commandLine =>
{
    // We expect the URI to be the last argument
    const uri = commandLine[commandLine.length - 1];

    if ( commandLine.length >= 2 && uri )
    {
        onReceiveUrl( store, uri );
    }

    // Someone tried to run a second instance, we should focus our window
    if ( mainWindow )
    {
        if ( mainWindow.isMinimized() ) mainWindow.restore();
        mainWindow.focus();
    }
} );

app.on( 'ready', async () =>
{
    if ( shouldQuit )
    {
        console.log( 'This instance should quit. Ciao!' );
        app.exit();
        return;
    }


    logger.info( 'App Ready' );

    onAppReady( store );
    if ( !isRunningSpectronTestProcess && isRunningUnpacked || isRunningDebug )
    {
        await installExtensions();
    }

    if ( ( process.platform === 'linux' ) || ( process.platform === 'win32' ) )
    {
        const uriArg = process.argv[process.argv.length - 1];
        if ( process.argv.length >= 2 && uriArg && ( uriArg.indexOf( 'safe' ) === 0 ) )
        {
            onReceiveUrl( store, uriArg );

            if ( mainWindow )
            {
                mainWindow.show();
            }
        }
    }

    mainWindow = openWindow( store );

    // TODO: Reenable for adding Safe Network popup
    // createTray();
    // createSafeInfoWindow();

    bgProcessWindow = await setupBackground( );
} );

app.on( 'open-url', ( e, url ) =>
{
    onReceiveUrl( store, url );

    if ( mainWindow )
    {
        mainWindow.show();
    }
} );


/**
 * Add event listeners...
 */

app.on( 'window-all-closed', () =>
{
    logger.verbose( 'All Windows Closed!' );
    app.dock.hide(); // hide the icon

    global.macAllWindowsClosed = true;

    // HACK: Fix this so we can have OSX convention for closing windows.
    // Respect the OSX convention of having the application in memory even
    // after all windows have been closed
    if ( process.platform !== 'darwin' )
    {
        app.quit();
    }
} );
