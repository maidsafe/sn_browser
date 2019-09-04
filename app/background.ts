/* eslint global-require: 1 */
import i18n from 'i18n';
import { remote } from 'electron';
import path from 'path';
import { logger } from '$Logger';
import { configureStore } from '$Store/configureStore';
import { I18N_CONFIG, isRunningTestCafeProcess } from '$Constants';
import { manageRemoteCalls } from './background.manageRemoteCalls';
import { setCurrentStore } from '$Actions/resetStore_action';
import { onInitBgProcess, getExtensionReduxMiddleware } from './extensions';
import { setupServer } from './server';

const initSafeServer = ( store ) => {
    const server = setupServer();
    onInitBgProcess( server, store );
};

const initBgProcess = async () => {
    // Add middleware from extensions here. TODO: this should be be unified somewhere.
    const loadMiddlewarePackages = getExtensionReduxMiddleware() || [];
    const store = configureStore( undefined, loadMiddlewarePackages, true );
    initSafeServer( store );
    setCurrentStore( store );

    i18n.configure( I18N_CONFIG );
    i18n.setLocale( 'en' );

    store.subscribe( () => {
        manageRemoteCalls( store );
    } );
};

initBgProcess();

window.addEventListener( 'error', function( error ) {
    console.error( 'errorInBackgroundWindow', error );
    logger.error(
        'errorInBackgroundWindow',
        JSON.stringify( error, [
            'message',
            'arguments',
            'type',
            'name',
            'file',
            'line'
        ] )
    );
} );
