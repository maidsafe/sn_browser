import path from 'path';
import os from 'os';

import log from 'electron-log';
import {
    currentWindowId,
    env,
    inTabProcess,
    isRunningUnpacked,
    isRunningPackaged,
    isRunningDebug,
    inBgProcess,
    startedRunningProduction,
    startedRunningMock,
    isRunningSpectronTestProcess,
    isRunningSpectronTestProcessingPackagedApp,
    isRunningTestCafeProcess,
    inMainProcess,
    isCI
} from '$Constants';

if ( log.transports ) {
    // Log level
    // error, warn, log, log, debug, silly
    // log.transports.console.level = 'silly';
    log.transports.file.level = 'silly';

    if (
        isRunningSpectronTestProcess ||
    process.env.NODE_ENV === 'test' ||
    ( !isRunningDebug && isRunningPackaged )
    ) {
        log.transports.file.level = 'warn';
        log.transports.console.level = 'warn';
    }

    log.transports.file.file = path.resolve( os.tmpdir(), 'safe-browser.log' );

    log.transports.console.format = '[{label} {h}:{i}:{s}.{ms}] › {text}';
    if ( inTabProcess ) {
        log.variables.label = `A Tab: `;
    }
    if ( currentWindowId ) {
        log.variables.label = `window ${currentWindowId}`;
    }
    if ( inMainProcess ) {
        log.variables.label = 'main';
        log.transports.console.format = '%c[{label} {h}:{i}:{s}.{ms}]%c › {text}';
    }

    if ( inBgProcess ) {
        log.variables.label = 'background';
    }

    log.transports.file.maxSize = 5 * 1024 * 1024;
}

// HACK: for jest
if ( inMainProcess && !isRunningSpectronTestProcess ) {
    // TODO: add buld ID if prod. Incase you're opening up, NOT THIS BUILD.
    log.info( '' );
    log.info( '' );
    log.info( '' );
    log.info( '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>' );
    log.info( `      Started with node env: ${env}` );
    log.info( '       Log location:', log.transports.file.file );
    log.info( '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>' );
    log.info( 'Running with derived constants:' );
    log.info( '' );
    log.info( 'isCI?: ', isCI );
    log.info( 'process.env.NODE_ENV: ', process.env.NODE_ENV );
    log.info( 'isRunningDebug?', isRunningDebug );
    log.info( 'isRunningUnpacked?', isRunningUnpacked );
    log.info( 'isRunningPackaged?', isRunningPackaged );
    log.info( 'inMainProcess?', inMainProcess );
    log.info( 'startedRunningProduction?', startedRunningProduction );
    log.info( 'startedRunningMock?', startedRunningMock );
    log.info( 'isRunningSpectronTestProcess?', isRunningSpectronTestProcess );
    log.info( 'isRunningTestCafeProcess?', isRunningTestCafeProcess );
    log.info(
        'isRunningSpectronTestProcessingPackagedApp?',
        isRunningSpectronTestProcessingPackagedApp
    );
    log.info( '' );
    log.info( '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>' );
    log.info( '' );

    process.on( 'uncaughtTypeError', ( error ) => {
        log.error( '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>' );
        log.error( 'whoops! there was an uncaught type error:' );
        log.error(
            JSON.stringify( error, [
                'message',
                'arguments',
                'type',
                'name',
                'file',
                'line'
            ] )
        );
        log.error( error );

        if ( error && error.line ) log.error( error.line );

        if ( error && error.file ) log.error( error.file );

        log.error( '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>' );
    } );

    process.on( 'uncaughtException', ( error: NodeError ) => {
        log.error( '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>' );
        log.error( 'whoops! there was an uncaught error:' );

        if ( inMainProcess ) {
            log.error( 'In the main process' );
        }

        if ( inBgProcess ) {
            log.error( 'In the bg process' );
        }

        log.error(
            JSON.stringify( error, [
                'message',
                'arguments',
                'type',
                'name',
                'file',
                'line'
            ] )
        );
        if ( error && error.line ) log.error( error.line );

        if ( error && error.file ) log.error( error.file );

        log.error( '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>' );
    } );

    process.on( 'unhandledRejection', ( error: NodeError ) => {
        log.error( '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>' );
        log.error( 'Unhandled Rejection. Reason:', error );
        log.error(
            JSON.stringify( error, [
                'message',
                'arguments',
                'type',
                'name',
                'file',
                'line'
            ] )
        );

        if ( error && error.line ) log.error( error.line );

        if ( error && error.file ) log.error( error.file );

        log.error( '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>' );
    } );
}

export const logger = log;
