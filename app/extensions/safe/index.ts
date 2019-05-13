import { logger } from '$Logger';
import { setAuthLibStatus } from '$Extensions/safe/actions/authenticator_actions';
import * as safeBrowserAppActions from '$Extensions/safe/actions/safeBrowserApplication_actions';
import {
    initSafeBrowserApp,
    handleSafeBrowserStoreChanges
} from '$Extensions/safe/safeBrowserApplication';
import { getLibStatus } from '$Extensions/safe/auth-api/authFuncs';
import { setSafeBgProcessStore } from '$Extensions/safe/ffi/ipc';

import {
    startedRunningMock,
    isRunningSpectronTestProcess,
    APP_INFO,
    PROTOCOLS
} from '$Constants';
import sysUri from '$Extensions/safe/ffi/sys_uri';

import { safeReducers } from '$Extensions/safe/reducers';
import { onPreload } from '$Extensions/safe/webviewPreload';
import {
    handleRemoteCalls,
    remoteCallApis
} from '$Extensions/safe/handleRemoteCalls';

import { addFileMenus } from '$Extensions/safe/menus';
import { urlIsAllowedBySafe as urlIsValid } from '$Extensions/safe/utils/safeHelpers';

import { blockNonSAFERequests } from './blockNonSafeReqs';
import { registerSafeAuthProtocol } from './protocols/safe-auth';
import { registerSafeProtocol } from './protocols/safe';
import { setupRoutes } from './server-routes';
import * as ffiLoader from './auth-api/ffiLoader';

const onWebviewPreload = ( store ) => onPreload( store );

/**
 * Adds menu items to the main peruse menus.
 * @param  {Object} store redux store
 * @param {Array} menusArray Array of menu objects to be parsed by electron.
 */
const addExtensionMenuItems = ( store, menusArray ) => {
    logger.info( 'Adding SAFE menus to browser' );

    const newMenuArray = [];

    menusArray.forEach( ( menu ) => {
        const { label } = menu;
        let newMenu = menu;

        if ( label.includes( 'File' ) ) {
            newMenu = addFileMenus( store, newMenu );
        }

        newMenuArray.push( newMenu );
    } );

    return newMenuArray;
};

const addReducersToPeruse = () => safeReducers;

/**
 * Triggered when a remote call is received in the main process
 * @param  {Object} store redux store
 * @param  {Object} allAPICalls object containing all api calls available in main (for use via store remoteCalls)
 * @param  {[type]} theCall     call object with id, and info
 */
const onRemoteCallInBgProcess = ( store, allAPICalls, theCall ) =>
    handleRemoteCalls( store, allAPICalls, theCall );

const getRemoteCallApis = () => remoteCallApis;

/**
 * add actions to the peruse browser container
 * @type {Object}
 */
const actionsForBrowser = {
    ...safeBrowserAppActions
};

const onInitBgProcess = async ( store ) => {
    logger.info( 'Registering SAFE Network Protocols' );
    try {
        setSafeBgProcessStore( store );
        // theSafeBgProcessStore = store;

        registerSafeProtocol( store );
        registerSafeAuthProtocol( store );
        blockNonSAFERequests();
    } catch ( e ) {
        logger.error( 'Load extensions error: ', e );
    }

    // load the auth/safe libs
    const theLibs = await ffiLoader.loadLibrary( startedRunningMock );

    let previousAuthLibraryStatus;

    store.subscribe( () => {
        const authLibraryStatus = getLibStatus();

        if ( authLibraryStatus && authLibraryStatus !== previousAuthLibraryStatus ) {
            logger.info( 'Authenticator lib status: ', authLibraryStatus );
            previousAuthLibraryStatus = authLibraryStatus;
            store.dispatch( setAuthLibStatus( authLibraryStatus ) );

            initSafeBrowserApp( store );
        }

        handleSafeBrowserStoreChanges( store );
    } );

    const mainAppInfo = APP_INFO.info;
    const authAppInfo = {
        ...mainAppInfo,
        id: 'net.maidsafe.app.browser.authenticator',
        name: 'SAFE Browser Authenticator',
        icon: 'iconPath'
    };

    logger.info( 'Auth application info', authAppInfo );
    sysUri.registerUriScheme( authAppInfo, PROTOCOLS.SAFE_AUTH );
};

/**
 * onOpenLoadExtensions
 * on open of peruse application
 * @param  {Object} store redux store
 */
const onOpen = ( store ) =>
    new Promise( ( resolve, reject ) => {
        logger.info( 'OnOpen: Setting mock in store. ', startedRunningMock );
        store.dispatch( safeBrowserAppActions.setIsMock( startedRunningMock ) );

        resolve();
    } );

/**
 * Add middleware to Peruse redux store
 * @param  {Object} store redux store
 */
const middleware = ( store ) => ( next ) => ( action ) => {
    if ( isRunningSpectronTestProcess ) {
        logger.info( 'ACTION:', action );
    }

    return next( action );
};

export default {
    addExtensionMenuItems,
    getRemoteCallApis,
    actionsForBrowser,
    addReducersToPeruse,
    onInitBgProcess,
    onRemoteCallInBgProcess,
    onOpen,
    onWebviewPreload,
    setupRoutes,
    middleware,
    urlIsValid
};
