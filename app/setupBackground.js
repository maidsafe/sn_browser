import { BrowserWindow } from 'electron';
import logger from 'logger';
import path from 'path';
import { isRunningUnpacked, isRunningDevelopment } from 'appConstants';

const BACKGROUND_PROCESS = path.join( __dirname, 'bg.html' );
let backgroundProcess = null;

const setupBackground = () =>
{
    logger.info( 'Setting up Background Process', backgroundProcess );

    if ( backgroundProcess === null )
    {
        logger.info('loading:', BACKGROUND_PROCESS );

        backgroundProcess = new BrowserWindow( {
            width: 300,
            height: 450,
            show: false,
            frame: false,
            fullscreenable: false,
            resizable: false,
            transparent: true,
            webPreferences : {
                // partition               : 'persist:safe-tab', // TODO make safe?
                nodeIntegration         : true,
                // Prevents renderer process code from not running when window is hidden
                backgroundThrottling: false
            }
        } );

        // Hide the window when it loses focus
        backgroundProcess.on('blur', () => {
          if (!backgroundProcess.webContents.isDevToolsOpened()) {
            backgroundProcess.hide()
          }
      });

        backgroundProcess.webContents.on( 'did-finish-load', () =>
        {
            logger.verbose( 'Background process renderer loaded.');

            if( isRunningUnpacked || isRunningDevelopment )
            {
                backgroundProcess.webContents.openDevTools()
            }
        } );

        backgroundProcess.loadURL( `file://${BACKGROUND_PROCESS}` );
    }

    return backgroundProcess;
};

export default setupBackground;
