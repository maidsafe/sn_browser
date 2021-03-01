import { createActions } from 'redux-actions';

export const TYPES = {
    ADD_NOTIFICATION: 'ADD_NOTIFICATION',
    UPDATE_NOTIFICATION: 'UPDATE_NOTIFICATION',
    CLEAR_NOTIFICATION: 'CLEAR_NOTIFICATION',
};

export const {
    addNotification,
    updateNotification,
    clearNotification,
} = createActions(
    TYPES.ADD_NOTIFICATION,
    TYPES.UPDATE_NOTIFICATION,
    TYPES.CLEAR_NOTIFICATION
);
