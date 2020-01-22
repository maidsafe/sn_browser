import React from 'react';
import { notification } from 'antd';

import { handleNotifications } from '$Utils/handleNotificiations';
import { reactNodeToElement } from '$Utils/reactNodeToElement';

jest.mock( '$Utils/reactNodeToElement', () => ( {
    reactNodeToElement: jest.fn()
} ) );

jest.mock( 'antd/lib/notification', () => ( {
    error: jest.fn(),
    warning: jest.fn()
} ) );

const clearNotification = jest.fn();

describe( 'handleNotifications', () => {
    it( 'should exist', () => {
        expect( handleNotifications ).not.toBeNull();
    } );

    it( 'opens antd error notification by default', () => {
        const previousBrowserProperties = { notifications: [] };
        const currentBrowserProperties = {
            notifications: [{ id: 'ie93dk203', body: 'Error notification body' }]
        };
        handleNotifications( previousBrowserProperties, currentBrowserProperties );
        expect( notification.error ).toHaveBeenCalled();
        expect( reactNodeToElement ).not.toHaveBeenCalled();
    } );

    it( 'opens antd notification with ReactNode', () => {
        const previousBrowserProperties = { notifications: [] };
        const reactElement = (
            <div>
                <i>Warning notification body</i>
            </div>
        );
        const currentBrowserProperties = {
            notifications: [
                { id: 'ie93dk203', type: 'warning', reactNode: reactElement }
            ]
        };
        handleNotifications( previousBrowserProperties, currentBrowserProperties );
        expect( notification.warning ).toHaveBeenCalled();
        expect( reactNodeToElement ).toHaveBeenCalled();
    } );
} );
