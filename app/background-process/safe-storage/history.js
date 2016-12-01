import { app, ipcMain } from 'electron'
import url from 'url'
import zerr from 'zerr'
import rpc from 'pauls-electron-rpc'
import manifest from '../api-manifests/history'
import log from '../../log'

import store from './store'
import { List, Map, fromJS } from 'immutable'
import { createAction, createActions } from 'redux-actions'

const BadParam = zerr('BadParam', '% must be a %')
const InvalidCmd = zerr('InvalidCommand', '% is not a valid command')


const initialHistoryState = List( [
    Map( {
        url: 'https://safenetforum.org/',
        title : "Safenet Forum",
        visits: List([]), 
        last_visit: new Date()
        
    })
] )



const UPDATE_SITE = 'UPDATE_SITE'
const DELETE_SITE = 'DELETE_SITE'
const DELETE_ALL  = 'DELETE_ALL'

export const { updateSite, deleteSite, deleteAll } = createActions( UPDATE_SITE, DELETE_SITE, DELETE_ALL )

export default function history(state = initialHistoryState, action) {
    let payload = fromJS(  action.payload )
    
    if( action.error )
    {
        return state
    }
    
    switch (action.type) {
        case UPDATE_SITE :
        {    
            let index = state.findIndex( site => {
                return site.get('url') === payload.get( 'url' )
            })
            
            if( index > -1 )
            {
                let siteToMerge = state.get( index )
                let updatedSite = siteToMerge.mergeDeep( payload ) //updates last visit, url, title
                let lastVisit   = payload.get('last_visit')
                // // beter parsing of things that will be always there
                if( payload.get('last_visit') && ! updatedSite.get('visits').includes( lastVisit ) )
                {
                    let updatedSiteVisits = updatedSite.get( 'visits' ).push( lastVisit )
                    updatedSite = updatedSite.set( 'visits', updatedSiteVisits )
                }
                
                updatedSite = updatedSite.set( 'last_visit', payload.get('last_visit') )

                return state.set( index, updatedSite )

            }
            
            payload = payload.set( 'visits', List([ payload.get('last_visit') ] ))
            
            return state.push( payload )
        }
        case DELETE_SITE: 
            {                
                let index = state.findIndex( site => site.get('url') === payload.get( 'url' ) )
                
                return state.delete( index )
            } 
        
        case DELETE_ALL: 
            { 
                return state.clear()    
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
        let site = { url, title, last_visit: new Date() }        
        return store.dispatch( updateSite( site ) )
    })
}

export function getVisitHistory ({ offset, limit }) {
    
    return new Promise( (resolve, reject ) =>
    {
        let history = store.getState()[ 'history' ]
        
        let filteredHistory = history.filter( (value, key) => 
        {            
            return ( key >= offset && key <= limit  )
        } )
                
        if( filteredHistory )
        {
            resolve( filteredHistory.toJS() )
        }
        else {
            resolve( undefined )
        }
    })
}

export function getMostVisited ({ offset, limit }) {
    
    offset  = offset || 0
    limit   = limit || 50
     
    return getVisitHistory( { offset, limit } )
            .then( unsortedHistory => 
            {                
                unsortedHistory.sort(function(a, b) {
                    return b.visits.length - a.visits.length //high->low ??
                })
                
                return unsortedHistory
            })
}

export function search (q) 
{    
    let history = store.getState()[ 'history' ].toJS()
    
    let filteredHistory = history.filter( (value, key) => 
    {
        return ( value.url.includes( q ) || value.title.includes( q ) )
    } )
    
    //sort mby most should be a helper function.
    filteredHistory = filteredHistory.sort(function(a, b) {
        if( !a.visits || !b.visits )
        { 
            return 1
        }
        else 
        {
            return b.visits.length - a.visits.length //high->low ??
        }
    })
    
    return new Promise( (resolve, reject ) =>
    {
        resolve( filteredHistory )
    })
}

export function removeVisit (url) {
    return new Promise( (resolve, reject) =>
    {
        let site = { url }
        
        return store.dispatch( deleteSite( site ) )
    } ) 
}

export function removeAllVisits () {
    
    
    return new Promise( (resolve, reject) =>
    {        
        return store.dispatch( deleteAll() )
    } ) 
}
    