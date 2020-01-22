import { remote } from 'electron';
import url from 'url';

import { logger } from '$Logger';
import { CONFIG, PROTOCOLS } from '$Constants';

export const registerSafeProtocol = () => {
    logger.info( `${PROTOCOLS.SAFE} Registering` );
    // bind to partition.
    const partition = CONFIG.SAFE_PARTITION;
    const ses = remote.session.fromPartition( partition );

    // TODO: Is it better to have one safe protocol
    // Would ports automatically routing locally make things simpler?
    ses.protocol.registerHttpProtocol(
        PROTOCOLS.SAFE,
        ( request, callback ) => {
            logger.info( `safe:// req url being parsed: ${request.url}` );
            const parsedUrl = url.parse( request.url );

            const { host, query } = parsedUrl;

            if ( !host ) {
                return;
            }

            const path = parsedUrl.pathname || '';

            // TODO. Sort out when/where with slash
            let newUrl = `http://localhost:${CONFIG.PORT}/safe://${host}${path}${
                query ? `?${query}` : ''
            }`;

            // Allow localhost to be served as safe://
            if ( parsedUrl.hostname === 'localhost' && parsedUrl.port ) {
                newUrl = `http://localhost:${parsedUrl.port}${path}${
                    query ? `?${query}` : ''
                }`;
            }

            callback( { url: newUrl } );
        },
        ( error ) => {
            if ( !error ) return;

            if ( error.message === 'The scheme has been registered' ) {
                logger.info( 'SAFE protocol already registered, so dont worry' );
            } else {
                throw error;
            }
        }
    );
};
