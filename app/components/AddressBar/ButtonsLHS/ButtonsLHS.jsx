import React, { Component } from 'react';

import logger from 'logger';
import { CLASSES } from '@Constants';

import { Row, Col, Button } from 'antd';
import 'antd/lib/row/style';
import 'antd/lib/col/style';
import 'antd/lib/button/style';
import { I18n } from 'react-redux-i18n';

import extendComponent from '@Utils/extendComponent';
import { wrapAddressBarButtonsLHS } from '@Extensions/components';
import styles from './buttonsLHS.css';

/**
 * Left hand side buttons for the Address Bar
 * @extends Component
 */
class ButtonsLHS extends Component {
    render() {
        const {
            activeTab,
            handleBack,
            handleForward,
            handleRefresh,
            canGoForwards,
            canGoBackwards
        } = this.props;

        return (
            <Row
                type="flex"
                justify="end"
                align="middle"
                gutter={{ xs: 2, sm: 4, md: 6 }}
            >
                <Col>
                    <Button
                        className={CLASSES.BACKWARDS}
                        disabled={!canGoBackwards}
                        icon="left"
                        shape="circle"
                        label={I18n.t('aria.navigate_back')}
                        aria-label={I18n.t('aria.navigate_back')}
                        onClick={handleBack}
                    />
                </Col>
                <Col>
                    <Button
                        className={CLASSES.FORWARDS}
                        disabled={!canGoForwards}
                        shape="circle"
                        icon="right"
                        aria-label={I18n.t('aria.navigate_forward')}
                        onClick={handleForward}
                    />
                </Col>
                <Col>
                    <Button
                        className={CLASSES.REFRESH}
                        shape="circle"
                        icon="reload"
                        aria-label={I18n.t('aria.reload_page')}
                        disabled={activeTab.isLoading}
                        onClick={handleRefresh}
                    />
                </Col>
            </Row>
        );
    }
}

export default extendComponent(ButtonsLHS, wrapAddressBarButtonsLHS);
