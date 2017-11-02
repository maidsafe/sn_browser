/* eslint global-require: 1, flowtype-errors/show-errors: 0 */
// @flow
import { app, BrowserWindow, BrowserView, ipcMain, webContents } from 'electron';
import logger from 'logger';

import MenuBuilder from './menu';
import windowStateKeeper from 'electron-window-state';
import loadCorePackages from './corePackageLoader';
import configureStore from './store/configureStore';
import { mainSync } from './store/electronStoreSyncer';
import handleCommands from './commandHandling';
// here we would load middlewares, eg. nonsense
const loadMiddlewarePackages = [];

const initialState = {};
const store = configureStore( initialState, loadMiddlewarePackages );
mainSync( store );

let mainWindow = null;

function getNewWindowPosition( mainWindowState )
{
    //for both x and y, we start at 0
    const defaultWindowPosition = 0;

    const noOfBrowserWindows   = BrowserWindow.getAllWindows().length;
    const windowCascadeSpacing = 20;

    let newWindowPosition;

    if ( noOfBrowserWindows === 0 )
    {
        newWindowPosition = { x: mainWindowState.x, y: mainWindowState.y };
    }
    else
    {
        newWindowPosition =
        {   x : defaultWindowPosition + ( windowCascadeSpacing * noOfBrowserWindows ),
            y : defaultWindowPosition + ( windowCascadeSpacing * noOfBrowserWindows )
        };
    }

    return newWindowPosition;
}

export default function openWindow()
{
    const mainWindowState = windowStateKeeper( {
        defaultWidth  : 2048,
        defaultHeight : 1024
    } );

    const newWindowPosition = getNewWindowPosition( mainWindowState );

    mainWindow = new BrowserWindow( {
        show              : false,
        x                 : newWindowPosition.x,
        y                 : newWindowPosition.y,
        width             : mainWindowState.width,
        height            : mainWindowState.height,
        titleBarStyle     : 'hidden-inset',
        'standard-window' : false,

    } );

    mainWindowState.manage( mainWindow );

    mainWindow.loadURL( `file://${__dirname}/app.html` );

    // @TODO: Use 'ready-to-show' event
    //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event

    mainWindow.webContents.on( 'did-finish-load', () =>
    {
        if ( !mainWindow )
        {
            throw new Error( '"mainWindow" is not defined' );
        }

        // before show lets load state
        mainWindow.show();
        mainWindow.focus();


    } );

    let filter = {
      urls: ['*://*' ]

    }

    // mainWindow.webContents.session.webRequest.onBeforeRequest(filter, (details, callback) =>
    // {
    //
    //     // console.log("DETAIILLSSS", details);
    // //   if( ! global.browserStatus.safeModeOn || isLocal( details ) )
    // //   {
    //     callback({});
    // //   }
    // //   else if( details.url.indexOf('http') > -1 )
    // //   {
    // //     // FIXME shankar - temp handling for opening external links
    // //     // if (details.url.indexOf('safe_proxy.pac') !== -1) {
    // //     //   return callback({ cancel: true })
    // //     // }
    // //     try {
    // //       shell.openExternal(details.url);
    // //     } catch (e) {};
    //   //
    // //     callback({ cancel: true, redirectURL: 'beaker:start' })
    //   //
    // //   }
    // })


    //for each tab in the store...
    // let view = new BrowserView({
    //     //   webPreferences: {
    //     //     nodeIntegration: false
    //     //   }
    // })
    // // mainWindow.setBrowserView(view)
    // // view.setBounds(0, 0, 800, 900)
    // // view.webContents.loadURL('https://electron.atom.io')



    mainWindow.on( 'closed', () =>
    {
        mainWindow = null;
    } );

    const menuBuilder = new MenuBuilder( mainWindow, openWindow, store );
    menuBuilder.buildMenu();
}


if ( process.env.NODE_ENV === 'production' )
{
    const sourceMapSupport = require( 'source-map-support' );
    sourceMapSupport.install();
}

if ( process.env.NODE_ENV === 'development' )
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


app.on( 'window-all-closed', () =>
{
    // Respect the OSX convention of having the application in memory even
    // after all windows have been closed
    if ( process.platform !== 'darwin' )
    {
        app.quit();
    }
} );


app.on( 'ready', async () =>
{
    logger.info('App Ready');

    if ( process.env.NODE_ENV === 'development' )
    {
        await installExtensions();
    }

    // Pass store to packages for use.
    // Peruse-tab can be passed to target webview partitions. This could be made
    // more flexible...
    //
    // Many things could be passed here for customisation...
    loadCorePackages( store );
    openWindow();

    // handle commands from the application
    handleCommands( store );
} );
