import logger from 'logger';
import { isRunningProduction, SAFE } from 'appConstants';
import setupRoutes from './server-routes';
import registerSafeProtocol from './protocols/safe';

import registerSafeAuthProtocol from './protocols/safe-auth';
import ipc from './ffi/ipc';

import { initAnon, initMock } from './network';
// import * as tabsActions from 'actions/tabs_actions';

import * as authAPI from './auth-api';

import blockNonSAFERequests from './blockNonSafeReqs';
import handleStoreChanges from './handleStoreChanges';


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

    store.subscribe( async () =>
    {
        handleStoreChanges( store );
    } );
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
//


export default {
    init,
    setupRoutes,
    // middleware
};
