import logger from 'logger';
import setupRoutes from './server-routes';
import registerSafeProtocol from './protocols/safe';
import registerSafeAuthProtocol from './protocols/safe-auth';
import blockNonSAFERequests from './blockNonSafeReqs';
import { setIsMock } from 'actions/peruse_actions';
import { isRunningMock, isRunningSpectronTestProcess } from 'appConstants';
import handlePeruseStoreChanges from './peruseSafeApp';

const onInitBgProcess = async ( store ) =>
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

    store.subscribe( () =>
    {
        handlePeruseStoreChanges( store );
    })
};

const onOpen = ( store ) =>
{
    store.dispatch( setIsMock( isRunningMock ) );
}

const middleware = store => next => action =>
{
    if( isRunningSpectronTestProcess )
    {
        logger.info( 'ACTION:', action );
    }

    return next( action );
};



export default {
    onInitBgProcess,
    setupRoutes,
    onOpen,
    middleware
};
