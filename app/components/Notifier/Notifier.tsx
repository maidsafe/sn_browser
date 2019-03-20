import { ipcRenderer } from 'electron';
import React, { Component } from 'react';
import { logger } from '$Logger';
import { CLASSES } from '$Constants';
import { Button, Column, IconButton, MessageBox, Row, Text } from 'nessie-ui';
import styles from './notifier.css';

const log = require( 'electron-log' );

interface NotifierProps {
    isVisible?: boolean;
    text?: string;
    type?: string;
    acceptText?: string;
    denyText?: string;
    dismissText?: string;
    onDismiss?: string;
    onAccept?: string;
    onDeny?: string;
    reactNode?: object;
    updateNotification?: ( ...args: Array<any> ) => any;
}
export default class Notifier extends Component<NotifierProps, {}> {
    static defaultProps = {
        isVisible: false,
        acceptText: 'Accept',
        denyText: 'Deny',
        dismissText: '',
        type: 'alert'
    };

    handleDismiss = () => {
        const { id, updateNotification } = this.props;
        // TODO: Use constants
        updateNotification( { id, response: 'ignore' } );
    };

    render() {
        const {
            acceptText,
            denyText,
            dismissText,
            id,
            isPrompt,
            text,
            reactNode,
            type,
            updateNotification
        } = this.props;
        if ( !text && !reactNode ) {
            return <div />;
        }
        let handleOnAccept;
        let handleOnDeny;
        if ( isPrompt ) {
            handleOnAccept = () => {
                updateNotification( { id, response: 'allow' } );
            };
            handleOnDeny = () => {
                updateNotification( { id, response: 'deny' } );
            };
        }
        const reactNodeToElement = nodeObject => {
            const nodeDescription = {};
            Object.keys( nodeObject ).forEach( key => {
                if ( key === 'type' ) {
                    return ( nodeDescription[key] = nodeObject[key] );
                }
                if ( key === 'props' ) {
                    Object.keys( nodeObject[key] ).forEach( prop => {
                        if ( prop === 'children' ) {
                            return ( nodeDescription.children = nodeObject.props.children );
                        }
                        if ( nodeDescription.props ) {
                            nodeDescription.props = Object.assign( {}, nodeDescription.props, {
                                [prop]: nodeObject[key][prop]
                            } );
                        } else {
                            nodeDescription.props = {
                                [prop]: nodeObject[key][prop]
                            };
                        }
                    } );
                }
                if ( key === 'key' && nodeObject.key ) {
                    if ( !nodeDescription.props ) {
                        nodeDescription.props = {};
                    }
                    nodeDescription.props.key = nodeObject.key;
                }
            } );
            if ( Array.isArray( nodeDescription.children ) ) {
                nodeDescription.children = nodeDescription.children
                    .reduce( ( acc, val ) => acc.concat( val ), [] )
                    .map( child => reactNodeToElement( child ) );
            } else if (
                nodeDescription.children instanceof Object &&
        !Array.isArray( nodeDescription.children )
            ) {
                nodeDescription.children = reactNodeToElement( nodeDescription.children );
            }
            const elementType = nodeDescription.type;
            const elementProps = nodeDescription.props || null;
            const elementChildren = nodeDescription.children || null;
            return React.createElement( elementType, elementProps, elementChildren );
        };
        const reactElement = reactNode ? reactNodeToElement( reactNode ) : null;
        return (
            <Row hasMinHeight className={styles.container} gutters="none">
                <MessageBox messageType={type}>
                    <Row verticalAlign="top" align="center">
                        <Column key="notifier-text" align="left">
                            {reactNode && reactElement}
                            {!reactNode && (
                                <Text className={CLASSES.NOTIFIER_TEXT}>{text} </Text>
                            )}
                        </Column>
                        {handleOnAccept && (
                            <Column verticalAlign="top" key="notifier-accept" align="right">
                                <Button
                                    tabIndex="0"
                                    className={CLASSES.NOTIFICATION__ACCEPT}
                                    role="promoted"
                                    onClick={handleOnAccept}
                                >
                                    {acceptText}
                                </Button>
                            </Column>
                        )}
                        {handleOnDeny && (
                            <Column verticalAlign="top" key="notifier-deny" align="right">
                                <Button
                                    tabIndex="0"
                                    className={CLASSES.NOTIFICATION__REJECT}
                                    onClick={handleOnDeny}
                                >
                                    {denyText}
                                </Button>
                            </Column>
                        )}
                        <Column verticalAlign="top" key="notifier-dismiss" align="right">
                            <IconButton
                                role="subtle"
                                className={CLASSES.NOTIFICATION__IGNORE}
                                iconType="close"
                                tabIndex="0"
                                onClick={this.handleDismiss}
                            >
                                {dismissText}
                            </IconButton>
                        </Column>
                    </Row>
                </MessageBox>
            </Row>
        );
    }
}
