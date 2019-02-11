import { createActions } from 'redux-actions';

export const TYPES = {
    SHOW_SETTINGS_MENU   : 'SHOW_SETTINGS_MENU',
    HIDE_SETTINGS_MENU   : 'HIDE_SETTINGS_MENU',
    BLUR_ADDRESS_BAR     : 'BLUR_ADDRESS_BAR',
    DESELECT_ADDRESS_BAR : 'DESELECT_ADDRESS_BAR',
    SELECT_ADDRESS_BAR   : 'SELECT_ADDRESS_BAR',
    RESET_STORE          : 'RESET_STORE',
    RELOAD_PAGE          : 'RELOAD_PAGE',
    PAGE_LOADED          : 'PAGE_LOADED',
    FOCUS_WEBVIEW        : 'FOCUS_WEBVIEW'
};

export const {
    showSettingsMenu,
    hideSettingsMenu,
    blurAddressBar,
    deselectAddressBar,
    selectAddressBar,
    resetStore,
    reloadPage,
    pageLoaded,
    focusWebview
} = createActions(
    {
        SHOW_SETTINGS_MENU : [
            undefined,
            () => ( { scope: 'local' } ) // meta
        ],
        HIDE_SETTINGS_MENU : [
            undefined,
            () => ( { scope: 'local' } ) // meta
        ],
        BLUR_ADDRESS_BAR : [
            undefined,
            () => ( { scope: 'local' } ) // meta
        ],
        DESELECT_ADDRESS_BAR : [
            undefined,
            () => ( { scope: 'local' } ) // meta
        ],
        SELECT_ADDRESS_BAR : [
            undefined,
            () => ( { scope: 'local' } ) // meta
        ],
        RESET_STORE : [
            undefined,
            () => ( { scope: 'local' } ) // meta
        ],
        RELOAD_PAGE : [
            undefined,
            () => ( { scope: 'local' } ) // meta
        ],
        PAGE_LOADED : [
            undefined,
            () => ( { scope: 'local' } ) // meta
        ],
        FOCUS_WEBVIEW : [
            undefined,
            () => ( { scope: 'local' } ) // meta
        ]
    }
);
