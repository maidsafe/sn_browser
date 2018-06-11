import { createActions } from 'redux-actions';

export const TYPES = {
    SET_APP_STATUS    : 'SET_APP_STATUS',
    SET_NETWORK_STATUS    : 'SET_NETWORK_STATUS',
    SET_IS_MOCK    : 'SET_IS_MOCK',

    SET_READ_CONFIG_STATUS     : 'SET_READ_CONFIG_STATUS',
    SET_SAVE_CONFIG_STATUS : 'SET_SAVE_CONFIG_STATUS',

    //read status from network
    RECEIVED_AUTH_RESPONSE : 'RECEIVED_AUTH_RESPONSE',

    RECONNECT_SAFE_APP          : 'RECONNECT_SAFE_APP'
};

export const {
    setAppStatus,
    setNetworkStatus,
    setIsMock,

    setReadConfigStatus,
    setSaveConfigStatus,

    receivedAuthResponse,

    reconnectSafeApp,

    resetStore
} = createActions(
    TYPES.SET_APP_STATUS,
    TYPES.SET_NETWORK_STATUS,
    TYPES.SET_IS_MOCK,

    TYPES.SET_READ_CONFIG_STATUS,
    TYPES.SET_SAVE_CONFIG_STATUS,

    TYPES.RECEIVED_AUTH_RESPONSE,

    TYPES.RECONNECT_SAFE_APP
);
