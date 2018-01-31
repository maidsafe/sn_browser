import { ipcRenderer, remote } from 'electron';
import logger from 'logger';

let isSafeAppAuthenticating = false;
let safeAuthNetworkState = -1;
const safeAuthData = null;


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

const addAuthNotification = ( data, app, addNotification, clearNotification, ignoreRequest ) =>
{
    let text = `${app.name} Requests Auth Permission`;
    let reqType = REQ_TYPES.AUTH;

    if ( data.contReq )
    {
        text = `${app.name} Requests Container Access`;
        reqType = REQ_TYPES.CONTAINER;
    }

    if ( data.mDataReq )
    {
        text = `${app.name} Requests mData Access`;
        reqType = REQ_TYPES.MDATA;
    }

    const success = () =>
    {
        authDecision( true, data, reqType );
        clearNotification();
    };

    const denial = () =>
    {
        authDecision( false, data, reqType );
        clearNotification();
    };

    addNotification( { text, onAccept: success, onDeny: denial, onDimiss: ignoreRequest } );
};

/**
 * binds listeners for authenticsator handling and triggers addition of Notifications for each
 * @param  {[type]} addNotification   [description]
 * @param  {[type]} clearNotification [description]
 * @return {[type]}                   [description]
 */
const setupAuthHandling = ( addNotification, clearNotification ) =>
{
    const ignoreRequest = ( data ) =>
    {
        ipcRenderer.send( 'skipAuthRequest', true );
        clearNotification();
    };

    // safe app plugin
    ipcRenderer.send( 'registerSafeApp' );

    ipcRenderer.on( 'webClientAuthReq', ( event, req ) =>
    {
        logger.info( 'on.....webClientAuthReq' );
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
        logger.info( 'on.....onNetworkStatus' );
        safeAuthNetworkState = status;
        logger.info( 'Network state changed to: ', safeAuthNetworkState );

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
    } );

    ipcRenderer.on( 'onAuthReq', ( event, data ) =>
    {
        logger.verbose( 'onAuthReq triggered' );
        const app = data.authReq.app;

        addAuthNotification( data, app, addNotification, clearNotification, ignoreRequest );
    } );

    ipcRenderer.on( 'onContainerReq', ( event, data ) =>
    {
        logger.verbose( 'onContainerReq triggered' );
        if ( data )
        {
            const app = data.contReq.app;
            addAuthNotification( data, app, addNotification, clearNotification, ignoreRequest );
        }
    } );

    ipcRenderer.on( 'onSharedMDataReq', ( event, data ) =>
    {
        logger.verbose( 'onSharedMDataReq triggered' );

        if ( data )
        {
            const app = data.mDataReq.app;

            addAuthNotification( data, app, addNotification, clearNotification, ignoreRequest );
        }
    } );

    ipcRenderer.on( 'onAuthDecisionRes', ( event, res ) =>
    {
        logger.info( 'on.....onAuthDecisionRes', res );

        const browserAuthReqUri = remote.getGlobal( 'browserAuthReqUri' );
        const browserReqUri = remote.getGlobal( 'browserReqUri' );

        if( res.uri === browserAuthReqUri || res.uri === browserReqUri )
        {
            ipcRenderer.send('browserAuthenticated', res.res, res.uri === browserAuthReqUri )
        }

        isSafeAppAuthenticating = false;
        if ( res.type === CLIENT_TYPES.WEB )
        {
            ipcRenderer.send( 'webClientAuthRes', res );
        }
    } );

    ipcRenderer.on( 'onContDecisionRes', ( event, res ) =>
    {
        logger.info( 'on.....onContDecisionRes', res );
        isSafeAppAuthenticating = false;
        if ( res.type === CLIENT_TYPES.WEB )
        {
            ipcRenderer.send( 'webClientContainerRes', res );
        }
    } );

    ipcRenderer.on( 'onUnAuthDecisionRes', ( event, res ) =>
    {
        logger.info( 'on.....onUnAuthDecisionRes', res );
        if ( res.type === CLIENT_TYPES.WEB )
        {
            ipcRenderer.send( 'webClientAuthRes', res );
        }
    } );

    ipcRenderer.on( 'onSharedMDataRes', ( event, res ) =>
    {
        logger.info( 'on.....onSharedMDataRes', res );
        isSafeAppAuthenticating = false;
        if ( res.type === CLIENT_TYPES.WEB )
        {
            ipcRenderer.send( 'webClientSharedMDataRes', res );
        }
    } );

    ipcRenderer.on( 'onAuthResError', ( event, res ) =>
    {
        logger.info( 'on.....onAuthResError', res );
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
        logger.info( 'on.....onUnAuthResError' );
        if ( res.type === CLIENT_TYPES.WEB )
        {
            ipcRenderer.send( 'webClientErrorRes', res );
        }
    } );
};


export default setupAuthHandling;
