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
import { app, BrowserWindow, protocol } from 'electron';
import logger from 'logger';
import { isRunningUnpacked, isRunningDevelopment, isRunningPackaged } from 'constants';

import openWindow from './openWindow';
import loadExtensions from './extensions';
import configureStore from './store/configureStore';
import handleCommands from './commandHandling';
import { setupWebAPIs } from './webAPIs';
// TODO: This should be handled in an extensible fashion
import { handleOpenUrl } from './extensions/safe/network';

import { setupServerVars, startServer } from './server';


const initialState = {};

// add middleware; perhaps from a plugin?
const loadMiddlewarePackages = [];
const store = configureStore( initialState, loadMiddlewarePackages );

import { mainSync } from './store/electronStoreSyncer';

const mainWindow = null;
mainSync( store );

// TODO: Register schemes from extension
protocol.registerStandardSchemes(['safe', 'safe-auth'], {secure: true});

if ( isRunningPackaged )
{
    const sourceMapSupport = require( 'source-map-support' );
    sourceMapSupport.install();
}

if ( isRunningUnpacked || process.env.DEBUG_PROD === 'true' )
{
    require( 'electron-debug' )();
    const path = require( 'path' );
    const p = path.join( __dirname, '..', 'app', 'node_modules' );
    require( 'module' ).globalPaths.push( p );
}

const installExtensions = async () =>
{
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


/**
 * Add event listeners...
 */

app.on( 'window-all-closed', () =>
{
    logger.info( 'All windows closed' );

    // Respect the OSX convention of having the application in memory even
    // after all windows have been closed
    if ( process.platform !== 'darwin' )
    {
        app.exit();
    }
} );


const parseSafeUri = function ( uri )
{
    return uri.replace( '//', '' ).replace( '==/', '==' );
};

const shouldQuit = app.makeSingleInstance( ( commandLine ) =>
{
    if ( commandLine.length >= 2 && commandLine[1] )
    {
        // sendResponse( commandLine[1] );

        handleOpenUrl( parseSafeUri( commandLine[1] ) );

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
    logger.info( 'App Ready' );

    if ( isRunningDevelopment || process.env.DEBUG_PROD === 'true' )
    {
        await installExtensions();
    }

    if ( ( process.platform === 'linux' ) || ( process.platform === 'win32' ) )
    {
        const uriArg = process.argv[process.argv.length - 1];
        if ( process.argv.length >= 2 && uriArg && ( uriArg.indexOf( 'safe' ) === 0 ) )
        {
            logger.info( 'received safe uriii', uriArg );
            handleOpenUrl( parseSafeUri( uriArg ) );
        }
    }

    if ( shouldQuit )
    {
        app.quit();
    }


    const server = await setupServerVars();

    openWindow( store );
    loadExtensions( server, store );
    startServer( server );

    setupWebAPIs();

    handleCommands( store );
} );

app.on( 'open-url', ( e, url ) =>
{
    // TODO. Queue incase of not started.
    // Also parse out and deal with safe:// urls and auth response etc.
    handleOpenUrl( parseSafeUri(url) );
} );
