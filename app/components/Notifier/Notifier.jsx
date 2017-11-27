
// @flow
import { ipcRender } from 'electron';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './notifier.css';

import { Button, Column, IconButton, MessageBox, Row, Text } from 'nessie-ui';

const log = require( 'electron-log' );

export default class Notifier extends Component
{
    static defaultProps =
    {
        isVisible   : false,
        acceptText  : 'Accept',
        denyText    : 'Deny',
        dismissText : ''
    }

    render()
    {
        const { notification, acceptText, denyText, dismissText } = this.props;

        if ( !notification )
        {
            return ( <div /> );
        }

        return (
            <Row hasMinHeight className={ styles.container }>
                <MessageBox messageType="alert">
                    <Row verticalAlign="middle" align="center">
                        <Text>{ notification.text }</Text>
                        <Column align="left">
                            <Button role="promoted" onClick={ notification.onAccept }>{notification.acceptText || acceptText }</Button>
                        </Column>
                        <Column align="left">
                            <Button onClick={ notification.onDeny }>{notification.denyText || denyText }</Button>
                        </Column>
                        <Column align="left">
                            <IconButton
                                role="subtle"
                                iconType="close"
                                onClick={ notification.onDismiss }
                            >
                                {notification.dismissText || dismissText }
                            </IconButton>
                        </Column>
                    </Row>
                </MessageBox>
            </Row>
        );
    }
}
