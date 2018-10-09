// @flow
import { app, Menu, shell, BrowserWindow } from 'electron';
import {
    addTab,
    activeTabForwards,
    activeTabBackwards,
    closeActiveTab,
    reopenTab,
    setActiveTab
} from 'actions/tabs_actions';

import { selectAddressBar } from 'actions/ui_actions';
import { isHot } from 'appConstants';
import { getLastClosedTab } from 'reducers/tabs';
import logger from 'logger';
import pkg from 'appPackage';

import { getExtensionMenuItems } from 'extensions';

export default class MenuBuilder
{
    constructor( mainWindow: BrowserWindow, openWindow, store )
    {
        this.mainWindow = mainWindow;
        this.openWindow = openWindow;
        this.store = store;
    }

    buildMenu()
    {
        if ( isHot )
        {
            this.setupDevelopmentEnvironment();
        }

        const template = this.buildMenusTemplate();

        const menu = Menu.buildFromTemplate( template );
        Menu.setApplicationMenu( menu );

        return menu;
    }

    setupDevelopmentEnvironment()
    {
        this.mainWindow.openDevTools();
        this.mainWindow.webContents.on( 'context-menu', ( e, props ) =>
        {
            const { x, y } = props;

            Menu
                .buildFromTemplate( [{
                    label : 'Inspect element',
                    click : () =>
                    {
                        this.mainWindow.inspectElement( x, y );
                    }
                }] )
                .popup( this.mainWindow );
        } );
    }

    buildMenusTemplate()
    {
        const store = this.store;

        const subMenuAbout = {
            label   : 'Peruse',
            submenu : [
                { label: 'About Peruse', selector: 'orderFrontStandardAboutPanel:' },
                { type: 'separator' },
                { label: 'Services', submenu: [] },
                { type: 'separator' },
                { label: `Hide ${pkg.productName}`, accelerator: 'Command+H', selector: 'hide:' },
                { label: 'Hide Others', accelerator: 'CommandOrControl+Shift+H', selector: 'hideOtherApplications:' },
                { label: 'Show All', selector: 'unhideAllApplications:' },
                { type: 'separator' },
                { label       : 'Quit',
                    accelerator : 'Command+Q',
                    click       : () =>
                    {
                        app.quit();
                    } }
            ]
        };

        const subMenuFile = {
            label   : 'File',
            submenu : [
                {
                    label       : '&New Window',
                    accelerator : 'CommandOrControl+N',
                    click       : ( item, win ) =>
                    {
                        if ( this.openWindow && win )
                        {
                            const windowId = win.webContents.id;
                            this.openWindow( this.store, windowId );
                        }
                    }
                },
                {
                    label       : 'New &Tab',
                    accelerator : 'CommandOrControl+T',
                    click       : ( item, win ) =>
                    {
                        if ( win )
                        {
                            const windowId = win.webContents.id;
                            this.store.dispatch( addTab( { url: 'about:blank', windowId, isActiveTab: true } ) );
                            this.store.dispatch( selectAddressBar() );
                        }
                    }
                },
                {
                    label       : 'Select Next Tab',
                    accelerator : 'Ctrl+Tab',
                    click       : ( item, win ) =>
                    {
                        if ( win )
                        {
                            const windowId = win.webContents.id;
                            const state = store.getState();
                            let index;
                            const openTabs = state.tabs.filter( ( tab ) => !tab.isClosed && tab.windowId === windowId );
                            openTabs.forEach( ( tab, i ) =>
                            {
                                if ( tab.isActiveTab )
                                {
                                    if ( i === openTabs.length - 1 )
                                    {
                                        index = openTabs[0].index;
                                    }
                                    else
                                    {
                                        index = openTabs[i + 1].index;
                                    }
                                }
                            } );
                            this.store.dispatch( setActiveTab( { index } ) );
                            this.store.dispatch( selectAddressBar() );
                        }
                    }
                },
                {
                    label       : 'Select Previous Tab',
                    accelerator : 'Ctrl+Shift+Tab',
                    click       : ( item, win ) =>
                    {
                        if ( win )
                        {
                            const windowId = win.webContents.id;
                            const state = store.getState();
                            let index;
                            const openTabs = state.tabs.filter( ( tab ) => !tab.isClosed && tab.windowId === windowId );
                            openTabs.forEach( ( tab, i ) =>
                            {
                                if ( tab.isActiveTab )
                                {
                                    if ( i === 0 )
                                    {
                                        index = openTabs[openTabs.length - 1].index;
                                    }
                                    else
                                    {
                                        index = openTabs[i - 1].index;
                                    }
                                }
                            } );
                            this.store.dispatch( setActiveTab( { index } ) );
                            this.store.dispatch( selectAddressBar() );
                        }
                    }
                },
                {
                    label       : 'Close Tab',
                    accelerator : 'CommandOrControl+W',
                    click       : ( item, win ) =>
                    {
                        if ( win )
                        {
                            const tabs = store.getState().tabs;
                            const windowId = win.webContents.id;

                            const openTabs =
                                tabs.filter( tab => !tab.isClosed && tab.windowId === windowId );

                            if ( openTabs.length === 1 )
                            {
                                win.close();
                            }
                            else
                            {
                                this.store.dispatch( closeActiveTab( windowId ) );
                            }
                        }
                    }
                },

                {
                    label       : 'Close Window',
                    accelerator : 'CommandOrControl+Shift+W',
                    click       : ( item, win ) =>
                    {
                        if ( win ) win.close();
                    }
                },
                { type: 'separator' },
                {
                    label       : 'Reopen Last Tab',
                    accelerator : 'CommandOrControl+Shift+T',
                    click       : ( item, win ) =>
                    {
                        const lastTab = getLastClosedTab( store.getState().tabs );
                        let windowToFocus = lastTab.windowId;

                        if ( windowToFocus )
                        {
                            windowToFocus = BrowserWindow.fromId( windowToFocus );
                            windowToFocus.focus();
                        }

                        store.dispatch( reopenTab() );
                    }
                }, { type: 'separator' },
                {
                    label       : 'Open Location',
                    accelerator : 'CommandOrControl+L',
                    click       : ( item, win ) =>
                    {
                        this.store.dispatch( selectAddressBar() );
                    }
                }
            ]
        };
        const subMenuEdit = {
            label   : 'Edit',
            submenu : [
                { label: 'Undo', accelerator: 'CommandOrControl+Z', selector: 'undo:' },
                { label: 'Redo', accelerator: 'Shift+CommandOrControl+Z', selector: 'redo:' },
                { type: 'separator' },
                { label: 'Cut', accelerator: 'CommandOrControl+X', selector: 'cut:' },
                { label: 'Copy', accelerator: 'CommandOrControl+C', selector: 'copy:' },
                { label: 'Paste', accelerator: 'CommandOrControl+V', selector: 'paste:' },
                { label: 'Select All', accelerator: 'CommandOrControl+A', selector: 'selectAll:' }
            ]
        };
        const subMenuView = {
            label   : 'View',
            submenu : [
                { label       : 'Bookmarks',
                    accelerator :  process.platform === 'darwin' ? 'Alt+Shift+B' : 'Control+Shift+O',
                    click       : ( item, win ) =>
                    {
                        if ( win )
                        {
                            const windowId = win.webContents.id;
                            this.store.dispatch( addTab( { url: 'peruse://bookmarks', windowId, isActiveTab: true } ) );
                        }
                    } },
                { type: 'separator' },
                { label       : 'Reload',
                    accelerator : 'CommandOrControl+R',
                    click       : ( item, win ) =>
                    {
                        if ( win ) win.webContents.send( 'command', 'view:reload' );
                    } },
                { label       : 'Toggle Full Screen',
                    accelerator :  process.platform === 'darwin' ? 'CommandOrControl+Shift+F' : 'F11',
                    click       : () =>
                    {
                        this.mainWindow.setFullScreen( !this.mainWindow.isFullScreen() );
                    } },
                { label       : 'Toggle Developer Tools',
                    accelerator : 'Alt+CommandOrControl+I',
                    click       : ( item, win ) =>
                    {
                        if ( win ) win.webContents.send( 'command', 'view:toggle-dev-tools' );
                    } }
            ]
        };
        const subMenuHistory = {
            label   : 'History',
            submenu : [
                { label       : 'View All History',
                    accelerator :  process.platform === 'darwin' ? 'CommandOrControl+Y' : 'Control+H',
                    click       : ( item, win ) =>
                    {
                        if ( win )
                        {
                            const windowId = win.webContents.id;
                            this.store.dispatch( addTab( { url: 'peruse://history', windowId, isActiveTab: true } ) );
                        }
                    } },
                { type: 'separator' },
                {
                    label       : 'Forward',
                    accelerator : 'CommandOrControl + ]',
                    click       : ( item, win ) =>
                    {
                        if ( win )
                        {
                            // todo check window id
                            store.dispatch( activeTabForwards() );
                        }
                    }
                },
                {
                    label       : 'Backward',
                    accelerator : 'CommandOrControl + [',
                    click       : ( item, win ) =>
                    {
                        if ( win )
                        {
                            // todo check window id
                            store.dispatch( activeTabBackwards() );
                        }
                    }
                }
            ]
        };

        const subMenuWindow = {
            label   : 'Window',
            submenu : [
                { label: 'Minimize', accelerator: 'CommandOrControl+M', selector: 'performMiniaturize:' },
                { label: 'Close', accelerator: 'CommandOrControl+Shift+W', selector: 'performClose:' },
                { type: 'separator' },
                { label: 'Bring All to Front', selector: 'arrangeInFront:' },
                { type: 'separator' },
                { label : 'Toggle Peruse-shell Devtools (not for web dev debug)',
                    click : ( item, win ) =>
                    {
                        if ( win )
                        {
                            win.toggleDevTools();
                        }
                    }
                }
            ]
        };
        const subMenuHelp = {
            label   : 'Help',
            submenu : [
                { label : 'Learn More about the Safe Network',
                    click()
                    {
                        shell.openExternal( 'https://maidsafe.net/' );
                    } },
                { label : 'Documentation',
                    click()
                    {
                        shell.openExternal( 'https://github.com/joshuef/peruse/blob/master/README.md' );
                    } },
                { label : 'Community Discussions',
                    click()
                    {
                        shell.openExternal( 'https://safenetforum.org' );
                    } },
                { label : 'Search Issues',
                    click()
                    {
                        shell.openExternal( 'https://github.com/joshuef/peruse/issues' );
                    } }
            ]
        };


        const initialMenusArray = [
            subMenuAbout,
            subMenuFile,
            ...( process.platform === 'darwin' ? [subMenuEdit] : [] ) ,
            subMenuView,
            subMenuHistory,
            subMenuWindow,
            subMenuHelp
        ];

        const extendedMenusArray = getExtensionMenuItems( store, initialMenusArray );

        return extendedMenusArray;
    }

}
