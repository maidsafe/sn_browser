import { SAFE } from 'appConstants';
import {
    saveConfigToSafe,
    readConfigFromSafe
} from './network/manageBrowserConfig';

import { requestAuth, clearAppObj } from './network';
import * as safeActions from 'actions/safe_actions';
import * as notificationActions from 'actions/notification_actions';
import logger from 'logger';

const authingStates = [
    SAFE.APP_STATUS.TO_AUTH,
    SAFE.APP_STATUS.AUTHORISING,
    SAFE.APP_STATUS.AUTHORISATION_FAILED,
    SAFE.APP_STATUS.AUTHORISATION_DENIED
];

/**
 * Setup actions to be triggered in response to store state changes.
 * @param  { ReduxStore } store [description]
 */
const handleStoreChanges = ( store ) =>
{
    manageSaveStateActions( store );
    manageReadStateActions( store );
    manageAuthorisationActions( store );
    manageLogout( store );
}

const networkIsConnected = ( state ) =>
{
    const safeNetwork = state.safeNetwork;

    if ( safeNetwork.appStatus === SAFE.NETWORK_STATE.LOGGED_IN ||
        authingStates.includes( safeNetwork.appStatus ) )
    {
        return true
    }
    else
    {
        return false;
    }
}

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
    else if ( !networkIsConnected( state ) )
    {
        store.dispatch( safeActions.setReadConfigStatus( SAFE.READ_STATUS.FAILED_TO_READ ) );
        store.dispatch( notificationActions.addNotification(
            {
                text: 'Unable to read the browser state. The network is not yet connected.',
                type: 'error'
            } ) );

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
 * Handle triggering actions and related functionality for logout of the Safe Network
 * based upon the application auth state
 * @param  {Object} state Application state (from redux)
 */
const manageLogout = async ( store ) =>
{
    const state = store.getState();

    if ( state.safeNetwork.appStatus === SAFE.APP_STATUS.TO_LOGOUT )
    {
        store.dispatch( safeActions.setAuthAppStatus( SAFE.APP_STATUS.LOGGING_OUT ) );
        store.dispatch( safeActions.resetStore() );
        clearAppObj();
        store.dispatch( safeActions.setAuthAppStatus( SAFE.APP_STATUS.LOGGED_OUT ) );
    }
};

/**
 * Handle triggering actions and related functionality for login to the SAFE netowrk
 * based upon the application auth state
 * @param  {Object} state Application state (from redux)
 */
// const manageLogin = async ( store ) =>
// {
//     const state = store.getState();
//
//     if ( state.safeNetwork.appStatus === SAFE.APP_STATUS.LOGGED_IN_TO_NETWORK)
//     {
//         store.dispatch( safeActions.setAuthAppStatus( SAFE.APP_STATUS.LOGGING_OUT ) );
//         store.dispatch( safeActions.resetStore() );
//         clearAppObj();
//         store.dispatch( safeActions.setAuthAppStatus( SAFE.APP_STATUS.LOGGED_OUT ) );
//     }
// };


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

    if ( networkIsConnected( state ) && safeNetwork.readStatus !== SAFE.READ_STATUS.READ_SUCCESSFULLY &&
        safeNetwork.readStatus !== SAFE.READ_STATUS.READ_BUT_NONEXISTANT )
    {
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
    else if ( !networkIsConnected( state ) )
    {
        store.dispatch( safeActions.setSaveConfigStatus( SAFE.SAVE_STATUS.FAILED_TO_SAVE ) );
        store.dispatch( notificationActions.addNotification(
            {
                text: 'Unable to save the browser state. The network is not yet connected.',
                type: 'error'
            } ) );

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




export default handleStoreChanges;
