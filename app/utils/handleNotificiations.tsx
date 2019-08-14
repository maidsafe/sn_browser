import React from 'react';
import { notification, Row, Col, Button } from 'antd';
import { CLASSES } from '$Constants';
import { reactNodeToElement, NodeObject } from '$Utils/reactNodeToElement';
import 'antd/lib/notification/style';
import 'antd/lib/button/style';
import 'antd/lib/row/style';
import 'antd/lib/col/style';

export interface Notification {
    id: string;
    type?: string;
    title?: string;
    acceptText?: string;
    denyText?: string;
    description?: string;
    body?: string;
    reactNode?: NodeObject;
    isPrompt?: boolean;
    duration?: number;
}

interface BrowserProps {
    notifications: Array<Notification>;
    clearNotification: Function;
    updateNotification: Function;
}

export const handleNotifications = (
    prevProps: BrowserProps,
    currentProps: BrowserProps
) => {
    const prevNotifyLen = prevProps.notifications.length;
    const currNotifyLen = currentProps.notifications.length;
    if ( prevNotifyLen !== currNotifyLen && currNotifyLen - prevNotifyLen > 0 ) {
        const {
            notifications,
            clearNotification,
            updateNotification
        } = currentProps;
        let latestNotification = notifications[notifications.length - 1];

        const defaultProps = {
            acceptText: 'Accept',
            denyText: 'Deny',
            title: 'Error',
            type: 'error'
        };

        latestNotification = { ...defaultProps, ...latestNotification };

        const config = {
            key: latestNotification.id,
            message: latestNotification.title,
            description: latestNotification.reactNode ? (
                reactNodeToElement( latestNotification.reactNode )
            ) : (
                <p className={CLASSES.NOTIFIER_TEXT}>{latestNotification.body}</p>
            ),
            duration: latestNotification.duration,
            onClose: () => clearNotification( { id: latestNotification.id } )
        };

        if ( latestNotification.isPrompt ) {
            const handleOnAccept = () => {
                updateNotification( { id: latestNotification.id, response: 'allow' } );
                notification.close( latestNotification.id );
            };
            const handleOnDeny = () => {
                updateNotification( { id: latestNotification.id, response: 'deny' } );
                notification.close( latestNotification.id );
            };

            config.description = (
                <div>
                    <Row align="top" justify="center">
                        <Col>
                            {latestNotification.reactNode ? (
                                reactNodeToElement( latestNotification.reactNode )
                            ) : (
                                <p className={CLASSES.NOTIFIER_TEXT}>latestNotification.body</p>
                            )}
                        </Col>
                    </Row>
                    <Row gutter={48}>
                        <Col span={12}>
                            <Button
                                tabIndex={0}
                                className={CLASSES.NOTIFICATION__ACCEPT}
                                type="primary"
                                // eslint-disable-next-line jsx-a11y/aria-role
                                role="promoted"
                                onClick={handleOnAccept}
                            >
                                {latestNotification.acceptText}
                            </Button>
                        </Col>
                        <Col span={12}>
                            <Button
                                tabIndex={0}
                                onClick={handleOnDeny}
                                className={CLASSES.NOTIFICATION__REJECT}
                            >
                                {latestNotification.denyText}
                            </Button>
                        </Col>
                    </Row>
                </div>
            );
        }
        notification[latestNotification.type]( config );
    }
};
