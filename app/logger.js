import path from 'path';
import os from 'os';
import util from 'util';

import {
    currentWindowId,
    env,
    isRunningUnpacked,
    isRunningPackaged,
    isRunningDebug,
    inBgProcess,
    startedRunningProduction,
    startedRunningMock,
    isRunningSpectronTestProcess,
    isRunningSpectronTestProcessingPackagedApp,
    inMainProcess,
    isCI
} from '@Constants';
import logger from 'electron-log';

if ( logger.transports )
{
    // Log level
    // error, warn, log, log, debug, silly
    // logger.transports.console.level = 'silly';
    logger.transports.file.level = 'silly';

    if ( !isRunningDebug && isRunningPackaged )
    {
        // logger.transports.console.level = 'warn';
        logger.transports.file.level = 'warn';
    }

    logger.transports.file.file = path.resolve(
        os.tmpdir(),
        'safe-browser.log'
    );

    logger.transports.console.format = '[{label} {h}:{i}:{s}.{ms}] › {text}';
    if ( currentWindowId )
    {
        logger.variables.label = `window ${ currentWindowId }`;
    }
    if ( inMainProcess )
    {
        logger.variables.label = 'main';
        logger.transports.console.format = '%c[{label} {h}:{i}:{s}.{ms}]%c › {text}';
    }

    if ( inBgProcess )
    {
        logger.variables.label = 'background';
    }

    logger.transports.file.maxSize = 5 * 1024 * 1024;
}


export default logger;

// HACK: for jest
if ( inMainProcess )
{
    // TODO: add buld ID if prod. Incase you're opening up, NOT THIS BUILD.
    logger.info( '' );
    logger.info( '' );
    logger.info( '' );
    logger.info( '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>' );
    logger.info( `      Started with node env: ${ env }` );
    // logger.info( '       Log location:', logger.transports.file.file );
    logger.info( '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>' );
    logger.info( 'Running with derived constants:' );
    logger.info( '' );
    logger.info( 'isCI?: ', isCI );
    logger.info( 'process.env.NODE_ENV: ', process.env.NODE_ENV );
    logger.info( 'isRunningDebug?', isRunningDebug );
    logger.info( 'isRunningUnpacked?', isRunningUnpacked );
    logger.info( 'isRunningPackaged?', isRunningPackaged );
    logger.info( 'inMainProcess?', inMainProcess );
    logger.info( 'startedRunningProduction?', startedRunningProduction );
    logger.info( 'startedRunningMock?', startedRunningMock );
    logger.info(
        'isRunningSpectronTestProcess?',
        isRunningSpectronTestProcess
    );
    logger.info(
        'isRunningSpectronTestProcessingPackagedApp?',
        isRunningSpectronTestProcessingPackagedApp
    );
    logger.info( '' );
    logger.info( '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>' );
    logger.info( '' );

    process.on( 'uncaughtTypeError', err =>
    {
        logger.error(
            '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>'
        );
        logger.error( 'whoops! there was an uncaught type error:' );
        logger.error( err );
        logger.error( err.file );
        logger.error( err.line );
        logger.error(
            '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>'
        );
    } );

    process.on( 'uncaughtException', err =>
    {
        logger.error(
            '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>'
        );
        logger.error( 'whoops! there was an uncaught error:' );
        logger.error( err );
        logger.error( err.file );
        logger.error( err.line );
        logger.error(
            '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>'
        );
    } );

    process.on( 'unhandledRejection', ( reason, p ) =>
    {
        logger.error(
            '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>'
        );
        logger.error(
            'Unhandled Rejection. Reason:',
            reason.message || reason
        );
        logger.error( 'At:', p );
        logger.error(
            '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>'
        );
    } );
}
