import React, { Component } from 'react';
import PropTypes from 'prop-types';

// import styles from './browser.css';
// import { CLASSES, isRunningSpectronTestProcess, startedRunningMock } from 'appConstants';
import { Row, Col, Button } from 'antd';
import 'antd/lib/row/style';
import 'antd/lib/col/style';
import 'antd/lib/button/style';

import logger from 'logger';

const wrapAddressBarButtonsRHS = ( AddressBarButtons, extensionFunctionality = {} ) =>
    class wrappedAddressBarButtonsRHS extends Component
    {
        static propTypes =
        {
            isMock             : PropTypes.bool.isRequired,
            experimentsEnabled : PropTypes.bool.isRequired,
            enableExperiments  : PropTypes.func.isRequired,
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
                <Row
                    type="flex"
                    justify="end"
                    align="middle"
                    gutter={ { xs: 2, sm: 4, md: 6 } }
                >
                    <Col>
                        <AddressBarButtons { ...this.props } />
                    </Col>
                    <Col>
                        <Button
                            icon="experiment"
                            shape="circle"
                        />
                    </Col>
                </Row>
            );
        }
    };


export default wrapAddressBarButtonsRHS;
