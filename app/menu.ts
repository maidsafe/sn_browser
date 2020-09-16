import open from 'open';
import { Store } from 'redux';
import { app, Menu, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';

import { AppUpdater } from './autoUpdate';

import {
    addTab,
    tabForwards,
    tabBackwards,
    tabShouldReload,
    toggleDevTools,
    selectAddressBar,
} from '$Actions/tabs_actions';
import { resetStore } from '$Actions/resetStore_action';
import {
    isHot,
    isRunningTestCafeProcess,
    isRunningPackaged,
    isRunningDebug,
} from '$Constants';
// import { getLastClosedTab } from '$Reducers/tabs';
import { logger } from '$Logger';
// eslint-disable-next-line import/extensions
import pkg from '$Package';
import { addNotification } from '$Actions/notification_actions';
import { AppWindow } from '$App/definitions/globals.d';
import { getExtensionMenuItems } from '$Extensions/mainProcess';
import { getResetStoreActionObject } from '$App/extensions/safe/backgroundProcess/handleRemoteCalls';
import {
    addTabEnd,
    addTabNext,
    windowCloseTab,
    setActiveTab,
    reopenTab,
    closeWindow,
} from '$Actions/windows_actions';

const getWindowId = ( win ) => {
    // if running testcafe, menu access window and actual window are different
    // for some reason...
    const windowId = isRunningTestCafeProcess ? 2 : win.id;

    return windowId;
};
export class MenuBuilder {
    private mainWindow: AppWindow;

    private openWindow: () => void;

    public store: Store;

    public constructor( mainWindow: AppWindow, openWindow, store ) {
        this.mainWindow = mainWindow;
        this.openWindow = openWindow;
        this.store = store;
    }

    public buildMenu() {
        if ( isHot || isRunningDebug ) {
            this.setupDevelopmentEnvironment();
        }

        const template = this.buildMenusTemplate();

        const menu = Menu.buildFromTemplate( template );
        Menu.setApplicationMenu( menu );

        return menu;
    }

    private setupDevelopmentEnvironment() {
        this.mainWindow.webContents.on( 'context-menu', ( _error, properties ) => {
            const { x, y } = properties;

            Menu.buildFromTemplate( [
                {
                    label: 'Inspect Element',
                    click: () => {
                        this.mainWindow.inspectElement( x, y );
                    },
                },
            ] ).popup( this.mainWindow );
        } );
    }

    private buildMenusTemplate() {
        const { store } = this;

        const subMenuAbout = {
            label: 'Safe &Browser',
            submenu: [
                {
                    label: 'About Safe Browser',
                    selector: 'orderFrontStandardAboutPanel:',
                },
                { type: 'separator' },
                { label: 'Services', submenu: [] },
                { type: 'separator' },
                {
                    label: `Hide ${pkg.productName}`,
                    accelerator: 'Command+H',
                    selector: 'hide:',
                },
                {
                    label: 'Hide Others',
                    accelerator: 'CommandOrControl+Shift+H',
                    selector: 'hideOtherApplications:',
                },
                { label: 'Show All', selector: 'unhideAllApplications:' },
                { type: 'separator' },
                {
                    label: 'Quit',
                    accelerator: 'Command+Q',
                    click: () => {
                        app.quit();
                    },
                },
            ],
        };

        const subMenuFile = {
            label: '&File',
            submenu: [
                {
                    label: 'New Window',
                    accelerator: 'CommandOrControl+N',
                    click: ( item, win ) => {
                        if ( this.openWindow && win ) {
                            const windowId = getWindowId( win );

                            this.openWindow( this.store, windowId );
                        }
                    },
                },
                {
                    label: 'New Tab',
                    accelerator: 'CommandOrControl+T',
                    click: ( item, win ) => {
                        if ( win ) {
                            const windowId = getWindowId( win );

                            const tabId = Math.random().toString( 36 );
                            this.store.dispatch(
                                addTab( {
                                    url: 'about:blank',
                                    tabId,
                                } )
                            );
                            this.store.dispatch(
                                addTabEnd( {
                                    tabId,
                                    windowId,
                                } )
                            );
                            this.store.dispatch(
                                setActiveTab( {
                                    tabId,
                                    windowId,
                                } )
                            );
                            this.store.dispatch( selectAddressBar( { tabId } ) );
                        }
                    },
                },
                {
                    label: 'Select Next Tab',
                    accelerator: 'Ctrl+Tab',
                    click: ( item, win ) => {
                        if ( win ) {
                            const windowId = getWindowId( win );

                            const openTabs = store.getState().windows.openWindows[windowId]
                                .tabs;
                            const { activeTab } = store.getState().windows.openWindows[
                                windowId
                            ];
                            let tabId;
                            openTabs.forEach( ( tab, i ) => {
                                if ( tab === activeTab ) {
                                    if ( i === openTabs.length - 1 ) {
                                        // eslint-disable-next-line prefer-destructuring
                                        tabId = openTabs[0];
                                    } else {
                                        // eslint-disable-next-line prefer-destructuring
                                        tabId = openTabs[i + 1];
                                    }
                                }
                            } );
                            this.store.dispatch( setActiveTab( { tabId, windowId } ) );
                        }
                    },
                },
                {
                    label: 'Select Previous Tab',
                    accelerator: 'Ctrl+Shift+Tab',
                    click: ( item, win ) => {
                        if ( win ) {
                            const windowId = getWindowId( win );
                            const openTabs = store.getState().windows.openWindows[windowId]
                                .tabs;
                            const { activeTab } = store.getState().windows.openWindows[
                                windowId
                            ];
                            let tabId;
                            openTabs.forEach( ( tab, i ) => {
                                if ( tab === activeTab ) {
                                    if ( i === 0 ) {
                                        // eslint-disable-next-line prefer-destructuring
                                        tabId = openTabs[openTabs.length - 1];
                                    } else {
                                        // eslint-disable-next-line prefer-destructuring
                                        tabId = openTabs[i - 1];
                                    }
                                }
                            } );
                            this.store.dispatch( setActiveTab( { tabId, windowId } ) );
                        }
                    },
                },
                {
                    label: 'Close Tab',
                    accelerator: 'CommandOrControl+W',
                    click: ( item, win ) => {
                        if ( win ) {
                            const windowId = getWindowId( win );

                            const tabId = store.getState().windows.openWindows[windowId]
                                .activeTab;
                            const openTabs = store.getState().windows.openWindows[windowId]
                                .tabs;
                            if ( openTabs.length === 1 ) {
                                win.close();
                            } else {
                                this.store.dispatch( windowCloseTab( { windowId, tabId } ) );
                            }
                        }
                    },
                },

                {
                    label: 'Close Window',
                    accelerator: 'CommandOrControl+Shift+W',
                    click: ( item, win ) => {
                        const windowId = getWindowId( win );

                        if ( win ) {
                            this.store.dispatch( closeWindow( { windowId } ) );
                            win.close();
                        }
                    },
                },
                { type: 'separator' },
                {
                    label: 'Reopen Last Tab',
                    accelerator: 'CommandOrControl+Shift+T',
                    click: ( item, win ) => {
                        const windowId = getWindowId( win );

                        // need to figure this one out
                        store.dispatch( reopenTab( { windowId } ) );
                    },
                },
                { type: 'separator' },
                {
                    label: 'Open Location',
                    accelerator: 'CommandOrControl+L',
                    click: ( item, win ) => {
                        const windowId = getWindowId( win );

                        const thisWindowActiveTabId = store.getState().windows.openWindows[
                            windowId
                        ].activeTab;

                        this.store.dispatch(
                            selectAddressBar( { tabId: thisWindowActiveTabId } )
                        );
                    },
                },
            ],
        };
        const subMenuEdit = {
            label: '&Edit',
            submenu: [
                {
                    label: 'Undo',
                    accelerator: 'CommandOrControl+Z',
                    selector: 'undo:',
                },
                {
                    label: 'Redo',
                    accelerator: 'Shift+CommandOrControl+Z',
                    selector: 'redo:',
                },
                { type: 'separator' },
                {
                    label: 'Cut',
                    accelerator: 'CommandOrControl+X',
                    selector: 'cut:',
                },
                {
                    label: 'Copy',
                    accelerator: 'CommandOrControl+C',
                    selector: 'copy:',
                },
                {
                    label: 'Paste',
                    accelerator: 'CommandOrControl+V',
                    selector: 'paste:',
                },
                {
                    label: 'Select All',
                    accelerator: 'CommandOrControl+A',
                    selector: 'selectAll:',
                },
            ],
        };
        const subMenuView = {
            label: '&View',
            submenu: [
                {
                    label: 'Bookmarks',
                    accelerator:
            process.platform === 'darwin' ? 'Alt+Shift+B' : 'Control+Shift+O',
                    click: ( item, win ) => {
                        if ( win ) {
                            const windowId = getWindowId( win );

                            const tabId = Math.random().toString( 36 );
                            this.store.dispatch(
                                addTab( {
                                    url: 'sn_browser://bookmarks',
                                    tabId,
                                } )
                            );
                            this.store.dispatch(
                                addTabEnd( {
                                    windowId,
                                    tabId,
                                } )
                            );
                            this.store.dispatch(
                                setActiveTab( {
                                    windowId,
                                    tabId,
                                } )
                            );
                        }
                    },
                },
                {
                    label: 'My Sites',
                    accelerator:
            process.platform === 'darwin' ? 'Alt+Shift+U' : 'Control+Shift+U',
                    click: ( item, win ) => {
                        if ( win ) {
                            const windowId = getWindowId( win );

                            const tabId = Math.random().toString( 36 );
                            this.store.dispatch(
                                addTab( {
                                    url: 'sn_browser://my-sites',
                                    tabId,
                                } )
                            );
                            this.store.dispatch(
                                addTabEnd( {
                                    windowId,
                                    tabId,
                                } )
                            );
                            this.store.dispatch(
                                setActiveTab( {
                                    windowId,
                                    tabId,
                                } )
                            );
                        }
                    },
                },
                { type: 'separator' },
                {
                    label: 'Reload',
                    accelerator:
            process.platform === 'darwin' ? 'CommandOrControl+R' : 'F5',
                    click: ( item, win ) => {
                        if ( win ) {
                            const windowId = getWindowId( win );

                            const tabId = store.getState().windows.openWindows[windowId]
                                .activeTab;
                            this.store.dispatch(
                                tabShouldReload( { tabId, shouldReload: true } )
                            );
                        }
                    },
                },
                {
                    label: 'Toggle Full Screen',
                    accelerator:
            process.platform === 'darwin' ? 'CommandOrControl+Shift+F' : 'F11',
                    click: ( item, win ) => {
                        win.setFullScreen( !win.isFullScreen() );
                    },
                },
                {
                    label: 'Toggle Developer Tools',
                    accelerator:
            process.platform === 'darwin'
                ? 'Alt+CommandOrControl+I'
                : 'Control+Shift+I',
                    click: ( item, win ) => {
                        if ( win ) {
                            const windowId = getWindowId( win );

                            const tabId = store.getState().windows.openWindows[windowId]
                                .activeTab;
                            store.dispatch(
                                toggleDevTools( { tabId, shouldToggleDevTools: true } )
                            );
                        }
                    },
                },
            ],
        };
        const subMenuHistory = {
            label: 'Hi&story',
            submenu: [
                {
                    label: 'View All History',
                    accelerator:
            process.platform === 'darwin' ? 'CommandOrControl+Y' : 'Control+H',
                    click: ( item, win ) => {
                        if ( win ) {
                            const windowId = getWindowId( win );

                            const tabId = Math.random().toString( 36 );
                            this.store.dispatch(
                                addTab( {
                                    url: 'sn_browser://history',
                                    tabId,
                                } )
                            );
                            this.store.dispatch(
                                addTabEnd( {
                                    windowId,
                                    tabId,
                                } )
                            );
                            this.store.dispatch(
                                setActiveTab( {
                                    windowId,
                                    tabId,
                                } )
                            );
                        }
                    },
                },
                { type: 'separator' },
                {
                    label: 'Forward',
                    accelerator: 'CommandOrControl + ]',
                    click: ( item, win ) => {
                        const windowId = getWindowId( win );

                        const timeStamp = new Date().getTime();
                        const tabId = store.getState().windows.openWindows[windowId]
                            .activeTab;
                        if ( win ) {
                            store.dispatch( tabForwards( { tabId, timeStamp } ) );
                        }
                    },
                },
                {
                    label: 'Backward',
                    accelerator: 'CommandOrControl + [',
                    click: ( item, win ) => {
                        const windowId = getWindowId( win );

                        const timeStamp = new Date().getTime();
                        const tabId = store.getState().windows.openWindows[windowId]
                            .activeTab;
                        if ( win ) {
                            store.dispatch( tabBackwards( { tabId, timeStamp } ) );
                        }
                    },
                },
            ],
        };

        const subMenuWindow = {
            label: '&Window',
            submenu: [
                {
                    label: 'Minimise',
                    accelerator: 'CommandOrControl+M',
                    role: 'minimize',
                },
                {
                    label: 'Close',
                    accelerator: 'CommandOrControl+Shift+W',
                    role: 'close',
                },
                { type: 'separator' },
                { label: 'Bring All to Front', role: 'front' },
                { type: 'separator' },
                {
                    label: 'Toggle Safe Browser-shell Devtools (not for web dev debug)',
                    click: ( item, win ) => {
                        if ( win ) {
                            win.toggleDevTools();
                        }
                    },
                },
            ],
        };
        const subMenuHelp = {
            label: '&Help',
            submenu: [
                {
                    label: `Safe Browser version: ${app.getVersion()}`,
                    enabled: false,
                },
                {
                    label: 'Learn More about the Safe Network',
                    click() {
                        open( 'https://safenetwork.tech/' );
                    },
                },
                {
                    label: 'Documentation',
                    click() {
                        open(
                            'https://github.com/maidsafe/sn_browser/blob/master/README.md'
                        );
                    },
                },
                {
                    label: 'Community Discussions',
                    click() {
                        open( 'https://safenetforum.org' );
                    },
                },
                {
                    label: 'Search Issues',
                    click() {
                        open( 'https://github.com/maidsafe/sn_browser/issues' );
                    },
                },
            ],
        };

        const helpMenuPacked = {
            label: '&Help',
            submenu: [
                ...subMenuHelp.submenu,
                {
                    label: 'Check for Updates...',
                    click() {
                        autoUpdater.autoDownload = false;
                        autoUpdater.on( 'update-not-available', () => {
                            const title = 'No Updates';
                            const notificationId = Math.random().toString( 36 );
                            const message = 'Current version is up to date.';
                            const theNotification = {
                                id: notificationId,
                                type: 'warning',
                                title,
                                body: message,
                                duration: 2,
                            };
                            store.dispatch( addNotification( theNotification ) );
                            autoUpdater.removeAllListeners( 'update-not-available' );
                        } );
                        // eslint-disable-next-line no-new
                        const browserUpdater = new AppUpdater( store );
                        browserUpdater.checkForUpdate();
                    },
                },
            ],
        };

        const subMenuTest = {
            label: '&Tests',
            submenu: [
                {
                    label: 'Reset the store',
                    click: ( item, win ) => {
                        const windowId = getWindowId( win );

                        const resetStoreActionObject = getResetStoreActionObject(
                            store.getState(),
                            windowId
                        );

                        this.store.dispatch( resetStore( resetStoreActionObject ) );
                    },
                },
                {
                    label: 'Add Tab Next',
                    click: ( item, win ) => {
                        // TODO: Refactor and DRY this out w/ handleRemoteCalls
                        const windowId = getWindowId( win );

                        const state = store.getState();

                        const { windows } = state;

                        const currentWindow = windows.openWindows[windowId]
                            ? windows.openWindows[windowId]
                            : {};

                        const activeTabId =
              currentWindow !== {} ? currentWindow.activeTab : null;

                        const currentTabs = currentWindow !== {} ? currentWindow.tabs : [];
                        const tabIndex = currentTabs.findIndex(
                            ( element ) => element === activeTabId
                        );

                        const tabId = Math.random().toString( 36 );

                        this.store.dispatch(
                            addTab( {
                                url: 'safe://home.dgeddes',
                                tabId,
                            } )
                        );

                        this.store.dispatch(
                            addTabNext( {
                                windowId,
                                tabId,
                                tabIndex,
                            } )
                        );

                        this.store.dispatch( setActiveTab( { tabId, windowId } ) );
                    },
                },
            ],
        };

        const initialMenusArray = [
            ...( process.platform === 'darwin' ? [subMenuAbout] : [] ),
            subMenuFile,
            ...( process.platform === 'darwin' ? [subMenuEdit] : [] ),
            subMenuView,
            subMenuHistory,
            subMenuWindow,
            ...( isRunningPackaged ? [helpMenuPacked] : [subMenuHelp] ),
            ...( isRunningTestCafeProcess ? [subMenuTest] : [] ),
        ];

        const extendedMenusArray = getExtensionMenuItems( store, initialMenusArray );

        return extendedMenusArray;
    }
}
