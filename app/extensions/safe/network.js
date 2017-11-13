import { initializeApp, fromAuthURI } from '@maidsafe/safe-node-app';
import { APP_INFO, CONFIG, SAFE } from 'constants';
import logger from 'logger';
import { app } from 'electron';

import { openExternal } from './api/utils';

let appObj = null;
const queue = [];


export const authFromQueue = async() =>
{
    if( queue.length )
    {
        authFromRes( queue[0] ); //hack for testing
    }
}


const authFromRes = async( res ) =>
{
    appObj = await appObj.auth.loginFromURI( res );
}

// ipcRenderer.on( 'simulate-mock-res', () =>
// {
//     logger.verbose('hi')
//     // store.dispatch( simulateMockRes() );
// } );


const getMDataValueForKey = async ( md, key ) =>
{
    try
    {
        const encKey = await md.encryptKey( key );
        const value = await md.get( encKey );
        const result = await md.decrypt( value.buf );
        return result;
    }
    catch ( err )
    {
        throw err;
    }
};

export const getAppObj = () =>
    appObj;

export const handleIPCResponse = async ( res ) =>
{
    try
    {
        logger.info( 'Received URL response: ', res );

        if ( appObj )
        {
            authFromRes( res );
        }
        else
        {
            queue.push( res );
        }
    }
    catch ( e )
    {
        logger.error( e );
    }


    // TODO: Handle passing urls etc, once we have safe://


    // osx only for the still open but all windows closed state
    // if( process.platform === 'darwin' && global.macAllWindowsClosed )
    // {
    //   if( url.startsWith('safe-') ) {
    //     createShellWindow()
    //   }
    //
    // }
};

export const initAnon = async () =>
{
    logger.verbose( 'Initialising unauthed app: ', APP_INFO.info );

    try
    {
        // TODO: register scheme. Use genConnUri not genAuth
        appObj = await initializeApp( APP_INFO.info, null, { libPath: CONFIG.LIB_PATH, logger } );

        const authReq = await appObj.auth.genAuthUri( {} );

        logger.info( 'auth req generated:', authReq );
        // commented out until system_uri open issue is solved for osx
        // await appObj.auth.openUri(resp.uri);
        openExternal( authReq.uri );
        return appObj;
    }
    catch ( e )
    {
        logger.error( e );
        throw e;
    }
};

export const fetchData = async ( app, url ) =>
{
    logger.verbose( `Fetching: ${url}` );

    if ( !app )
    {
        return Promise.reject( new Error( 'Must login to Authenticator for viewing SAFE sites' ) );
    }

    try
    {
        const data = await app.webFetch( url );
    }
    catch ( e )
    {
        logger.error( e );
    }
};

export const requestAuth = async () =>
{
    try
    {
        const app = await initializeApp( APP_INFO.info, null, { libPath: CONFIG.LIB_PATH } );
        const resp = await app.auth.genAuthUri( APP_INFO.permissions, APP_INFO.opts );
        // commented out until system_uri open issue is solved for osx
        // await app.auth.openUri(resp.uri);
        openExternal( resp.uri );
        return;
    }
    catch ( err )
    {
        console.error( err );
        throw err;
    }
};

/*
* A request to share access to a Mutable Data structure becomes necessary when\
* that structure was created by the same user, however, in a foreign application
*
* This function will cause a shared MD auth popup to appear in SAFE Browser
*/
export const requestSharedMDAuth = async ( app, publicName ) =>
{
    const mdPermissions = [];
    if ( !publicName )
    {
        return Promise.reject( new Error( 'Invalid publicName' ) );
    }
    try
    {
        const pubNamesCntr = await app.auth.getContainer( CONSTANTS.ACCESS_CONTAINERS.PUBLIC_NAMES );
        const servCntrName = await getMDataValueForKey( pubNamesCntr, publicName );

        // Add service container to request array
        mdPermissions.push( {
            type_tag : CONSTANTS.TYPE_TAG.DNS,
            name     : servCntrName,
            perms    : ['Insert', 'Update', 'Delete'],
        } );

        const servCntr = await app.mutableData.newPublic( servCntrName, CONSTANTS.TYPE_TAG.DNS );
        const services = await servCntr.getEntries();
        await services.forEach( ( key, val ) =>
        {
            const service = key.toString();

            // check service is not an email or deleted
            if ( ( service.indexOf( CONSTANTS.MD_EMAIL_PREFIX ) !== -1 )
        || ( val.buf.length === 0 ) || service === CONSTANTS.MD_META_KEY )
            {
                return;
            }
            mdPermissions.push( {
                type_tag : CONSTANTS.TYPE_TAG.WWW,
                name     : val.buf,
                perms    : ['Insert', 'Update', 'Delete'],
            } );
        } );

        const resp = await app.auth.genShareMDataUri( mdPermissions );
        // commented out until system_uri open issue is solved for osx
        // await app.auth.openUri(resp.uri);
        openExternal( resp.uri );
        return;
    }
    catch ( err )
    {
        throw err;
    }
};

export const connectAuthed = async ( uri, netStatusCallback ) =>
{
    if ( !netStatusCallback )
    {
        return Promise.reject( new Error( 'netStatusCallback ' ) );
    }

    if ( !uri )
    {
        return Promise.reject( new Error( 'Invalid Auth response' ) );
    }

    logger.info( 'Connecting to safe...' );

    try
    {
        const app = await fromAuthURI( APP_INFO.info, uri, netStatusCallback, { libPath: CONFIG.LIB_PATH } );
        await app.auth.refreshContainersPermissions();
        netStatusCallback( SAFE.NETWORK_STATE.CONNECTED );
        return app;
    }
    catch ( err )
    {
        logger.error( `Error connecting to safe... ${err}` );

        throw err;
    }
};

export const connectWithSharedMd = async ( app, uri ) =>
{
    if ( !resUri )
    {
        return Promise.reject( new Error( 'Invalid Shared Mutable Data Auth response' ) );
    }
    try
    {
        await fromAuthURI( APP_INFO.info, uri, { libPath: CONFIG.LIB_PATH } );
        return;
    }
    catch ( err )
    {
        throw err;
    }
};

/**
 * Reconnect the application with SAFE Network when disconnected
 */
export const reconnect = ( app ) =>
{
    if ( !app )
    {
        return Promise.reject( new Error( 'Application not initialised' ) );
    }
    return app.reconnect();
};


/**
 * Authorise application for dev environment
 * This creates a test login for development purpose
 */
export const initMock = async () =>
{
    logger.info('initing mock')
    try
    {
        appObj = await initializeApp( APP_INFO.info, null, { libPath: CONFIG.LIB_PATH } );
        appObj = await appObj.auth.loginForTest( APP_INFO.permissions );
        return appObj;
    }
    catch ( err )
    {
        throw err;
    }
};
