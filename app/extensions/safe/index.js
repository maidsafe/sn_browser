import logger from 'logger';
import setupRoutes from './server-routes';
import registerSafeProtocol from './protocols/safe';
import registerSafeAuthProtocol from './protocols/safe-auth';
import blockNonSAFERequests from './blockNonSafeReqs';

const init = async ( store ) =>
{
    logger.info( 'Registering SAFE Network Protocols' );
    registerSafeProtocol();
    registerSafeAuthProtocol();

    blockNonSAFERequests();

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
