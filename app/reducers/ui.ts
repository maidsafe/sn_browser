import { TYPES } from '$Actions/ui_actions';
import { initialAppState } from './initialAppState';

const initialState = initialAppState.ui;

const addWindowtoUI = ( state, payload ) => {
    const targetWindowId = payload.windowId;
    const getCurrentWindowState = state.windows;
    const windowState = [...getCurrentWindowState];
    windowState.push( { windowId: targetWindowId, settingsMenuIsVisible: false } );
    const newState = { ...state, windows: windowState };
    return newState;
};
function toggleMenu( state, payload, showMenu ) {
    const targetWindowId = payload.windowId;
    const getCurrentWindowState = state.windows;
    const windowState = [...getCurrentWindowState];
    const found = windowState.find( obj => obj.windowId === targetWindowId );
    if ( !found ) {
        return state;
    }
    const updatedWindowIndex = windowState.findIndex(
        obj => obj.windowId === targetWindowId
    );
    const updatedWindow = { ...found };
    if ( showMenu === true ) {
        updatedWindow.settingsMenuIsVisible = true;
    } else {
        updatedWindow.settingsMenuIsVisible = false;
    }
    windowState[updatedWindowIndex] = updatedWindow;
    const newState = { ...state, windows: windowState };
    return newState;
}

const showSettingsMenu = ( state, payload ) => {
    const showMenu = true;
    const newState = toggleMenu( state, payload, showMenu );
    return newState;
};

const hideSettingsMenu = ( state, payload ) => {
    const showMenu = false;
    const newState = toggleMenu( state, payload, showMenu );
    return newState;
};
const removeWindowUI = ( state, payload ) => {
    const targetWindowId = payload.windowId;
    const getCurrentWindowState = state.windows;
    const windowState = [...getCurrentWindowState];
    const UpdatedwindowState = windowState.filter(
        obj => obj.windowId !== targetWindowId
    );
    const newState = { ...state, windows: UpdatedwindowState };
    return newState;
};

export function ui( state: Array = initialState, action ) {
    const { payload } = action;

    switch ( action.type ) {
        case TYPES.SHOW_SETTINGS_MENU: {
            return showSettingsMenu( state, payload );
        }
        case TYPES.HIDE_SETTINGS_MENU: {
            return hideSettingsMenu( state, payload );
        }
        case TYPES.SELECT_ADDRESS_BAR: {
            return { ...state, addressBarIsSelected: true };
        }
        case TYPES.DESELECT_ADDRESS_BAR: {
            return { ...state, addressBarIsSelected: false };
        }
        case TYPES.UI_ADD_WINDOW: {
            return addWindowtoUI( state, payload );
        }
        case TYPES.BLUR_ADDRESS_BAR: {
            return { ...state, addressBarIsSelected: false };
        }
        case TYPES.FOCUS_WEBVIEW: {
            return { ...state, shouldFocusWebview: payload };
        }
        case TYPES.UI_REMOVE_WINDOW: {
            return removeWindowUI( state, payload );
        }

        default:
            return state;
    }
}
