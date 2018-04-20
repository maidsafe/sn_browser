import logger from 'logger';
import setupRoutes from './server-routes';
import registerSafeProtocol from './protocols/safe';
import registerSafeAuthProtocol from './protocols/safe-auth';
import blockNonSAFERequests from './blockNonSafeReqs';
import { setIsMock } from 'actions/peruse_actions';
import { isRunningMock, isRunningSpectronTestProcess } from 'appConstants';
import handlePeruseStoreChanges from './peruseSafeApp';
import loadSafeLibs from './loadSafeLibs';
import { setIPCStore } from 'extensions/safe/ffi/ipc';
import sysUri from 'extensions/safe/ffi/sys_uri';
import { APP_INFO, PROTOCOLS } from 'appConstants';

const onInitBgProcess = async ( store ) =>
{
    logger.info( 'Registering SAFE Network Protocols' );
    try
    {
        registerSafeProtocol( store );
        registerSafeAuthProtocol( store );
        blockNonSAFERequests();
        setIPCStore(store);
    }
    catch ( e )
    {
        logger.error( 'Load extensions error: ', e );
    }

    store.subscribe( () =>
    {
        handlePeruseStoreChanges( store );
        loadSafeLibs( store );
    });

    const mainAppInfo = APP_INFO.info;
    const authAppInfo = {
        ...mainAppInfo,
        id     : 'net.maidsafe.app.browser.authenticator',
        name   : 'SAFE Browser Authenticator',
        icon   : 'iconPath'
    }

    logger.verbose( 'Auth application info', authAppInfo );
    sysUri.registerUriScheme( authAppInfo, PROTOCOLS.SAFE_AUTH );
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
