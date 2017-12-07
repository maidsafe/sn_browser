
// @flow
import { ipcRender } from 'electron';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './notifier.css';

import { Button, Column, IconButton, MessageBox, Row, Text } from 'nessie-ui';

const log = require( 'electron-log' );

export default class Notifier extends Component
{
    static propTypes =
   {
       isVisible   : PropTypes.bool,
       text        : PropTypes.string,
       acceptText  : PropTypes.string,
       denyText    : PropTypes.string,
       dismissText : PropTypes.string,
       onDismiss   : PropTypes.func,
       onAccept    : PropTypes.func,
       onDeny      : PropTypes.func
   }
    static defaultProps =
    {
        isVisible   : false,
        acceptText  : 'Accept',
        denyText    : 'Deny',
        dismissText : ''

    }

    handleDismiss = () =>
    {
        const { clearNotification } = this.props;
        clearNotification();
    }

    render()
    {
        const { acceptText,
            denyText,
            dismissText,
            onDismiss,
            onAccept,
            onDeny,
            text
        } = this.props;

        // TODO: Enable IPC comms for functionality with some string/phrasing
        // to catch and implement the cb.
        // OR: Use electron-redux aliasing.

        if ( !text )
        {
            return ( <div /> );
        }

        return (
            <Row hasMinHeight className={ styles.container }>
                <MessageBox messageType="alert">
                    <Row verticalAlign="middle" align="center">
                        <Text>{ text }</Text>
                        <Column align="left">
                            <Button role="promoted" onClick={ onAccept }>{ acceptText }</Button>
                        </Column>
                        <Column align="left">
                            <Button onClick={ onDeny }>{ denyText }</Button>
                        </Column>
                        <Column align="left">
                            <IconButton
                                role="subtle"
                                iconType="close"
                                onClick={ onDismiss || this.handleDismiss }
                            >
                                { dismissText }
                            </IconButton>
                        </Column>
                    </Row>
                </MessageBox>
            </Row>
        );
    }
}
