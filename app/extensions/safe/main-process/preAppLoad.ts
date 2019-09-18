import { Store } from 'redux';
import { app, protocol } from 'electron';
import { isRunningUnpacked } from '$Constants';
import { logger } from '$Logger';
// import buildConfig from '$BuilderConfig';

export const preAppLoad = ( _store: Store ) => {
    if ( isRunningUnpacked && process.platform === 'win32' ) return;

    // protocol.registerStandardSchemes( buildConfig.protocols.schemes, { secure: true } );
    protocol.registerSchemesAsPrivileged( [
        {
            scheme: 'safe',
            privileges: {
                standard: true,
                secure: true,
                allowServiceWorkers: true,
                corsEnabled: true
            }
        }
    ] );

    app.setAsDefaultProtocolClient( 'safe' );

    const isDefaultSafe = app.isDefaultProtocolClient( 'safe' );
    logger.info( 'Registered to handle safe: urls ? ', isDefaultSafe );
};
