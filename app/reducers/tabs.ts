/* eslint-disable */
import { TYPES } from '$Actions/tabs_actions';
import {
    makeValidAddressBarUrl
} from '$Utils/urlHelpers';
import { isRunningUnpacked } from '$Constants';
import { logger } from '$Logger';
import initialAppState from './initialAppState';

const initialState = initialAppState.tabs;

const addTab = ( state , tab ) =>
{
    const tabUrl = makeValidAddressBarUrl( tab.url || '' );
    const tabId = tab.tabId;
    const faviconPath = isRunningUnpacked
        ? '../resources/favicon.ico'
        : '../favicon.ico';
    const newTab =
    {
        url          : tabUrl,
        tabId, 
        historyIndex : 0,
        ui :  {
            addressBarIsSelected : false,
            pageIsLoading        : false,
            shouldFocusWebview   : false
        }, 
        webId        : undefined,
        history      : [ tabUrl ],
        favicon : faviconPath
    }
    let newState = { ...state, [tabId] : newTab };
    return newState;
};

const moveTabFowards = (state, payload) => 
{
    try
    {
        var { tabId, tabToMerge } = handleTabPayload( state, payload );
    }
    catch ( err )
    {
        logger.error( err );
        return state;
    }
    const updatedTab = tabToMerge;
    const history = updatedTab.history;
    const nextHistoryIndex = updatedTab.historyIndex + 1 || 1;
    if ( !history || history.length < 2 || !history[nextHistoryIndex] )
    {
        return state;
    }
    const newUrl = history[nextHistoryIndex];
    updatedTab.historyIndex = nextHistoryIndex;
    updatedTab.url = newUrl;
    const updatedState = { ...state, [tabId]: updatedTab };
    return updatedState;
};

const moveTabBackwards = (state, payload) => 
{
    try
    {
        var { tabId, tabToMerge } = handleTabPayload( state, payload );
    }
    catch ( err )
    {
        logger.error( err );
        return state;
    }
    const updatedTab = tabToMerge;
    const history = updatedTab.history;
    const nextHistoryIndex = updatedTab.historyIndex - 1;
    if (
        !history
        || history.length < 2
        || !history[nextHistoryIndex]
        || nextHistoryIndex < 0
    )
    {
        return state;
    }
    const newUrl = history[nextHistoryIndex];
    updatedTab.historyIndex = nextHistoryIndex;
    updatedTab.url = newUrl;
    const updatedState = { ...state, [ tabId ]: updatedTab };
    return updatedState;
};

const updateTab = ( state, payload ) =>
{
    try
    {
        var { tabId, tabToMerge } = handleTabPayload( state, payload );
    }
    catch ( err )
    {
        logger.error( err );
        return state;
    }
    if ( tabId === undefined )
    {
        return state;
    }
    let updatedTab = { ...tabToMerge, ...payload };
    if ( payload.url )
    {
        updatedTab = updateTabHistory( tabToMerge, payload );
    }

    const updatedState = { ...state, [tabId]: updatedTab};
    return updatedState;
};

const updateTabHistory = ( tabToMerge, payload ) =>
{
    const url = makeValidAddressBarUrl( payload.url );
    let updatedTab = { ...tabToMerge, ...payload };
    const ancientHistory = tabToMerge.history;
    let newHistory = [...ancientHistory];
    const currentIndex = tabToMerge.historyIndex;

    if ( url && url !== tabToMerge.url )
    {
        if ( ancientHistory && ancientHistory[currentIndex] !== url )
        {
            updatedTab.historyIndex += 1;

            // if we're not at last index split array there.
            if ( ancientHistory.length - 1 !== currentIndex )
            {
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

const handleTabPayload = ( state, payload ) =>
{
    if ( payload )
    {
        if ( payload.constructor !== Object )
        {
            throw new Error( "Payload must be an Object." );
        }
        const { tabId } = payload;
        const tabToMerge = { ...state[tabId] };
        return { tabId, tabToMerge };
    }
};

const focusWebview = (state, tab) =>
{
    const tabId = tab.tabId;
    const payload = tab.toggle;
    const TabtoMerge = { ...state[tabId] }
    const newTab =
    {
        ...TabtoMerge,
        ui: 
        {
            ...TabtoMerge.ui,
            shouldFocusWebview   : payload 
        }
    }
    const newState = { ...state, [tabId]: newTab }; 
    return newState;
};

const blurAddressBar = (state, tab)=>{
    const tabId = tab.tabId;
    const TabtoMerge = { ...state[tabId] }
    const newTab =
    {
        ...TabtoMerge,
        ui: 
        {
            ...TabtoMerge.ui,
            addressBarIsSelected: false 
        }
    }
    const newState = { ...state, [tabId]: newTab }; 
    return newState;
};

const selectAddressBar =( state, tab) => 
{
    const tabId = tab.tabId;
    const TabtoMerge = { ...state[tabId] }
    const newTab =
    {
        ...TabtoMerge,
        ui: 
        {
            ...TabtoMerge.ui,
            addressBarIsSelected: true
        }
    }
    const newState = { ...state, [tabId]: newTab }; 
    return newState;
};

const deselectAddressBar =( state, tab) => 
{
    const tabId = tab.tabId;
    const TabtoMerge = { ...state[tabId] }
    const newTab =
    {
        ...TabtoMerge,
        ui: 
        {
            ...TabtoMerge.ui,
            addressBarIsSelected: false
        }
    }
    const newState = { ...state, [tabId]: newTab }; 
    return newState;
};

const resetStore = ( initialState, tab )=>{
    const tabUrl = makeValidAddressBarUrl( tab.url || '' );
    const tabId = tab.tabId;
    const faviconPath = isRunningUnpacked
        ? '../resources/favicon.ico'
        : '../favicon.ico';
    const newTab =
    {
        url          : tabUrl,
        tabId, 
        historyIndex : 0,
        ui :  {
            addressBarIsSelected : false,
            pageIsLoading        : false,
            shouldFocusWebview   : false
        }, 
        webId        : undefined,
        history      : [ tabUrl ],
        favicon : faviconPath
    }
    let newState = { ...initialState, [tabId] : newTab };
    return newState;
};

export default function tabs( state: object = initialState, action )
{
    const payload = action.payload;

    if ( action.error )
    {
        logger.error( 'ERROR IN ACTION', action.error );
        return state;
    }

    switch ( action.type )
    {
        case TYPES.ADD_TAB: {
            return addTab( state, payload );
        }
        case TYPES.UPDATE_TAB :
        {
            return updateTab( state, payload );
        }
        case TYPES.TAB_FORWARDS :
        {
            return moveTabFowards( state, payload );
        }
        case TYPES.TAB_BACKWARDS :
        {
            return moveTabBackwards( state, payload );
        }
        case TYPES.FOCUS_WEBVIEW:
        {
            return focusWebview(state, payload);
        }
        case TYPES.BLUR_ADDRESS_BAR:
        {
            return blurAddressBar(state, payload);
        }
        case TYPES.SELECT_ADDRESS_BAR:
        {
            return selectAddressBar(state, payload);
        }
        case TYPES.DESELECT_ADDRESS_BAR:
        {
            return deselectAddressBar(state, payload);
        }
        case TYPES.RESET_STORE: {
            return resetStore(state, payload );
        }
        default:
            return state;
    }
}
