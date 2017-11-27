import { ipcRenderer } from 'electron';

const log = require( 'electron-log' );

let isSafeAppAuthenticating = false;
let safeAuthNetworkState = -1;
let safeAuthData = null;


export const CLIENT_TYPES = {
    DESKTOP : 'DESKTOP',
    WEB     : 'WEB'
};

export const REQ_TYPES = {
    AUTH      : 'AUTH',
    CONTAINER : 'CONTAINER',
    MDATA     : 'MDATA'
};


export const handleSafeAuthAuthentication = ( req, type ) =>
{
    ipcRenderer.send( 'decryptRequest', req, type || CLIENT_TYPES.DESKTOP );
};


function authDecision( isAllowed, data, reqType )
{
    isSafeAppAuthenticating = true;

    if ( reqType === REQ_TYPES.AUTH )
    {
        return ipcRenderer.send( 'registerAuthDecision', data, isAllowed );
    }
    else if ( reqType === REQ_TYPES.CONTAINER )
    {
        return ipcRenderer.send( 'registerContainerDecision', data, isAllowed );
    }
    ipcRenderer.send( 'registerSharedMDataDecision', data, isAllowed );
}

const addAuthNotification = ( data, addNotification, clearNotification, ignoreRequest  ) =>
{
    const text = `${data.authReq.app.name} Requests Auth`;

    const success = () =>
    {
        authDecision( true, data, REQ_TYPES.AUTH );
        clearNotification();
    };
    const denial = () =>
    {
        authDecision( false, data, REQ_TYPES.AUTH );
        clearNotification();
    };

    addNotification( { text, onAccept: success, onDeny: denial, onDimiss: ignoreRequest } );
}


const setupAuthHandling = ( addNotification, clearNotification ) =>
{

    const ignoreRequest = ( data ) =>
    {
        ipcRenderer.send( 'skipAuthRequest', true );
        clearNotification();
    }

    // safe app plugin
    ipcRenderer.send( 'registerSafeApp' );
    // setupSafeReconnectionHandlers( update );
    ipcRenderer.on( 'webClientAuthReq', ( event, req ) =>
    {
        log.info( 'on.....webClientAuthReq' );
        handleSafeAuthAuthentication( req, CLIENT_TYPES.WEB );
    } );


    // safe authenticator plugin
    ipcRenderer.send( 'registerSafeNetworkListener' );
    ipcRenderer.send( 'registerOnAuthReq' );
    ipcRenderer.send( 'registerOnContainerReq' );
    ipcRenderer.send( 'registerOnSharedMDataReq' );
    ipcRenderer.send( 'registerOnReqError' );

    ipcRenderer.on( 'onNetworkStatus', ( event, status ) =>
    {
        // addNotification( { name: 'Hello', reqType: 'ONE OF THOSE'} );
        log.info( 'on.....onNetworkStatus' );
        safeAuthNetworkState = status;
        log.info( 'Network state changed to: ', safeAuthNetworkState );

        if ( status === -1 )
        {
            // hideSafeAuthPopup();
            // startSafeConnectionCountdown();
        }
        // else
        // {
        //     const safeConnectionIntervalId = getSafeConnectionIntervalId();
        //     clearInterval( safeConnectionIntervalId );
        // }

        // update();
    } );

    ipcRenderer.on( 'onAuthReq', ( event, data ) =>
    {
        log.info( 'on....onAuthReq.', data );

        addAuthNotification( data, addNotification, clearNotification, ignoreRequest );
    } );

    ipcRenderer.on( 'onContainerReq', ( event, data ) =>
    {
        log.info( 'on.....onContainerReq' );
        if ( data )
        {
            // safeAuthData = data;
            addAuthNotification( data, addNotification, clearNotification, ignoreRequest );
        }
    } );

    ipcRenderer.on( 'onSharedMDataReq', ( event, data ) =>
    {
        log.info( 'on.....onSharedMDataReq' );
        if ( data )
        {
            // safeAuthData = data;
            addAuthNotification( data, addNotification, clearNotification, ignoreRequest );
        }
    } );

    ipcRenderer.on( 'onAuthDecisionRes', ( event, res ) =>
    {
        log.info( 'on.....onAuthDecisionRes' );
        isSafeAppAuthenticating = false;
        if ( res.type === CLIENT_TYPES.WEB )
        {
            ipcRenderer.send( 'webClientAuthRes', res );
        }
    } );

    ipcRenderer.on( 'onContDecisionRes', ( event, res ) =>
    {
        log.info( 'on.....onContDecisionRes' );
        isSafeAppAuthenticating = false;
        if ( res.type === CLIENT_TYPES.WEB )
        {
            ipcRenderer.send( 'webClientContainerRes', res );
        }
    } );

    ipcRenderer.on( 'onUnAuthDecisionRes', ( event, res ) =>
    {
        log.info( 'on.....onUnAuthDecisionRes' );
        if ( res.type === CLIENT_TYPES.WEB )
        {
            ipcRenderer.send( 'webClientAuthRes', res );
        }
    } );

    ipcRenderer.on( 'onSharedMDataRes', ( event, res ) =>
    {
        log.info( 'on.....onSharedMDataRes' );
        isSafeAppAuthenticating = false;
        if ( res.type === CLIENT_TYPES.WEB )
        {
            ipcRenderer.send( 'webClientSharedMDataRes', res );
        }
    } );

    ipcRenderer.on( 'onAuthResError', ( event, res ) =>
    {
        log.info( 'on.....onAuthResError' );
        isSafeAppAuthenticating = false;
        if ( res && res.error && ( res.error.toLowerCase() === 'unauthorised' ) )
        {
            // onClickOpenSafeAuthHome();
        }
        if ( res.type === CLIENT_TYPES.WEB )
        {
            ipcRenderer.send( 'webClientErrorRes', res );
        }
    } );

    ipcRenderer.on( 'onUnAuthResError', ( event, res ) =>
    {
        log.info( 'on.....onUnAuthResError' );
        if ( res.type === CLIENT_TYPES.WEB )
        {
            ipcRenderer.send( 'webClientErrorRes', res );
        }
    } );
};


export default setupAuthHandling;
