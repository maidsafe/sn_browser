/* eslint global-require: 1, flowtype-errors/show-errors: 0 */
import { BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import windowStateKeeper from 'electron-window-state';
import MenuBuilder from './menu';
import { onOpenLoadExtensions }  from './extensions';

import logger from 'logger';
import {
    addTab,
    updateTab
} from './actions/tabs_actions';
import { selectAddressBar } from './actions/ui_actions';

const browserWindowArray = [];

function getNewWindowPosition( mainWindowState )
{
    // for both x and y, we start at 0
    const defaultWindowPosition = 0;

    const noOfBrowserWindows = BrowserWindow.getAllWindows().length;
    const windowCascadeSpacing = 20;

    let newWindowPosition;

    if ( noOfBrowserWindows === 0 )
    {
        newWindowPosition = { x: mainWindowState.x, y: mainWindowState.y };
    }
    else
    {
        newWindowPosition =
        { x : defaultWindowPosition + ( windowCascadeSpacing * noOfBrowserWindows ),
            y : defaultWindowPosition + ( windowCascadeSpacing * noOfBrowserWindows )
        };
    }

    return newWindowPosition;
}

const openWindow = ( store ) =>
{
    const mainWindowState = windowStateKeeper( {
        defaultWidth  : 2048,
        defaultHeight : 1024
    } );

    const newWindowPosition = getNewWindowPosition( mainWindowState );

    let mainWindow = new BrowserWindow( {
        show              : false,
        x                 : newWindowPosition.x,
        y                 : newWindowPosition.y,
        width             : mainWindowState.width,
        height            : mainWindowState.height,
        titleBarStyle     : 'hidden-inset',
        'standard-window' : false,
        webPreferences    :
        {
            // preload : path.join( __dirname, 'browserPreload.js' )
        }

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

        onOpenLoadExtensions( store );

        // before show lets load state
        mainWindow.show();
        mainWindow.focus();

        const webContentsId = mainWindow.webContents.id;
        if ( browserWindowArray.length === 1 )
        {
            // first tab needs this webContentsId.
            store.dispatch( updateTab( { index: 0, windowId: webContentsId } ) );
        }
        else
        {
            store.dispatch( addTab( { url: 'about:blank', windowId: webContentsId, isActiveTab: true } ) );
            store.dispatch( selectAddressBar() );
        }
    } );

    mainWindow.on( 'closed', () =>
    {
        const index = browserWindowArray.indexOf( mainWindow );
        mainWindow = null;
        if ( index > -1 )
        {
            browserWindowArray.splice( index, 1 );
        }
    } );

    browserWindowArray.push( mainWindow );

    const menuBuilder = new MenuBuilder( mainWindow, openWindow, store );
    menuBuilder.buildMenu();

    return mainWindow;
};


export default openWindow;


ipcMain.on( 'command:close-window', ( ) =>
{
    const win = BrowserWindow.getFocusedWindow();

    if ( win )
    {
        win.close();
    }
} );
