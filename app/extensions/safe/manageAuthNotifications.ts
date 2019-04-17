/* eslint-disable no-underscore-dangle */
import * as notificationActions from '$Actions/notification_actions';
import { logger } from '$Logger';
import { createAuthRequestElement } from './components/authRequest';

export const CLIENT_TYPES = {
    DESKTOP: 'DESKTOP',
    WEB: 'WEB'
};

export const REQ_TYPES = {
    AUTH: 'AUTH',
    CONTAINER: 'CONTAINER',
    MDATA: 'MDATA'
};

export const addAuthNotification = (
    authReqData,
    app,
    sendAuthDecision,
    store
) => {
    if ( !store ) {
        throw new Error( 'Store not defined in authenticator IPC yet.' );
    }
    const addNotification = payload =>
        store.dispatch( notificationActions.addNotification( payload ) );
    const clearNotification = ( payload: { id: string } ) =>
        store.dispatch( notificationActions.clearNotification( payload ) );

    let title = `${app.name} Requests Auth Permission`;
    let reqType = REQ_TYPES.AUTH;

    if ( authReqData.contReq ) {
        title = `${app.name} Requests Container Access`;
        reqType = REQ_TYPES.CONTAINER;
    }

    if ( authReqData.mDataReq ) {
        title = `${app.name} Requests mData Access`;
        reqType = REQ_TYPES.MDATA;
    }

    const notificationId = Math.random().toString( 36 );

    const ignoreRequest = () => {
        logger.info( 'replace these ipcRenderer.send calls' );
        sendAuthDecision( false, authReqData, reqType );
        clearNotification( { id: notificationId } );
    };

    const success = () => {
        logger.info( 'success happeninng' );
        sendAuthDecision( true, authReqData, reqType );
        clearNotification( { id: notificationId } );
    };

    const denial = () => {
        logger.info( 'deny happeninng' );
        sendAuthDecision( false, authReqData, reqType );
        clearNotification( { id: notificationId } );
    };
    const reactNode = createAuthRequestElement( authReqData );
    const theNotification = {
    // TODO: where should ID actually be applied?
        id: notificationId,
        title,
        isPrompt: true,
        reactNode,
        type: 'warning',
        duration: 0
    };
    const responseMap = {
        allow: success,
        deny: denial,
        ignore: ignoreRequest
    };

    // TODO: Add id to each notification
    addNotification( theNotification );

    // now we listen....
    const stopListening = store.subscribe( () => {
        logger.info( 'Listener for addAuthNotification' );

        const state = store.getState();
        const { notifications } = state;

        if ( !notifications ) {
            return;
        }

        const ourNotification = notifications.find( n => n.id === notificationId );

        if ( !ourNotification || ourNotification === theNotification ) {
            return;
        }

        if ( ourNotification.response && responseMap[ourNotification.response] ) {
            responseMap[ourNotification.response]();
            stopListening();
        }
    } );
};
