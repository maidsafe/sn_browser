import { ipcRenderer, remote } from 'electron'
import { setup as setupUI } from './shell-window/ui'
import importWebAPIs from './lib/fg/import-web-apis'

let winston = remote.getGlobal('winston');

// setup UI
importWebAPIs()
// background-process need to know when shell-window is ready to accept commands
setupUI(() => {
  winston.info('shell-window-ready');
  ipcRenderer.send('shell-window-ready')
})
