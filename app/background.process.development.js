/* eslint global-require: 1, flowtype-errors/show-errors: 0 */

import logger from 'logger';
import { configureStore } from 'store/configureStore';
import i18n from 'i18n';
import { I18N_CONFIG, APP_INFO, PROTOCOLS } from 'appConstants';

// TODO This handling needs to be imported via extension apis more seemlessly
import handlePeruseStoreChanges from './peruseSafeApp';
import * as authActions from 'actions/authenticator_actions';

// TODO: Dont use client when the same. Offer up original where worded differently
// aim to deprecate client file.
import * as theAPI from 'extensions/safe/auth-api/authFuncs';

import { initAnon, initMock } from 'extensions/safe/network';
import { setIPCStore } from 'extensions/safe/ffi/ipc';
import manageRemoteCalls from './background.manageRemoteCalls';
import sysUri from 'extensions/safe/ffi/sys_uri';

// import * as authAPI from 'extensions/safe/auth-api';

import * as ffiLoader from 'extensions/safe/auth-api/ffiLoader';

const init = async ( ) =>
{
    logger.info( 'Init of bg process.' );
    // const initialState = {};

    // Add middleware from extensions here. TODO: this should be be unified somewhere.
    // const loadMiddlewarePackages = [];
    const store = configureStore( {}, [], true );


    i18n.configure( I18N_CONFIG );
    i18n.setLocale( 'en' );

    const mainAppInfo = APP_INFO.info;
    const authAppInfo = {
        ...mainAppInfo,
        id     : 'net.maidsafe.app.browser.authenticator',
        name   : 'SAFE Browser Authenticator plugin',
        icon   : 'iconPath'
     }

    sysUri.registerUriScheme( authAppInfo, PROTOCOLS.SAFE_AUTH );

    try
    {
        // setup auth
        ffiLoader.loadLibrary();

        //enable use of store for dispatching of actions.
        setIPCStore(store);

        // TODO: Move webfetch here... web fetch...
        // if ( isRunningProduction )
        // {
        //     await initAnon( store );
        // }
        // else
        // {
        //     await initMock( store );
        // }
    }
    catch ( e )
    {
        console.log( 'Problems initing SAFE extension' );
        console.log( e.message );
        console.log( e );
    }

    store.subscribe( async () =>
    {
        manageRemoteCalls( store );
        handlePeruseStoreChanges( store );
    } );

    // Lets check the auth lib status:
    const authLibStatus = theAPI.getLibStatus();
    logger.verbose( 'Authenticator lib status: ', authLibStatus );
    store.dispatch( authActions.setAuthLibStatus( authLibStatus ) );
};

init( );



window.onerror = function ( error, url, line )
{
    logger.error( 'errorInWindow', error );
};
