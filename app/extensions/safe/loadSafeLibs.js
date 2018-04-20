import logger from 'logger';
import * as ffiLoader from './auth-api/ffiLoader';
import { initAnon } from 'extensions/safe/network';
import { setIPCStore } from 'extensions/safe/ffi/ipc';
import * as theAPI from 'extensions/safe/auth-api/authFuncs';
// import via peruse webpack resolution
import * as authActions from 'actions/authenticator_actions';

let mockStatus = null;

/**
 * Load the SAFE network libs into the background process.
 * uses the store to determine the network state.
 * @param  {Object} store Redux store object.
 */
const loadSafeLibs = ( store ) =>
{
    const state = store.getState();
    const isMock = state.peruseApp.isMock;

    const listenerState = store.getState();
    const islistenerMock = listenerState.peruseApp.isMock;

    if ( islistenerMock === mockStatus )
        return;

    mockStatus = islistenerMock;
    ffiLoader.loadLibrary( islistenerMock );

    const authLibStatus = theAPI.getLibStatus();
    logger.verbose( 'Authenticator lib status: ', authLibStatus );
    store.dispatch( authActions.setAuthLibStatus( authLibStatus ) );

    if ( authLibStatus )
    {
        initAnon( store );
    }
};

export default loadSafeLibs;
