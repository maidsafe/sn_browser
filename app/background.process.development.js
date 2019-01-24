/* eslint global-require: 1, flowtype-errors/show-errors: 0 */
import logger from 'logger';
import { configureStore } from 'store/configureStore';
import i18n from 'i18n';
import { I18N_CONFIG, startedRunningMock } from 'appConstants';


import manageRemoteCalls from './background.manageRemoteCalls';
import { onInitBgProcess, getExtensionReduxMiddleware } from './extensions';
import setupServer from './server';
import { remote } from 'electron';

window.thisIsTheBackgroundProcess = true;

const initSafeServer = store =>
{
    const server = setupServer();
    onInitBgProcess( server, store );
};

const initBgProcess = async ( ) =>
{
    // Add middleware from extensions here. TODO: this should be be unified somewhere.
    const loadMiddlewarePackages = getExtensionReduxMiddleware() || [];
    const store = configureStore( undefined, loadMiddlewarePackages, true );
    initSafeServer( store );

    i18n.configure( I18N_CONFIG );
    i18n.setLocale( 'en' );

    store.subscribe( () =>
    {
        manageRemoteCalls( store );
    } );
};

initBgProcess( );

window.onerror = function ( error, url, line )
{
    logger.error( 'errorInWindow', error );
};
