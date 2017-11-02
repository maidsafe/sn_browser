/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved */
const ipcMain = require('electron').ipcMain; // electron deps will be avaible inside browser
/* eslint-enable import/no-extraneous-dependencies, import/no-unresolved */
const { genRandomString, freePageObjs } = require('./helpers');

const reqsSent = new Map();

let ipcEvent = null;

class AuthRequest {
  constructor(uri, isUnRegistered, cb) {
    this.id = genRandomString();
    this.uri = uri;
    this.isUnRegistered = isUnRegistered;
    this.cb = cb;
    this.res = null;
    this.error = null;
  }
}

class IpcTasks {
  constructor() {}

  add(uri, isUnregistered, cb) {
    let req = new AuthRequest(uri, isUnregistered, cb);
    reqsSent.set(req.id, req);
    ipcEvent.sender.send('webClientAuthReq', req);
  }

  remove(id) {
    reqsSent.delete(id);
    return this;
  }
}

const ipcTasks = new IpcTasks();

const authRes = (event, response) => {
  // handle response
  const reqId = response.id;
  const task = reqsSent.get(reqId);
  if (!task) {
    return;
  }
  ipcTasks.remove(reqId);
  if (typeof task.cb === 'function') {
    task.cb(null, response.res);
  }
};

ipcMain.on('onTabRemove', (event, safeAppGroupId) => {
  freePageObjs(safeAppGroupId);
});

ipcMain.on('onTabUpdate', (event, safeAppGroupId) => {
  freePageObjs(safeAppGroupId);
});

ipcMain.on('registerSafeApp', (event) => {
  ipcEvent = event;
});

ipcMain.on('webClientContainerRes', authRes);

ipcMain.on('webClientAuthRes', authRes);

ipcMain.on('webClientSharedMDataRes', authRes);

ipcMain.on('webClientErrorRes', (event, res) => {
  // handle Error
  const err = res.error;
  if (err && err.toLowerCase() === 'unauthorised') {
    return;
  }

  const reqId = res.id;
  const task = reqsSent.get(reqId);
  if (!task) {
    return;
  }
  ipcTasks.remove(reqId);
  if (typeof task.cb === 'function') {
    task.cb(err);
  }
});

module.exports.sendAuthReq = (req, isUnregistered, cb) => {
  // The isUnregistered flag is used to handle the requests in a separate queue
  // from the ones for registered requests, so they can be processed in parallel.
  ipcTasks.add(req.uri, isUnregistered, cb);
};
