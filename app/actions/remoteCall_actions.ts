import { createActions } from 'redux-actions';

export const TYPES = {
    ADD_REMOTE_CALL: 'ADD_REMOTE_CALL',
    REMOVE_REMOTE_CALL: 'REMOVE_REMOTE_CALL',
    UPDATE_REMOTE_CALL: 'UPDATE_REMOTE_CALL',
};

export const {
    addRemoteCall,
    removeRemoteCall,
    updateRemoteCall,
} = createActions(
    TYPES.ADD_REMOTE_CALL,
    TYPES.REMOVE_REMOTE_CALL,
    TYPES.UPDATE_REMOTE_CALL
);
