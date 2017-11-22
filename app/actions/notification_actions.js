import { createActions } from 'redux-actions';

export const TYPES = {
    ADD_NOTIFICATION : 'ADD_NOTIFICATION',
    CLEAR_NOTIFICATION : 'CLEAR_NOTIFICATION'
};

export const { addNotification, clearNotification } = createActions( TYPES.ADD_NOTIFICATION, TYPES.CLEAR_NOTIFICATION );
