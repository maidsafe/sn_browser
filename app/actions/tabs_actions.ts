import { createActions } from 'redux-actions';

export const TYPES = {
    ADD_TAB: 'ADD_TAB',
    TAB_FORWARDS: 'TAB_FORWARDS',
    TAB_BACKWARDS: 'TAB_BACKWARDS',
    CLOSE_TAB: 'CLOSE_TAB',
    UPDATE_TAB: 'UPDATE_TAB',
    UPDATE_TABS: 'UPDATE_TABS',
    SET_ACTIVE_TAB: 'SET_ACTIVE_TAB',
    REOPEN_TAB: 'REOPEN_TAB'
};

export const {
    addTab,
    setActiveTab,
    closeTab,
    reopenTab,
    updateTab,
    updateTabs,
    tabForwards,
    tabBackwards
} = createActions(
    TYPES.ADD_TAB,
    TYPES.SET_ACTIVE_TAB,
    TYPES.CLOSE_TAB,
    TYPES.REOPEN_TAB,
    TYPES.UPDATE_TAB,
    TYPES.UPDATE_TABS,
    TYPES.TAB_FORWARDS,
    TYPES.TAB_BACKWARDS
);
