import { createActions } from 'redux-actions';

export const TYPES = {
    ADD_BOOKMARK: 'ADD_BOOKMARK',
    REMOVE_BOOKMARK: 'REMOVE_BOOKMARK',
    UPDATE_BOOKMARK: 'UPDATE_BOOKMARK',
    UPDATE_BOOKMARKS: 'UPDATE_BOOKMARKS',
};

export const {
    addBookmark,
    removeBookmark,
    updateBookmark,
    updateBookmarks,
} = createActions(
    TYPES.ADD_BOOKMARK,
    TYPES.REMOVE_BOOKMARK,
    TYPES.UPDATE_BOOKMARK,
    TYPES.UPDATE_BOOKMARKS
);
