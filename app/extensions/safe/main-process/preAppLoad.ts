import { Store } from 'redux';
import { app } from 'electron';
import { isRunningUnpacked } from '$Constants';
import { logger } from '$Logger';

export const preAppLoad = ( _store: Store ) => {
    if ( isRunningUnpacked && process.platform === 'win32' ) return;
    app.setAsDefaultProtocolClient( 'safe-auth' );
    app.setAsDefaultProtocolClient( 'safe' );
    const isDefaultAuth = app.isDefaultProtocolClient( 'safe-auth' );
    const isDefaultSafe = app.isDefaultProtocolClient( 'safe' );
    logger.info( 'Registered to handle safe: urls ? ', isDefaultSafe );
    logger.info( 'registered to handle safe-auth: urls ?', isDefaultAuth );
};
