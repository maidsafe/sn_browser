import { app, ipcMain } from 'electron'
import url from 'url'
import zerr from 'zerr'
import rpc from 'pauls-electron-rpc'
import manifest from '../api-manifests/history'
import log from '../../log'

import store, { saveStore, saveStore2 } from './store/safe-store';
import { List, Map, fromJS } from 'immutable';
import { createAction } from 'redux-actions';

const BadParam = zerr('BadParam', '% must be a %')
const InvalidCmd = zerr('InvalidCommand', '% is not a valid command')


const initialHistoryState = List( [
    Map( {
        url: 'https://safenetforum.org/',
        title : "Safenet Forum",
        visits: List([]), 
        last_visit: new Date()
        
    })
] );



const UPDATE_SITE = 'UPDATE_SITE';
const DELETE_SITE = 'DELETE_SITE';
const DELETE_ALL  = 'DELETE_ALL';

// export const { deleteSite, deleteAll } = createActions( DELETE_SITE, DELETE_ALL );


export const updateSite = createAction( UPDATE_SITE, ( payload , preventSave ) =>
{
    let state = fromJS( store.getState() );
    let history = state.get('history');
    let newState;
    let newHistory;
    
    payload = fromJS( payload );
    
    let index = history.findIndex( site => {
        return site.get('url') === payload.get( 'url' );
    });
    
    if( index > -1 )
    {
        let siteToMerge = history.get( index );
        let updatedSite = siteToMerge.mergeDeep( payload ); //updates last visit, url, title
        let lastVisit   = payload.get('last_visit')
        // // beter parsing of things that will be always there
        if( payload.get('last_visit') && ! updatedSite.get('visits').includes( lastVisit ) )
        {
            let updatedSiteVisits = updatedSite.get( 'visits' ).push( lastVisit );
            updatedSite = updatedSite.set( 'visits', updatedSiteVisits );
        }
        
        updatedSite = updatedSite.set( 'last_visit', payload.get('last_visit') );

        newHistory = history.set( index, updatedSite );
            
        newState = state.set( 'history', newHistory );
        
        if( preventSave )
        {
            return newState.get('history');
        }
        
        //DRY this string out
        return saveStore2( 'history', newState  );
    }
    
    payload = payload.set( 'visits', List([ payload.get('last_visit') ] ));
    
    newHistory  = history.push( payload );
    newState    = state.set( 'history', newHistory );
    
    if( preventSave )
    {
        return newState.get('history');
    }

    //DRY this string out
    return saveStore2( 'history', newState  );
});



export const deleteSite = createAction( DELETE_SITE, payload =>
{
    let state = fromJS( store.getState() ).get('history');
    
    payload = fromJS( payload );
    
    let index = state.findIndex( site => site.get('url') === payload.get( 'url' ) );
    
    let newState = state.delete( index );
    
    return saveStore2( 'history', newState );;
} );


export const deleteAll = createAction( DELETE_ALL, payload =>
{
    let state = fromJS( store.getState() ).get('history');
    
    let newState = state.clear();    
    return saveStore2( 'history', newState );;
} );






export default function history(state = initialHistoryState, action) {
    let payload = fromJS(  action.payload );
    
    if( action.error )
    {
        return state;
    }
    
    switch (action.type) {
        case UPDATE_SITE :
        {
        	return payload;
        }
        case DELETE_SITE: 
            {                 
                return payload;
            } 
        
        case DELETE_ALL: 
            { 
                return payload;
            }
        default:
          return state
  }
  
  
}







export function setup () {
  // wire up RPC
  rpc.exportAPI('beakerHistory', manifest, { addVisit, getVisitHistory, getMostVisited, search, removeVisit, removeAllVisits })
}

export function addVisit ( {url, title } ) {
    // each visit has a timestamp
    return new Promise( (resolve, reject ) =>
    {
        let site = { url, title, last_visit: new Date() };        
        return store.dispatch( updateSite( site ) );
    });
}

export function getVisitHistory ({ offset, limit }) {
    
    return new Promise( (resolve, reject ) =>
    {
        let history = store.getState()[ 'history' ];
        
        let filteredHistory = history.filter( (value, key) => 
        {            
            return ( key >= offset && key <= limit  )
        } )
                
        if( filteredHistory )
        {
            resolve( filteredHistory.toJS() );
        }
        else {
            resolve( undefined );
        }
    });
}

export function getMostVisited ({ offset, limit }) {
    
    offset  = offset || 0;
    limit   = limit || 50;
     
    return getVisitHistory( { offset, limit } )
            .then( unsortedHistory => 
            {                
                unsortedHistory.sort(function(a, b) {
                    return b.visits.length - a.visits.length; //high->low ??
                });
                
                return unsortedHistory;
            });
}

export function search (q) 
{    
    let history = store.getState()[ 'history' ].toJS();
    
    let filteredHistory = history.filter( (value, key) => 
    {
        return ( value.url.includes( q ) || value.title.includes( q ) );
    } )
    
    //sort mby most should be a helper function.
    filteredHistory = filteredHistory.sort(function(a, b) {
        if( !a.visits || !b.visits )
        { 
            return 1;
        }
        else 
        {
            return b.visits.length - a.visits.length; //high->low ??
        }
    });
    
    return new Promise( (resolve, reject ) =>
    {
        resolve( filteredHistory );
    });
}

export function removeVisit (url) {
    return new Promise( (resolve, reject) =>
    {
        let site = { url };
        
        return store.dispatch( deleteSite( site ) );
    } ) 
}

export function removeAllVisits () {
    
    
    return new Promise( (resolve, reject) =>
    {        
        return store.dispatch( deleteAll() );
    } ) 
}
    