import { createActions } from 'redux-actions';
import { createAliasedAction } from 'electron-redux';
import { callIPC } from '@Extensions/safe/ffi/ipc';
import AUTH_CONSTANTS from '@Extensions/safe/auth-constants';
import { inBgProcess } from '@Constants';

import logger from 'logger';

export const TYPES = {
    SET_AUTH_LIB_STATUS     : 'SET_AUTH_LIB_STATUS',
    SET_AUTH_HANDLE         : 'SET_AUTH_HANDLE',
    SET_AUTH_NETWORK_STATUS : 'SET_AUTH_NETWORK_STATUS',
    ADD_AUTH_REQUEST        : 'ADD_AUTH_REQUEST',
    REMOVE_AUTH_REQUEST     : 'REMOVE_AUTH_REQUEST',
    HANDLE_AUTH_URL         : 'HANDLE_AUTH_URL',
    SET_RE_AUTHORISE_STATE  : 'SET_RE_AUTHORISE_STATE',
    SET_IS_AUTHORISED_STATE : 'SET_IS_AUTHORISED_STATE'
};

export const {
    setAuthLibStatus,
    setAuthHandle,
    setAuthNetworkStatus,
    addAuthRequest,
    removeAuthRequest,
    setReAuthoriseState,
    setIsAuthorisedState
} = createActions(
    TYPES.SET_AUTH_LIB_STATUS,
    TYPES.SET_AUTH_HANDLE,
    TYPES.SET_AUTH_NETWORK_STATUS,
    TYPES.ADD_AUTH_REQUEST,
    TYPES.REMOVE_AUTH_REQUEST,
    TYPES.SET_RE_AUTHORISE_STATE,
    TYPES.SET_IS_AUTHORISED_STATE
);

const triggerAuthDecoding = reqObject =>
{
    logger.info( 'Decoding an auth req object', reqObject );
    if ( !inBgProcess ) return;

    console.info( 'Handling an AuthReq in BG process:', reqObject );
    callIPC.enqueueRequest( reqObject );
};

export const handleAuthUrl = createAliasedAction(
    TYPES.HANDLE_AUTH_URL,
    reqObject => ( {
        // the real action
        type    : TYPES.HANDLE_AUTH_URL,
        payload : triggerAuthDecoding( reqObject )
    } )
);
