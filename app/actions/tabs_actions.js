import { createActions } from 'redux-actions';

export const TYPES = {
    ADD_TAB              : 'ADD_TAB',
    ACTIVE_TAB_FORWARDS  : 'ACTIVE_TAB_FORWARDS',
    ACTIVE_TAB_BACKWARDS : 'ACTIVE_TAB_BACKWARDS',
    CLOSE_TAB            : 'CLOSE_TAB',
    CLOSE_ACTIVE_TAB     : 'CLOSE_ACTIVE_TAB',
    UPDATE_TAB           : 'UPDATE_TAB',
    UPDATE_TABS          : 'UPDATE_TABS',
    UPDATE_ACTIVE_TAB    : 'UPDATE_ACTIVE_TAB',
    SET_ACTIVE_TAB       : 'SET_ACTIVE_TAB',
    REOPEN_TAB           : 'REOPEN_TAB'
};

export const {
    addTab
    , setActiveTab
    , closeTab
    , closeActiveTab
    , reopenTab
    , updateTab
    , updateTabs
    , updateActiveTab
    , activeTabForwards
    , activeTabBackwards
} = createActions(
    TYPES.ADD_TAB
    , TYPES.SET_ACTIVE_TAB
    , TYPES.CLOSE_TAB
    , TYPES.CLOSE_ACTIVE_TAB
    , TYPES.REOPEN_TAB
    , TYPES.UPDATE_TAB
    , TYPES.UPDATE_TABS
    , TYPES.UPDATE_ACTIVE_TAB
    , TYPES.ACTIVE_TAB_FORWARDS
    , TYPES.ACTIVE_TAB_BACKWARDS
);
