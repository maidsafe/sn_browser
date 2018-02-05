// following @pfrazee's beaker pattern again here.
import setupPreloadAPIs from './setupPreloadAPIs';;

setupPreloadAPIs();

window.onerror = function(error, url, line) {
    ipcRenderer.send('errorInWindow', error);
};
