import { createActions } from 'redux-actions';

export const TYPES = {
    ADD_NOTIFICATION       : 'ADD_NOTIFICATION',
    ADD_LOCAL_NOTIFICATION : 'ADD_LOCAL_NOTIFICATION',
    CLEAR_NOTIFICATION     : 'CLEAR_NOTIFICATION'
};

export const {
    addNotification,
    addLocalNotification,
    clearNotification
} = createActions( {
    [TYPES.ADD_NOTIFICATION]       : payload => ( { ...payload } ),
    [TYPES.ADD_LOCAL_NOTIFICATION] : [
        payload => ( { ...payload } ),
        meta => (
            {
                scope : 'local'
            } )
    ],
    [TYPES.CLEAR_NOTIFICATION] : payload => ( {} )
} );
