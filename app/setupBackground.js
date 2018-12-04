import { BrowserWindow } from 'electron';
import logger from 'logger';
import path from 'path';
import {
    isRunningUnpacked,
    isRunningDebug,
    isRunningSpectronTestProcess,
    isRunningDevelopment,
    isCI
} from 'appConstants';

const BACKGROUND_PROCESS = `file://${__dirname}/bg.html`;
let backgroundProcess = null;
const setupBackground = async ( ) => new Promise( ( resolve, reject ) => {
    logger.info( 'Setting up Background Process' );

    if ( backgroundProcess === null )
    {
        logger.info('loading bg:', BACKGROUND_PROCESS );

        backgroundProcess = new BrowserWindow( {
            width          : 300,
            height         : 450,
            show           : false,
            frame          : false,
            fullscreenable : false,
            resizable      : false,
            transparent    : true,
            webPreferences : {
                // partition               : 'persist:safe-tab', // TODO make safe?
                nodeIntegration     : true,
                // Prevents renderer process code from not running when window is hidden
                backgroundThrottling: false
            }
        } );

        // Hide the window when it loses focus
      //   backgroundProcess.on('blur', () => {
      //     if (!backgroundProcess.webContents.isDevToolsOpened()) {
      //       backgroundProcess.hide()
      //     }
      // });

        backgroundProcess.webContents.on( 'did-finish-load', () =>
        {
            logger.verbose( 'Background process renderer loaded.');

            if( isRunningSpectronTestProcess || isCI ) return resolve( backgroundProcess );

            if( isRunningDebug || isRunningUnpacked || isRunningDevelopment )
            {
                backgroundProcess.webContents.openDevTools({ mode: 'detach' });
            }
            resolve( backgroundProcess );
        } );

        backgroundProcess.webContents.on( 'did-fail-load', ( event, code, message ) =>
        {
            logger.error('>>>>>>>>>>>>>>>>>>>>>>>> Bg process failed to load <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<')
            reject( message );
        } );

        backgroundProcess.loadURL( BACKGROUND_PROCESS );
    }
} );

export default setupBackground;
