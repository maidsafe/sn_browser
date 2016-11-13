import { app } from 'electron'
import log from '../../log'
import store from './store';
import { List, Map, fromJS } from 'immutable';

import { createActions } from 'redux-actions';


const UPDATE_SETTINGS = 'UPDATE_SETTINGS';

export const { updateSettings } = createActions( UPDATE_SETTINGS );


const initialState = Map( {
	auto_update_enabled: 0,
	authMessage : 'Not attempted to connect yet'
});

export default function settings(state = initialState, action) 
{
	let payload = fromJS( action.payload );
	
	switch (action.type) {
		case UPDATE_SETTINGS :
		{
			return state.mergeDeep( payload );
		}
		return
		default:
		return state
	}
}












export function setup () {
}

export function set (key, value) 
{
	return new Promise( (resolve, reject ) => 
	{    
		let setter = {};
		setter[key] = value;
		store.dispatch( updateSettings( setter ) )
	})
}

export function get (key) 
{
	return new Promise( ( resolve, reject) =>
	{
		let settings = store.getState()[ 'settings' ];
		
		if( settings )
		{
			let result = settings.get( key );
			if( result )
			{
				resolve( settings.get( key ) );
			}
			
		}
		else {
			resolve( 'undefined' );
		}
	})
	
}

export function getAll () {
	return new Promise( ( resolve, reject) =>
	{
		let settings = store.getState()[ 'settings' ];
		
		if( settings )
		{
			resolve( settings.toJS() );
		}
		else {
			resolve( {} );
		}
	})
}
