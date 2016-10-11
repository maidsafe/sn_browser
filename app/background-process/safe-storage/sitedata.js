import { app, ipcMain } from 'electron'
import path from 'path'
import url from 'url'
import rpc from 'pauls-electron-rpc'
import manifest from '../api-manifests/sitedata'
import log from '../../log'
import { nfs } from 'safe-js';

import store from './store/safe-store';
import * as rawSitedataActions from './store/actions/sitedata';

let sitedataActions = {};
// let store = setupStore();
const dispatch = store.dispatch;

Object.keys( rawSitedataActions ).forEach( key =>
{
    if( typeof rawSitedataActions[ key ] === 'string' )
	return;
    //if its a function....
    // let's setup dispatch for convenience. This should be
    // abstracted for other store/actions
    sitedataActions[ key ] = ( data ) => dispatch( rawSitedataActions[ key ]( data ) );
});

// TODO Handling safe auth variables for the browser.

// exported methods
// =


export function setup () {
  // open database

  // wire up RPC
  rpc.exportAPI('beakerSitedata', manifest, { get, set })

  //rpc could return a function that is itself an event listener?
  //which would allow for reloads etc.... ? OR?
  //OR.
  //
  //Cicking button triggers function in main process.
  //main process triggers reload after function execution.
  //
  //posssibly cleaner...
}

export function set (url, key, value)
{
    var origin = extractOrigin(url);

    let siteData = { id: origin, data: {} };

    siteData.data[ key ] = value


    // TODO. change RPC to not expect promise
	return new Promise( ( resolve, reject) =>
	{
	    return sitedataActions.setSiteData( siteData );

	})
    //now the question arises as to what we should be returning here......
    //success? inflight? a promise??

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

