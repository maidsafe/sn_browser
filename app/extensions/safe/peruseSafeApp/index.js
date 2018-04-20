import opn from 'opn';
import {
    saveConfigToSafe,
    readConfigFromSafe
} from './manageBrowserConfig';
import { initializeApp } from '@maidsafe/safe-node-app';
import {
    APP_INFO,
    CONFIG,
    PROTOCOLS,
    SAFE,
    isCI,
    isRunningSpectronTestProcessingPackagedApp
} from 'appConstants';
import * as peruseAppActions from 'actions/peruse_actions';
import * as notificationActions from 'actions/notification_actions';
// import * as remoteCallActions from 'actions/remoteCall_actions';
import logger from 'logger';

const authingStates = [
    SAFE.APP_STATUS.TO_AUTH,
    SAFE.APP_STATUS.AUTHORISING,
    SAFE.APP_STATUS.AUTHORISATION_FAILED,
    SAFE.APP_STATUS.AUTHORISATION_DENIED
];

let peruseAppObj;

// TODO: Refactor away this and use aliased actions for less... sloppy
// flow and make this more reasonable.
let isAuthing = false;
let isReading = false;
let isSaving = false;

/**
 * Setup actions to be triggered in response to store state changes.
 * @param  { ReduxStore } store [description]
 */
const handlePeruseStoreChanges = ( store ) =>
{
    manageSaveStateActions( store );
    manageReadStateActions( store );
    manageAuthorisationActions( store );
}



let cachedRemoteCallArray = [];
// things underway
let callingArray = [];


/**
 * requests Safe network access for the Peruse application.
 * @param  {Boolean} isMock is the browser being run on a mock network
 * @return {Promise}        Peruse SafeApp object
 */
const requestPeruseAppAuthentication = async ( ) =>
{
    try
    {
        peruseAppObj = await initializeApp( APP_INFO.info, null, { libPath: CONFIG.SAFE_NODE_LIB_PATH } );

        const authReq = await peruseAppObj.auth.genAuthUri( APP_INFO.permissions, APP_INFO.opts );

        logger.verbose('generated auth uri:', authReq);
        global.browserAuthReqUri = authReq.uri;
        opn( authReq.uri );
        // await peruseAppObj.auth.openUri( authReq.uri );

        return peruseAppObj;
    }
    catch ( err )
    {
        logger.error( err );
        throw err;
    }
};

// TODO: Watch out, this is duped in network.js for funcs over there.
export const getPeruseAppObj = () =>
    peruseAppObj;

const urisUnderAuth = [];
const authFromStoreResponse = async ( res, store ) =>
{
    if( !res.startsWith('safe') )
    {
        // it's an error!
        logger.error( res )
        store.dispatch( notificationActions.addNotification(
            {
                text: `Unable to connect to the network. ${res}`,
                type: 'error'
            } ) );

        store.dispatch( peruseAppActions.setAppStatus( SAFE.APP_STATUS.AUTHORISATION_FAILED ) );

        return;
    }

    if( urisUnderAuth.includes( res ) )
    {
        return;
    }

    //TODO: This logic shuld be in BG process for peruse.
    try
    {
        urisUnderAuth.push(res);
        peruseAppObj = await peruseAppObj.auth.loginFromURI( res );

        if ( store )
        {
            store.dispatch( peruseAppActions.setAppStatus( SAFE.APP_STATUS.AUTHORISED ) );
            store.dispatch( peruseAppActions.setNetworkStatus( SAFE.NETWORK_STATE.CONNECTED ) );
        }
    }
    catch ( err )
    {
        if ( store )
        {
            let message = err.message;

            if( err.message.startsWith( 'Unexpected (probably a logic') )
            {
                message = `Check your current IP address matches your registered address at invite.maidsafe.net`;
            }

            if ( isRunningSpectronTestProcessingPackagedApp || isCI ) return;

            store.dispatch( notificationActions.addNotification( { text: message, onDismiss: notificationActions.clearNotification } ) );
        }

        logger.error( err.message || err );
        logger.error( '>>>>>>>>>>>>>' );
    }
};

/**
 * Handle triggering actions and related functionality for Authorising on the SAFE netowrk
 * based upon the application auth state
 * @param  {Object} state Application state (from redux)
 */
const manageAuthorisationActions = async ( store ) =>
{
    const peruse = store.getState().peruseApp;

    if ( peruse.appStatus === SAFE.APP_STATUS.TO_AUTH && !isAuthing )
    {
        // cannot rely solely on store as can change in other ways
        // before this is updated properly. This prevents that.
        isAuthing = true;

        store.dispatch( peruseAppActions.setAppStatus( SAFE.APP_STATUS.AUTHORISING ) );

        await requestPeruseAppAuthentication( );
        isAuthing = false;
    }

    if( peruse.authResponseUri && peruse.authResponseUri.length )
    {
        // TODO: This should 'clear' or somesuch....
        // OR: Only run if not authed?
        store.dispatch( peruseAppActions.receivedAuthResponse( '' ) );
        authFromStoreResponse( peruse.authResponseUri, store );
    }
};


const peruseAppIsConnected = ( state ) =>
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

const peruseIsAuthing = ( state ) =>
{
    const pendingAuthStates = [
        SAFE.APP_STATUS.TO_AUTH,
        SAFE.APP_STATUS.AUTHORISING
    ];

    const peruseApp = state.peruseApp;

    return isAuthing || pendingAuthStates.includes( peruseApp.appStatus )
}

const peruseIsAuthed = ( state ) =>
{
    return state.peruseApp.appStatus === SAFE.APP_STATUS.AUTHORISED;
}

const peruseIsConnected = ( state ) =>
{
    // Q: why do we have a loggedin state?
    return state.peruseApp.networkStatus === SAFE.NETWORK_STATE.CONNECTED;
}

const peruseAuthFailed = ( state ) =>
{
    state.peruseApp.appStatus === SAFE.APP_STATUS.AUTHORISATION_FAILED
}


/**
 * Handle triggering actions and related functionality for saving to SAFE netowrk
 * based upon the application stateToSave
 * @param  {Object} state Application state (from redux)
 */
const manageReadStateActions = async ( store ) =>
{
    //Hack as store is actually unreliable.
    //TODO: Rework this to use aliased funcs.
    if( isReading )
        return;

    const state = store.getState();
    const peruseApp = state.peruseApp;

    // if its not to save, or isnt authed yet...
    if ( peruseApp.readStatus !== SAFE.READ_STATUS.TO_READ ||
       peruseIsAuthing( state ) || peruseAuthFailed( state ) )
    {
        // do nothing
        return;
    }

    if( !peruseIsAuthed( state ) )
    {
        // come back when authed.
        store.dispatch( peruseAppActions.setAppStatus( SAFE.APP_STATUS.TO_AUTH ) );
        return;
    }

    if( !peruseIsConnected(state) )
    {
        return;
    }

    isReading = true;

    logger.verbose('Attempting to READ PeruseApp state from network')
    store.dispatch( peruseAppActions.setReadConfigStatus( SAFE.READ_STATUS.READING ) );

    readConfigFromSafe( store )
        .then( savedState =>
        {
            store.dispatch( peruseAppActions.receivedConfig( savedState ) );
            store.dispatch(
                peruseAppActions.setReadConfigStatus( SAFE.READ_STATUS.READ_SUCCESSFULLY )
            );

            isReading = false;
            return null;
        } )
        .catch( e =>
        {
            isReading = false;
            logger.error( e );
            store.dispatch(
                peruseAppActions.setSaveConfigStatus( SAFE.SAVE_STATUS.FAILED_TO_READ )
            );
            throw new Error( e );
        } );

};



/**
 * Handle triggering actions and related functionality for saving to SAFE netowrk
 * based upon the application stateToSave
 * @param  {Object} state Application state (from redux)
 */
const manageSaveStateActions = async ( store ) =>
{
    //Hack as store is actually unreliable.
    //TODO: Rework this to use aliased funcs.
    if( isSaving )
        return;

    const state = store.getState();
    const peruseApp = state.peruseApp;

    // if its not to save, or isnt authed yet...
    if ( peruseApp.saveStatus !== SAFE.SAVE_STATUS.TO_SAVE ||
       peruseIsAuthing( state ) || peruseAuthFailed( state ) )
    {
        // do nothing
        return;
    }

    //if it auth didnt happen, and hasnt failed... previously... we can try again (we're in TO SAVE, not SAVING.)
    if( !peruseIsAuthed( state ) )
    {
        // come back when authed.
        store.dispatch( peruseAppActions.setAppStatus( SAFE.APP_STATUS.TO_AUTH ) );
        return;
    }

    if( !peruseIsConnected(state) )
    {
        return;
    }


    //lets scrap read for now.
    if ( peruseApp.readStatus !== SAFE.READ_STATUS.READ_SUCCESSFULLY &&
        peruseApp.readStatus !== SAFE.READ_STATUS.READ_BUT_NONEXISTANT &&
        peruseApp.readStatus !== SAFE.READ_STATUS.TO_READ &&
        peruseApp.readStatus !== SAFE.READ_STATUS.READING )
    {
            logger.verbose( 'Can\'t save state, not read yet... Triggering a read.' );
            store.dispatch( peruseAppActions.setReadConfigStatus( SAFE.READ_STATUS.TO_READ ) );

        return;
    }

    isSaving = true;

    logger.verbose('Attempting to SAVE PeruseApp state to network')
    store.dispatch( peruseAppActions.setSaveConfigStatus( SAFE.SAVE_STATUS.SAVING ) );
    saveConfigToSafe( store )
        .then( () =>
        {
            isSaving = false;
            store.dispatch(
                peruseAppActions.setSaveConfigStatus( SAFE.SAVE_STATUS.SAVED_SUCCESSFULLY )
            );

            return null;
        } )
        .catch( e =>
        {
            isSaving = false;
            logger.error( e );

            // TODO: Handle errors across the store in a separate error watcher?
            store.dispatch(
                peruseAppActions.setSaveConfigStatus( SAFE.SAVE_STATUS.FAILED_TO_SAVE )
            );
            throw new Error( e );
        } );
};



export default handlePeruseStoreChanges;
