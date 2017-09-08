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
  commandReceiver = webContents;
  runQueue()
}

export function open (url) {

  if (commandReceiver && commandReceiver !== null) {
    commandReceiver.send('command', 'file:new-tab', url)
  } else {
    queue.push(url)

    //osx only for the still open but all windows closed state
    if( process.platform === 'darwin' && global.macAllWindowsClosed )
    {
      if( url.startsWith('safe-') ) {
        createShellWindow()
      }

    }
  }

}
