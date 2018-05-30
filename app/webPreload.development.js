// following @pfrazee's beaker pattern again here.
// import setModuleImportLocations from 'setModuleImportLocations';
import { ipcRenderer } from 'electron';

var { setupPreloadedSafeAuthApis } = require( './setupPreloadAPIs');
var configureStore = require( './store/configureStore').configureStore;

// TODO This handling needs to be imported via extension apis more seemlessly
const store = configureStore( );

setupPreloadedSafeAuthApis( store );

window.onerror = function ( error, url, line )
{
    ipcRenderer.send( 'errorInWindow', error );
};
