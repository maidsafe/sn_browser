import { createActions } from 'redux-actions';

export const TYPES = {
    ADD_WINDOW: 'ADD_WINDOW',
    ADD_TAB_NEXT: 'ADD_TAB_NEXT',
    ADD_TAB_END: 'ADD_TAB_END',
    SET_ACTIVE_TAB: 'SET_ACTIVE_TAB',
    WINDOW_CLOSE_TAB: 'WINDOW_CLOSE_TAB',
    REOPEN_TAB: 'REOPEN_TAB',
    CLOSE_WINDOW: 'CLOSE_WINDOW',
    SHOW_SETTINGS_MENU: 'SHOW_SETTINGS_MENU',
    HIDE_SETTINGS_MENU: 'HIDE_SETTINGS_MENU',
    SET_LAST_FOCUSED_WINDOW: 'SET_LAST_FOCUSED_WINDOW'
};

export const {
    addWindow,
    addTabNext,
    addTabEnd,
    setActiveTab,
    windowCloseTab,
    reopenTab,
    closeWindow,
    showSettingsMenu,
    hideSettingsMenu,
    setLastFocusedWindow
} = createActions(
    TYPES.ADD_WINDOW,
    TYPES.ADD_TAB_NEXT,
    TYPES.ADD_TAB_END,
    TYPES.SET_ACTIVE_TAB,
    TYPES.WINDOW_CLOSE_TAB,
    TYPES.REOPEN_TAB,
    TYPES.CLOSE_WINDOW,
    TYPES.SHOW_SETTINGS_MENU,
    TYPES.HIDE_SETTINGS_MENU,
    TYPES.SET_LAST_FOCUSED_WINDOW
);
