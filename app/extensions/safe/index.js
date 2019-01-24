import logger from 'logger';
import * as authenticatorActions from 'extensions/safe/actions/authenticator_actions';
import { app } from 'electron';
import * as safeBrowserAppActions from 'extensions/safe/actions/safeBrowserApplication_actions';
import { initSafeBrowserApp } from 'extensions/safe/safeBrowserApplication';
import { getLibStatus } from 'extensions/safe/auth-api/authFuncs';

import * as ffiLoader from './auth-api/ffiLoader';

import { parse as parseURL } from 'url';
import setupRoutes from './server-routes';
import registerSafeProtocol from './protocols/safe';
import registerSafeAuthProtocol from './protocols/safe-auth';
import blockNonSAFERequests from './blockNonSafeReqs';

import { setIsMock } from 'extensions/safe/actions/safeBrowserApplication_actions';
import { startedRunningMock, isRunningSpectronTestProcess, isRunningUnpacked } from 'appConstants';
import { handleSafeBrowserStoreChanges } from './safeBrowserApplication';
import { getSafeBrowserUnauthedReqUri } from 'extensions/safe/safeBrowserApplication/init/initAnon';

import sysUri from 'extensions/safe/ffi/sys_uri';
import { APP_INFO, PROTOCOLS } from 'appConstants';
import { addTab } from 'actions/tabs_actions';

import safeReducers from 'extensions/safe/reducers';
import webviewPreload from 'extensions/safe/webviewPreload';
import { handleRemoteCalls, remoteCallApis } from 'extensions/safe/handleRemoteCalls';
import * as SafeBrowserActions from 'extensions/safe/actions/safeBrowserApplication_actions';

import { addFileMenus } from 'extensions/safe/menus';
import { urlIsAllowedBySafe as urlIsValid } from 'extensions/safe/utils/safeHelpers';

const onWebviewPreload = store =>
    webviewPreload( store );


const preAppLoad = () =>
{
    if ( isRunningUnpacked && process.platform === 'win32' ) return;
    app.setAsDefaultProtocolClient( 'safe-auth' );
    app.setAsDefaultProtocolClient( 'safe' );
    const isDefaultAuth = app.isDefaultProtocolClient( 'safe-auth' );
    const isDefaultSafe = app.isDefaultProtocolClient( 'safe' );
    logger.info( 'Registered to handle safe: urls ? ', isDefaultSafe );
    logger.info( 'registered to handle safe-auth: urls ?', isDefaultAuth );
};

/**
 * Adds menu items to the main peruse menus.
 * @param  {Object} store redux store
 * @param {Array} menusArray Array of menu objects to be parsed by electron.
 */
const addExtensionMenuItems = ( store, menusArray ) =>
{
    logger.verbose( 'Adding SAFE menus to browser' );

    const newMenuArray = [];

    menusArray.forEach( menu =>
    {
        const label = menu.label;
        let newMenu = menu;

        if ( label.includes( 'File' ) )
        {
            newMenu = addFileMenus( store, newMenu );
        }

        newMenuArray.push( newMenu );
    } );

    return newMenuArray;
};

const addReducersToPeruse = ( ) =>
    safeReducers;

/**
 * Triggered when a remote call is received in the main process
 * @param  {Object} store redux store
 * @param  {Object} allAPICalls object containing all api calls available in main (for use via store remoteCalls)
 * @param  {[type]} theCall     call object with id, and info
 */
const onRemoteCallInBgProcess = ( store, allAPICalls, theCall ) => handleRemoteCalls( store, allAPICalls, theCall );

const getRemoteCallApis = () => remoteCallApis;

/**
 * add actions to the peruse browser container
 * @type {Object}
 */
const actionsForBrowser = {
    ...SafeBrowserActions
};

let theSafeBgProcessStore;

export const getSafeBackgroundProcessStore = () =>
{
    if ( !theSafeBgProcessStore ) throw new Error( `No background process store defined. ${ process.mainModule.filename }'` );

    return theSafeBgProcessStore;
};

const onInitBgProcess = async store =>
{
    logger.info( 'Registering SAFE Network Protocols' );
    try
    {
        theSafeBgProcessStore = store;

        registerSafeProtocol( store );
        registerSafeAuthProtocol( store );
        blockNonSAFERequests();
    }
    catch ( e )
    {
        logger.error( 'Load extensions error: ', e );
    }

    // load the auth/safe libs
    const theLibs = await ffiLoader.loadLibrary( startedRunningMock );

    let prevAuthLibStatus;

    store.subscribe( () =>
    {
        const authLibStatus = getLibStatus();

        if ( authLibStatus && authLibStatus !== prevAuthLibStatus )
        {
            logger.verbose( 'Authenticator lib status: ', authLibStatus );
            prevAuthLibStatus = authLibStatus;
            store.dispatch( authenticatorActions.setAuthLibStatus( authLibStatus ) );

            initSafeBrowserApp( store );
        }

        handleSafeBrowserStoreChanges( store );
    } );

    const mainAppInfo = APP_INFO.info;
    const authAppInfo = {
        ...mainAppInfo,
        id   : 'net.maidsafe.app.browser.authenticator',
        name : 'SAFE Browser Authenticator',
        icon : 'iconPath'
    };

    logger.verbose( 'Auth application info', authAppInfo );
    sysUri.registerUriScheme( authAppInfo, PROTOCOLS.SAFE_AUTH );
};

/**
 * on open of peruse application
 * @param  {Object} store redux store
 */
const onOpen = store =>
{
    logger.verbose( 'OnOpen: Setting mock in store. ', startedRunningMock );
    store.dispatch( setIsMock( startedRunningMock ) );
};

/**
 * on open of peruse application
 * @param  {Object} store redux store
 */
const onAppReady = store =>
{
    logger.verbose( 'OnAppReady: Setting mock in store. ', startedRunningMock );
    store.dispatch( setIsMock( startedRunningMock ) );
};

/**
 * Add middleware to Peruse redux store
 * @param  {Object} store redux store
 */
const middleware = store => next => action =>
{
    if ( isRunningSpectronTestProcess )
    {
        logger.info( 'ACTION:', action );
    }

    return next( action );
};


const parseSafeUri = function ( uri )
{
    logger.verbose( 'Parsing safe uri', uri );
    return uri.replace( '//', '' ).replace( '==/', '==' );
};

const waitForBasicConnection = ( theStore, timeout = 15000 ) => new Promise( resolve =>
{
    let timeLeft = timeout;
    const check = () =>
    {
        timeLeft -= 500;
        const netState = theStore.getState().safeBrowserApp.networkStatus;
        logger.verbose( 'Waiting for basic connection...', netState );

        if ( netState !== null )
        {
            resolve();
        }
        else if ( timeLeft < 0 )
        {
            resolve();
        }
        else
        {
            setTimeout( check, 500 );
        }
    };

    setTimeout( check, 500 );
} );

/**
 * Trigger when receiving a URL param in the browser.
 *
 * Occurring in the main process.
 * @param  {Object} store redux store
 * @param  {String} url   url param
 */
const onReceiveUrl = async ( store, url ) =>
{
    const preParseUrl = parseSafeUri( url );
    const parsedUrl = parseURL( preParseUrl );

    logger.info( 'Did get a parsed url on the go', parsedUrl );

    if ( parsedUrl.protocol === 'safe-auth:' )
    {
        logger.info( 'this is a parsed url for auth', url );
        if ( url !== getSafeBrowserUnauthedReqUri() )
        {
            // otherwise EVERYTHING waits for basic connection...
            // so we know the libs are ready/ loaded
            // (and we assume, _that_ happens at the correc time due to browser hooks)
            await waitForBasicConnection( store );

            logger.info( 'DONE WAITING', url );
        }
        store.dispatch( authenticatorActions.handleAuthUrl( url ) );
    }
    if ( parsedUrl.protocol === 'safe:' )
    {
        await waitForBasicConnection( store );

        logger.verbose( 'Handling safe: url', url );
        store.dispatch( addTab( { url, isActiveTab: true } ) );
    }
    // 20 is arbitrarily looong right now...
    else if ( parsedUrl.protocol && parsedUrl.protocol.startsWith( 'safe-' ) && parsedUrl.protocol.length > 20 )
    {
        logger.verbose( 'Handling safe-???? url' );
        store.dispatch( safeBrowserAppActions.receivedAuthResponse( url ) );
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
    addExtensionMenuItems,
    getRemoteCallApis,
    actionsForBrowser,
    addReducersToPeruse,
    onInitBgProcess,
    onReceiveUrl,
    onRemoteCallInBgProcess,
    onOpen,
    onAppReady,
    onWebviewPreload,
    preAppLoad,
    setupRoutes,
    middleware,
    urlIsValid
};
