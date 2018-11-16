import React, { Component } from 'react';
// import styles from './browser.css';
import { CLASSES, isRunningSpectronTestProcess, startedRunningMock } from 'appConstants';
import { SAFE } from 'extensions/safe/constants';
import WebIdDropdown from 'extensions/safe/components/WebIdDropdown';
// import { Column, IconButton, Grid } from 'nessie-ui';
import _ from 'lodash';
import logger from 'logger';
import styles from './wrapAddressBarButtons.css';

import { Row, Col, Button } from 'antd';
import 'antd/lib/row/style';
import 'antd/lib/col/style';
import 'antd/lib/button/style';


const wrapAddressBarButtonsLHS = ( AddressBarButtons, extensionFunctionality = {} ) =>
    class wrappedAddressBarButtonsLHS extends Component
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
                <Row
                    type="flex"
                    justify="end"
                    align="middle"
                    gutter={ { xs: 2, sm: 4, md: 6 } }
                >
                    <Col >
                        <AddressBarButtons { ...this.props } />
                    </Col>
                    <Col >
                        <Button
                        // className = { }
                            icon="experiment"
                            shape="circle"
                            onClick={ this.handleExperimentalToggleClick }
                        // size="S"
                        // style={ { cursor: 'pointer' } }
                        />
                    </Col>
                    {
                        experimentsEnabled &&
                            <Col >
                                <WebIdDropdown
                                    { ...this.props }
                                />
                            </Col>
                    }

                </Row>
            );
        }
    };


export default wrapAddressBarButtonsLHS;
