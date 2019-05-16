import { remote, webContents } from 'electron';
import { TYPES } from '$Actions/tabs_actions';
import { makeValidAddressBarUrl } from '$Utils/urlHelpers';
import { isRunningUnpacked } from '$Constants';
import { logger } from '$Logger';
import { initialAppState } from './initialAppState';

const initialState = initialAppState.tabs;

const handleTabPayload = ( state, payload ) => {
    if ( payload ) {
        if ( payload.constructor !== Object ) {
            throw new Error( 'Payload must be an Object.' );
        }
        const { tabId } = payload;
        if ( state[tabId] !== undefined ) {
            const tabToMerge = { ...state[tabId] };
            return { tabId, tabToMerge };
        }
    }
    return state;
};

const addTab = ( state, tab ) => {
    const tabUrl = makeValidAddressBarUrl( tab.url || '' );
    const { tabId } = tab;

    if ( !tabId ) {
        logger.error( new Error( 'No tab ID passed into addTab' ) );

        return state;
    }

    const faviconPath = isRunningUnpacked
        ? '../resources/favicon.ico'
        : '../favicon.ico';

    const newTab = {
        url: tabUrl,
        tabId,
        historyIndex: 0,
        ui: {
            addressBarIsSelected: false,
            pageIsLoading: false,
            shouldFocusWebview: false
        },
        shouldToggleDevTools: false,
        webId: undefined,
        history: [tabUrl],
        favicon: faviconPath
    };
    const newState = { ...state, [tabId]: newTab };
    return newState;
};

const moveTabFowards = ( state, payload ) => {
    const { tabId, tabToMerge } = handleTabPayload( state, payload );
    const updatedTab = tabToMerge;
    const { history } = updatedTab;
    const nextHistoryIndex = updatedTab.historyIndex + 1 || 1;
    if ( !history || history.length < 2 || !history[nextHistoryIndex] ) {
        return state;
    }

    const newUrl = history[nextHistoryIndex];
    updatedTab.historyIndex = nextHistoryIndex;
    updatedTab.url = newUrl;
    const updatedState = { ...state, [tabId]: updatedTab };
    return updatedState;
};

const moveTabBackwards = ( state, payload ) => {
    const { tabId, tabToMerge } = handleTabPayload( state, payload );
    const updatedTab = tabToMerge;
    const { history } = updatedTab;
    const nextHistoryIndex = updatedTab.historyIndex - 1;
    if (
        !history ||
    history.length < 2 ||
    !history[nextHistoryIndex] ||
    nextHistoryIndex < 0
    ) {
        return state;
    }
    const newUrl = history[nextHistoryIndex];
    updatedTab.historyIndex = nextHistoryIndex;
    updatedTab.url = newUrl;
    const updatedState = { ...state, [tabId]: updatedTab };
    return updatedState;
};

const updateTabHistory = ( tabToMerge, payload ) => {
    const url = makeValidAddressBarUrl( payload.url );
    let updatedTab = { ...tabToMerge, ...payload };
    const ancientHistory = tabToMerge.history;
    let newHistory = [...ancientHistory];
    const currentIndex = tabToMerge.historyIndex;

    if ( url && url !== tabToMerge.url ) {
        if ( ancientHistory && ancientHistory[currentIndex] !== url ) {
            updatedTab.historyIndex += 1;

            // if we're not at last index split array there.
            if ( ancientHistory.length - 1 !== currentIndex ) {
                newHistory = newHistory.slice( 0, currentIndex + 1 );
            }

            // else, a simple addition to array
            updatedTab.history = newHistory;
            updatedTab.history.push( url );
        }
    }
    updatedTab = {
        ...updatedTab,
        url
    };
    return updatedTab;
};

const updateTab = ( state, payload ) => {
    const { tabId, tabToMerge } = handleTabPayload( state, payload );
    if ( tabId === undefined && tabToMerge === undefined ) {
        return state;
    }
    let updatedTab = { ...tabToMerge, ...payload };
    if ( payload.url ) {
        updatedTab = updateTabHistory( tabToMerge, payload );
    }

    const updatedState = { ...state, [tabId]: updatedTab };
    return updatedState;
};

// TODO: sort this out
const focusWebview = ( state, tab ) => {
    const { tabId, shouldFocus } = tab;

    if ( !tabId ) {
        logger.error( 'No tabId provided to focusWebview' );
        return state;
    }

    const tabtoMerge = { ...state[tabId] };
    const newTab = {
        ...tabtoMerge,
        ui: {
            ...tabtoMerge.ui,
            shouldFocusWebview: shouldFocus
        }
    };
    const newState = { ...state, [tabId]: newTab };
    return newState;
};

const blurAddressBar = ( state, tab ) => {
    const { tabId } = tab;
    const newTab = {
        ...state[tabId],
        ui: {
            ...state[tabId].ui,
            addressBarIsSelected: false
        }
    };
    const newState = { ...state, [tabId]: newTab };
    return newState;
};

const selectAddressBar = ( state, tab ) => {
    const { tabId } = tab;
    const newTab = {
        ...state[tabId],
        ui: {
            ...state[tabId].ui,
            addressBarIsSelected: true
        }
    };
    const newState = { ...state, [tabId]: newTab };
    return newState;
};

const deselectAddressBar = ( state, tab ) => {
    const { tabId } = tab;
    const newTab = {
        ...state[tabId],
        ui: {
            ...state[tabId].ui,
            addressBarIsSelected: false
        }
    };
    const newState = { ...state, [tabId]: newTab };
    return newState;
};

const resetStore = ( payload ) => {
    const { tabId } = payload;
    const newTabStartLocation = makeValidAddressBarUrl( 'safe-auth://home' );
    const faviconPath = isRunningUnpacked
        ? '../resources/favicon.ico'
        : '../favicon.ico';
    const newTab = {
        url: newTabStartLocation,
        tabId,
        historyIndex: 0,
        ui: {
            addressBarIsSelected: false,
            pageIsLoading: false,
            shouldFocusWebview: false
        },
        shouldToggleDevTools: false,
        webId: undefined,
        history: [newTabStartLocation],
        favicon: faviconPath
    };
    const newState = { ...initialState, [tabId]: newTab };
    return newState;
};

/**
 * Tabs reducer. Should handle all tab states, including window/tab id and the individual tab history
 * @param  { array } state  array of tabs
 * @param  { object } action action Object
 * @return { array }        updatd state object
 */
export function tabs( state: object = initialState, action ) {
    const { payload } = action;

    if ( action.error ) {
        logger.error( 'ERROR IN ACTION', action.error );
        return state;
    }

    switch ( action.type ) {
        case TYPES.ADD_TAB: {
            return addTab( state, payload );
        }
        case TYPES.UPDATE_TAB: {
            return updateTab( state, payload );
        }
        case TYPES.TAB_FORWARDS: {
            return moveTabFowards( state, payload );
        }
        case TYPES.TAB_BACKWARDS: {
            return moveTabBackwards( state, payload );
        }
        case TYPES.FOCUS_WEBVIEW: {
            return focusWebview( state, payload );
        }
        case TYPES.BLUR_ADDRESS_BAR: {
            return blurAddressBar( state, payload );
        }
        case TYPES.SELECT_ADDRESS_BAR: {
            return selectAddressBar( state, payload );
        }
        case TYPES.DESELECT_ADDRESS_BAR: {
            return deselectAddressBar( state, payload );
        }
        case TYPES.TABS_RESET_STORE: {
            return resetStore( payload );
        }
        default:
            return state;
    }
}
