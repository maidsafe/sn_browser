import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk'
import { electronEnhancer } from 'redux-electron-store';
import createNodeLogger from 'redux-node-logger';
import promiseMiddleware from 'redux-promise';
//get actions for reStore
// this seems a bit whack, but for now...
import { setSiteData } from './actions/sitedata';
import { setSetting } from './actions/settings';
import { updateBookmark } from '../bookmarks';
import { updateSite } from '../history';


import rootReducer from './reducers/root-reducer';
import { nfs } from 'safe-js';

export const SITE_DATA_ID = 'safe:safe-browser';
export const SAFE_BROWSER_STATE_FILE = 'safeBrowserData.json';


const logger = createNodeLogger({
    level: 'info',
    collapsed: true
});


let initialState = {};

let enhancer = compose(
    applyMiddleware(thunk, logger, promiseMiddleware),
    electronEnhancer()
);

let store = createStore(rootReducer, enhancer);

export default store;





const getTokenFromState = ( state = store.getState() ) =>
{
    let browserSettings = state[ 'settings' ];

    if( browserSettings )
    {
        let authToken = browserSettings.get('authToken');
                
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


export const getStore = () =>
{
    let currentToken = getTokenFromState( );
    
    if( currentToken )
    {
        return nfs.getFile( currentToken, SAFE_BROWSER_STATE_FILE );
    }
    else {
        return Promise.reject( 'no token data found' );
    }
}


export const saveStore = ( ) =>
{
        let state = store.getState();
        let currentToken = getTokenFromState( state );
        
        if( currentToken )
        {
            let JSONToSave = JSON.stringify( state );
            return nfs.createOrUpdateFile( currentToken, SAFE_BROWSER_STATE_FILE, JSONToSave, 'application/json' )
                .then( bool => 
                    {
                        console.log( "success was had saving state:  ", bool )
                        return bool;
                    } );
        }
        else {
            return Promise.reject( new Error( 'Unable to save data to the SAFE network, as no token found' ) );
        }
}

export const saveStore2 = ( specificReducer, newState ) =>
{
        let state = newState;
        let currentToken = getTokenFromState();

        if( currentToken )
        {
            let JSONToSave = JSON.stringify( newState );
            return nfs.createOrUpdateFile( currentToken, SAFE_BROWSER_STATE_FILE, JSONToSave, 'application/json' )
                .then( bool => 
                    {
                        //currently request is sucecssful, but retuning errors
                        console.log( "success was had saving newState:  ", bool, newState )
                        // fail condition here. if not 200
                        // 
                        return newState.get( specificReducer );
                    } )
        }
        else {
            console.log( "FAILLL" );
            return Promise.reject( new Error( 'Unable to save data to the SAFE network, as no token found' ) );
        }
}


export const reStore = ( storeState ) =>
{
    if( storeState.errorCode )
    {
        return Promise.reject( storeState );
    }
    
    if( storeState.settings )
    {
        dispatchActionForEachProp( storeState.settings , setSetting );
    }
    
    if( storeState.sitedata )
    {
        dispatchActionForEachProp( storeState.sitedata , setSiteData );
    }
    
    if( storeState.history )
    {
        dispatchForEach( storeState.history , updateSite );
    }
    
    if( storeState.bookmarks )
    {
        dispatchForEach( storeState.bookmarks , updateBookmark );
    }
    
}


const dispatchForEach = ( array, action ) =>
{
    array.forEach( (item, key) => 
    {
        // item.save = false;
        store.dispatch( action( item, true ) ); //true to prevent save
        return;
    })
}

const dispatchActionForEachProp = ( object, action ) =>
{
    let objectArray = Object.keys( object );
    
    objectArray.forEach( ( prop ) =>
    {
        if( prop.includes( 'auth' ) )
        {
            return;
        }
        
        store.dispatch( action( prop, object[ prop ] ) );        
    } )
    
} 



