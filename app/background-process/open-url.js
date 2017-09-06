// handle OSX open-url event
import { ipcMain } from 'electron'
import { createShellWindow } from './ui/windows'

var queue = []
var commandReceiver

function runQueue()
{
  queue.forEach(url => commandReceiver.send('command', 'file:new-tab', url))
  queue.length = 0
}

export function setup () {
  ipcMain.once('shell-window-ready', function (e) {
    commandReceiver = e.sender
    runQueue()
  })
}


export function unsetReceiver()
{
  commandReceiver = null;
  return;
}

export function updateReceiver( webContents )
{
  console.log("trying to update to be", webContents.id);
  commandReceiver = webContents;
  runQueue()
}

export function open (url) {

  if (commandReceiver !== null) {
    commandReceiver.send('command', 'file:new-tab', url)
  } else {
    queue.push(url)
  }

  if( url.startsWith('safe-') ) {
    createShellWindow()
  }
}
