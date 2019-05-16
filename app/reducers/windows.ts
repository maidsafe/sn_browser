/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { TYPES } from '$Actions/windows_actions';
import { logger } from '$Logger';
import { TYPES as TAB_TYPES } from '$Actions/tabs_actions';
import { cloneDeep } from 'lodash';
import { initialAppState } from './initialAppState';

const initialState = initialAppState.windows;

const addWindow = ( state, tab ) => {
    const targetWindow = tab.windowId;
    const openWindows = { ...state.openWindows };
    const closedWindows = { ...state.closedWindows };
    const newState = {
        openWindows: {
            ...openWindows,
            [targetWindow]: {
                activeTab: null,
                wasLastInFocus: true,
                ui: {
                    settingsMenuIsVisible: false
                },
                tabs: []
            }
        },
        closedWindows: {
            ...closedWindows,
            [targetWindow]: {
                closedTabs: [],
                lastActiveTabs: []
            }
        }
    };
    return newState;
};

const addTabNext = ( state, tab ) => {
    const targetWindow = tab.windowId;
    const { tabId } = tab;
    let { tabIndex } = tab;

    const openWindows = { ...state.openWindows };
    const newState = { ...state, openWindows };

    const newWindow = {
        ...openWindows[targetWindow],
        activeTab: null,
        ui: {
            settingsMenuIsVisible: false
        },
        tabs: [...openWindows[targetWindow].tabs]
    };
    tabIndex += 1;
    const lastTabIndex = tabIndex || 0;

    newWindow.tabs.splice( lastTabIndex, 0, tabId );

    newState.openWindows[targetWindow] = newWindow;
    return newState;
};

const addTabEnd = ( state, tab ) => {
    const targetWindow = tab.windowId;
    const { tabId } = tab;

    const openWindows = { ...state.openWindows };
    const newState = { ...state, openWindows };

    const newWindow = {
        ...openWindows[targetWindow],
        activeTab: null,
        ui: {
            settingsMenuIsVisible: false
        },
        tabs: [...openWindows[targetWindow].tabs, tabId]
    };

    newState.openWindows[targetWindow] = newWindow;

    return newState;
};

const setActiveTab = ( state, tab ) => {
    const targetWindow = tab.windowId;
    const { tabId } = tab;

    const openWindows = { ...state.openWindows };

    const newOpenWindows = {
        ...state.openWindows,
        [targetWindow]: {
            ...openWindows[targetWindow],
            activeTab: tabId
        }
    };

    const newState = { ...state, openWindows: newOpenWindows };
    return newState;
};

const closetab = ( state, tab ) => {
    const targetWindow = tab.windowId;
    const { tabId } = tab;

    const openWindows = { ...state.openWindows };
    const closedWindows = cloneDeep( state.closedWindows );

    const lastTabIndex = openWindows[targetWindow].tabs.findIndex( ( Id ) => {
        return Id === tabId;
    } );

    const newOpenTabs = openWindows[targetWindow].tabs.filter(
        ( Id ) => Id !== tabId
    );

    const tabsIndexLength = openWindows[targetWindow].tabs.length - 1;

    const newActiveTab =
    tabsIndexLength === lastTabIndex
        ? newOpenTabs[tabsIndexLength - 1]
        : newOpenTabs[lastTabIndex];

    openWindows[targetWindow] = {
        ...openWindows[targetWindow],
        tabs: newOpenTabs,
        activeTab: newActiveTab
    };

    const closedTabObj = {
        tabId,
        lastTabIndex
    };

    closedWindows[targetWindow].closedTabs.push( closedTabObj );

    const newState = {
        ...state,
        openWindows,
        closedWindows
    };
    return newState;
};

const setWindowLastInFocus = ( state, aWindowId ) => {
    const newState = { ...state };

    const newOpenWindows = {};

    Object.keys( newState.openWindows ).forEach( ( someWindowId ) => {
        newOpenWindows[someWindowId] = {
            ...newState.openWindows[someWindowId],
            wasLastInFocus: false
        };
    } );

    const newFocusWindow = {
        ...newOpenWindows[aWindowId],
        wasLastInFocus: true
    };

    newOpenWindows[aWindowId] = newFocusWindow;

    newState.openWindows = newOpenWindows;

    return newState;
};

const reOpenTab = ( state, tabs ) => {
    const targetWindowId = tabs.windowId;

    const newOpenWindows = { ...state.openWindows };

    const closedWindows = { ...state.closedWindows };

    const newWindow = { ...newOpenWindows[targetWindowId] };

    newWindow.tabs = [...newWindow.tabs];

    const closedWindowTabs = [...closedWindows[targetWindowId].closedTabs];

    closedWindows[targetWindowId] = {
        ...closedWindows[targetWindowId],
        closedTabs: closedWindowTabs
    };

    const lastTabObj = closedWindowTabs[closedWindowTabs.length - 1];

    closedWindowTabs.pop();

    const { tabId, lastTabIndex } = lastTabObj;

    newWindow.tabs.splice( lastTabIndex, 0, tabId );

    newOpenWindows[targetWindowId] = newWindow;

    const newState = {
        ...state,
        openWindows: newOpenWindows,
        closedWindows
    };

    return newState;
};

const closeWindow = ( state, tab ) => {
    const targetwindow = tab.windowId;

    const newOpenWindows = { ...state.openWindows };
    const newClosedWindows = { ...state.closedWindows };

    const closingWindow = state.openWindows[targetwindow];

    if ( !closingWindow ) return state;

    const closingWindowsTabs = state.openWindows[targetwindow].tabs || [];

    const newTabs = [...closingWindowsTabs];
    const newCloseWindow = {
        ...newClosedWindows[targetwindow],
        lastActiveTabs: newTabs
    };

    delete newOpenWindows[targetwindow];

    newClosedWindows[targetwindow] = newCloseWindow;

    const newState = {
        ...state,
        closedWindows: newClosedWindows,
        openWindows: newOpenWindows
    };
    return newState;
};

function toggleMenu( state, payload, showMenu ) {
    const targetWindow = payload.windowId;

    const newOpenWindows = { ...state.openWindows };
    const newWindow = {
        ...newOpenWindows[targetWindow],
        ui: {
            settingsMenuIsVisible: showMenu
        }
    };

    newOpenWindows[targetWindow] = newWindow;

    const newState = { ...state, openWindows: newOpenWindows };
    return newState;
}

const showSettingsMenu = ( state, payload ) => {
    const showMenu = true;
    return toggleMenu( state, payload, showMenu );
};

const hideSettingsMenu = ( state, payload ) => {
    const showMenu = false;
    return toggleMenu( state, payload, showMenu );
};

const resetStore = ( state, payload ) => {
    const targetWindow = payload.fromWindow;
    const { tabId } = payload;

    if ( !targetWindow ) return state;

    const newState = {
        openWindows: {
            [targetWindow]: {
                activeTab: tabId,
                ui: {
                    settingsMenuIsVisible: false
                },
                tabs: [tabId]
            }
        },
        closedWindows: {
            [targetWindow]: {
                closedTabs: [],
                lastActiveTabs: []
            }
        }
    };
    return newState;
};

export const windows = ( state: object = initialState, action ) => {
    const { payload } = action;

    if ( action.error ) {
        logger.error( 'ERROR IN ACTION', action.error );
        return state;
    }

    switch ( action.type ) {
        case TYPES.ADD_WINDOW: {
            return addWindow( state, payload );
        }
        case TYPES.ADD_TAB_NEXT: {
            return addTabNext( state, payload );
        }
        case TYPES.ADD_TAB_END: {
            return addTabEnd( state, payload );
        }
        case TYPES.SET_ACTIVE_TAB: {
            return setActiveTab( state, payload );
        }
        case TYPES.WINDOW_CLOSE_TAB: {
            return closetab( state, payload );
        }
        case TYPES.REOPEN_TAB: {
            return reOpenTab( state, payload );
        }
        case TYPES.CLOSE_WINDOW: {
            return closeWindow( state, payload );
        }
        case TYPES.SET_LAST_FOCUSED_WINDOW: {
            return setWindowLastInFocus( state, payload );
        }
        case TYPES.SHOW_SETTINGS_MENU: {
            return showSettingsMenu( state, payload );
        }
        case TYPES.HIDE_SETTINGS_MENU: {
            return hideSettingsMenu( state, payload );
        }
        case TAB_TYPES.RESET_STORE: {
            return resetStore( state, payload );
        }
        default:
            return state;
    }
};
