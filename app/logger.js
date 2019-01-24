import path from 'path';
import os from 'os';
import { env,
    isRunningUnpacked,
    isRunningPackaged,
    isRunningDebug,
    startedRunningProduction,
    startedRunningMock,
    isRunningSpectronTestProcess,
    isRunningSpectronTestProcessingPackagedApp,
    inMainProcess,
    isCI,
    TESTENV
} from 'appConstants';

const log = require( 'electron-log' );

if ( log.transports )
{
    // Log level
    // error, warn, info, verbose, debug, silly
    log.transports.console.level = 'silly';
    log.transports.file.level = 'silly';

    if ( !isRunningDebug && isRunningPackaged )
    {
        log.transports.console.level = 'warn';
        log.transports.file.level = 'warn';
    }

    log.transports.file.file = path.resolve( os.tmpdir(), 'safe-browser.log' );

    /**
    * Set output format template. Available variables:
    * Main: {level}, {text}
    * Date: {y},{m},{d},{h},{i},{s},{ms}
    */
    log.transports.console.format = '{h}:{i}:{s}:{ms} {text}';

    // Set a function which formats output
    // log.transports.console.format = ( msg ) => util.format( ...msg.data );

    log.transports.file.format = '{h}:{i}:{s}:{ms} {text}';

    // Set approximate maximum log size in bytes. When it exceeds,
    // the archived log will be saved as the log.old.log file
    log.transports.file.maxSize = 5 * 1024 * 1024;
}

// HACK: for jest
if ( log.info && log.verbose && inMainProcess )
{
    // TODO: add buld ID if prod. Incase you're opening up, NOT THIS BUILD.
    log.verbose( '' );
    log.verbose( '' );
    log.verbose( '' );
    log.info( '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>' );
    log.info( `      Started with node env: ${ env }` );
    log.info( '       Log location:', log.transports.file.file );
    log.info( '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>' );
    log.verbose( 'Running with derived constants:' );
    log.verbose( '' );
    log.verbose( 'isCI?', isCI );
    log.verbose( 'TESTENV?', TESTENV );
    log.verbose( 'isRunningDebug?', isRunningDebug );
    log.verbose( 'isRunningUnpacked?', isRunningUnpacked );
    log.verbose( 'isRunningPackaged?', isRunningPackaged );
    log.verbose( 'inMainProcess?', inMainProcess );
    log.verbose( 'startedRunningProduction?', startedRunningProduction );
    log.verbose( 'startedRunningMock?', startedRunningMock );
    log.verbose( 'isRunningSpectronTestProcess?', isRunningSpectronTestProcess );
    log.verbose( 'isRunningSpectronTestProcessingPackagedApp?', isRunningSpectronTestProcessingPackagedApp );
    log.verbose( '' );
    log.verbose( '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>' );
    log.verbose( '' );

    process.on( 'uncaughtTypeError', err =>
    {
        log.error( '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>' );
        log.error( 'whoops! there was an uncaught type error:' );
        log.error( err );
        log.error( err.file );
        log.error( err.line );
        log.error( '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>' );
    } );

    process.on( 'uncaughtException', err =>
    {
        log.error( '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>' );
        log.error( 'whoops! there was an uncaught error:' );
        log.error( err );
        log.error( err.file );
        log.error( err.line );
        log.error( '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>' );
    } );

    process.on( 'unhandledRejection', ( reason, p ) =>
    {
        log.error( '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>' );
        log.error( 'Unhandled Rejection. Reason:', reason.message || reason );
        log.error( 'At:', p );
        log.error( '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>' );
    } );
}

export default log;
