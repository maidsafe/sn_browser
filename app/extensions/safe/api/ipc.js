/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved */
const ipcMain = require('electron').ipcMain; // electron deps will be avaible inside browser
/* eslint-enable import/no-extraneous-dependencies, import/no-unresolved */
const { genRandomString, freePageObjs } = require('./helpers');

const reqsSent = new Map();

let ipcEvent = null;
// Until ipcEvent is ready, we need to keep reqs in a queue
const pendingReqs = [];

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

const add = (uri, isUnregistered, cb) => {
  const req = new AuthRequest(uri, isUnregistered, cb);
  if (ipcEvent) {
    reqsSent.set(req.id, req);
    ipcEvent.sender.send('webClientAuthReq', req);
  } else {
    // let's keep it in a queue to send when ipcEvent is ready
    pendingReqs.push(req);
  }
};

const sendPendingReqs = () => {
  pendingReqs.forEach((req) => {
    reqsSent.set(req.id, req);
    ipcEvent.sender.send('webClientAuthReq', req);
  });
  pendingReqs.length = 0;
};

const remove = (id) => {
  reqsSent.delete(id);
  return this;
};

const authRes = (event, response) => {
  // handle response
  const reqId = response.id;
  const task = reqsSent.get(reqId);
  if (!task) {
    return;
  }
  remove(reqId);
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
  sendPendingReqs();
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
  remove(reqId);
  if (typeof task.cb === 'function') {
    task.cb(err);
  }
});

module.exports.sendAuthReq = (req, isUnregistered, cb) => {
  // The isUnregistered flag is used to handle the requests in a separate queue
  // from the ones for registered requests, so they can be processed in parallel.
  add(req.uri, isUnregistered, cb);
};
