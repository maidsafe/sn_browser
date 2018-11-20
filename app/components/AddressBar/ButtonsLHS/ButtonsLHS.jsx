import React, { Component } from 'react';

import logger from 'logger';

import { Row, Col, Button } from 'antd';
import 'antd/lib/row/style';
import 'antd/lib/col/style';
import 'antd/lib/button/style';

import extendComponent from 'utils/extendComponent';
import { wrapAddressBarButtonsLHS } from 'extensions/components';
import styles from './buttonsLHS.css';

/**
 * Left hand side buttons for the Address Bar
 * @extends Component
 */
class ButtonsLHS extends Component
{
    render()
    {
        const { activeTab, handleBack, handleForward, handleRefresh } = this.props;

        return (
            <Row
                type="flex"
                justify="end"
                align="middle"
                gutter={ { xs: 2, sm: 4, md: 6 } }
            >
                <Col>
                    <Button
                        className="js-address__backwards"
                        icon="left"
                        shape="circle"
                        onClick={ handleBack }
                    />
                </Col>
                <Col>
                    <Button
                        className="js-address__forwards"
                        shape="circle"
                        icon="right"
                        onClick={ handleForward }
                    />
                </Col>
                <Col>
                    <Button
                        className={ styles.refresh }
                        shape="circle"
                        icon="reload"
                        disabled={ activeTab.isLoading }
                        onClick={ handleRefresh }
                    />
                </Col>
            </Row>
        )
    }
}

export default extendComponent( ButtonsLHS, wrapAddressBarButtonsLHS );
