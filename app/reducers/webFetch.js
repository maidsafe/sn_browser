// @flow
import { handleActions } from 'redux-actions';
import initialAppState from './initialAppState';
import { setWebFetchStatus } from 'extensions/safe/actions/web_fetch_actions';

const initialState = initialAppState.webFetch;

export default handleActions( {
    [setWebFetchStatus]( state, { payload } )
    {
        return Object.assign( {}, state, payload );
    }
}, initialState );
