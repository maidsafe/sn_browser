import { createActions } from 'redux-actions';

export const TYPES = {
    SHOW_SETTINGS_MENU: 'SHOW_SETTINGS_MENU',
    HIDE_SETTINGS_MENU: 'HIDE_SETTINGS_MENU',
    BLUR_ADDRESS_BAR: 'BLUR_ADDRESS_BAR',
    UI_ADD_WINDOW: 'UI_ADD_WINDOW',
    UI_REMOVE_WINDOW: 'UI_REMOVE_WINDOW',
    DESELECT_ADDRESS_BAR: 'DESELECT_ADDRESS_BAR',
    SELECT_ADDRESS_BAR: 'SELECT_ADDRESS_BAR',
    RESET_STORE: 'RESET_STORE',
    FOCUS_WEBVIEW: 'FOCUS_WEBVIEW'
};

export const {
    showSettingsMenu,
    hideSettingsMenu,
    blurAddressBar,
    deselectAddressBar,
    uiAddWindow,
    selectAddressBar,
    uiRemoveWindow,
    resetStore,
    focusWebview
} = createActions(
    TYPES.SHOW_SETTINGS_MENU,
    TYPES.HIDE_SETTINGS_MENU,
    TYPES.BLUR_ADDRESS_BAR,
    TYPES.DESELECT_ADDRESS_BAR,
    TYPES.UI_ADD_WINDOW,
    TYPES.SELECT_ADDRESS_BAR,
    TYPES.UI_REMOVE_WINDOW,
    TYPES.RESET_STORE,
    TYPES.FOCUS_WEBVIEW
);
