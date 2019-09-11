import React, { Component } from 'react';
// import styles from './browser.css';
import _ from 'lodash';
import { logger } from '$Logger';
// import { logger } from '$Logger';
// import styles from './nrsRegistryBar.css';

interface NrsRegistryBarProps {
    address: string;
    addressIsAvailable: boolean;
    registerNrsName: Function;
}
export class NrsRegistryBar extends Component<NrsRegistryBarProps, {}> {
    handleRegisterAddress = ( webId ) => {
        const { registerNrsName, address, addressIsAvailable } = this.props;

        logger.info( `Registering ${address} on NRS` );

        registerNrsName( address );
    };

    render() {
        const { address, addressIsAvailable } = this.props;

        return (
            <React.Fragment>
                {addressIsAvailable && (
                    <div>
                        {`${address} is available.`}{' '}
                        <button type="button" onClick={this.handleRegisterAddress}>
              Register it now.
                        </button>
                    </div>
                )}
            </React.Fragment>
        );
    }
}
