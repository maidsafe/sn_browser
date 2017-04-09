// @flow
import { app, Menu, shell, BrowserWindow } from 'electron';

export default class MenuBuilder
{
    mainWindow: BrowserWindow;

    constructor( mainWindow: BrowserWindow )
{
        this.mainWindow = mainWindow;
    }

    buildMenu()
{
        if ( process.env.NODE_ENV === 'development' )
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
        const subMenuAbout = {
            label   : 'Peruse',
            submenu : [
        { label: 'About ElectronReact', selector: 'orderFrontStandardAboutPanel:' },
        { type: 'separator' },
        { label: 'Services', submenu: [] },
        { type: 'separator' },
        { label: 'Hide ElectronReact', accelerator: 'Command+H', selector: 'hide:' },
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
                    label       : 'New Tab',
                    accelerator : 'Command+T',
                    click       : ( item, win ) =>
                    {
                        if ( win ) win.webContents.send( 'command', 'file:new-tab', 'bullshit' );
                    }
                },
                {
                    label       : 'Close Tab',
                    accelerator : 'Command+W',
                    click       : ( item, win ) =>
                    {
                        if ( win ) win.webContents.send( 'command', 'file:close-tab' );
                    }
                },
                // { type: 'separator' },
                {
                    label       : 'Reopen Closed Tab',
                    accelerator : 'Command+Shift+T',
                    click( item, win )
                    {
                        if ( win ) win.webContents.send( 'command', 'file:reopen-tab' );
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
        const subMenuViewDev = {
            label   : 'View',
            submenu : [
                { label       : 'Reload',
                    accelerator : 'Command+R',
                    click       : () =>
{
                        this.mainWindow.webContents.reload();
                    } },
                { label       : 'Toggle Full Screen',
                    accelerator : 'Ctrl+Command+F',
                    click       : () =>
{
                        this.mainWindow.setFullScreen( !this.mainWindow.isFullScreen() );
                    } },
                { label       : 'Toggle Developer Tools',
                    accelerator : 'Alt+Command+I',
                    click       : () =>
{
                        this.mainWindow.toggleDevTools();
                    } }
            ]
        };
        const subMenuViewProd = {
            label   : 'View',
            submenu : [
                { label       : 'Toggle Full Screen',
                    accelerator : 'Ctrl+Command+F',
                    click       : () =>
{
                        this.mainWindow.setFullScreen( !this.mainWindow.isFullScreen() );
                    } }
            ]
        };
        const subMenuWindow = {
            label   : 'Window',
            submenu : [
        { label: 'Minimize', accelerator: 'Command+M', selector: 'performMiniaturize:' },
        { label: 'Close', accelerator: 'Command+W', selector: 'performClose:' },
        { type: 'separator' },
        { label: 'Bring All to Front', selector: 'arrangeInFront:' }
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

        const subMenuView = process.env.NODE_ENV === 'development'
      ? subMenuViewDev
      : subMenuViewProd;

        return [
            subMenuAbout,
            subMenuFile,
            subMenuEdit,
            subMenuView,
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
