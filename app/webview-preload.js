import importWebAPIs from './lib/fg/import-web-apis'
import babelBrowserBuild from 'browser-es-module-loader/dist/babel-browser-build'
import BrowserESModuleLoader from 'browser-es-module-loader/dist/browser-es-module-loader'
import { ipcRenderer } from 'electron'

// setup UI
importWebAPIs()



// for detecting / closing menus
window.addEventListener( 'click', ( e ) =>
{
  ipcRenderer.send('webview-clicked', window.location );
})


// attach globals
window.BrowserESModuleLoader = BrowserESModuleLoader
