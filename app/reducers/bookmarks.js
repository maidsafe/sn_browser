
// @flow
import { remote, shell, webContents } from 'electron';
import _ from 'lodash';
import { TYPES } from 'actions/bookmarks_actions';
import { TYPES as SAFE_TYPES } from 'actions/safe_actions';
import { makeValidUrl } from 'utils/urlHelpers';
import initialAppState from './initialAppState';

const initialState = initialAppState.bookmarks;

/**
 * Get the current window's webcontents Id. Defaults to `1` if none found.
 * @return { Integer } WebContents Id of the curremt BrowserWindow webcontents.
 */
const getCurrentWindowId = ( ) =>
{
    let currentWindowId;

    if ( typeof currentWindowId === 'undefined' && remote )
    {
        currentWindowId = remote.getCurrentWindow().webContents.id;
    }
    else if ( typeof currentWindowId === 'undefined' )
    {
        currentWindowId = 1;
    }

    return currentWindowId;
};

const addBookmark = ( state, bookmark ) =>
{
    if ( !bookmark )
    {
        throw new Error( 'You must pass a bookmark object with url' );
    }

    // TODO, check if url existssss

    const bookmarkUrl = makeValidUrl( bookmark.url || '' );
    const newBookmark = { ...bookmark };

    const newState = [...state];


    newState.push( newBookmark );

    return newState;
};


/**
 * Set a bookmark as closed. If it is active, deactivate and and set a new active bookmark
 * @param { array } state
 * @param { object } payload
 */
const removeBookmark = ( state, payload ) =>
{
    const removalIndex = state.findIndex( bookmark => bookmark === payload );


    const updatedState = [...state];

    updatedState.pop( removalIndex );

    return updatedState;
};


const updateBookmark = ( state, payload ) =>
{
    const index = payload.index;

    if ( index < 0 )
    {
        // TODO : Should we actually be adding here?
        return state;
    }

    const bookmarkToMerge = state[index];

    let updatedBookmark = { ...bookmarkToMerge };

    updatedBookmark = { ...updatedBookmark, ...payload };

    if ( payload.url )
    {
        const url = makeValidUrl( payload.url );
        updatedBookmark = { ...updatedBookmark, url };
    }

    const updatedState = [...state];

    updatedState[index] = updatedBookmark;

    return updatedState;
};


/**
 * Bookmarks reducer. Should handle all bookmark actions
 * @param  { array } state  array of bookmarks
 * @param  { object } action action Object
 * @return { array }        updatd state object
 */
export default function bookmarks( state: array = initialState, action )
{
    const payload = action.payload;

    if ( action.error )
    {
        console.log( 'ERROR IN ACTION', action.error );
        return state;
    }

    switch ( action.type )
    {
        case TYPES.ADD_BOOKMARK :
        {
            return addBookmark( state, payload );
        }
        case TYPES.REMOVE_BOOKMARK :
        {
            return removeBookmark( state, payload );
        }
        case TYPES.UPDATE_BOOKMARK :
        {
            return updateBookmark( state, payload );
        }
        case SAFE_TYPES.RECEIVED_CONFIG :
        {
            const payloadBookmarks = payload.bookmarks;
            const newBookmarks = [...state, ...payloadBookmarks];

            return _.uniqBy( newBookmarks, 'url' );
        }
        case SAFE_TYPES.LOGOUT :
        {
            const initial = initialState;
            return [...initial];
        }
        default:
            return state;
    }
}
