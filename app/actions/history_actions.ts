import { createActions } from 'redux-actions';

export const TYPES = {
    UPDATE_HISTORY_STATE: 'UPDATE_HISTORY_STATE'
};

export const { updateHistoryState } = createActions( TYPES.UPDATE_HISTORY_STATE );
