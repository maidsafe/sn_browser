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
import { app, BrowserWindow, protocol, ipcMain } from 'electron';
import logger from 'logger';
import { isRunningUnpacked, isRunningDevelopment, isRunningPackaged, PROTOCOLS } from 'appConstants';
import { parse as parseURL } from 'url';
import pkg from 'appPackage';

import openWindow from './openWindow';
import loadExtensions from './extensions';
import configureStore from './store/configureStore';
import handleCommands from './commandHandling';
import { setupWebAPIs } from './webAPIs';

// TODO: This should be handled in an extensible fashion
import { handleOpenUrl } from './extensions/safe/network';
import { addTab, closeActiveTab } from 'actions/tabs_actions';
import { setupServerVars, startServer } from './server';


const initialState = {};

// Add middleware from extensions here.
const loadMiddlewarePackages = [];

const store = configureStore( initialState, loadMiddlewarePackages );

// renderer error notifications
ipcMain.on('errorInWindow', function(event, data){
    logger.error(data)
});

const mainWindow = null;

const handleSafeUrls = ( url ) =>
{
    // TODO. Queue incase of not started.
    handleOpenUrl( url );

    const parsedUrl = parseURL( url );

    // TODO: Use constants // 'shouldOpenUrl...'
    if ( parsedUrl.protocol === 'safe:' )
    {
        store.dispatch( addTab( { url, isActiveTab: true } ) );
    }
};

// Register all schemes from package.json
protocol.registerStandardSchemes( pkg.build.protocols.schemes, { secure: true } );

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


const parseSafeUri = function ( uri )
{
    return uri.replace( '//', '' ).replace( '==/', '==' );
};

const shouldQuit = app.makeSingleInstance( ( commandLine ) =>
{
    if ( commandLine.length >= 2 && commandLine[1] )
    {
        handleSafeUrls( parseSafeUri( commandLine[1] ) );
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

    if ( isRunningUnpacked || process.env.DEBUG_PROD === 'true' )
    {
        await installExtensions();
    }

    if ( ( process.platform === 'linux' ) || ( process.platform === 'win32' ) )
    {
        const uriArg = process.argv[process.argv.length - 1];
        if ( process.argv.length >= 2 && uriArg && ( uriArg.indexOf( 'safe' ) === 0 ) )
        {
            handleSafeUrls( parseSafeUri( uriArg ) );
        }
    }

    if ( shouldQuit )
    {
        app.exit();
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
    handleSafeUrls( url );
    // osx only for the still open but all windows closed state
    if ( process.platform === 'darwin' && global.macAllWindowsClosed )
    {
        if ( url.startsWith( 'safe-' ) )
        {
            openWindow( store );
        }
    }
} );


/**
 * Add event listeners...
 */

app.on( 'window-all-closed', () =>
{
    global.macAllWindowsClosed = true;

    // HACK: Fix this so we can have OSX convention for closing windows.
    // Respect the OSX convention of having the application in memory even
    // after all windows have been closed
    if ( process.platform !== 'darwin' )
    {
        app.quit();
    }
} );
