import { ipcRenderer, webFrame } from 'electron'
import rpc from 'pauls-electron-rpc'

// it would be better to import this from package.json
const BEAKER_VERSION = '0.0.1'
const WITH_CALLBACK_TYPE_PREFIX = '_with_cb_';
const WITH_ASYNC_CALLBACK_TYPE_PREFIX = '_with_async_cb_';

// Use a readable RPC stream to invoke a provided callback function,
// resolving the promise upon the closure of the stream the sender.
const readableToCallback = (rpcAPI) => {
  return (arg1, cb) => {
    return new Promise((resolve, reject) => {
      var r = rpcAPI(arg1);
      r.on('data', data => cb.apply(cb, data));
      r.on('error', err => reject(err));
      r.on('end', () => resolve());
    });
  }
}

// Use a readable RPC stream to invoke a provided callback function even after
// resolving the promise.
const readableToAsyncCallback = (rpcAPI) => {
  return (arg1, cb) => {
    return new Promise((resolve, reject) => {
      let firstValueReceived = false;
      var r = rpcAPI(arg1);
      r.on('data', data => {
        if (!firstValueReceived) {
          firstValueReceived = true;
          resolve(data[0]);
        } else {
          cb.apply(cb, data);
        }
      });
      r.on('error', err => reject(err));
    });
  }
}

// method which will populate window.beaker with the APIs deemed appropriate for the protocol
export default function () {

  // mark the safe protocol as 'secure' to enable all DOM APIs
  webFrame.registerURLSchemeAsSecure('safe');
  window.beaker = { version: BEAKER_VERSION }
  var webAPIs = ipcRenderer.sendSync('get-web-api-manifests', window.location.protocol)

  for (var k in webAPIs) {

    let fnsToImport = [];
    let fnsWithCallback = [];
    let fnsWithAsyncCallback = [];
    for (var fn in webAPIs[k]) {
      // We adapt the functions which contain a callback
      if (fn.startsWith(WITH_CALLBACK_TYPE_PREFIX)) {
        // We use a readable type to receive the data from the RPC channel
        let manifest = {[fn]: 'readable'};
        let rpcAPI = rpc.importAPI(WITH_CALLBACK_TYPE_PREFIX + k, manifest, { timeout: false })
        // We expose the function removing the WITH_CALLBACK_TYPE_PREFIX prefix
        let newFnName = fn.replace(WITH_CALLBACK_TYPE_PREFIX, '');
        fnsWithCallback[newFnName] = readableToCallback(rpcAPI[fn]);
      } else if (fn.startsWith(WITH_ASYNC_CALLBACK_TYPE_PREFIX)) {
        // We use a readable type to receive the data from the RPC channel
        let manifest = {[fn]: 'readable'};
        let rpcAPI = rpc.importAPI(WITH_ASYNC_CALLBACK_TYPE_PREFIX + k, manifest, { timeout: false })
        // We expose the function removing the WITH_ASYNC_CALLBACK_TYPE_PREFIX prefix
        let newFnName = fn.replace(WITH_ASYNC_CALLBACK_TYPE_PREFIX, '');
        fnsWithAsyncCallback[newFnName] = readableToAsyncCallback(rpcAPI[fn]);
      } else {
        fnsToImport[fn] = webAPIs[k][fn];
      }
    }

    window[k] = Object.assign(rpc.importAPI(k, fnsToImport, { timeout: false }), fnsWithCallback, fnsWithAsyncCallback);
  }
}
