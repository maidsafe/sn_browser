import { app } from 'electron';
import util from 'util';
import { env,
    isRunningUnpacked,
    isRunningPackaged,
    isRunningProduction,
    isRunningDevelopment,
    isRunningSpectronTest
} from 'constants';

const log = require( 'electron-log' );
// Log level
// error, warn, info, verbose, debug, silly
log.transports.console.level = 'verbose';

/**
 * Set output format template. Available variables:
 * Main: {level}, {text}
 * Date: {y},{m},{d},{h},{i},{s},{ms}
 */
log.transports.console.format = '{h}:{i}:{s}:{ms} {text}';

// Set a function which formats output
log.transports.console.format = ( msg ) => util.format( ...msg.data );

log.transports.file.level = 'verbose';
log.transports.file.format = '{h}:{i}:{s}:{ms} {text}';

// Set approximate maximum log size in bytes. When it exceeds,
// the archived log will be saved as the log.old.log file
log.transports.file.maxSize = 5 * 1024 * 1024;

// TODO: add buld ID if prod. Incase you're opening up, NOT THIS BUILD.
log.info( '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>' );
log.info( `      Started with node env: ${env}` );
log.info( '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>' );

log.verbose( 'Running with derived constants:' );
log.verbose( '' );
log.verbose( 'isRunningUnpacked?', isRunningUnpacked );
log.verbose( 'isRunningPackaged?', isRunningPackaged );
log.verbose( 'isRunningProduction?', isRunningProduction );
log.verbose( 'isRunningDevelopment?', isRunningDevelopment );
log.verbose( 'isRunningSpectronTest?', isRunningSpectronTest );
log.verbose( '' );
log.verbose( '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>' );
log.verbose( '' );

process.on( 'uncaughtTypeError', ( err ) =>
{
    log.error( '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>' );
    log.error( 'whoops! there was an uncaught type error:' );
    log.error( err );
    log.error( err.file );
    log.error( err.line );
    log.error( '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>' );
} );

process.on( 'uncaughtException', ( err ) =>
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

export default log;
