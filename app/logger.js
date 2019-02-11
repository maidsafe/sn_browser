import path from 'path';
import os from 'os';
import {
    env,
    isRunningUnpacked,
    isRunningPackaged,
    isRunningDebug,
    // inBgProcess,
    startedRunningProduction,
    startedRunningMock,
    isRunningSpectronTestProcess,
    isRunningSpectronTestProcessingPackagedApp,
    inMainProcess,
    isCI
} from '@Constants';
import fileLogger from 'electron-log';
// import log from 'electron-timber';

// const log = require( 'electron-timber' );

const processLog = fileLogger;

if ( fileLogger.transports )
{
    // Log level
    // error, warn, log, log, debug, silly
    // fileLogger.transports.console.level = 'silly';
    fileLogger.transports.file.level = 'silly';

    if ( !isRunningDebug && isRunningPackaged )
    {
        // fileLogger.transports.console.level = 'warn';
        fileLogger.transports.file.level = 'warn';
    }

    fileLogger.transports.file.file = path.resolve(
        os.tmpdir(),
        'safe-browser.log'
    );

    // Set a function which formats output
    fileLogger.transports.console.level = false;
    // fileLogger.transports.console.format = ( msg ) => util.format( ...msg.data );

    fileLogger.transports.file.format = '{h}:{i}:{s}:{ms} {text}';

    // Set approximate maximum fileLogger size in bytes. When it exceeds,
    // the archived fileLogger will be saved as the fileLogger.old.fileLogger file
    fileLogger.transports.file.maxSize = 5 * 1024 * 1024;
}

const combinedLogger = {
    info : ( ...args ) =>
    {
        // processLog.log( ...args );
        fileLogger.info( ...args );
    },
    log : ( ...args ) =>
    {
        // processLog.log( ...args );
        fileLogger.info( ...args );
    },
    error : ( ...args ) =>
    {
        fileLogger.error( ...args );
        // processLog.error( ...args );
    },
    warn : ( ...args ) =>
    {
        fileLogger.warn( ...args );
        // processLog.warn( ...args );
    }
};

export default combinedLogger;

// HACK: for jest
if ( inMainProcess )
{
    // TODO: add buld ID if prod. Incase you're opening up, NOT THIS BUILD.
    combinedLogger.log( '' );
    combinedLogger.log( '' );
    combinedLogger.log( '' );
    combinedLogger.log( '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>' );
    combinedLogger.log( `      Started with node env: ${ env }` );
    // combinedLogger.log( '       Log location:', combinedLogger.transports.file.file );
    combinedLogger.log( '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>' );
    combinedLogger.log( 'Running with derived constants:' );
    combinedLogger.log( '' );
    combinedLogger.log( 'isCI?: ', isCI );
    combinedLogger.log( 'process.env.NODE_ENV: ', process.env.NODE_ENV );
    combinedLogger.log( 'isRunningDebug?', isRunningDebug );
    combinedLogger.log( 'isRunningUnpacked?', isRunningUnpacked );
    combinedLogger.log( 'isRunningPackaged?', isRunningPackaged );
    combinedLogger.log( 'inMainProcess?', inMainProcess );
    combinedLogger.log( 'startedRunningProduction?', startedRunningProduction );
    combinedLogger.log( 'startedRunningMock?', startedRunningMock );
    combinedLogger.log(
        'isRunningSpectronTestProcess?',
        isRunningSpectronTestProcess
    );
    combinedLogger.log(
        'isRunningSpectronTestProcessingPackagedApp?',
        isRunningSpectronTestProcessingPackagedApp
    );
    combinedLogger.log( '' );
    combinedLogger.log( '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>' );
    combinedLogger.log( '' );

    process.on( 'uncaughtTypeError', err =>
    {
        combinedLogger.error(
            '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>'
        );
        combinedLogger.error( 'whoops! there was an uncaught type error:' );
        combinedLogger.error( err );
        combinedLogger.error( err.file );
        combinedLogger.error( err.line );
        combinedLogger.error(
            '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>'
        );
    } );

    process.on( 'uncaughtException', err =>
    {
        combinedLogger.error(
            '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>'
        );
        combinedLogger.error( 'whoops! there was an uncaught error:' );
        combinedLogger.error( err );
        combinedLogger.error( err.file );
        combinedLogger.error( err.line );
        combinedLogger.error(
            '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>'
        );
    } );

    process.on( 'unhandledRejection', ( reason, p ) =>
    {
        combinedLogger.error(
            '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>'
        );
        combinedLogger.error(
            'Unhandled Rejection. Reason:',
            reason.message || reason
        );
        combinedLogger.error( 'At:', p );
        combinedLogger.error(
            '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>'
        );
    } );
}
