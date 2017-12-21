// @flow
import { app, Menu, shell, BrowserWindow } from 'electron';
import {
    addTab,
    activeTabForwards,
    activeTabBackwards,
    closeActiveTab,
    reopenTab
} from 'actions/tabs_actions';
import { selectAddressBar } from 'actions/ui_actions';
import { isHot } from 'appConstants';
import { getLastClosedTab } from 'reducers/tabs';
import logger from 'logger';
import pkg from 'appPackage';

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

        let template;

        if ( process.platform === 'darwin' )
        {
            template = this.buildDarwinTemplate();
        }
        else
        {
            template = this.buildDefaultTemplate();
        }

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

    buildDarwinTemplate()
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
                { label: 'Hide Others', accelerator: 'Command+Shift+H', selector: 'hideOtherApplications:' },
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
                    label       : 'New Window',
                    accelerator : 'Command+N',
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
                    label       : 'New Tab',
                    accelerator : 'Command+T',
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
                    label       : 'Close Tab',
                    accelerator : 'Command+W',
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
                    accelerator : 'Command+Shift+W',
                    click       : ( item, win ) =>
                    {
                        if ( win ) win.close();
                    }
                },
                { type: 'separator' },
                {
                    label       : 'Reopen Last Tab',
                    accelerator : 'Command+Shift+T',
                    click       : ( item, win ) =>
                    {
                        const lastTab = getLastClosedTab( store.getState().tabs );
                        let windowToFocus = lastTab.windowId;
                        windowToFocus = BrowserWindow.fromId( windowToFocus );

                        if ( windowToFocus )
                        {
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
                { label: 'Undo', accelerator: 'Command+Z', selector: 'undo:' },
                { label: 'Redo', accelerator: 'Shift+Command+Z', selector: 'redo:' },
                { type: 'separator' },
                { label: 'Cut', accelerator: 'Command+X', selector: 'cut:' },
                { label: 'Copy', accelerator: 'Command+C', selector: 'copy:' },
                { label: 'Paste', accelerator: 'Command+V', selector: 'paste:' },
                { label: 'Select All', accelerator: 'Command+A', selector: 'selectAll:' }
            ]
        };
        const subMenuView = {
            label   : 'View',
            submenu : [
                { label       : 'Bookmarks',
                    accelerator : 'Option+Shift+B',
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
                    accelerator : 'Command+R',
                    click       : ( item, win ) =>
                    {
                        if ( win ) win.webContents.send( 'command', 'view:reload' );
                    } },
                { label       : 'Toggle Full Screen',
                    accelerator : 'Ctrl+Command+F',
                    click       : () =>
                    {
                        this.mainWindow.setFullScreen( !this.mainWindow.isFullScreen() );
                    } },
                { label       : 'Toggle Developer Tools',
                    accelerator : 'Alt+Command+I',
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
                    accelerator : 'CommandOrControl+Y',
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
                { label: 'Minimize', accelerator: 'Command+M', selector: 'performMiniaturize:' },
                { label: 'Close', accelerator: 'Command+Shift+W', selector: 'performClose:' },
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
                { label : 'Learn More',
                    click()
                    {
                        shell.openExternal( 'http://electron.atom.io' );
                    } },
                { label : 'Documentation',
                    click()
                    {
                        shell.openExternal( 'https://github.com/atom/electron/tree/master/docs#readme' );
                    } },
                { label : 'Community Discussions',
                    click()
                    {
                        shell.openExternal( 'https://discuss.atom.io/c/electron' );
                    } },
                { label : 'Search Issues',
                    click()
                    {
                        shell.openExternal( 'https://github.com/atom/electron/issues' );
                    } }
            ]
        };

        return [
            subMenuAbout,
            subMenuFile,
            subMenuEdit,
            subMenuView,
            subMenuHistory,
            subMenuWindow,
            subMenuHelp
        ];
    }

    buildDefaultTemplate()
    {
        const templateDefault = [{
            label   : '&File',
            submenu : [{
                label       : '&Open',
                accelerator : 'Ctrl+O'
            },
            {
                label       : '&Close',
                accelerator : 'Ctrl+W',
                click       : () =>
                {
                    this.mainWindow.close();
                },
            },
            { type: 'separator' },
            {
                label       : 'Open Location',
                accelerator : 'CommandOrControl+L',
                click       : ( item, win ) =>
                {
                    this.store.dispatch( selectAddressBar() );
                }
            }
        ]
        }, {
            label   : '&View',
            submenu : ( process.env.NODE_ENV === 'development' ) ? [{
                label       : '&Reload',
                accelerator : 'Ctrl+R',
                click       : () =>
                {
                    this.mainWindow.webContents.reload();
                }
            }, {
                label       : 'Toggle &Full Screen',
                accelerator : 'F11',
                click       : () =>
                {
                    this.mainWindow.setFullScreen( !this.mainWindow.isFullScreen() );
                }
            },
            { type: 'separator' },
            { label       : 'Bookmarks',
                accelerator : 'Control+Shift+O',
                click       : ( item, win ) =>
                {
                    if ( win )
                    {
                        const windowId = win.webContents.id;
                        this.store.dispatch( addTab( { url: 'peruse://bookmarks', windowId, isActiveTab: true } ) );
                    }
                } },
            { label       : 'View All History',
                accelerator : 'Control+H',
                click       : ( item, win ) =>
                {
                    if ( win )
                    {
                        const windowId = win.webContents.id;
                        this.store.dispatch( addTab( { url: 'peruse://history', windowId, isActiveTab: true } ) );
                    }
                }
            },
            { type: 'separator' },
            {
                label       : 'Toggle &Developer Tools',
                accelerator : 'Alt+Ctrl+I',
                click       : () =>
                {
                    this.mainWindow.toggleDevTools();
                }
            }] : [{
                label       : 'Toggle &Full Screen',
                accelerator : 'F11',
                click       : () =>
                {
                    this.mainWindow.setFullScreen( !this.mainWindow.isFullScreen() );
                }
            }]
        }, {
            label   : 'Help',
            submenu : [{
                label : 'Learn More',
                click()
                {
                    shell.openExternal( 'http://electron.atom.io' );
                }
            }, {
                label : 'Documentation',
                click()
                {
                    shell.openExternal( 'https://github.com/atom/electron/tree/master/docs#readme' );
                }
            }, {
                label : 'Community Discussions',
                click()
                {
                    shell.openExternal( 'https://discuss.atom.io/c/electron' );
                }
            }, {
                label : 'Search Issues',
                click()
                {
                    shell.openExternal( 'https://github.com/atom/electron/issues' );
                }
            }]
        }];

        return templateDefault;
    }
}
