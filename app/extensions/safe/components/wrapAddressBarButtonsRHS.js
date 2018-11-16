import React, { Component } from 'react';
import PropTypes from 'prop-types';

// import styles from './browser.css';
import { CLASSES, isRunningSpectronTestProcess, startedRunningMock } from 'appConstants';
// import { SAFE } from 'extensions/safe/constants';
// import _ from 'lodash';
import logger from 'logger';

const wrapAddressBarButtonsRHS = ( AddressBarButtons, extensionFunctionality = {} ) =>
    class wrappedAddressBarButtonsRHS extends Component
    {
        static propTypes =
        {
            isMock             : PropTypes.bool.isRequired,
            experimentsEnabled : PropTypes.bool.isRequired,
            enableExperiments : PropTypes.func.isRequired,
            disableExperiments : PropTypes.func.isRequired,

        }

        static defaultProps =
        {
            // safeBrowserApp : {
                isMock             : false,
                experimentsEnabled : false
            // }
        }

        handleExperimentalToggleClick = ( ) =>
        {
            const { enableExperiments, disableExperiments, experimentsEnabled } = this.props;
            // const { experimentsEnabled } = safeBrowserApp;

            if ( experimentsEnabled )
            {
                disableExperiments();
                return;
            }

            enableExperiments();
        }

        render()
        {
            // const { safeBrowserApp, activeTab, experimentsEnabled } = this.props;
            // const {
            //     experimentsEnabled
            // } = safeBrowserApp;

            return (
                <AddressBarButtons { ...this.props } />
            );
        }
    };


export default wrapAddressBarButtonsRHS;
