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
import { app, BrowserWindow } from 'electron';
import logger from 'logger';

import openWindow from './openWindow';
import loadCorePackages from './corePackageLoader';
import configureStore from './store/configureStore';
import handleCommands from './commandHandling';

const initialState = {};
// add middleware; perhaps from a plugin?
const loadMiddlewarePackages = [];
const store = configureStore( initialState, loadMiddlewarePackages );

// TODO: Why/how is this breaking e2e tests?
import { mainSync } from './store/electronStoreSyncer';

let mainWindow = null;
mainSync( store );

if ( process.env.NODE_ENV === 'production' )
{
    const sourceMapSupport = require( 'source-map-support' );
    sourceMapSupport.install();
}

if ( process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true' )
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
        app.quit();
    }
} );


app.on( 'ready', async () =>
{
    logger.info( 'App Ready' );

    if ( process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true' )
    {
        await installExtensions();
    }

    openWindow(store);

    loadCorePackages( store );
    handleCommands( store );
} );
