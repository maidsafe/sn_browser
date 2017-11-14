// credit to @pfrazee's beaker plugin.js implementation!
import { ipcMain } from 'electron';
import logger from 'logger';
import rpc from 'pauls-electron-rpc';
import { safeAuthApi } from 'extensions/safe/api';

// globals
const WITH_CALLBACK_TYPE_PREFIX = '_with_cb_';
const WITH_ASYNC_CALLBACK_TYPE_PREFIX = '_with_async_cb_';

const allAPIs = [safeAuthApi];

// fetch a complete listing of the plugin info
// - each plugin module can export arrays of values. this is a helper to create 1 list of all of them
const caches = {};
export function getAllInfo( key )
{
    // use cached
    if ( caches[key] )
    {
        return caches[key];
    }

    // construct
    caches[key] = [];

    allAPIs.forEach( protocolModule =>
    {
        // TODO: This is a hack as we're msising one layer compared to beaker
        let values = protocolModule;

        if ( !Array.isArray( values ) )
        {
            values = [values];
        }

        if ( key === 'webAPIs' )
        {
            values = [ protocolModule ];
        }

        caches[key] = caches[key].concat( values );

    } );

    return caches[key];
}

const setupIpcListener = () =>
{
    ipcMain.on( 'get-web-api-manifests', ( event, scheme ) =>
    {
        // hardcode the beaker: scheme, since that's purely for internal use
        if ( scheme == 'safe:' )
        {
            const protos = {
                // beakerBrowser,
                // beakerBookmarks,
                // beakerDownloads,
                // beakerHistory,
                // beakerSitedata
            };
            event.returnValue = protos;
            return;
        }

        const manifest = getWebAPIManifests( scheme );

        // for everything else, we'll use the plugins
        event.returnValue = manifest;
    } );
};


// setup all web APIs
export function setupWebAPIs()
{
    setupIpcListener();
    getAllInfo( 'webAPIs' ).forEach( api =>
    {
        // run the module's protocol setup
        // logger.debug('Wiring up Web API:', api.name, api.scheme)

        // We export functions with callbacks in a separate channel
        // since they will be adapted to invoke the callbacks
        const fnsToExport = [];
        const fnsWithCallbacks = [];
        const fnsWithAsyncCallbacks = [];
        // for ( const fn in api.manifest )
        Object.keys( api.manifest ).forEach( fn =>
        {
            if ( fn.startsWith( WITH_CALLBACK_TYPE_PREFIX ) )
            {
                fnsWithCallbacks[fn] = api.manifest[fn];
            }
            else if ( fn.startsWith( WITH_ASYNC_CALLBACK_TYPE_PREFIX ) )
            {
                fnsWithAsyncCallbacks[fn] = api.manifest[fn];
            }
            else
            {
                fnsToExport[fn] = api.manifest[fn];
            }
        } );

        rpc.exportAPI( api.name, fnsToExport, api.methods );
        rpc.exportAPI( WITH_CALLBACK_TYPE_PREFIX + api.name, fnsWithCallbacks, api.methods ); // FIXME: api.methods shall be probably chopped too
        rpc.exportAPI( WITH_ASYNC_CALLBACK_TYPE_PREFIX + api.name, fnsWithAsyncCallbacks, api.methods ); // FIXME: api.methods shall be probably chopped too
    } );
}




// get web API manifests for the given protocol
export const getWebAPIManifests = ( scheme ) =>
{
    const manifests = {};
    scheme = scheme.replace( /:/g, '' );

    const proto = getAllInfo( 'protocols' ).find( proto => proto.protocols.includes( scheme ) );

    if ( !proto )
    {
        return manifests;
    }

    // collect manifests
    getAllInfo( 'webAPIs' ).forEach( api =>
    {
        if ( ( api.isInternal == proto.isInternal ) && proto.protocols.includes( scheme ) )
        {
            manifests[api.name] = api.manifest;
        }
    } );
    return manifests;
};
