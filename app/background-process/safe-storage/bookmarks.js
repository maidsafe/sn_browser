import { app } from 'electron'
import url from 'url'
import rpc from 'pauls-electron-rpc'
import manifest from '../api-manifests/bookmarks'
import log from '../../log'


import store from './store'
import { List, Map, fromJS } from 'immutable'
import { createActions } from 'redux-actions'

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
] )


const UPDATE_BOOKMARK = 'UPDATE_BOOKMARK'
const DELETE_BOOKMARK = 'DELETE_BOOKMARK'

export const { updateBookmark, deleteBookmark } = createActions( UPDATE_BOOKMARK, DELETE_BOOKMARK )

export default function bookmarks(state = initialBookmarkState, action) {
    let payload =  fromJS( action.payload ) 
    
    if( action.error )
    {
        //trigger error action
        return state
    }

    switch (action.type) {
        case UPDATE_BOOKMARK :
        {
        
            let newState
            let newBookmarks
            
            let index = state.findIndex( site => {
                return site.get('url') === payload.get( 'url' )
            })
            
            if( index > -1 )
            {
                let siteToMerge = state.get( index )
                let updatedSite = siteToMerge.mergeDeep( payload )

                if( payload.get('newUrl') )
                {
                    updatedSite = updatedSite.set( 'url', payload.get('newUrl') )
                }
                
                if( payload.get('num_visits') )
                {
                    let newVisitCount = siteToMerge.get('num_visits') || 0
                    newVisitCount++
                    updatedSite = updatedSite.set( 'num_visits', newVisitCount )
                }
                
                return state.set( index, updatedSite )
                
            }
            
            if( payload.get( 'num_visits' ) )
            {
                return state
            }
            
            return state.push( payload )
        }
        case DELETE_BOOKMARK: 
        {                         
            let index = state.findIndex( site => site.get('url') === payload.get( 'url' ) )
            
            return state.delete( index )
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
    return new Promise( (resolve, reject) =>
    {
        let bookmark = { url, title }        
        return store.dispatch( updateBookmark( bookmark ) )
    } ) 

}

export function changeTitle (url, title) {
    
    return new Promise( (resolve, reject) =>
    {
        let bookmark = { url, title }
        
        return store.dispatch( updateBookmark( bookmark ) )
    } ) 
}

export function changeUrl (oldUrl, newUrl) {

    return new Promise( (resolve, reject) =>
    {
        let bookmark = { 
            url: oldUrl,
            newUrl : newUrl }
        
        return store.dispatch( updateBookmark( bookmark ) )
    } ) 

}

export function addVisit (url) {
    
    let site = store.getState()[ 'bookmarks' ].find( site => site.get('url') === url ) 
    if( site )
    {
        return new Promise( (resolve, reject) =>
        {
            let bookmark = { url, num_visits : 1 }
            
            return store.dispatch( updateBookmark( bookmark ) )
        } ) 
        
    }
    else {
        return Promise.reject('bookmark does not exist')
    }


}

export function remove (url) {

    return new Promise( (resolve, reject) =>
    {
        let bookmark = { url }
        
        return store.dispatch( deleteBookmark( bookmark ) )
    } ) 
}

export function get (url) {

    return new Promise( ( resolve, reject) =>
    {
        let site = store.getState()[ 'bookmarks' ].find( site => site.get('url') === url ) 

        if( site )
        {
            let datum = site.get( 'data' ).get( key )
            resolve( datum )
        }
        else {
            resolve( undefined )
        }
    })
    
}

export function list () {

    let sites = store.getState()[ 'bookmarks' ].toJS()
    
    return new Promise( (resolve, reject ) => resolve( sites ))

}
