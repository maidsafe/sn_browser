import React from 'react';
import classNames from 'classnames';
import { CONSTANTS } from '../constants';

interface PropTypes {
    status: number;
}

export const NetworkStatus = ( props: PropTypes ) => {
    let message = null;
    switch ( props.status ) {
        case CONSTANTS.NETWORK_STATUS.CONNECTED: {
            message = 'Connected';
            break;
        }
        case CONSTANTS.NETWORK_STATUS.DISCONNECTED: {
            message = 'Terminated';
            break;
        }
        case CONSTANTS.NETWORK_STATUS.CONNECTING: {
            message = 'Connecting';
            break;
        }
        default: {
            message = '';
            break;
        }
    }
    return (
        <div className="nw-status">
            <span
                className={classNames( 'nw-status-i', {
                    connecting: props.status === CONSTANTS.NETWORK_STATUS.CONNECTING,
                    terminated: props.status === CONSTANTS.NETWORK_STATUS.DISCONNECTED,
                    connected: props.status === CONSTANTS.NETWORK_STATUS.CONNECTED
                } )}
            >
                {' '}
            </span>
            <span className="nw-status-tooltip">{message}</span>
        </div>
    );
};
