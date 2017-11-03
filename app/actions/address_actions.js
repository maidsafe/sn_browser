import { createActions } from 'redux-actions';

export const TYPES = {
    UPDATE_ADDRESS : 'UPDATE_ADDRESS'
};

export const { updateAddress } = createActions( TYPES.UPDATE_ADDRESS );
