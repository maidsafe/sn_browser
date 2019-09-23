import { BrowserWindow } from 'electron';
import { logger } from '$Logger';
// import path from 'path';
import {
    isRunningUnpacked,
    isRunningDebug,
    isRunningTestCafeProcess,
    isCI
} from '$Constants';

const BACKGROUND_PROCESS = `file://${__dirname}/bg.html`;

let backgroundProcessWindow = null;
export const setupBackground = async () =>
    new Promise(
        ( resolve, reject ): BrowserWindow => {
            logger.info( 'Setting up Background Process' );

            if ( backgroundProcessWindow === null ) {
                logger.info( 'loading bg:', BACKGROUND_PROCESS );

                backgroundProcessWindow = new BrowserWindow( {
                    width: 300,
                    height: 450,
                    show: false,
                    frame: false,
                    fullscreenable: false,
                    resizable: false,
                    transparent: true,
                    webPreferences: {
                        // partition               : 'persist:safe-tab', // TODO make safe?
                        nodeIntegration: true,
                        // Prevents renderer process code from not running when window is hidden
                        backgroundThrottling: false
                    }
                } );

                if ( isRunningDebug && !isRunningTestCafeProcess ) {
                    backgroundProcessWindow.webContents.on( 'did-finish-load', () => {
                        backgroundProcessWindow.webContents.openDevTools( {
                            mode: 'undocked'
                        } );
                    } );
                }

                // Hide the window when it loses focus
                //   backgroundProcessWindow.on('blur', () => {
                //     if (!backgroundProcessWindow.webContents.isDevToolsOpened()) {
                //       backgroundProcessWindow.hide()
                //     }
                // });

                backgroundProcessWindow.webContents.on( 'did-finish-load', (): void => {
                    logger.info( 'Background process renderer loaded.' );

                    // if ( isRunningTestCafeProcess || isCI )
                    //     return resolve( backgroundProcessWindow );

                    //         if (
                    //             isRunningDebug ||
                    // ( isRunningUnpacked && !isRunningTestCafeProcess )
                    //         ) {
                    //             logger.info( 'SHOULD be loading BR process devvvvvv' );
                    //             backgroundProcessWindow.webContents.on( 'did-frame-finish-load', () => {
                    //             backgroundProcessWindow.openDevTools( {
                    //                 mode: 'undocked'
                    //             } );
                    //             } );
                    //         }
                    return resolve( backgroundProcessWindow );
                } );

                backgroundProcessWindow.webContents.on(
                    'did-fail-load',
                    ( event, code, message ) => {
                        logger.error(
                            '>>>>>>>>>>>>>>>>>>>>>>>> Bg process failed to load <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<'
                        );
                        reject( message );
                    }
                );

                backgroundProcessWindow.webContents.on(
                    'preload-error',
                    ( event, code, message ) => {
                        logger.error(
                            '>>>>>>>>>>>>>>>>>>>>>>>> Bg process preload error <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<'
                        );
                        reject( message );
                    }
                );

                backgroundProcessWindow.webContents.on(
                    'crashed',
                    ( event, code, message ) => {
                        logger.error(
                            '>>>>>>>>>>>>>>>>>>>>>>>> Bg process crashed <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<'
                        );
                        logger.error( event, message );
                        reject( message );
                    }
                );

                backgroundProcessWindow.loadURL( BACKGROUND_PROCESS );
            }

            return backgroundProcessWindow;
        }
    );
