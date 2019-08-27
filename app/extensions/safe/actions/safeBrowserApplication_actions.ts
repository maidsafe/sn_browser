import { createActions } from 'redux-actions';
import { createAliasedAction } from 'electron-redux';
import { logger } from '$Logger';
import { inBgProcess } from '$Constants';
import { getWebIds } from '$Extensions/safe/backgroundProcess/safeBrowserApplication';

export const TYPES = {
    ALIAS_CONNECT_UNAUTHORISED_BROWSER_APP:
    'ALIAS_CONNECT_UNAUTHORISED_BROWSER_APP',
    CONNECT_UNAUTHORISED_BROWSER_APP: 'CONNECT_UNAUTHORISED_BROWSER_APP',

    SET_APP_STATUS: 'SET_APP_STATUS',
    SET_NETWORK_STATUS: 'SET_NETWORK_STATUS',
    SET_IS_MOCK: 'SET_IS_MOCK',

    // experiments
    ENABLE_EXPERIMENTS: 'ENABLE_EXPERIMENTS',
    DISABLE_EXPERIMENTS: 'DISABLE_EXPERIMENTS',

    // webId
    ALIAS_GET_AVAILABLE_WEB_IDS: 'ALIAS_GET_AVAILABLE_WEB_IDS',
    GET_AVAILABLE_WEB_IDS: 'GET_AVAILABLE_WEB_IDS',
    SET_AVAILABLE_WEB_IDS: 'SET_AVAILABLE_WEB_IDS',
    FETCHING_WEB_IDS: 'FETCHING_WEB_IDS',

    SET_READ_CONFIG_STATUS: 'SET_READ_CONFIG_STATUS',
    SET_SAVE_CONFIG_STATUS: 'SET_SAVE_CONFIG_STATUS',

    // read status from network
    RECEIVED_AUTH_RESPONSE: 'RECEIVED_AUTH_RESPONSE',

    RECONNECT_SAFE_APP: 'RECONNECT_SAFE_APP',
    RESET_STORE: 'RESET_STORE',

    // UI actions.
    SHOW_WEB_ID_DROPDOWN: 'SHOW_WEB_ID_DROPDOWN',

    SET_KNOWN_VERSIONS_FOR_URL: 'SET_KNOWN_VERSIONS_FOR_URL'
};

export const {
    setAppStatus,
    setNetworkStatus,
    setIsMock,

    enableExperiments,
    disableExperiments,

    setAvailableWebIds,
    fetchingWebIds,

    setReadConfigStatus,
    setSaveConfigStatus,

    receivedAuthResponse,

    reconnectSafeApp,

    resetStore,

    showWebIdDropdown,

    setKnownVersionsForUrl
} = createActions(
    TYPES.SET_APP_STATUS,
    TYPES.SET_NETWORK_STATUS,
    TYPES.SET_IS_MOCK,

    TYPES.ENABLE_EXPERIMENTS,
    TYPES.DISABLE_EXPERIMENTS,

    TYPES.SET_AVAILABLE_WEB_IDS,
    TYPES.FETCHING_WEB_IDS,

    TYPES.SET_READ_CONFIG_STATUS,
    TYPES.SET_SAVE_CONFIG_STATUS,

    TYPES.RECEIVED_AUTH_RESPONSE,

    TYPES.RECONNECT_SAFE_APP,
    TYPES.RESET_STORE,

    TYPES.SHOW_WEB_ID_DROPDOWN,

    TYPES.SET_KNOWN_VERSIONS_FOR_URL
);

export const getAvailableWebIds = createAliasedAction(
    TYPES.ALIAS_GET_AVAILABLE_WEB_IDS,
    // TODO: there is a complaint about not having middleware, despite redux-promise.
    () => ( {
    // the real action
        type: TYPES.GET_AVAILABLE_WEB_IDS,
        payload: getWebIds()
    } )
);

// export const triggerConnectUnauthorised = createAliasedAction(
//     TYPES.ALIAS_CONNECT_UNAUTHORISED_BROWSER_APP,
//     // TODO: there is a complaint about not having middleware, despite redux-promise.
//     () => ( {
//     // the real action
//         type: TYPES.CONNECT_UNAUTHORISED_BROWSER_APP,
//         payload: triggerGetWebIds()
//     } )
// );
