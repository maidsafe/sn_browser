import { remote, shell } from 'electron';
import { CONFIG } from 'appConstants';
import { urlIsAllowedBySafe } from './utils/safeHelpers';
import logger from 'logger';

// const isForLocalServer = ( parsedUrlObject ) =>
//     parsedUrlObject.protocol === 'localhost:' || parsedUrlObject.hostname === '127.0.0.1';


const blockNonSAFERequests = () =>
{
    const filter = {
        urls : ['*://*']
    };

    const safeSession = remote.session.fromPartition( CONFIG.SAFE_PARTITION );

    safeSession.webRequest.onBeforeRequest( filter, ( details, callback ) =>
    {
        if ( urlIsAllowedBySafe( details.url ) )
        {
            logger.debug( `Allowing url ${details.url}` );
            callback( {} );
            return;
        }

        if ( details.url.indexOf( 'http' ) > -1 )
        {
            try
            {
                shell.openExternal( details.url );
            }
            catch ( e )
            {
                logger.error( e );
            }
        }

        logger.info( 'Blocked req:', details.url );
        callback( { cancel: true } );
    } );
};

export default blockNonSAFERequests;
