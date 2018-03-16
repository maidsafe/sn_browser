import logger from 'logger';
import setupRoutes from './server-routes';
import registerSafeProtocol from './protocols/safe';
import registerSafeAuthProtocol from './protocols/safe-auth';
import blockNonSAFERequests from './blockNonSafeReqs';
import { setIsMock } from 'actions/peruse_actions';
import { isRunningMock } from 'appConstants';

const init = async ( store ) =>
{
    logger.info( 'Registering SAFE Network Protocols' );
    try
    {
        registerSafeProtocol( store );
        registerSafeAuthProtocol( store );
        blockNonSAFERequests();
    }
    catch ( e )
    {
        logger.error( 'Load extensions error: ', e );
    }
};

const onOpen = ( store ) =>
{
    store.dispatch( setIsMock( isRunningMock ) );
}

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
    onOpen
    // middleware
};
