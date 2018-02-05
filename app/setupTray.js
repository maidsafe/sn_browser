import { app, Tray, BrowserWindow, ipcMain } from 'electron';
import logger from 'logger';
import path from 'path';
import { isRunningUnpacked, isRunningDevelopment, CONFIG } from 'appConstants';

let tray;
let safeInfoWindow;

export const createTray = () =>
{
    tray = new Tray( 'resources/icons/heart.png' );
    tray.on( 'right-click', toggleWindow );
    tray.on( 'double-click', toggleWindow );
    tray.on( 'click', ( event ) =>
    {
        toggleWindow();

        // Show devtools when command clicked
        if ( safeInfoWindow.isVisible() && process.defaultApp && event.metaKey )
        {
            safeInfoWindow.openDevTools( { mode: 'detach' } );
        }
    } );
};

const getWindowPosition = () =>
{
    const safeInfoWindowBounds = safeInfoWindow.getBounds();
    const trayBounds = tray.getBounds();

    // Center safeInfoWindow horizontally below the tray icon
    const x = Math.round( trayBounds.x + ( trayBounds.width / 2 ) - ( safeInfoWindowBounds.width / 2 ) );

    // Position safeInfoWindow 4 pixels vertically below the tray icon
    const y = Math.round( trayBounds.y + trayBounds.height + 4 );

    return { x, y };
};

export const createSafeInfoWindow = () =>
{
    safeInfoWindow = new BrowserWindow( {
        width          : 300,
        height         : 450,
        show           : false,
        frame          : false,
        fullscreenable : false,
        resizable      : false,
        transparent    : true,
        webPreferences : {
            // Prevents renderer process code from not running when safeInfoWindow is
            // hidden
            preload              : path.join( __dirname, 'browserPreload.js' ),
            backgroundThrottling : false,
            nodeIntegration      : true
        }
    } );
    safeInfoWindow.loadURL( `file://${CONFIG.APP_HTML_PATH}` );

    // Hide the safeInfoWindow when it loses focus
    safeInfoWindow.on( 'blur', () =>
    {
        if ( !safeInfoWindow.webContents.isDevToolsOpened() )
        {
            safeInfoWindow.hide();
        }
    } );


    safeInfoWindow.webContents.on( 'did-finish-load', () =>
    {
        safeInfoWindow.webContents.executeJavaScript( 'window.peruseNav(\'safeInfoWindow\')', ( err, url, result ) =>
        {
            logger.verbose( 'Safe Info Window Loaded' );
        } );

        logger.info( 'BACKGROUND_PROCESS loaded' );

        if ( isRunningUnpacked || isRunningDevelopment )
        {
            safeInfoWindow.webContents.openDevTools();
        }
    } );
};

const toggleWindow = () =>
{
    if ( safeInfoWindow.isVisible() )
    {
        safeInfoWindow.hide();
    }
    else
    {
        showWindow();
    }
};

const showWindow = () =>
{
    const position = getWindowPosition();
    safeInfoWindow.setPosition( position.x, position.y, false );
    safeInfoWindow.show();
    safeInfoWindow.focus();
};

ipcMain.on( 'show-safeInfoWindow', () =>
{
    showWindow();
} );
