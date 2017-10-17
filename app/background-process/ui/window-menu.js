import { app, BrowserWindow, dialog } from 'electron'
import { createShellWindow } from './windows'
import store from '../safe-storage/store'
import { saveConfig, saveConfigAndQuit } from '../safe-storage/actions/initializer_actions'
import * as openURL from '../open-url'

var darwinMenu = {
  label: 'SAFE Browser',
  submenu: [
    { label: 'About the SAFE Browser', role: 'about' },
    { type: 'separator' },
    { label: 'Services', role: 'services', submenu: [] },
    { type: 'separator' },
    { label: 'Hide Beaker', accelerator: 'Command+H', role: 'hide' },
    { label: 'Hide Others', accelerator: 'Command+Alt+H', role: 'hideothers' },
    { label: 'Show All', role: 'unhide' },
    { type: 'separator' }
  ]
}

var fileMenu = {
  label: 'File',
  submenu: [
    {
      label: 'New Tab',
      accelerator: 'CmdOrCtrl+T',
      click: function (item, win) {
        if (win) win.webContents.send('command', 'file:new-tab')
      }
    },
    {
      label: 'New Window',
      accelerator: 'CmdOrCtrl+N',
      click: function () { createShellWindow() }
    },
    {
      label: 'Reopen Closed Tab',
      accelerator: 'CmdOrCtrl+Shift+T',
      click: function (item, win) {
        if (win) win.webContents.send('command', 'file:reopen-closed-tab')
      }
    },
    {
      label: 'SAFE Browsing Enabled',
      checked: global.browserStatus.safeModeOn,
      accelerator: 'CmdOrCtrl+Shift+L',
      type: 'checkbox',
      click: function (item, win) {
        if (win) win.webContents.send('command', 'window:toggle-safe-mode')
      }
    },
    { type: 'separator' },
    {
      label: 'Show SAFE Logs',
      click: function (item, win) {
        openURL.open('safe-logs:list')
      }
    },
    { type: 'separator' },
    { label: 'Save Browser State', accelerator: 'CmdOrCtrl+S', click() {
      store.dispatch( saveConfig() );
    } },
    { label: 'Save Browser State and Close', accelerator: 'Ctrl+Shift+Q', click() {
      store.dispatch( saveConfigAndQuit() );
    } },
    { label: 'Quit without saving', accelerator: 'CmdOrCtrl+Q', click() { app.quit() } },
    { type: 'separator' },
    {
      label: 'Open File',
      accelerator: 'CmdOrCtrl+O',
      click: function (item, win) {
        if (win) {
          dialog.showOpenDialog({ title: 'Open file...', properties: ['openFile', 'createDirectory'] }, files => {
            if (files && files[0])
          win.webContents.send('command', 'file:new-tab', 'file://'+files[0])
        })
        }
      }
    },
    {
      label: 'Open Location',
      accelerator: 'CmdOrCtrl+L',
      click: function (item, win) {
        if (win) win.webContents.send('command', 'file:open-location')
      }
    },
    { type: 'separator' },
    {
      label: 'Close Window',
      accelerator: 'CmdOrCtrl+Shift+W',
      click: function (item, win) {
        if (win) win.close()
      }
    },
    {
      label: 'Close Tab',
      accelerator: 'CmdOrCtrl+W',
      click: function (item, win) {
        if (win) win.webContents.send('command', 'file:close-tab')
      }
    }
  ]
}

var editMenu = {
  label: 'Edit',
  submenu: [
    { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
    { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
    { type: "separator" },
    { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
    { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
    { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
    { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" },
    {
      label: "Find in Page",
      accelerator: "CmdOrCtrl+F",
      click: function (item, win) {
        if (win) win.webContents.send('command', 'edit:find')
      }
    }
  ]
}

var viewMenu = {
  label: 'View',
  submenu: [{
    label: 'Reload',
    accelerator: 'CmdOrCtrl+R',
    click: function (item, win) {
      if (win) win.webContents.send('command', 'view:reload')
    }
  },
    {
      label: 'Hard Reload (Clear Cache)',
      accelerator: 'CmdOrCtrl+Shift+R',
      click: function (item, win) {
        if (win) win.webContents.send('command', 'view:hard-reload')
      }
    },
    { type: "separator" },
    {
      label: 'Zoom In',
      accelerator: 'CmdOrCtrl+=',
      click: function (item, win) {
        if (win) win.webContents.send('command', 'view:zoom-in')
      }
    },
    {
      label: 'Zoom Out',
      accelerator: 'CmdOrCtrl+-',
      click: function (item, win) {
        if (win) win.webContents.send('command', 'view:zoom-out')
      }
    },
    {
      label: 'Actual Size',
      accelerator: 'CmdOrCtrl+0',
      click: function (item, win) {
        if (win) win.webContents.send('command', 'view:zoom-reset')
      }
    },
    { type: "separator" },
    {
      label: 'Toggle Web Page DevTools',
      accelerator: 'Alt+CmdOrCtrl+I',
      click: function (item, win) {
        if (win) win.webContents.send('command', 'view:toggle-dev-tools')
      }
    }]
}

var historyMenu = {
  label: 'History',
  role: 'history',
  submenu: [
    {
      label: 'Back',
      accelerator: 'CmdOrCtrl+Left',
      click: function (item, win) {
        if (win) win.webContents.send('command', 'history:back')
      }
    },
    {
      label: 'Forward',
      accelerator: 'CmdOrCtrl+Right',
      click: function (item, win) {
        if (win) win.webContents.send('command', 'history:forward')
      }
    }
  ]
}

var windowMenu = {
  label: 'Window',
  role: 'window',
  submenu: [
    {
      label: 'Minimize',
      accelerator: 'CmdOrCtrl+M',
      role: 'minimize'
    },
    {
      label: 'Close',
      accelerator: 'CmdOrCtrl+Q',
      role: 'close'
    },
    {
      label: 'Next Tab',
      accelerator: 'CmdOrCtrl+]',
      click: function (item, win) {
        if (win) win.webContents.send('command', 'window:next-tab')
      }
    },
    {
      label: 'Previous Tab',
      accelerator: 'CmdOrCtrl+[',
      click: function (item, win) {
        if (win) win.webContents.send('command', 'window:prev-tab')
      }
    }
  ]
}
if (process.platform == 'darwin') {
  windowMenu.submenu.push({
    type: 'separator'
  })
  windowMenu.submenu.push({
    label: 'Bring All to Front',
    role: 'front'
  })
}


var devMenu = {
  label: 'Developer Tools',
  submenu:
  [
    {
      label: 'Toggle Web Page DevTools',
      accelerator: 'Alt+CmdOrCtrl+I',
      click: function (item, win) {
        if (win) win.webContents.send('command', 'view:toggle-dev-tools')
      }
    },
    { type: 'separator' },
    {
      label: 'Reload Safe Browser Window',
      click: function ()
      {
        BrowserWindow.getFocusedWindow().webContents.reloadIgnoringCache()
      }
    },
    {
      label: 'Toggle Safe Browser Window DevTools',
      accelerator: "CmdOrCtrl+Shift+I",
      click: function ()
      {
        BrowserWindow.getFocusedWindow().toggleDevTools()
      }
    }
  ]
}

export default function buildWindowMenu (env) {
  var menus = [fileMenu, editMenu, viewMenu, historyMenu, windowMenu]
  if (process.platform === 'darwin') menus.unshift(darwinMenu)
  windowMenu.submenu.push({
    type: 'separator'
  })
  windowMenu.submenu.push(devMenu)
  return menus
}
