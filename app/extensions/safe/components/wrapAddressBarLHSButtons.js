import React, { Component } from 'react';
// import styles from './browser.css';
import { CLASSES, isRunningSpectronTestProcess, startedRunningMock } from 'appConstants';
import { SAFE } from 'extensions/safe/constants';
import WebIdDropdown from 'extensions/safe/components/WebIdDropdown';
import { Column, IconButton, Grid } from 'nessie-ui';
import _ from 'lodash';
import logger from 'logger';

const hideDropdownTimeout = 0.15; // seconds
const webIdManagerUri = startedRunningMock ? 'http://localhost:1234' : 'safe://webidea.ter';
const authHomeUri = 'safe-auth://home';

const wrapAddressBarLHSButtons = ( AddressBarButtons, extensionFunctionality = {} ) =>
    class wrappedAddressbarButtons extends Component
    {
        static defaultProps =
        {
            safeBrowserApp : {
                webIds : []
            }
        }

        handleExperimentalToggleClick = ( ) =>
        {
            const { enableExperiments, disableExperiments, safeBrowserApp } = this.props;
            const { experimentsEnabled } = safeBrowserApp;

            if ( experimentsEnabled )
            {
                disableExperiments();
                return;
            }

            enableExperiments();
        }

        render()
        {
            const { safeBrowserApp, activeTab } = this.props;
            const {
                experimentsEnabled
            } = safeBrowserApp;

            return (
                <Grid gutters="M">
                    <Column align="center" verticalAlign="middle">
                        <AddressBarButtons { ...this.props } />
                    </Column>
                    <Column size="icon-M" align="center" verticalAlign="middle">
                        <div>
                            <IconButton
                                onClick={ this.handleExperimentalToggleClick }
                                iconTheme="navigation"
                                iconType="inspect"
                                size="S"
                                style={ { cursor: 'pointer' } }
                            />
                        </div>
                        {
                            experimentsEnabled &&
                            <WebIdDropdown
                                { ...this.props }
                            />
                        }
                    </Column>

                </Grid>
            );
        }
    };


export default wrapAddressBarLHSButtons;
