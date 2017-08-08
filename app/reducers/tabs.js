// @flow

import { remote } from 'electron';
import { createActions } from 'redux-actions';

import initialAppState 			from './initialAppState.json';
// import updateAddress from './address';

const ADD_TAB = 'ADD_TAB';
const CLOSE_TAB = 'CLOSE_TAB';
const CLOSE_ACTIVE_TAB = 'CLOSE_ACTIVE_TAB';
const UPDATE_TAB = 'UPDATE_TAB';
const UPDATE_ACTIVE_TAB = 'UPDATE_ACTIVE_TAB';
const SET_ACTIVE_TAB = 'SET_ACTIVE_TAB';
const REOPEN_TAB = 'REOPEN_TAB';

export const {
    addTab
    , setActiveTab
    , closeTab
    , closeActiveTab
    , reopenTab
    , updateTab
    , updateActiveTab
} = createActions(
    ADD_TAB
    , SET_ACTIVE_TAB
    , CLOSE_TAB
    , CLOSE_ACTIVE_TAB
    , REOPEN_TAB
    , UPDATE_TAB
    , UPDATE_ACTIVE_TAB
);

const initialState = initialAppState.tabs;


const getActiveTab = ( state ) => state.find( tab => tab.isActiveTab );
const getActiveTabIndex = ( state ) => state.findIndex( tab => tab.isActiveTab );

export function _deactivateOldActiveTab( state )
{
    const activeTabIndex = getActiveTabIndex( state );

    if( activeTabIndex > -1 )
    {
        const oldActiveTab = getActiveTab( state );
        const updatedOldTab = { ...oldActiveTab, isActiveTab: false };

        const updatedState = [ ...state ];
        updatedState[ activeTabIndex ] = updatedOldTab;
        return updatedState;
    }

    return state;
}

/**
 * set active tab to a given index
 * @param       { Int } index index to set as activeTabIndex
 * @param       { Array } state the state array of tabs
 * @constructor
 */
export function _setActiveTab( index, state )
{
    // let newState = state;
    //
    let newActiveTab = state[ index ];
    let updatedState = [ ...state ];

    updatedState = _deactivateOldActiveTab( state );

    updatedState[ index ] = { ...newActiveTab, isActiveTab: true, isClosed: false };

    return updatedState;
}


export function _updateTabHistory( tabToMerge, url )
{
    let updatedTab = { ...tabToMerge };
    if ( url && url !== tabToMerge.url )
    {
        if ( updatedTab.history )
        {
            updatedTab.history.push( url );
        }
        else
        {
            updatedTab.history = [ url ];
        }
    }
    return updatedTab;
}


export function _addTab( state, tab )
{
    const currentWindowId = remote ? remote.getCurrentWindow().id : 1;
    const newTab = { ...tab, windowId: currentWindowId } ;

    let newState = [ ...state ];

    if ( newTab.isActiveTab )
    {
        newState = _deactivateOldActiveTab( newState );
    }

    newState.push( newTab );


    return newState;
}

export function _closeTab( state, payload )
{
    const index = payload.index;

    return setTabAsClosed( state, index );
}

function setTabAsClosed( state, index )
{
    const tabToMerge = state[ index ];
    const updatedTab = { ...tabToMerge, isActiveTab: false, index, isClosed: true, closedTime: new Date() };
    let updatedState = [ ...state ];
    updatedState[ index ] = updatedTab;

    if ( tabToMerge.isActiveTab )
    {
        // TODO: Filter tabs for isClosed and get nearest index that is not closed
        let newActiveTabIndex = index - 1;
        const newActiveTab = state[ newActiveTabIndex ];
        console.log("WAS ACTIVE UPDS new: ", newActiveTabIndex, newActiveTab );
        if ( !newActiveTab )
        {
            newActiveTabIndex = index + 1;
        }

        updatedState = _setActiveTab( newActiveTabIndex, updatedState );
    }

    return updatedState;
}

export function _closeActiveTab( state )
{
    const activeTabIndex = getActiveTabIndex( state );

    return setTabAsClosed( state, activeTabIndex );

}


export function _reopenTab( state, payload )
{
    let lastTab = getLastClosedTab( state );

    lastTab = { ...lastTab, isClosed: false, closedTime: null };
    let updatedState = [...state];

    updatedState[ lastTab.index ] = lastTab;

    return updatedState;
}

export function getLastClosedTab( state )
{
    return state.reduce(  ( prev, lastClosed) => {
      return (lastClosed.closedTime > prev.closedTime ) ? lastClosed : prev;
    }, state[0]);
}


export function _updateActiveTab( state, payload )
{
    const index = getActiveTabIndex( state );

    if ( index < 0 )
    {
        return state;
    }

    const tabToMerge = state[ index ];

    let updatedTab = { ...tabToMerge, ...payload };

    const url = payload.url;

    updatedTab = _updateTabHistory( updatedTab, url );

    const updatedState = [ ...state ];

    updatedState[ index ] = updatedTab;
    return updatedState;
}


export function _updateTab( state, payload )
{
    const index = payload.index;

    if ( index < 0 )
    {
        return state;
    }

    const tabToMerge = state[ index ];

    let updatedTab = { ...tabToMerge, ...payload };

    const url = payload.url;

    updatedTab = _updateTabHistory( updatedTab, url );

    const updatedState = [ ...state ];

    updatedState[ index ] = updatedTab

    return updatedState;
}


export default function tabs( state: array = initialState, action )
{
    const payload = action.payload;

    if ( action.error )
    {
        console.log( 'ERROR IN ACTION', action.error );
        return state;
    }

    switch ( action.type )
    {
        case ADD_TAB :
            {
                return _addTab( state, payload );
            }
        case SET_ACTIVE_TAB :
            {
                return _setActiveTab( payload, state );
            }
        case CLOSE_TAB :
            {
                return _closeTab( state, payload );
            }
        case CLOSE_ACTIVE_TAB :
            {
                return _closeActiveTab( state );
            }
        case REOPEN_TAB :
            {
                return _reopenTab( state, payload );
            }
        case UPDATE_ACTIVE_TAB :
            {
                return _updateActiveTab( state, payload );
            }
        case UPDATE_TAB :
            {
                return _updateTab( state, payload );
            }
        default:
            return state;
    }
}
