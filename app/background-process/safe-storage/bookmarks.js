import { app } from 'electron'
import url from 'url'
import rpc from 'pauls-electron-rpc'
import manifest from '../api-manifests/bookmarks'
import log from '../../log'


import store, { saveStore, saveStore2 } from './store/safe-store';
import { List, Map, fromJS } from 'immutable';
import { createActions, createAction } from 'redux-actions';

const initialBookmarkState = List( [
    Map( {
        url: 'https://safenetforum.org/',
        title : "Safenet Forum",
        num_visits : 0
    }),
    Map( {
        url: 'safe://dir.yvette/',
        title : "SAFE Network Directory",
        num_visits : 0
    })
] );


const UPDATE_BOOKMARK = 'UPDATE_BOOKMARK';
const DELETE_BOOKMARK = 'DELETE_BOOKMARK';

// const { updateBookmark, deleteBookmark } = createActions( UPDATE_BOOKMARK, DELETE_BOOKMARK );
export const { deleteBookmark } = createAction( DELETE_BOOKMARK, payload =>
{
    let state = fromJS( store.getState() ).get('bookmarks');
    
    payload = fromJS( payload );
    
    let index = state.findIndex( site => site.get('url') === payload.get( 'url' ) );
    
    let newState = state.delete( index );
    
    return saveStore2( 'bookmarks', newState );;
} );



export const updateBookmark = createAction( UPDATE_BOOKMARK, ( payload , preventSave ) =>
{
    let state = fromJS( store.getState() );
    let bookmarks = state.get('bookmarks');
    
    payload = fromJS( payload );
    
    let newState;
    let newBookmarks;
    
    if( ! bookmarks.findIndex )
    {
        //TODO: solve this properly
        console.log( "THERE WAS A PROBLEMMMM", payload, bookmarks );
        return bookmarks;
    }
    
    let index = bookmarks.findIndex( site => {
        return site.get('url') === payload.get( 'url' );
    });
    
    if( index > -1 )
    {
        let siteToMerge = bookmarks.get( index );
        let updatedSite = siteToMerge.mergeDeep( payload );

        if( payload.get('newUrl') )
        {
            updatedSite = updatedSite.set( 'url', payload.get('newUrl') );
        }
        
        if( payload.get('num_visits') )
        {
            let newVisitCount = siteToMerge.get('num_visits') || 0;
            newVisitCount++;
            updatedSite = updatedSite.set( 'num_visits', newVisitCount );
        }
        
        newBookmarks = bookmarks.set( index, updatedSite );
            
        newState = state.set( 'bookmarks', newBookmarks );
        
        if( preventSave )
        {
            return newState.get('bookmarks');
        }
        
        return saveStore2( 'bookmarks', newState  );
    }
    
    
    if( payload.get( 'num_visits' ) )
    {
        return bookmarks;
    }
    
    
    newBookmarks    = bookmarks.push( payload );
    newState        = state.set( 'bookmarks', newBookmarks );
    
    if( preventSave )
    {
        return newState.get('bookmarks');
    }
    return saveStore2( 'bookmarks', newState );
});


export default function bookmarks(state = initialBookmarkState, action) {
    let payload =  action.payload ;
    
    if( payload && payload.error )
    {
        return state;
    }

    switch (action.type) {
        case UPDATE_BOOKMARK :
        {
            return payload;
        }
        case DELETE_BOOKMARK: 
        {             
            return payload;
        } 
        default:
            return state
    }
}


export function setup () {
  // wire up RPC
  rpc.exportAPI('beakerBookmarks', manifest, { add, changeTitle, changeUrl, addVisit, remove, get, list })
}

export function add (url, title) {
    console.log( "ADDING BMARK" );
    return new Promise( (resolve, reject) =>
    {
        let bookmark = { url, title };        
        return store.dispatch( updateBookmark( bookmark ) );
    } ) 

}

export function changeTitle (url, title) {
    console.log( "CHANGE BMARK" );
    
    return new Promise( (resolve, reject) =>
    {
        let bookmark = { url, title };
        
        return store.dispatch( updateBookmark( bookmark ) );
    } ) 
}

export function changeUrl (oldUrl, newUrl) {
    console.log( "CHANGE url" );

    return new Promise( (resolve, reject) =>
    {
        let bookmark = { 
            url: oldUrl,
            newUrl : newUrl };
        
        return store.dispatch( updateBookmark( bookmark ) );
    } ) 

}

export function addVisit (url) {
    console.log( "add visit BMARK" );

    return new Promise( (resolve, reject) =>
    {
        let bookmark = { url, num_visits : 1 };
        
        return store.dispatch( updateBookmark( bookmark ) );
    } ) 

}

export function remove (url) {
    console.log( "remove BMARK" );

    return new Promise( (resolve, reject) =>
    {
        let bookmark = { url };
        
        return store.dispatch( deleteBookmark( bookmark ) );
    } ) 
}

export function get (url) {
    console.log( "get BMARK" );

    return new Promise( ( resolve, reject) =>
    {
        let site = store.getState()[ 'bookmarks' ].find( site => site.get('url') === url ) ;

        if( site )
        {
            let datum = site.get( 'data' ).get( key );
            resolve( datum );
        }
        else {
            resolve( undefined );
        }
    })
    
}

export function list () {
    console.log( "list BMARK" );

    let sites = store.getState()[ 'bookmarks' ].toJS();
    
    return new Promise( (resolve, reject ) => resolve( sites ));

}
