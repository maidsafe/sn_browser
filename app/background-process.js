// This is main process of Electron, started as first thing when your
// app starts. This script is running through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

import { app, BrowserWindow, Menu } from 'electron'
import log from 'loglevel'
import env from './env'

import registerProtocolHandlers from './registerProtocolHandlers'

import logInRenderer from './background-process/logInRenderer'

import * as beakerBrowser from './background-process/browser'
import * as plugins from './background-process/plugins'
import * as webAPIs from './background-process/web-apis'
import * as windows from './background-process/ui/windows'
import buildWindowMenu from './background-process/ui/window-menu'
import registerContextMenu from './background-process/ui/context-menu'
import * as downloads from './background-process/ui/downloads'
import * as permissions from './background-process/ui/permissions'

import { APP_STATUS } from './background-process/safe-storage/constants';
import * as settings from './background-process/safe-storage/reducers/settings'
import * as sitedata from './background-process/safe-storage/reducers/sitedata'
import * as bookmarks from './background-process/safe-storage/reducers/bookmarks'
import * as history from './background-process/safe-storage/reducers/history'
import store from './background-process/safe-storage/store'
import { saveConfigAndQuit } from './background-process/safe-storage/actions/initializer_actions'


import * as beakerProtocol from './background-process/protocols/beaker'
import * as beakerFaviconProtocol from './background-process/protocols/beaker-favicon'

import * as openURL from './background-process/open-url'

var mainWindow = null;

const parseSafeUri = function(uri) {
  return uri.replace('//', '').replace('==/', '==');
};


// // configure logging
log.setLevel('trace')

// load the installed protocols
plugins.registerStandardSchemes()

app.on('ready', function () {

  //init protocols
  registerProtocolHandlers();

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
  global.unsubscribeFromSafeStore();

  if (process.platform !== 'darwin')
    app.quit()
})

app.on('open-url', function (e, url) {
  openURL.open(url)
})
