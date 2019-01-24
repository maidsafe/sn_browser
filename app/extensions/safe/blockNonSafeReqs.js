import { remote, shell } from 'electron';
import { parse as parseURL } from 'url';
import path from 'path';
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
    const httpRegExp = new RegExp( '^http' );

    const safeSession = remote.session.fromPartition( CONFIG.SAFE_PARTITION );

    safeSession.webRequest.onBeforeRequest( filter, ( details, callback ) =>
    {
        if ( urlIsAllowedBySafe( details.url ) )
        {
            logger.debug( `Allowing url ${ details.url }` );
            callback( {} );
            return;
        }


        // HACK for idMgr and Patter. until:
        // https://github.com/parcel-bundler/parcel/issues/1663
        if ( details.url.includes( 'font_148784_v4ggb6wrjmkotj4i' ) )
        {
            const thePath = parseURL( details.url ).path;
            const ext = path.extname( thePath );

            const newUrl = `http://localhost:${ CONFIG.PORT }/dummy/iconfont${ ext }`;
            callback( { redirectURL: newUrl } );
            return;
        }

        if ( httpRegExp.test( details.url ) )
        {
            try
            {
                logger.info( 'about to call shell.openExternal in blockNonSafeReqs?', details.url );
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
