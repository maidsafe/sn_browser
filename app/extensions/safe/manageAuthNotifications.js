/* eslint-disable no-underscore-dangle */
import * as notificationActions from 'actions/notification_actions';
import CONSTANTS from './auth-constants';
import logger from 'logger';
import { createAuthRequestElement } from './components/authRequest';

export const CLIENT_TYPES = {
    DESKTOP : 'DESKTOP',
    WEB     : 'WEB'
};

export const REQ_TYPES = {
    AUTH      : 'AUTH',
    CONTAINER : 'CONTAINER',
    MDATA     : 'MDATA'
};


export const addAuthNotification = ( authReqData, app, sendAuthDecision, store ) =>
{
    if ( !store )
    {
        throw new Error( 'Store not defined in authenticator IPC yet.' );
    }
    const addNotification = payload => store.dispatch( notificationActions.addNotification( payload ) );
    const clearNotification = () => store.dispatch( notificationActions.clearNotification( ) );


    let text = `${ app.name } Requests Auth Permission`;
    let reqType = REQ_TYPES.AUTH;

    if ( authReqData.contReq )
    {
        text = `${ app.name } Requests Container Access`;
        reqType = REQ_TYPES.CONTAINER;
    }

    if ( authReqData.mDataReq )
    {
        text = `${ app.name } Requests mData Access`;
        reqType = REQ_TYPES.MDATA;
    }

    const ignoreRequest = ( ) =>
    {
        logger.info( 'replace these ipcRenderer.send calls' );
        sendAuthDecision( false, authReqData, reqType );
        clearNotification();
    };

    const success = () =>
    {
        logger.info( 'success happeninng' );
        sendAuthDecision( true, authReqData, reqType );
        clearNotification();
    };

    const denial = () =>
    {
        logger.info( 'deny happeninng' );
        sendAuthDecision( false, authReqData, reqType );
        clearNotification();
    };
    const reactNode = createAuthRequestElement( authReqData );
    const notificationId = Math.random().toString( 36 );
    const theNotification = {
        // TODO: where should ID actually be applied?
        id       : notificationId,
        text,
        isPrompt : true,
        reactNode
    };
    const responseMap = {
        allow  : success,
        deny   : denial,
        ignore : ignoreRequest
    };

    // TODO: Add id to each notification
    addNotification( theNotification );

    // now we listen....
    const stopListening = store.subscribe( () =>
    {
        logger.verbose( 'Listener for addAuthNotification' );

        const state = store.getState();
        const notifications = state.notifications;

        if ( !notifications )
        {
            return;
        }

        const ourNotification = notifications.find( n => n.id === notificationId );

        if ( !ourNotification || ourNotification === theNotification )
        {
            return;
        }

        if ( ourNotification.response && responseMap[ourNotification.response] )
        {
            responseMap[ourNotification.response]();
            stopListening();
        }
    } );
};
