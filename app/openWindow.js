/* eslint global-require: 1, flowtype-errors/show-errors: 0 */
import { BrowserWindow, ipcMain } from 'electron';
import windowStateKeeper from 'electron-window-state';
import MenuBuilder from './menu';
import logger from 'logger';

//TODO: Move this // abstract
import {authFromQueue} from './extensions/safe/network';

let mainWindow = null;

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

        authFromQueue();
    } );

    mainWindow.on( 'closed', () =>
    {
        mainWindow = null;
    } );

    const menuBuilder = new MenuBuilder( mainWindow, openWindow, store );
    menuBuilder.buildMenu();
}


export default openWindow;


ipcMain.on( 'command:close-window', ( ) =>
{
    let win = BrowserWindow.getFocusedWindow();

    if( win )
    {
        win.close();
    }
})
