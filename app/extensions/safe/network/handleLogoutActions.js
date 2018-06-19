import { SAFE } from 'extensions/safe/constants';
import { requestAuth, clearAppObj } from '../network';
import * as peruseAppActions from 'extensions/safe/actions/peruse_actions';
import * as notificationActions from 'actions/notification_actions';
import * as uiActions from 'actions/ui_actions';
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
const handleLogoutActions = ( store ) =>
{
    manageLogout( store );
}

const networkIsConnected = ( state ) =>
{
    const peruseApp = state.peruseApp;

    if ( peruseApp.appStatus === SAFE.NETWORK_STATE.LOGGED_IN ||
        authingStates.includes( peruseApp.appStatus ) )
    {
        return true
    }
    else
    {
        return false;
    }
}

let previousAppStatus;
/**
 * Handle triggering actions and related functionality for logout of the Safe Network
 * based upon the application auth state
 * @param  {Object} state Application state (from redux)
 */
const manageLogout = async ( store ) =>
{
    const state = store.getState();

    if ( state.peruseApp.appStatus === SAFE.APP_STATUS.TO_LOGOUT
        && previousAppStatus !== SAFE.APP_STATUS.TO_LOGOUT )
    {
        logger.verbose('Performing logout cleanup.')
        store.dispatch( peruseAppActions.setAppStatus( SAFE.APP_STATUS.LOGGED_OUT ) );
        clearAppObj();
        store.dispatch( uiActions.resetStore() );
    }

    previousAppStatus = state.peruseApp.appStatus;
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
//     if ( state.peruseApp.appStatus === SAFE.APP_STATUS.LOGGED_IN_TO_NETWORK)
//     {
//         store.dispatch( peruseAppActions.setAppStatus( SAFE.APP_STATUS.LOGGING_OUT ) );
//         store.dispatch( uiActions.resetStore() );
//         clearAppObj();
//         store.dispatch( peruseAppActions.setAppStatus( SAFE.APP_STATUS.LOGGED_OUT ) );
//     }
// };


export default handleLogoutActions;
