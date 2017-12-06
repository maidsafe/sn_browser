import url from 'url';
import logger from 'logger';
import { CONFIG, PROTOCOLS } from 'constants';

import { session } from 'electron';


export const registerSafeLocalhostProtocol = () =>
{
    logger.info( 'Registering localhost scheme');
    const partition = CONFIG.SAFE_PARTITION;
    const ses = session.fromPartition( partition );

    ses.protocol.registerHttpProtocol( PROTOCOLS.SAFE_LOCAL, ( req, cb ) =>
    {
        const parsedURL = url.parse( req.url );

        const newUrl = `http://127.0.0.1:${parsedURL.host}${parsedURL.path || ''}`;

        cb( { url: newUrl } );
    }, ( err ) =>
    {
        if ( err )
            logger.error( 'Problem registering localhost', err )
    } );
};

export default registerSafeLocalhostProtocol;
