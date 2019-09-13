import { BrowserWindow, ipcMain, app } from 'electron';
import path from 'path';
import os, { type } from 'os';
import windowStateKeeper from 'electron-window-state';
import { logger } from '$Logger';
import { MenuBuilder } from './menu';
import { onOpenLoadExtensions } from './extensions/mainProcess';
import {
    isRunningTestCafeProcess,
    isRunningSpectronTestProcess,
    isRunningDebug,
    testCafeURL
} from '$Constants';
import { addTab, selectAddressBar } from './actions/tabs_actions';
import {
    windowCloseTab,
    addTabEnd,
    setActiveTab,
    closeWindow,
    addWindow,
    setLastFocusedWindow
} from '$Actions/windows_actions';

const browserWindowArray = [];

function getNewWindowPosition( thisWindowState ): { x: number; y: number } {
    // for both x and y, we start at 0
    const defaultWindowPosition = 0;

    const noOfBrowserWindows = BrowserWindow.getAllWindows().length;
    const windowCascadeSpacing = 20;

    let newWindowPosition;

    if ( noOfBrowserWindows === 0 ) {
        newWindowPosition = { x: thisWindowState.x, y: thisWindowState.y };
    } else {
        newWindowPosition = {
            x: defaultWindowPosition + windowCascadeSpacing * noOfBrowserWindows,
            y: defaultWindowPosition + windowCascadeSpacing * noOfBrowserWindows
        };
    }

    return newWindowPosition;
}

export const openWindow = ( store ): BrowserWindow => {
    const thisWindowState = windowStateKeeper( {
        defaultWidth: 2048,
        defaultHeight: 1024
    } );

    let appIcon = path.join( __dirname, '../resources/safeicon.png' );

    if ( process.platform === 'win32' ) {
        appIcon = path.join( __dirname, '../resources/icon.ico' );
    }

    const newWindowPosition = getNewWindowPosition( thisWindowState );
    const browserWindowConfig = {
        show: false,
        x: newWindowPosition.x,
        y: newWindowPosition.y,
        width: thisWindowState.width,
        height: thisWindowState.height,
        titleBarStyle: 'hiddenInset',
        icon: appIcon,
        webPreferences: {
            partition: 'persist:safe-tab',
            webviewTag: true,
            nodeIntegration: true,
            backgroundThrottling: false
        }
    };

    let thisWindow = new BrowserWindow( browserWindowConfig );

    thisWindowState.manage( thisWindow );

    thisWindow.loadURL( `file://${__dirname}/app.html` );

    if ( isRunningDebug && !isRunningSpectronTestProcess ) {
        thisWindow.on( 'did-frame-finish-load', () => {
            thisWindow.openDevTools( { mode: 'undocked' } );
        } );
    }
    thisWindow.webContents.once(
        'did-finish-load',
        async (): Promise<void> => {
            // have to add a tab here now
            const thisWindowId = thisWindow.id;
            logger.info( 'state-thisWindowId', thisWindowId );
            if ( browserWindowArray.length === 1 ) {
                const tabId = Math.random().toString( 36 );
                store.dispatch( addWindow( { windowId: thisWindowId } ) );
                store.dispatch( addTabEnd( { windowId: thisWindowId, tabId } ) );

                if ( !testCafeURL ) {
                    store.dispatch( addTab( { url: 'safe-browser://my-sites', tabId } ) );
                } else {
                    store.dispatch(
                        addTab( {
                            url: testCafeURL,
                            tabId
                        } )
                    );
                }

                store.dispatch( setActiveTab( { windowId: thisWindowId, tabId } ) );
            } else {
                const tabId = Math.random().toString( 36 );
                store.dispatch( addWindow( { windowId: thisWindowId } ) );
                store.dispatch( addTabEnd( { windowId: thisWindowId, tabId } ) );
                store.dispatch( addTab( { url: 'about:blank', tabId } ) );
                store.dispatch( setActiveTab( { windowId: thisWindowId, tabId } ) );
                store.dispatch( selectAddressBar( { tabId } ) );
            }
        }
    );

    thisWindow.webContents.on(
        'did-finish-load',
        async (): Promise<void> => {
            if ( !thisWindow ) {
                throw new Error( '"thisWindow" is not defined' );
            }

            await onOpenLoadExtensions( store );

            // before show lets load state
            thisWindow.show();
            thisWindow.focus();
        }
    );

    thisWindow.on( 'focus', () => {
        const thisWindowId = thisWindow.id;
        store.dispatch( setLastFocusedWindow( thisWindowId ) );
    } );

    thisWindow.on( 'close', () => {
        const thisWindowId = thisWindow.id;

        logger.info( 'dispatching closeWindow for', thisWindowId );
        store.dispatch( closeWindow( { windowId: thisWindowId } ) );
    } );

    thisWindow.on( 'closed', () => {
        const index = browserWindowArray.indexOf( thisWindow );
        thisWindow = null;
        if ( index > -1 ) {
            browserWindowArray.splice( index, 1 );
        }
        if ( process.platform !== 'darwin' && browserWindowArray.length === 0 ) {
            app.quit();
        }
    } );

    thisWindow.webContents.on( 'crashed', ( event, code, message ) => {
        logger.error(
            '>>>>>>>>>>>>>>>>>>>>>>>> Browser render process crashed <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<'
        );
        logger.error( event, message );
    } );

    browserWindowArray.push( thisWindow );

    const menuBuilder = new MenuBuilder( thisWindow, openWindow, store );
    menuBuilder.buildMenu();

    return thisWindow;
};

ipcMain.on( 'command:close-window', (): void => {
    const win = BrowserWindow.getFocusedWindow();
    if ( win ) {
        win.close();
    }
    if ( process.platform !== 'darwin' && browserWindowArray.length === 0 ) {
        app.quit();
    }
} );

ipcMain.on( 'closeWindows', ( event, data ) => {
    logger.info( 'closeWindows IPC received...', data );

    if ( data.length === 0 ) {
        logger.error( 'No windowIds passed to closeWindows.' );
    }

    data.forEach( ( element ) => {
        const winId = parseInt( element, 10 );
        const win = BrowserWindow.fromId( winId );
        win.close();
    } );
} );
