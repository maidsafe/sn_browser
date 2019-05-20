import { logger } from '$Logger';
import { CONFIG, PROTOCOLS } from '$Constants';

import { remote } from 'electron';
/* eslint-enable import/extensions */

export const registerSafeAuthProtocol = () => {
    logger.info( 'Registering safe-auth scheme' );
    const partition = CONFIG.SAFE_PARTITION;
    const ses = remote.session.fromPartition( partition );

    ses.protocol.registerHttpProtocol(
        PROTOCOLS.SAFE_AUTH,
        ( req, cb ) => {
            logger.info( `Protocol:: safe-auth:// url being parsed: ${req.url}` );

            // TODO. Sort out when/where with slash
            const newUrl = `http://localhost:${CONFIG.PORT}/auth/${req.url}`;

            cb( { url: newUrl } );
        },
        ( err ) => {
            if ( !err ) return;

            if ( err.message === 'The scheme has been registered' ) {
                logger.info( 'SAFE-AUTH protocol already registered, so dont worry' );
            } else {
                throw err;
            }
        }
    );
};
