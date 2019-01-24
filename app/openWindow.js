/* eslint global-require: 1, flowtype-errors/show-errors: 0 */
import { BrowserWindow, ipcMain, app } from 'electron';
import path from 'path';
import os from 'os';
import windowStateKeeper from 'electron-window-state';
import MenuBuilder from './menu';
import { onOpenLoadExtensions } from './extensions';
import { isRunningSpectronTestProcess, isRunningDebug } from 'appConstants';
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

const openWindow = store =>
{
    const mainWindowState = windowStateKeeper( {
        defaultWidth  : 2048,
        defaultHeight : 1024
    } );

    let appIcon = path.join( __dirname, '../resources/safeicon.png' );

    if ( process.platform === 'win32' )
    {
        appIcon = path.join( __dirname, '../resources/icon.ico' );
    }

    const newWindowPosition = getNewWindowPosition( mainWindowState );
    const browserWindowConfig =
    {
        show           : false,
        x              : newWindowPosition.x,
        y              : newWindowPosition.y,
        width          : mainWindowState.width,
        height         : mainWindowState.height,
        titleBarStyle  : 'hiddenInset',
        icon           : appIcon,
        webPreferences :
        {
            partition : 'persist:safe-tab'
            // preload : path.join( __dirname, 'browserPreload.js' )
        }

    };

    let mainWindow = new BrowserWindow( browserWindowConfig );

    mainWindowState.manage( mainWindow );

    mainWindow.loadURL( `file://${ __dirname }/app.html` );

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

        if ( isRunningDebug && !isRunningSpectronTestProcess )
        {
            mainWindow.openDevTools( { mode: 'undocked' } );
        }

        const webContentsId = mainWindow.webContents.id;
        if ( browserWindowArray.length === 1 )
        {
            const allTabs = store.getState().tabs;
            const orphanedTabs = allTabs.filter( tab =>
                !tab.windowId );
            orphanedTabs.forEach( orphan =>
            {
                store.dispatch( updateTab( { index: orphan.index, windowId: webContentsId } ) );
            } );
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
        if ( process.platform !== 'darwin' && browserWindowArray.length === 0 )
        {
            app.quit();
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
    if ( process.platform !== 'darwin' && browserWindowArray.length === 0 )
    {
        app.quit();
    }
} );
