// following @pfrazee's beaker pattern again here.
import { ipcRenderer } from 'electron';
import rpc from 'pauls-electron-rpc';
import pkg from 'appPackage';
const VERSION = pkg.version;
const WITH_CALLBACK_TYPE_PREFIX = '_with_cb_';
const WITH_ASYNC_CALLBACK_TYPE_PREFIX = '_with_async_cb_';
const EXPORT_AS_STATIC_OBJ_PREFIX = '_export_as_static_obj_';

// Use a readable RPC stream to invoke a provided callback function,
// resolving the promise upon the closure of the stream the sender.
const readableToCallback = ( rpcAPI ) =>
    ( arg1, cb ) =>
        new Promise( ( resolve, reject ) =>
        {
            const r = rpcAPI( arg1 );
            r.on( 'data', data => cb.apply( cb, data ) );
            r.on( 'error', err => reject( err ) );
            r.on( 'end', () => resolve() );
        } );

// Use a readable RPC stream to invoke a provided callback function even after
// resolving the promise.
const readableToAsyncCallback = ( rpcAPI, safeAppGroupId ) =>
    ( arg1, cb, arg2 ) =>
        new Promise( ( resolve, reject ) =>
        {
            let firstValueReceived = false;
            const r = rpcAPI( arg1, arg2, safeAppGroupId );
            r.on( 'data', data =>
            {
                if ( !firstValueReceived )
                {
                    firstValueReceived = true;
                    resolve( data[0] );
                }
                else
                {
                    cb.apply( cb, data );
                }
            } );
            r.on( 'error', err => reject( err ) );
        } );


// method which will populate window with the APIs deemed appropriate for the protocol
const setupPreloadAPIs = ( asProtocol ) =>
{
    // mark the safe protocol as 'secure' to enable all DOM APIs
    // webFrame.registerURLSchemeAsSecure('safe');
    window[ pkg.name ] = { version: VERSION };
    const webAPIs = asProtocol ?
        ipcRenderer.sendSync( 'get-web-api-manifests', asProtocol ) :
        ipcRenderer.sendSync( 'get-web-api-manifests', window.location.protocol ) ;

    // create an id to group all safeApp objects
    const safeAppGroupId = ( Math.random() * 1000 | 0 ) + Date.now();
    window.safeAppGroupId = safeAppGroupId;

    Object.keys( webAPIs ).forEach( k =>
    {
        const fnsToImport = [];
        const fnsWithCallback = [];
        const fnsWithAsyncCallback = [];
        const staticObjs = [];

        Object.keys( webAPIs[k] ).forEach( fn =>
        {
            // We adapt the functions which contain a callback
            if ( fn.startsWith( WITH_CALLBACK_TYPE_PREFIX ) )
            {
                // We use a readable type to receive the data from the RPC channel
                const manifest = { [fn]: 'readable' };
                const rpcAPI = rpc.importAPI( WITH_CALLBACK_TYPE_PREFIX + k, manifest, { timeout: false } );
                // We expose the function removing the WITH_CALLBACK_TYPE_PREFIX prefix
                const newFnName = fn.replace( WITH_CALLBACK_TYPE_PREFIX, '' );
                fnsWithCallback[newFnName] = readableToCallback( rpcAPI[fn] );
            }
            else if ( fn.startsWith( WITH_ASYNC_CALLBACK_TYPE_PREFIX ) )
            {
                // We use a readable type to receive the data from the RPC channel
                const manifest = { [fn]: 'readable' };
                const rpcAPI = rpc.importAPI( WITH_ASYNC_CALLBACK_TYPE_PREFIX + k, manifest, { timeout: false } );
                // We expose the function removing the WITH_ASYNC_CALLBACK_TYPE_PREFIX prefix
                const newFnName = fn.replace( WITH_ASYNC_CALLBACK_TYPE_PREFIX, '' );
                // Provide the safeAppGroupId to map it to all safeApp instances created,
                // so they can be automatically freed when the page is closed or refreshed
                fnsWithAsyncCallback[newFnName] = readableToAsyncCallback( rpcAPI[fn], safeAppGroupId );
            }
            else if ( fn.startsWith( EXPORT_AS_STATIC_OBJ_PREFIX ) )
            {
                const manifest = { [fn]: 'sync' };
                const rpcAPI = rpc.importAPI( EXPORT_AS_STATIC_OBJ_PREFIX + k, manifest, { timeout: false } );
                // We expose the object name removing the EXPORT_AS_STATIC_OBJ_PREFIX prefix
                const objName = fn.replace( EXPORT_AS_STATIC_OBJ_PREFIX, '' );
                // Call the function to expose just the returned value
                staticObjs[objName] = rpcAPI[fn].call();
            }
            else
            {
                fnsToImport[fn] = webAPIs[k][fn];
            }
        });

        window[k] = Object.assign( rpc.importAPI( k, fnsToImport, { timeout: false } ), staticObjs, fnsWithCallback, fnsWithAsyncCallback );
    } );
}


export default setupPreloadAPIs;
