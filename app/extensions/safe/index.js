import { session, shell } from 'electron';
import logger from 'logger';
import { CONFIG, isRunningProduction } from 'appConstants';
import setupRoutes from './server-routes';
import registerSafeProtocol from './protocols/safe';
import registerSafeAuthProtocol from './protocols/safe-auth';
import ipc from './ffi/ipc';
import { initAnon, initMock } from './network';
import * as tabsActions from 'actions/tabs_actions';
import { urlIsAllowed } from './utils/safeHelpers';
import * as authAPI from './auth-api';


const isForLocalServer = ( parsedUrlObject ) =>
{
    return parsedUrlObject.protocol === `localhost:` || parsedUrlObject.hostname === '127.0.0.1';
}

const blockNonSAFERequests = () =>
{
    const filter = {
        urls : ['*://*']
    };

    const safeSession = session.fromPartition( CONFIG.SAFE_PARTITION );

    safeSession.webRequest.onBeforeRequest( filter, ( details, callback ) =>
    {

        if ( urlIsAllowed( details.url ) )
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

    blockNonSAFERequests();

    // if we want to do something with the store, we would do it here.
    // store.subscribe( () =>
    // {
    // } );
};

// const middleware = store => next => action =>
// {
//     logger.info( 'ACTION:paylos', action.payload.url );
//
//     if ( action.type === tabsActions.TYPES.ADD_TAB && action.payload.url && action.payload.url.startsWith( 'http' ) )
//     {
//         let newAction = { ...action, type: 'cancelled' }
//         return 'boop';
//     }
//
//     // return next( action );
// };

export default {
    init,
    setupRoutes,
    // middleware
};
