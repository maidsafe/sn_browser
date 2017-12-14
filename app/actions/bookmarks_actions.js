import { createActions } from 'redux-actions';

export const TYPES = {
    ADD_BOOKMARK    : 'ADD_BOOKMARK',
    REMOVE_BOOKMARK : 'REMOVE_BOOKMARK',
    UPDATE_BOOKMARK : 'UPDATE_BOOKMARK'
};

export const {
    addBookmark
    , removeBookmark
    , updateBookmark
} = createActions(
    TYPES.ADD_BOOKMARK
    , TYPES.REMOVE_BOOKMARK
    , TYPES.UPDATE_BOOKMARK
);
