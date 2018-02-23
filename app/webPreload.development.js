// following @pfrazee's beaker pattern again here.
import setupPreloadedSafeAuthAPIs from './setupPreloadAPIs';
import { ipcRenderer } from 'electron';
import { configureStore } from 'store/configureStore';

// TODO This handling needs to be imported via extension apis more seemlessly
const initialState = {};

// Add middleware from extensions here. TODO: this should be be unified somewhere.
const loadMiddlewarePackages = [];
const store = configureStore( initialState, loadMiddlewarePackages );


setupPreloadedSafeAuthAPIs( store );

window.onerror = function ( error, url, line )
{
    ipcRenderer.send( 'errorInWindow', error );
};
