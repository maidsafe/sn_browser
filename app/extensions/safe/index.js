import logger from 'logger';
import * as authenticatorActions from 'extensions/safe/actions/authenticator_actions';

// TODO: get this into the extension folder
import * as peruseAppActions from 'extensions/safe/actions/peruse_actions';

import { parse as parseURL } from 'url';
import setupRoutes from './server-routes';
import registerSafeProtocol from './protocols/safe';
import registerSafeAuthProtocol from './protocols/safe-auth';
import blockNonSAFERequests from './blockNonSafeReqs';
import { setIsMock } from 'extensions/safe/actions/peruse_actions';
import { startedRunningMock, isRunningSpectronTestProcess } from 'appConstants';
import handlePeruseStoreChanges from './peruseSafeApp';
import loadSafeLibs from './loadSafeLibs';
import { setIPCStore } from 'extensions/safe/ffi/ipc';
import sysUri from 'extensions/safe/ffi/sys_uri';
import { APP_INFO, PROTOCOLS } from 'appConstants';
import { addTab } from 'actions/tabs_actions';

import safeReducers from 'extensions/safe/reducers';
import webviewPreload from 'extensions/safe/webviewPreload';
import { handleRemoteCalls, remoteCallApis } from 'extensions/safe/handleRemoteCalls';

const onWebviewPreload = ( store ) =>
{
    return webviewPreload( store )
}


const preAppLoad = () =>
{

}

const addReducersToPeruse = ( ) =>
{
    return safeReducers;
}

const onRemoteCallInMain = ( store, allAPICalls, theCall ) => handleRemoteCalls(store, allAPICalls, theCall);

const getRemoteCallApis = () => remoteCallApis;

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
    logger.info('OnOpen: Setting mock in store. ', startedRunningMock)
    store.dispatch( setIsMock( startedRunningMock ) );
}

const middleware = store => next => action =>
{
    if( isRunningSpectronTestProcess )
    {
        logger.info( 'ACTION:', action );
    }

    return next( action );
};



const parseSafeUri = function ( uri )
{
    return uri.replace( '//', '' ).replace( '==/', '==' );
};

const onReceiveUrl = ( store, url ) =>
{
    const preParseUrl = parseSafeUri( url );
    const parsedUrl = parseURL( preParseUrl );

    // TODO. Queue incase of not started.
    logger.verbose( 'Receiving Open Window Param (a url)', url );

    // When we have more... What then? Are we able to retrieve the url schemes registered for a given app?
    if ( parsedUrl.protocol === 'safe-auth:' )
    {
        store.dispatch( authenticatorActions.handleAuthUrl( url ) );
    }
    if ( parsedUrl.protocol === 'safe:' )
    {
        store.dispatch( addTab( { url, isActiveTab: true } ) );
    }
    // 20 is arbitrarily looong right now...
    else if ( parsedUrl.protocol && parsedUrl.protocol.startsWith( 'safe-' ) && parsedUrl.protocol.length > 20 )
    {
        store.dispatch( peruseAppActions.receivedAuthResponse( url ) );
    }


    if ( process.platform === 'darwin' && global.macAllWindowsClosed )
    {
        if ( url.startsWith( 'safe-' ) )
        {
            openWindow( store );
        }
    }
};


export default {
    getRemoteCallApis,
    addReducersToPeruse,
    onInitBgProcess,
    onReceiveUrl,
    onRemoteCallInMain,
    onOpen,
    onWebviewPreload,
    preAppLoad,
    setupRoutes,
    middleware
};
