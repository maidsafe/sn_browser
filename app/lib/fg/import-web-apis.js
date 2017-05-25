import { ipcRenderer, webFrame } from 'electron'
import rpc from 'pauls-electron-rpc'

// it would be better to import this from package.json
const BEAKER_VERSION = '0.0.1'
const WITH_CALLBACK_TYPE_PREFIX = '_with_cb_';

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

// method which will populate window.beaker with the APIs deemed appropriate for the protocol
export default function () {

  // mark the safe protocol as 'secure' to enable all DOM APIs
  // webFrame.registerURLSchemeAsSecure('safe');
  window.beaker = { version: BEAKER_VERSION }
  var webAPIs = ipcRenderer.sendSync('get-web-api-manifests', window.location.protocol)

  for (var k in webAPIs) {

    let fnsToImport = [];
    let fnsWithCallback = [];
    for (var fn in webAPIs[k]) {
      // We adapt the functions which contain a callback
      if (fn.startsWith(WITH_CALLBACK_TYPE_PREFIX)) {
        // We use a readable type to receive the data from rpc channel
        let manifest = {[fn]: 'readable'};
        let rpcAPI = rpc.importAPI(WITH_CALLBACK_TYPE_PREFIX + k, manifest, { timeout: false })
        // We expose the function removing the WITH_CALLBACK_TYPE_PREFIX prefix
        let newFnName = fn.replace(WITH_CALLBACK_TYPE_PREFIX, '');
        fnsWithCallback[newFnName] = readableToCallback(rpcAPI[fn]);
      } else {
        fnsToImport[fn] = webAPIs[k][fn];
      }
    }

    window[k] = Object.assign(rpc.importAPI(k, fnsToImport, { timeout: false }), fnsWithCallback);
  }
}
