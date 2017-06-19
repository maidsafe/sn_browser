// This is main process of Electron, started as first thing when your
// app starts. This script is running through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

import { app, BrowserWindow, Menu } from 'electron'
import log from 'loglevel'
import env from './env'

import store, { getStore, reStore, saveStore, handleAuthError } from './background-process/safe-storage/store'

// set setting does not trigger save
import { updateSettings } from './background-process/safe-storage/settings'

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

import { auth } from 'safe-js'
// import packageJson from './package.json'
var packageJson = require( './package.json' );
var mainWindow = null;

log.debug( "packagejson" );

const parseSafeUri = function(uri) {
  return uri.replace('//', '').replace('==/', '==');
};

const safeBrowserApp =
{
    name: packageJson.name,
    id: packageJson.name,
    version: packageJson.version,
    vendor: packageJson.author.name,
    permissions : [ "SAFE_DRIVE_ACCESS"]
};




// // configure logging
log.setLevel('trace')

// load the installed protocols
plugins.registerStandardSchemes()

app.on('ready', function () {

    let token = auth.authorise( safeBrowserApp ).then( tok =>
  {
        store.dispatch( updateSettings( { 'authSuccess': true } ) )
        store.dispatch( updateSettings( { 'authToken' : tok.token } ) )
        store.dispatch( updateSettings( { 'authMessage': 'Authorised with SAFE Launcher' } ) )

        getStore( tok.token )
            .then( json =>
            {
                reStore( json )

            })
            .catch( err =>
            {
                if( err.status === 404)
                {
                    store.dispatch( updateSettings( { 'authMessage': 'Authorised with SAFE Launcher'  } ) )
                }
                else {

                    store.dispatch( updateSettings( { 'authMessage': 'Problems getting browser settings from the network, ' + err.staus + ', ' + err.statusText  } ) )
                }
            })

  })
  .catch( handleAuthError )

  // API initialisations
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

  if((process.platform === 'linux') || (process.platform === 'win32')) {
    if (process.argv[1] && (process.argv[1].indexOf('safe') !== -1)) {
      openURL.open(parseSafeUri(process.argv[1]))
    }
  }

  const shouldQuit = app.makeSingleInstance(function(commandLine, workingDirectory) {
    if (commandLine.length >= 2 && commandLine[1]) {
      openURL.open(parseSafeUri(commandLine[1]));
    }

    mainWindow = BrowserWindow.getFocusedWindow() || BrowserWindow.getAllWindows()[0]

    // Someone tried to run a second instance, we should focus our window
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  if (shouldQuit) {
    app.quit();
  }
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin')
    app.quit()
})

app.on('open-url', function (e, url) {
  openURL.open(url)
})
