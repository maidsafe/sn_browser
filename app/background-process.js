// This is main process of Electron, started as first thing when your
// app starts. This script is running through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

import { app, Menu } from 'electron'
import log from 'loglevel'
import env from './env'

import store from './background-process/safe-storage/store/safe-store';
// import setupStore from './background-process/safe-storage/store/safe-store';
import * as rawSitedataActions from './background-process/safe-storage/store/actions/sitedata';



import * as beakerBrowser from './background-process/browser'
import * as plugins from './background-process/plugins'
import * as webAPIs from './background-process/web-apis'
import * as windows from './background-process/ui/windows'
import buildWindowMenu from './background-process/ui/window-menu'
import registerContextMenu from './background-process/ui/context-menu'
import * as downloads from './background-process/ui/downloads'
import * as permissions from './background-process/ui/permissions'
import * as settings from './background-process/safe-storage/settings'
import * as sitedata from './background-process/safe-storage/sitedata'
import * as bookmarks from './background-process/safe-storage/bookmarks'
import * as history from './background-process/safe-storage/history'

import * as beakerProtocol from './background-process/protocols/beaker'
import * as beakerFaviconProtocol from './background-process/protocols/beaker-favicon'

import * as openURL from './background-process/open-url'

import { auth } from 'safe-js';

// // configure logging
log.setLevel('trace')


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




let currentValue;

function handleChange() {
  let previousValue = currentValue
  currentValue = store.getState();

  if (previousValue !== currentValue) {
    console.log('Store change');
    // console.log('Store changed from', previousValue, 'to', currentValue)
  }
}

let unsubscribe = store.subscribe(handleChange)

// load the installed protocols
plugins.registerStandardSchemes()

app.on('ready', function () {

    const app =
    {
	//pull from package.json
	name: "SafeBrowser",
	id: "safe-browser",
	version: "0.3.2",
	vendor: "josh.wilson",
	permissions : [ "SAFE_DRIVE_ACCESS"]
    };

    let browserData =
    {
	id: 'safe:safe-browser',
	data: {}
    }
    //
    let token = auth.authorise( app, 'armadillo' ).then( tok =>
	{
	    browserData.data.authToken = tok;
	    browserData.data.authMessage = 'Authorised with launcher.';

	    console.log( browserData );

	    sitedataActions.setSiteData( browserData );


	    //lets shim an auth status via the sites api
	})
	.catch( err =>
	{
	    console.log( "ERROORORRRRSS", err );

	    //routing interface error when cannot connect to  network!!
	    //
	    //{ errorCode: -12,
  // description: 'CoreError::RoutingInterfaceError' }

	    if( err.code === 'ECONNREFUSED' )
	    {
		browserData.data.authMessage = 'SAFE Launcher does not appear to be open.';
		console.log( "Connection refused, launcher not open" );
		sitedataActions.setSiteData( browserData );
	    }

	    if( err === 'Unauthorized' )
	    {
		browserData.data.authMessage = 'The browser failed to authorise with the SAFE launcher.';
		sitedataActions.setSiteData( browserData );
		console.log( "Connection refused, not authorised with launcher" );
	    }

	});


  // databases
  settings.setup()
  sitedata.setup()
  bookmarks.setup()
  history.setup()

  // base
  beakerBrowser.setup()

  // ui
  Menu.setApplicationMenu(Menu.buildFromTemplate(buildWindowMenu(env)))
  registerContextMenu()
  windows.setup()
  downloads.setup()
  permissions.setup()

  // protocols
  beakerProtocol.setup()
  beakerFaviconProtocol.setup()
  plugins.setupProtocolHandlers()

  // web APIs
  webAPIs.setup()
  plugins.setupWebAPIs()

  // listen OSX open-url event
  openURL.setup()
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin')
    app.quit()
})

app.on('open-url', function (e, url) {
  openURL.open(url)
})

