import { app } from 'electron'
import log from '../../log'
import store from './store/safe-store';
import { saveSetting } from './store/actions/settings';


export function setup () {
}

export function set (key, value) 
{
    return new Promise( (resolve, reject ) => 
    {    
        store.dispatch( saveSetting( key, value ) )
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
