import React, { Component } from 'react';

import logger from 'logger';
import { Column, IconButton, Row } from 'nessie-ui';

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
            <Row gutters="S">
                <Column align="center" verticalAlign="middle">
                    <IconButton
                        iconTheme="navigation"
                        iconType="left"
                        iconSize="S"
                        onClick={ handleBack }
                    />
                </Column>
                <Column align="center" verticalAlign="middle">
                    <IconButton
                        iconTheme="navigation"
                        iconSize="S"
                        iconType="right"
                        onClick={ handleForward }
                    />
                </Column>
                <Column align="center" verticalAlign="middle">
                    <IconButton
                        className={ styles.refresh }
                        iconTheme="navigation"
                        iconSize="S"
                        iconType="reset"
                        isDisabled={ activeTab.isLoading }
                        onClick={ handleRefresh }
                    />
                </Column>
            </Row>
        )
    }
}

export default extendComponent( ButtonsLHS, wrapAddressBarButtonsLHS );
