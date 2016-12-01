import { app } from 'electron'
import log from '../../log'
import store, { handleAuthError } from './store'
import { List, Map, fromJS } from 'immutable'

import { createActions } from 'redux-actions'
import { auth } from 'safe-js'

const UPDATE_SETTINGS = 'UPDATE_SETTINGS'

export const { updateSettings } = createActions( UPDATE_SETTINGS )


const initialState = Map( {
	auto_update_enabled: 0,
	authMessage : 'Not attempted to connect yet'
})

export default function settings(state = initialState, action) 
{
	let payload = fromJS( action.payload )
	
	switch (action.type) {
		case UPDATE_SETTINGS :
		{
			return state.mergeDeep( payload )
		}
		return
		default:
		return state
	}
}









export function set (key, value) 
{
	return new Promise( (resolve, reject ) => 
	{    
		let setter = {}
		setter[key] = value
		store.dispatch( updateSettings( setter ) )
	})
}

export function get (key) 
{
	return new Promise( ( resolve, reject) =>
	{
		let settings = store.getState()[ 'settings' ]
		
		if( settings )
		{
			let result = settings.get( key )
			if( result )
			{
				resolve( settings.get( key ) )
			}
			
		}
		else {
			resolve( 'undefined' )
		}
	})
	
}


const safeBrowserApp =
{
    //TODO: pull from package.json
    name: "SafeBrowser",
    id: "safe-browser",
    version: "0.4.0",
    vendor: "josh.wilson",
    permissions : [ "SAFE_DRIVE_ACCESS"]
}



export function reauthenticateSAFE () {
		
	return auth.authorise( safeBrowserApp ).then( tok =>
	{
		store.dispatch( updateSettings( { 'authSuccess': true } ) )

		store.dispatch( updateSettings( { 'authToken' : tok.token } ) )
		store.dispatch( updateSettings( { 'authMessage': 'Authorised with SAFE Launcher' } ) )

	} )
	// .catch( handleAuthError )
}

export function getAll () {
	return new Promise( ( resolve, reject) =>
	{
		let settings = store.getState()[ 'settings' ]
		
		if( settings )
		{
			resolve( settings.toJS() )
		}
		else {
			resolve( {} )
		}
	})
}
