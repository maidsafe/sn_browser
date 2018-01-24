import { session, shell } from 'electron';
import logger from 'logger';
import { CONFIG, isRunningProduction, SAFE } from 'appConstants';
import setupRoutes from './server-routes';
import registerSafeProtocol from './protocols/safe';
import {
    saveConfigToSafe,
    readConfigFromSafe
} from './network/manageBrowserConfig';
import registerSafeAuthProtocol from './protocols/safe-auth';
import ipc from './ffi/ipc';

import { initAnon, initMock, requestAuth } from './network';
import * as tabsActions from 'actions/tabs_actions';
import * as safeActions from 'actions/safe_actions';
import { urlIsAllowed } from './utils/safeHelpers';
import * as authAPI from './auth-api';


const isForLocalServer = ( parsedUrlObject ) =>
    parsedUrlObject.protocol === 'localhost:' || parsedUrlObject.hostname === '127.0.0.1';

const blockNonSAFERequests = () =>
{
    const filter = {
        urls : ['*://*']
    };

    const safeSession = session.fromPartition( CONFIG.SAFE_PARTITION );

    safeSession.webRequest.onBeforeRequest( filter, ( details, callback ) =>
    {
        if ( urlIsAllowed( details.url ) )
        {
            logger.debug( `Allowing url ${details.url}` );
            callback( {} );
            return;
        }

        if ( details.url.indexOf( 'http' ) > -1 )
        {
            try
            {
                shell.openExternal( details.url );
            }
            catch ( e )
            {
                logger.error( e );
            }
        }

        logger.info( 'Blocked req:', details.url );
        callback( { cancel: true } );
    } );
};

const init = async ( store ) =>
{
    logger.info( 'Registering SAFE Network Protocols' );
    registerSafeProtocol();
    registerSafeAuthProtocol();

    try
    {
        // setup auth
        authAPI.ffi.ffiLoader.loadLibrary();

        // dont do this inside if auth ffi as circular dep
        ipc();

        if ( isRunningProduction )
        {
            await initAnon( store );
        }
        else
        {
            await initMock( store );
        }
    }
    catch ( e )
    {
        logger.info( 'Problems initing SAFE extension' );
        logger.info( e.message );
        logger.info( e );
    }

    blockNonSAFERequests();

    store.subscribe( async () =>
    {
        manageSaveStateActions( store );
        manageReadStateActions( store );
        manageAuthorisationActions( store );
    } );
};

// const middleware = store => next => action =>
// {
//     logger.info( 'ACTION:paylos', action.payload.url );
//
//     if ( action.type === tabsActions.TYPES.ADD_TAB && action.payload.url && action.payload.url.startsWith( 'http' ) )
//     {
//         let newAction = { ...action, type: 'cancelled' }
//         return 'boop';
//     }
//
//     // return next( action );
// };
//


const authingStates = [
    SAFE.APP_STATUS.TO_AUTH,
    SAFE.APP_STATUS.AUTHORISING,
    SAFE.APP_STATUS.AUTHORISATION_FAILED,
    SAFE.APP_STATUS.AUTHORISATION_DENIED
];


/**
 * Handle triggering actions and related functionality for saving to SAFE netowrk
 * based upon the application stateToSave
 * @param  {Object} state Application state (from redux)
 */
const manageReadStateActions = async ( store ) =>
{
    const state = store.getState();
    const safeNetwork = state.safeNetwork;

    if ( safeNetwork.readStatus !== SAFE.READ_STATUS.TO_READ )
    {
        // do nothing
        return;
    }

    if ( safeNetwork.appStatus === SAFE.APP_STATUS.AUTHORISED &&
        safeNetwork.networkStatus === SAFE.NETWORK_STATE.CONNECTED )
    {
        store.dispatch( safeActions.setReadConfigStatus( SAFE.READ_STATUS.READING ) );
        readConfigFromSafe( store )
            .then( savedState =>
            {
                store.dispatch( safeActions.receivedConfig( savedState ) );
                store.dispatch(
                    safeActions.setReadConfigStatus( SAFE.READ_STATUS.READ_SUCCESSFULLY )
                );
                return null;
            } )
            .catch( e =>
            {
                logger.error( e );
                store.dispatch(
                    safeActions.setSaveConfigStatus( SAFE.SAVE_STATUS.FAILED_TO_READ )
                );
                throw new Error( e );
            } );
    }

    // TODO: Refactor and DRY this out between save/read?
    else if ( !authingStates.includes( safeNetwork.appStatus ) )
    {
        store.dispatch( safeActions.setAuthAppStatus( SAFE.APP_STATUS.TO_AUTH ) );
    }


    // TODO: Refactor this: Is it needed?
    if ( safeNetwork.readStatus === SAFE.READ_STATUS.FAILED_TO_READ &&
        safeNetwork.appStatus === SAFE.APP_STATUS.AUTHORISED )
    {
        store.dispatch( safeActions.setReadConfigStatus( SAFE.READ_STATUS.TO_READ ) );
    }
};


/**
 * Handle triggering actions and related functionality for Authorising on the SAFE netowrk
 * based upon the application auth state
 * @param  {Object} state Application state (from redux)
 */
const manageAuthorisationActions = async ( store ) =>
{
    const state = store.getState();

    if ( state.safeNetwork.appStatus === SAFE.APP_STATUS.TO_AUTH )
    {
        store.dispatch( safeActions.setAuthAppStatus( SAFE.APP_STATUS.AUTHORISING ) );
        const app = await requestAuth();
    }
};

/**
 * Handle triggering actions and related functionality for saving to SAFE netowrk
 * based upon the application stateToSave
 * @param  {Object} state Application state (from redux)
 */
const manageSaveStateActions = async ( store ) =>
{
    const state = store.getState();
    const safeNetwork = state.safeNetwork;

    if ( safeNetwork.saveStatus !== SAFE.SAVE_STATUS.TO_SAVE )
    {
        // do nothing
        return;
    }

    if ( safeNetwork.readStatus !== SAFE.READ_STATUS.READ_SUCCESSFULLY )
    {
        logger.verbose( 'read stat', safeNetwork.readStatus, SAFE.READ_STATUS.TO_READ );

        if ( safeNetwork.readStatus !== SAFE.READ_STATUS.TO_READ &&
            safeNetwork.readStatus !== SAFE.READ_STATUS.READING )
        {
            logger.verbose( 'Can\'t save, not read yet. Triggering a read.' );
            store.dispatch( safeActions.setReadConfigStatus( SAFE.READ_STATUS.TO_READ ) );
        }

        return;
    }

    if ( safeNetwork.appStatus === SAFE.APP_STATUS.AUTHORISED &&
        safeNetwork.networkStatus === SAFE.NETWORK_STATE.CONNECTED )
    {
        store.dispatch( safeActions.setSaveConfigStatus( SAFE.SAVE_STATUS.SAVING ) );
        saveConfigToSafe( store )
            .then( () =>
            {
                store.dispatch(
                    safeActions.setSaveConfigStatus( SAFE.SAVE_STATUS.SAVED_SUCCESSFULLY )
                );

                return null;
            } )
            .catch( e =>
            {
                logger.error( e );

                // TODO: Handle errors across the store in a separate error watcher?
                store.dispatch(
                    safeActions.setSaveConfigStatus( SAFE.SAVE_STATUS.FAILED_TO_SAVE )
                );
                throw new Error( e );
            } );
    }
    else if ( !authingStates.includes( state.safeNetwork.appStatus ) )
    {
        store.dispatch( safeActions.setAuthAppStatus( SAFE.APP_STATUS.TO_AUTH ) );
    }


    if ( safeNetwork.saveStatus === SAFE.SAVE_STATUS.FAILED_TO_SAVE &&
        safeNetwork.appStatus === SAFE.APP_STATUS.AUTHORISED )
    {
        store.dispatch( safeActions.setSaveConfigStatus( SAFE.SAVE_STATUS.TO_SAVE ) );
    }
};


export default {
    init,
    setupRoutes,
    // middleware
};
