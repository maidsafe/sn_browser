import React from 'react';
import { mount, shallow } from 'enzyme';

import Notifier from 'components/Notifier';
import { Text } from 'nessie-ui';
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

describe( 'Notifier', () =>
{
    let wrapper;
    let instance;
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

        wrapper = shallow(
            <Provider store={ store } >
                <Notifier { ...props } />
            </Provider > ).dive();
        instance = wrapper.instance();
    } );

    describe( 'constructor( props )', () =>
    {
        it( 'should have name Notifier', () =>
        {
            expect( instance.constructor.name ).toMatch( 'Notifier' );
        } );
    } );

    describe( 'mount() Notifier', () =>
    {
        beforeEach( () =>
        {
            props = { ...props, isVisible: true, text: 'notifier text' };
            wrapper = mount(
                <Provider store={ store } >
                    <Notifier { ...props } />
                </Provider > );
            instance = wrapper.instance();
        } );

        it( 'should have exactly 1 Text component', () =>
        {
            expect( wrapper.find( Text ).length ).toBe( 1 );
        } );

        it( 'should take a element object description as prop', () =>
        {
            const paraOne = 'Paragraph 1 text';
            const paraTwo = 'Paragraph 2 text';
            const paraThree = 'Paragraph 3 text';
            const elObject = {
                _owner : null,
                key    : null,
                props  : {
                    className : 'parentDiv',
                    children  : [
                        {
                            _owner : null,
                            props  : {
                                children : paraOne,
                                key      : 1,
                            },
                            ref  : null,
                            type : 'p'
                        },
                        {
                            _owner : null,
                            props  : {
                                children : paraTwo,
                                key      : 2,
                            },
                            ref  : null,
                            type : 'p'
                        },
                        {
                            _owner : null,
                            props  : {
                                children : paraThree,
                                key      : 3,
                            },
                            ref  : null,
                            type : 'p'
                        }
                    ]
                },
                ref  : null,
                type : 'div'
            };
            props = { ...props, isVisible: true, reactNode: elObject };
            const wrapper = mount(
                <Provider store={ store } >
                    <Notifier { ...props } />
                </Provider > );
            const reactNode = wrapper.find( 'div.parentDiv' );
            const reactNodeChildren = reactNode.children();
            expect( reactNodeChildren.length ).toBe( 3 );
            expect( reactNodeChildren.get( 0 ).props.children ).toBe( paraOne );
            expect( reactNodeChildren.get( 1 ).props.children ).toBe( paraTwo );
            expect( reactNodeChildren.get( 2 ).props.children ).toBe( paraThree );
        } );
    } );

    describe( 'props', () =>
    {
        beforeEach( () =>
        {
            props = {
                isVisible          : false,
                type               : 'alert',
                acceptText         : 'Accept',
                denyText           : 'Deny',
                updateNotification : jest.fn()
            };
            wrapper = mount(
                <Provider store={ store } >
                    <Notifier { ...props } />
                </Provider > );
            instance = wrapper.instance();
        } );

        describe( 'isVisible', () =>
        {
            it( 'isVisible should be "false" by default', () =>
            {
                expect( instance.isVisible ).toBeFalsy();
            } );
        } );
    } );
} );
