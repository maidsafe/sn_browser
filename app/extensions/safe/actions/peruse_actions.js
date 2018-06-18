import { createActions } from 'redux-actions';

export const TYPES = {
    SET_APP_STATUS    : 'SET_APP_STATUS',
    SET_NETWORK_STATUS    : 'SET_NETWORK_STATUS',
    SET_IS_MOCK    : 'SET_IS_MOCK',

    //webId
    SET_CURRENT_WEB_ID : 'SET_CURRENT_WEB_ID',

    SET_READ_CONFIG_STATUS     : 'SET_READ_CONFIG_STATUS',
    SET_SAVE_CONFIG_STATUS : 'SET_SAVE_CONFIG_STATUS',

    //read status from network
    RECEIVED_AUTH_RESPONSE : 'RECEIVED_AUTH_RESPONSE',

    RECONNECT_SAFE_APP          : 'RECONNECT_SAFE_APP',

    //UI actions.
    SHOW_WEB_ID_DROPDOWN : 'SHOW_WEB_ID_DROPDOWN'
};

export const {
    setAppStatus,
    setNetworkStatus,
    setIsMock,

    setCurrentWebId,

    setReadConfigStatus,
    setSaveConfigStatus,

    receivedAuthResponse,

    reconnectSafeApp,

    resetStore,

    showWebIdDropdown
} = createActions(
    TYPES.SET_APP_STATUS,
    TYPES.SET_NETWORK_STATUS,
    TYPES.SET_IS_MOCK,

    TYPES.SET_CURRENT_WEB_ID,

    TYPES.SET_READ_CONFIG_STATUS,
    TYPES.SET_SAVE_CONFIG_STATUS,

    TYPES.RECEIVED_AUTH_RESPONSE,

    TYPES.RECONNECT_SAFE_APP,

    TYPES.SHOW_WEB_ID_DROPDOWN
);
