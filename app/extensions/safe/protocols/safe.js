import { session, app } from 'electron';
import url from 'url';
import logger from 'logger';
import { CONFIG, PROTOCOLS,APP_INFO, isRunningPackaged } from 'constants';

// import sysUri from '../ffi/sys_uri';

const registerSafeProtocol = () =>
{
    logger.verbose( `${PROTOCOLS.SAFE} Registering` );

    // bind to partition.
    const partition = CONFIG.SAFE_PARTITION;
    const ses = session.fromPartition( partition );

    // TODO: Is it better to have one safe protocol. Would ports automatically routing locally make things simpler?
    ses.protocol.registerHttpProtocol( PROTOCOLS.SAFE, ( req, cb ) =>
    {
        logger.verbose( `safe:// req url being parsed: ${req.url}` );
        const parsedUrl = url.parse( req.url );
        let host = parsedUrl.host;

        if ( !host )
        {
            return;
        }

        if ( host.indexOf( '.' ) < 1 )
        {
            host = `www.${parsedUrl.host}`;
        }

        const path = parsedUrl.pathname || '';

        // TODO. Sort out when/where with slash
        const newUrl = `http://localhost:${CONFIG.PORT}/safe/${host}${path}`;

        cb( { url: newUrl } );
    }, ( err ) =>
    {
        if ( err ) console.error( 'Failed to register SAFE protocol' );
    } );
};

export default registerSafeProtocol;
