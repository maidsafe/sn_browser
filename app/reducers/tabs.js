// @flow

import { List, Map, fromJS } from 'immutable';

import { createActions } from 'redux-actions';
import initialAppState 			from './initialAppState.json';
import { remote } from 'electron';
import updateAddress from './address';

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

const initialState = fromJS( initialAppState.tabs );


const getActiveTabIndex = ( state ) =>
{
    return state.findIndex( tab => tab.get( 'isActiveTab' ) );

}

export function _deactivateOldTab( state )
{
    let newState;
    const oldTabIndex = getActiveTabIndex( state );

    if ( oldTabIndex > -1 )
    {
        const oldTab = state.get( oldTabIndex );
        const updatedOldTab = oldTab.mergeDeep( { isActiveTab: false } );
        return state.set( oldTabIndex, updatedOldTab );
    }

    return state;
};



export function _setActiveTab( payload , state )
{
    let newState = state;
    //
    let newActiveTab = state.get( payload );
    const tabWithActiveSet = { isActiveTab: true, isClosed: false };

    newActiveTab = newActiveTab.merge( tabWithActiveSet);
    newState = _deactivateOldTab( newState );

    newState = newState.set( payload, newActiveTab );

    return newState;
}


export function _updateTabHistory( tabToMerge, url )
{
    let updatedTab = tabToMerge;
    if( url && url !== tabToMerge.get('url') )
    {
        if( updatedTab.get( 'history') )
        {
            updatedTab = updatedTab.update( 'history', list => list.push( payload.get( 'url' ) ) );
        }
        else
        {
            updatedTab.set( 'history', List([ url ]) );
        }
    }
    return updatedTab;
}


export function _addTab( state, payload )
{
    let currentWindowId = remote ? remote.getCurrentWindow().id : 1;
    let newTab = payload.mergeDeep({ windowId : currentWindowId });

    console.log( 'newTab on addTab' , newTab );
    let newState = state.push( newTab );

    if ( newTab.get( 'isActiveTab' ) )
    {
        newState = _deactivateOldTab( newState );
    }

    return newState;
}

export function _closeTab( state, payload )
{
    const index = payload.get( 'index' );

    setTabAsClosed( state, index );

    return updatedState;
}

function setTabAsClosed( state, index )
{
    const tabToMerge = state.get( index );
    const updatedTab = tabToMerge.mergeDeep( { isActiveTab: false, index, isClosed: true, closedTime: new Date() } );
    let updatedState = state.set( index, updatedTab );

    if( tabToMerge.get( 'isActiveTab' ) )
    {
        // TODO: Filter tabs for isClosed and get nearest index that is not closed
        let newActiveTabIndex = index - 1;
        let newActiveTab = state.get( newActiveTabIndex );

        if( !newActiveTab )
        {
            console.log( 'index minus one doesnt exist ', newActiveTab );
            newActiveTabIndex = index + 1;
        }

        if( !newActiveTab )
        {
            console.log( 'NO TABS LEFT ======22221!!!' );
        }

        updatedState = _setActiveTab( newActiveTabIndex, updatedState );
    }

    return updatedState;
}

export function _closeActiveTab( state )
{
    let activeTabIndex = getActiveTabIndex( state );
    console.log( 'closing active tab' , activeTabIndex );
    return setTabAsClosed( state, activeTabIndex );



    // closeTab( { index: activeTabIndex } );

    // return state;
}


export function _reopenTab( state, payload )
{
    let lastTab = getLastClosedTab( state );

    lastTab = lastTab.set( 'isClosed', false );
    lastTab = lastTab.set( 'closedTime', null );

    return state.set( lastTab.get('index'), lastTab  );
}

export function getLastClosedTab( state )
{
    return state.max( tab => tab.get( 'closedTime' ) );
}


export function _updateActiveTab( state, payload )
{
    const index = state.findIndex( tab => tab.get( 'isActiveTab' ) );

    if ( index < 0 )
    {
        return state;
    }

    const tabToMerge = state.get( index );

    let updatedTab = tabToMerge.mergeDeep( payload );

    // console.log( 'updating active tabToMerge', updatedTab.toJS() );

    const url = payload.get( 'url' );

    updatedTab = _updateTabHistory( updatedTab , url)

    return state.set( index, updatedTab );
}


export function _updateTab( state, payload )
{
    const index = payload.get( 'index' );

    if ( index < 0 )
    {
        return state;
    }

    const tabToMerge = state.get( index );

    let updatedTab = tabToMerge.mergeDeep( payload );


    const url = payload.get( 'url' );

    updatedTab = _updateTabHistory( updatedTab, url );


    // console.log( 'updating tab', updatedTab.toJS() );
    return state.set( index, updatedTab );
}








export default function tabs( state: array = initialState, action )
{
    const payload = fromJS( action.payload );

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
                return _setActiveTab( payload , state );

            }
        case CLOSE_TAB :
            {
                return _closeTab( state, payload )
            }
        case CLOSE_ACTIVE_TAB :
            {
                return _closeActiveTab( state )
            }
        case REOPEN_TAB :
        {
            return _reopenTab( state, payload )
        }
        case UPDATE_ACTIVE_TAB :
            {
                return _updateActiveTab( state, payload )
            }
        case UPDATE_TAB :
            {
                return _updateTab( state, payload )
            }
        default:
            return state;
    }
}







const safeBrowserApp =
    {
    // TODO: pull from package.json
        name        : 'SafeBrowser',
        id          : 'safe-browser',
        version     : '0.4.0',
        vendor      : 'josh.wilson',
        permissions : ['SAFE_DRIVE_ACCESS']
    };
