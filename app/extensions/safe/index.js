import { session, shell } from 'electron';
import url from 'url';
import logger from 'logger';
import { CONFIG, isRunningProduction } from 'constants';
import setupRoutes from './server-routes';
import registerSafeProtocol from './protocols/safe';
import registerSafeAuthProtocol from './protocols/safe-auth';
import ipc from './ffi/ipc';
import { initAnon, initMock } from './network';

import * as authAPI from './auth-api';

const isForSafeServer = ( parsedUrlObject ) =>
    parsedUrlObject.host === `localhost:${CONFIG.PORT}`;

const blockNonSAFERequests = () =>
{
    const filter = {
        urls : ['*://*']
    };

    const safeSession = session.fromPartition( CONFIG.SAFE_PARTITION );

    safeSession.webRequest.onBeforeRequest( filter, ( details, callback ) =>
    {
        const target = url.parse( details.url );

        if ( target.protocol === 'safe:' || target.protocol === 'safe-auth:' ||
            target.protocol === 'chrome-devtools:' || target.protocol === 'file:' ||
            isForSafeServer( target ) )
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

        logger.debug( 'Blocked req:', details.url );
        callback( { cancel: true } );
    } );
};

const init = async ( store ) =>
{
    logger.info( 'Registering SAFE Network Protocols' );
    registerSafeProtocol();
    registerSafeAuthProtocol();

    try
    {
        // setup auth
        authAPI.ffi.ffiLoader.loadLibrary();

        // dont do this inside if auth ffi as circular dep
        ipc();

        if ( isRunningProduction )
        {
            await initAnon( store );
        }
        else
        {
            await initMock( store );
        }
    }
    catch ( e )
    {
        logger.info( 'Problems initing SAFE extension' );
        logger.info( e.message );
        logger.info( e );
    }
    // authAPI.client();
    blockNonSAFERequests();

    // if we want to do something with the store, we would do it here.
    // store.subscribe( () =>
    // {
    // } );
};

export default {
    init,
    setupRoutes
};
