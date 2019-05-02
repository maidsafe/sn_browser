import { BrowserWindow, ipcMain, app } from 'electron';
import path from 'path';
import windowStateKeeper from 'electron-window-state';
// import { logger } from '$Logger';
import { MenuBuilder } from './menu';
import { onOpenLoadExtensions } from './extensions';
import { isRunningSpectronTestProcess, isRunningDebug } from '$Constants';
import { addTab, updateTab } from './actions/tabs_actions';
import {
    selectAddressBar,
    uiAddWindow,
    uiRemoveWindow
} from './actions/ui_actions';

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

    mainWindow.webContents.on(
        'did-finish-load',
        async (): Promise<void> => {
            if ( !mainWindow ) {
                throw new Error( '"mainWindow" is not defined' );
            }

            await onOpenLoadExtensions( store );

            if ( isRunningDebug && !isRunningSpectronTestProcess ) {
                mainWindow.openDevTools( { mode: 'undocked' } );
            }

            const webContentsId = mainWindow.webContents.id;
            if ( browserWindowArray.length === 1 ) {
                const allTabs = store.getState().tabs;
                const orphanedTabs = allTabs.filter( ( tab ): boolean => !tab.windowId );
                orphanedTabs.forEach(
                    ( orphan ): void => {
                        store.dispatch(
                            updateTab( { index: orphan.index, windowId: webContentsId } )
                        );
                    }
                );
                store.dispatch(
                    uiAddWindow( {
                        windowId: webContentsId
                    } )
                );
            } else {
                store.dispatch(
                    addTab( {
                        url: 'about:blank',
                        windowId: webContentsId,
                        isActiveTab: true
                    } )
                );
                store.dispatch(
                    uiAddWindow( {
                        windowId: webContentsId
                    } )
                );
                store.dispatch( selectAddressBar() );
            }

            mainWindow.show();
            mainWindow.focus();
        }
    );
    mainWindow.on(
        'close',
        (): void => {
            const webContentsId = mainWindow.webContents.id;
            store.dispatch(
                uiRemoveWindow( {
                    windowId: webContentsId
                } )
            );
        }
    );
    mainWindow.on(
        'closed',
        (): void => {
            const index = browserWindowArray.indexOf( mainWindow );
            mainWindow = null;
            if ( index > -1 ) {
                browserWindowArray.splice( index, 1 );
            }
            if ( process.platform !== 'darwin' && browserWindowArray.length === 0 ) {
                app.quit();
            }
        }
    );

    mainWindow.webContents.on( 'preload-error', ( event, code, message ) => {
        logger.error(
            '>>>>>>>>>>>>>>>>>>>>>>>> Browser render process preload error <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<'
        );
        logger.error( error );
        reject( message );
    } );

    mainWindow.webContents.on( 'crashed', ( event, code, message ) => {
        logger.error(
            '>>>>>>>>>>>>>>>>>>>>>>>> Browser render process crashed <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<'
        );
        logger.error( event, message );
        reject( message );
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

        if ( win ) {
            win.close();
        }
        if ( process.platform !== 'darwin' && browserWindowArray.length === 0 ) {
            app.quit();
        }
    }
);
