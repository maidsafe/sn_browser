import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import createNodeLogger from 'redux-node-logger'
import promiseMiddleware from 'redux-promise'
import _ from 'lodash'

import { updateSiteData } from './sitedata'
import { updateSettings } from './settings'
import { updateBookmark } from './bookmarks'
import { updateSite } from './history'

import rootReducer from './root-reducer'
import { nfs } from 'safe-js'

export const SITE_DATA_ID = 'safe:safe-browser'
export const SAFE_BROWSER_STATE_FILE = 'safeBrowserData.json'


const logger = createNodeLogger({
    level: 'info',
    collapsed: true
})

let enhancer = compose(
    applyMiddleware(thunk, logger, promiseMiddleware)
)

let store = createStore(rootReducer, enhancer)

export default store;



const getTokenFromState = ( state = store.getState() ) =>
{
    let browserSettings = state[ 'settings' ]

    if( browserSettings )
    {
        let authToken = browserSettings.get('authToken')
                
        if( authToken )
        {
            return authToken;
            
        }
        else {
            return null;
        }
        
    }
    else {
        return null;
    }
}


export const getStore = ( token ) =>
{
    let currentToken = token || getTokenFromState()
    
    if( currentToken )
    {
        return nfs.getFile( currentToken, SAFE_BROWSER_STATE_FILE, 'json' )
    }
    else {
        return Promise.reject( 'no token data found' )
    }
}


const save = ( ) =>
{
        let state = store.getState()
        let currentToken = getTokenFromState( state )

        if( currentToken )
        {
            let JSONToSave = JSON.stringify( state )
            return nfs.createOrUpdateFile( currentToken, SAFE_BROWSER_STATE_FILE, JSONToSave, 'application/json' )
                .then( bool => 
                    {
                        console.log( "success was had saving state:  ", bool )
                        return bool
                    } )
        }
        else {
            return Promise.reject( new Error( 'Unable to save data to the SAFE network, as no token found' ) )
        }
}

export const saveStore = _.debounce( save, 500 );





export const reStore = ( storeState ) =>
{
    if( storeState.errorCode )
    {
        return Promise.reject( storeState )
    }
    
    if( storeState.settings )
    {
        store.dispatch( updateSettings( storeState.settings ) )        

    }
    
    if( storeState.sitedata )
    {
        dispatchForEach( storeState.sitedata , updateSiteData )
    }
    
    if( storeState.history )
    {
        dispatchForEach( storeState.history , updateSite )
    }
    
    if( storeState.bookmarks )
    {
        dispatchForEach( storeState.bookmarks , updateBookmark )
    }
    
}


const dispatchForEach = ( array, action ) =>
{
    array.forEach( (item, key) => 
    {
        store.dispatch( action( item ) )
        return;
    })
}





export const handleAuthError = ( err ) =>
{   
    store.dispatch( updateSettings( { 'authSuccess': false} ) )
    if( err.code === -12 )
    {
        store.dispatch( updateSettings( { 'authMessage': 'SAFE Launcher does not appear to be open.' } ) )
        return
    }
    else if( err.code === 'ECONNREFUSED' )
    {
		store.dispatch( updateSettings( { 'authMessage': 'SAFE Launcher does not appear to be open.' } ) )
        return
    }
    else if( err.statusText === 'Unauthorized' )
    {
		store.dispatch( updateSettings( { 'authMessage':'The browser failed to authorise with the SAFE launcher.' } ) )
        return
    }
    
    store.dispatch( updateSettings( { 'authMessage': '' + JSON.stringify( err ) } ) )
}