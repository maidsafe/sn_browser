// @flow
import { app, Menu, shell, BrowserWindow } from 'electron';
import {
    reopenTab,
    activeTabForwards,
    activeTabBackwards
} from './actions/tabs_actions';
import { isRunningDevelopment, isHot, isRunningSpectronTest } from 'constants';
import { getLastClosedTab } from './reducers/tabs';
import logger from 'logger';
import appPackage from 'appPackage';

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
            if ( isHot  )
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
                { label: `Hide ${appPackage.productName}`, accelerator: 'Command+H', selector: 'hide:' },
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
                        if ( this.openWindow ) this.openWindow();
                    }
                },
                {
                    label       : 'New Tab',
                    accelerator : 'Command+T',
                    click       : ( item, win ) =>
                    {
                        if ( win ) win.webContents.send( 'command', 'file:new-tab', );
                    }
                },
                {
                    label       : 'Close Tab',
                    accelerator : 'Command+W',
                    click       : ( item, win ) =>
                    {
                        if ( win ) win.webContents.send( 'command', 'file:close-active-tab' );
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
                    click( item, win )
                    {
                        const lastTab = getLastClosedTab( store.getState().tabs );
                        let windowToFocus = lastTab.windowId;
                        windowToFocus = BrowserWindow.fromId( windowToFocus );

                        if ( windowToFocus )
                        {
                            windowToFocus.focus();
                        }

                        // here. we find last tab && update store to be open.
                        store.dispatch( reopenTab() );
                        // store.dispatch( setActiveTab( {index:  lastTab } ) );
                        // need window ID to focus it

                        // if ( win ) win.webContents.send( 'command', 'file:reopen-tab' );
                        console.log( 'TODO: Add history to all tabs... go back in time. Redux goodness??' );
                    }
                }, { type: 'separator' },
                {
                    label       : 'Open Location',
                    accelerator : 'CommandOrControl+L',
                    click( item, win )
                    {
                        if ( win ) win.webContents.send( 'command', 'file:focus-location' );
                        console.log( 'TODO: Focus Nav bar' );
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
                { label: 'Toggle Peruse-shell Devtools (not for web dev debug)',
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
            }, {
                label       : '&Close',
                accelerator : 'Ctrl+W',
                click       : () =>
                {
                    this.mainWindow.close();
                }
            }]
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
            }, {
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
