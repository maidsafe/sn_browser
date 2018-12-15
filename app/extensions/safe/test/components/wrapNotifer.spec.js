import React from 'react';
import { mount, shallow } from 'enzyme';

import Notifier from 'components/Notifier';
import { Button } from 'antd';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

const mockStore = configureStore();

// Some mocks to negate FFI and native libs we dont care about
jest.mock( 'extensions/safe/ffi/refs/types', () => ( {} ) );
jest.mock( 'extensions/safe/ffi/refs/constructors', () => ( {} ) );
jest.mock( 'extensions/safe/ffi/refs/parsers', () => ( {} ) );

jest.mock( 'ref-array', () => jest.fn() );
//
jest.mock( 'ffi', () => jest.fn() );
jest.mock( 'extensions/safe/ffi/authenticator', () => jest.fn() );

jest.mock( '@maidsafe/safe-node-app', () => jest.fn() );
jest.mock( 'extensions/safe/actions/safeBrowserApplication_actions' );

describe( 'ExtendedNotifier', () =>
{
    let wrapper;
    let props = {};
    let store;

    beforeEach( () =>
    {
        props = {
            isVisible          : false,
            type               : 'alert',
            acceptText         : 'Accept',
            denyText           : 'Deny',
            updateNotification : jest.fn(),
            clearNotification  : jest.fn(),
            safeBrowserApp     : {
                isConnecting : false
            }
        };
        store = mockStore( props );
    } );

    describe( 'handleReconnect', () =>
    {
        beforeEach( () =>
        {
            props = { ...props, isVisible: true, type: 'error', text: 'Disconnected', handleReconnect: true };
            wrapper = mount(
                <Provider store={ store } >
                    <Notifier { ...props } />
                </Provider > );
        } );

        it( 'should have exactly 1 Button component', () =>
        {
            expect( wrapper.find( Button ).length ).toBe( 1 );
            expect( wrapper.find( Button ).text() ).toBe( 'Reconnect' );
        } );
    } );
} );
