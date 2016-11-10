// This is main process of Electron, started as first thing when your
// app starts. This script is running through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

import { app, Menu } from 'electron'
import log from 'loglevel'
import env from './env'

import store, { getStore, reStore, saveStore } from './background-process/safe-storage/store';

// set setting does not trigger save
import { updateSettings } from './background-process/safe-storage/settings';



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


    store.subscribe( e => 
    {        
        saveStore();    
    })

    const app =
    {
    	//TODO: pull from package.json
    	name: "SafeBrowser",
    	id: "safe-browser",
    	version: "0.4.0",
    	vendor: "josh.wilson",
    	permissions : [ "SAFE_DRIVE_ACCESS"]
    };

    let token = auth.authorise( app ).then( tok =>
	{    
        // TODO: Trigger save should be automatic not on every instance.
        // NOTHING should be saved until a store is gotten. Or failed.
        // Only then do we do createOrUpdateFile....
        // setting for sync interval

        //get store can optionally have a token passed?
        
        
        getStore( tok.token )
            .then( json =>
            {            
                store.dispatch( updateSettings( { 'authToken' : tok.token } ) );
                reStore( json );
                
                store.dispatch( updateSettings( { 'authMessage': 'Authorised with launcher.' } ) );
            })
            .catch( err => 
            {
                store.dispatch( updateSettings( { 'authMessage': 'Problems getting browser settings from the network, ' + JSON.stringify( err )  } ) );
            })

	})
	.catch( err =>
	{        
	    if( err.code === -12 )
        {
            store.dispatch( updateSettings( { 'authMessage': 'SAFE Launcher does not appear to be open.' } ) );
            return;
        }
        else if( err.code === 'ECONNREFUSED' )
	    {
    		store.dispatch( updateSettings( { 'authMessage': 'SAFE Launcher does not appear to be open.' } ) );
            return;
	    }
        else if( err === 'Unauthorized' )
	    {
    		store.dispatch( updateSettings( { 'authMessage':'The browser failed to authorise with the SAFE launcher.' } ) );
            return;
	    }
        
        store.dispatch( updateSettings( { 'authMessage': '' + err } ) );

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

