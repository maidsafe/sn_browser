import logger from 'logger';
import { isRunningProduction, SAFE } from 'appConstants';
import setupRoutes from './server-routes';
import registerSafeProtocol from './protocols/safe';

import registerSafeAuthProtocol from './protocols/safe-auth';

import { initAnon, initMock } from './network';

import * as authAPI from './auth-api';

import blockNonSAFERequests from './blockNonSafeReqs';
import handleMainStoreChanges from './network/handleStoreChanges';


const init = async ( store ) =>
{
    logger.info( 'Registering SAFE Network Protocols' );
    registerSafeProtocol();
    registerSafeAuthProtocol();


    //TODO: Curerently this is duplicated in BG and netowrk....
    try
    {
        // setup auth
        authAPI.ffi.ffiLoader.loadLibrary();

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
        handleMainStoreChanges( store );
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
