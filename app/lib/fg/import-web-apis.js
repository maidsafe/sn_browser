import { ipcRenderer, webFrame } from 'electron'
import rpc from 'pauls-electron-rpc'

// it would be better to import this from package.json
const BEAKER_VERSION = '0.0.1'

const readableToCallback = (rpcAPI) => {
  return (arg1, arg2, cb) => {
    return new Promise((resolve, reject) => {
      var r = rpcAPI(arg1, arg2);
      r.on('data', n => cb(n));
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
      if (fn.startsWith('_with_cb_')) {
        // We use a readable type to receive the data from rpc channel
        let manifest = {[fn]: 'readable'};
        let rpcAPI = rpc.importAPI('_with_cb_' + k, manifest, { timeout: false })
        // We expose the function removing the '_with_cb_' prefix
        let newFnName = fn.replace('_with_cb_', '');
        fnsWithCallback[newFnName] = readableToCallback(rpcAPI[fn]);
      } else {
        fnsToImport[fn] = webAPIs[k][fn];
      }
    }

    window[k] = Object.assign(rpc.importAPI(k, fnsToImport, { timeout: false }), fnsWithCallback);
  }
}
