import { BrowserWindow, ipcMain, app } from 'electron';
import path from 'path';
import os, { type } from 'os';
import windowStateKeeper from 'electron-window-state';
import { logger } from '$Logger';
import { MenuBuilder } from './menu';
import { onOpenLoadExtensions } from './extensions';
import { isRunningSpectronTestProcess, isRunningDebug } from '$Constants';
import { addTab, updateTab, selectAddressBar } from './actions/tabs_actions';
import {
    windowCloseTab,
    addTabEnd,
    setActiveTab,
    closeWindow,
    addWindow
} from '$Actions/windows_actions';

const browserWindowArray = [];

function getNewWindowPosition( mainWindowState ): { x: number; y: number } {
    // for both x and y, we start at 0
    const defaultWindowPosition = 0;

    const noOfBrowserWindows = BrowserWindow.getAllWindows().length;
    const windowCascadeSpacing = 20;

    let newWindowPosition;

    if ( noOfBrowserWindows === 0 ) {
        newWindowPosition = { x: mainWindowState.x, y: mainWindowState.y };
    } else {
        newWindowPosition = {
            x: defaultWindowPosition + windowCascadeSpacing * noOfBrowserWindows,
            y: defaultWindowPosition + windowCascadeSpacing * noOfBrowserWindows
        };
    }

    return newWindowPosition;
}

export const openWindow = ( store ): BrowserWindow => {
    const mainWindowState = windowStateKeeper( {
        defaultWidth: 2048,
        defaultHeight: 1024
    } );

    let appIcon = path.join( __dirname, '../resources/safeicon.png' );

    if ( process.platform === 'win32' ) {
        appIcon = path.join( __dirname, '../resources/icon.ico' );
    }

    const newWindowPosition = getNewWindowPosition( mainWindowState );
    const browserWindowConfig = {
        show: false,
        x: newWindowPosition.x,
        y: newWindowPosition.y,
        width: mainWindowState.width,
        height: mainWindowState.height,
        titleBarStyle: 'hiddenInset',
        icon: appIcon,
        webPreferences: {
            partition: 'persist:safe-tab'
            // preload : path.join( __dirname, 'browserPreload.js' )
            //  isRunningUnpacked ?
            // `http://localhost:${devPort}/webPreload.js` : `file://${ __dirname }/browserPreload.js`;
        }
    };

    let mainWindow = new BrowserWindow( browserWindowConfig );

    mainWindowState.manage( mainWindow );

    mainWindow.loadURL( `file://${__dirname}/app.html` );

    // @TODO: Use 'ready-to-show' event
    //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event

    mainWindow.webContents.on(
        'did-finish-load',
        async (): Promise<void> => {
            if ( !mainWindow ) {
                throw new Error( '"mainWindow" is not defined' );
            }

            await onOpenLoadExtensions( store );

            // before show lets load state
            mainWindow.show();
            mainWindow.focus();

            if ( isRunningDebug && !isRunningSpectronTestProcess ) {
                mainWindow.openDevTools( { mode: 'undocked' } );
            }
            // have to add a tab here now
            // const webContentsId = mainWindow.webContents.id;
            const mainWindowId = mainWindow.id;
            logger.info( 'state-mainWindowId', mainWindowId );
            if ( browserWindowArray.length === 1 ) {
                const tabId = Math.random().toString( 36 );
                store.dispatch( addWindow( { windowId: mainWindowId } ) );
                store.dispatch( addTabEnd( { windowId: mainWindowId, tabId } ) );
                store.dispatch( addTab( { url: 'safe-auth://home/', tabId } ) );
                store.dispatch( setActiveTab( { windowId: mainWindowId, tabId } ) );
            } else {
                const tabId = Math.random().toString( 36 );
                store.dispatch( addWindow( { windowId: mainWindowId } ) );
                store.dispatch( addTabEnd( { windowId: mainWindowId, tabId } ) );
                store.dispatch( addTab( { url: 'about:blank', tabId } ) );
                store.dispatch( setActiveTab( { windowId: mainWindowId, tabId } ) );
                store.dispatch( selectAddressBar( { tabId } ) );
            }
        }
    );
    mainWindow.on( 'close', () => {
        const webContentsId = mainWindow.webContents.id;
        const mainWindowId = mainWindow.id;
        store.dispatch( closeWindow( { windowId: mainWindowId } ) );
    } );

    mainWindow.on( 'closed', () => {
        const index = browserWindowArray.indexOf( mainWindow );
        mainWindow = null;
        if ( index > -1 ) {
            browserWindowArray.splice( index, 1 );
        }
        if ( process.platform !== 'darwin' && browserWindowArray.length === 0 ) {
            app.quit();
        }
    } );

    mainWindow.webContents.on( 'crashed', ( event, code, message ) => {
        logger.error(
            '>>>>>>>>>>>>>>>>>>>>>>>> Browser render process crashed <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<'
        );
        logger.error( event, message );
    } );

    browserWindowArray.push( mainWindow );

    const menuBuilder = new MenuBuilder( mainWindow, openWindow, store );
    menuBuilder.buildMenu();

    return mainWindow;
};

ipcMain.on(
    'command:close-window',
    (): void => {
        const win = BrowserWindow.getFocusedWindow();
    }
);

ipcMain.on( 'command:close-window', () => {
    const win = BrowserWindow.getFocusedWindow();
    if ( win ) {
        win.close();
    }
    if ( process.platform !== 'darwin' && browserWindowArray.length === 0 ) {
        app.quit();
    }
} );

ipcMain.on( 'resetStore', ( event, data ) => {
    data.forEach( element => {
        const winId = parseInt( element );
        const win = BrowserWindow.fromId( winId );
        win.close();
    } );
} );
