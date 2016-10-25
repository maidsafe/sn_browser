// This is main process of Electron, started as first thing when your
// app starts. This script is running through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

import { app, Menu } from 'electron'
import log from 'loglevel'
import env from './env'

import store, { getStore, reStore } from './background-process/safe-storage/store/safe-store';

// set setting does not trigger save
import { saveSetting, setSetting } from './background-process/safe-storage/store/actions/settings';



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
const dispatch = store.dispatch;


let currentValue;

// load the installed protocols
plugins.registerStandardSchemes()

app.on('ready', function () {

    const app =
    {
    	//TODO: pull from package.json
    	name: "SafeBrowser",
    	id: "safe-browser",
    	version: "0.3.2",
    	vendor: "josh.wilson",
    	permissions : [ "SAFE_DRIVE_ACCESS"]
    };

    let token = auth.authorise( app ).then( tok =>
	{    
        // TODO: Trigger save should be automatic not on every instance.
        // NOTHING should be saved until a store is gotten. Or failed.
        // Only then do we do createOrUpdateFile....
        // setting for sync interval
        store.dispatch( setSetting( 'authToken', tok.token ) );
        store.dispatch( setSetting( 'authMessage', 'Authorised with launcher.' ) );

        //get store can optionally have a token passed?
        getStore()
            .then( response =>
            {            
                response.json().then( json => reStore( json ) )  
                
            })
            .catch( err => 
            {
                store.dispatch( setSetting( 'authMessage', 'Problems getting browser settings from the network, ' + JSON.stringify( err )  ) );
            })

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
    		console.log( "Connection refused, launcher not open" );
    		store.dispatch( setSetting( 'authMessage', 'SAFE Launcher does not appear to be open.' ) );
	    }

	    if( err === 'Unauthorized' )
	    {
    		store.dispatch( setSetting( 'authMessage','The browser failed to authorise with the SAFE launcher.' ) );
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

