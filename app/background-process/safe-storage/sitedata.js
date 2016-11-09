import { app, ipcMain } from 'electron'
import url from 'url'
import rpc from 'pauls-electron-rpc'
import manifest from '../api-manifests/sitedata'
import log from '../../log'

import store from './store/safe-store';
import * as rawSitedataActions from './store/actions/sitedata';

let sitedataActions = {};
// let store = setupStore();
const dispatch = store.dispatch;

Object.keys( rawSitedataActions ).forEach( key =>
{
    if( typeof rawSitedataActions[ key ] === 'string' )
	return;

    sitedataActions[ key ] = ( data ) => dispatch( rawSitedataActions[ key ]( data ) );
});

// TODO Handling safe auth variables for the browser.

// exported methods
// =


export function setup () {
  // open database

  // wire up RPC
  rpc.exportAPI('beakerSitedata', manifest, { get, set })
}

export function set (url, key, value)
{
    var origin = extractOrigin(url);

    let siteData = { id: origin, data: {} };

    siteData.data[ key ] = value

	return new Promise( ( resolve, reject) =>
	{
	    return sitedataActions.setSiteData( siteData );

	})


}

export function get (url, key) {
    var origin = extractOrigin(url);
    let siteData = { id: origin, key: key };

    return new Promise( ( resolve, reject) =>
    {
	    let site = store.getState()[ 'siteData' ].find( site => site.get('id') === origin ) ;

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

function extractOrigin (originURL) {
  var urlp = url.parse(originURL)
  if (!urlp || !urlp.host || !urlp.protocol)
    return
  return (urlp.protocol + urlp.host + (urlp.port || ''))
}

