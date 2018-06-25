
// @flow
import { ipcRenderer } from 'electron';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './notifier.css';
import logger from 'logger';
import { CLASSES } from 'appConstants';

import { Button, Column, IconButton, MessageBox, Row, Text } from 'nessie-ui';

const log = require( 'electron-log' );

export default class Notifier extends Component
{
    static propTypes =
   {
       isVisible   : PropTypes.bool,
       text        : PropTypes.string,
       type        : PropTypes.string,
       acceptText  : PropTypes.string,
       denyText    : PropTypes.string,
       dismissText : PropTypes.string,
       onDismiss   : PropTypes.string,
       onAccept    : PropTypes.string,
       onDeny      : PropTypes.string,
       updateNotification : PropTypes.func
   }
    static defaultProps =
    {
        isVisible   : false,
        acceptText  : 'Accept',
        denyText    : 'Deny',
        dismissText : '',
        type        : 'alert'
    }

    handleDismiss = () =>
    {
        const { id, updateNotification } = this.props;
        //TODO: Use constants
        updateNotification({ id, response: 'ignore' })

    }

    render()
    {
        const { acceptText,
            denyText,
            dismissText,
            id,
            isPrompt,
            text,
            type,
            updateNotification
        } = this.props;

        if ( !text )
        {
            return ( <div /> );
        }

        let handleOnAccept;
        let handleOnDeny;

        if( isPrompt )
        {
            handleOnAccept = () =>
            {
                updateNotification({ id, response: 'allow' })
            };
            handleOnDeny = () => {
                updateNotification({ id, response: 'deny' })
            };
        }


        return (
            <Row hasMinHeight className={ styles.container } gutters={"none"}>
                <MessageBox messageType={type}>
                    <Row verticalAlign="middle" align="center">
                        <Text className={CLASSES.NOTIFIER_TEXT}>{ text }</Text>
                        {
                            handleOnAccept &&
                            <Column align="left">
                                <Button role="promoted" onClick={ handleOnAccept }>{ acceptText }</Button>
                            </Column>
                        }
                        {
                            handleOnDeny &&
                            <Column align="left">
                                <Button onClick={ handleOnDeny }>{ denyText }</Button>
                            </Column>
                        }
                        <Column align="left">
                            <IconButton
                                role="subtle"
                                iconType="close"
                                onClick={ this.handleDismiss }
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
