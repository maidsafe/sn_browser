import React from 'react';
import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';

import configureStore from 'redux-mock-store';

import Browser from 'components/Browser';
import AddressBar from 'components/AddressBar';
import TabBar from 'components/TabBar';
import Notifier from 'components/Notifier';
import TabContents from 'components/TabContents';

jest.autoMockOff();

// create any initial state needed
const initialState = {
    ui                   : { windows: [] },
    tabs                 : [],
    windowId             : 1,
    addTab               : jest.fn(),
    updateTab            : jest.fn(),
    closeTab             : jest.fn(),
    setActiveTab         : jest.fn(),
    reopenTab            : jest.fn(),
    addBookmark          : jest.fn(),
    removeBookmark       : jest.fn(),
    selectAddressBar     : jest.fn(),
    deselectAddressBar   : jest.fn(),
    blurAddressBar       : jest.fn(),
    addNotification      : jest.fn(),
    clearNotification    : jest.fn(),
    updateNotification   : jest.fn(),
    addLocalNotification : jest.fn()
};

// here it is possible to pass in any middleware if needed into //configureStore
const mockStore = configureStore();
let store;

describe( 'Browser', () =>
{
    let wrapper;
    let instance;
    let newState;

    describe( 'constructor( )', () =>
    {
        store = mockStore( initialState );

        wrapper = shallow(
            <Provider store={ store }>
                <Browser { ...initialState } />
            </Provider>
        ).dive();
        instance = wrapper.instance();

        it( 'should have name Browser', () =>
        {
            expect( instance.constructor.name ).toMatch( 'Browser' );
        } );
    } );

    describe( 'mount() with one tab', () =>
    {
        newState = {
            ...initialState,
            tabs : [
                {
                    url          : 'hello',
                    isActiveTab  : true,
                    windowId     : 1,
                    index        : 1,
                    isClosed     : false,
                    historyIndex : 1,
                    history      : [ 'a', 'hello' ]
                }
            ]
        };

        store = mockStore( newState );

        // must be mount for component did mount
        wrapper = mount(
            <Provider store={ store }>
                <Browser { ...newState } />
            </Provider>
        );

        it( 'should have exactly 1 AddressBar component', () =>
        {
            expect( wrapper.find( AddressBar ).length ).toBe( 1 );
        } );

        it( 'should have exactly 1 TabBar component', () =>
        {
            expect( wrapper.find( TabBar ).length ).toBe( 1 );
        } );

        it( 'should have exactly 1 Notifier component', () =>
        {
            expect( wrapper.find( Notifier ).length ).toBe( 1 );
        } );

        it( 'should have exactly 1 TabContents component', () =>
        {
            expect( wrapper.find( TabContents ).length ).toBe( 1 );
        } );
    } );

    describe( 'props', () =>
    {
        beforeEach( () =>
        {
            newState = { ...initialState, tabs: [] };
            store = mockStore( newState );

            wrapper = shallow(
                <Provider store={ store }>
                    <Browser { ...newState } />
                </Provider>
            ).dive();
            instance = wrapper.instance();
        } );

        describe( 'addressBarIsSelected', () =>
        {
            it( 'addressBarIsSelected should be "false" by default', () =>
            {
                expect( instance.addressBarIsSelected ).toBeFalsy();
            } );
        } );

        describe( 'tabs', () =>
        {
            it( 'should exist', () =>
            {
                expect( instance.props ).not.toBeUndefined();
            } );
            it( 'should be empty by default', () =>
            {
                expect( instance.props.tabs.length ).toBe( 0 );
            } );

            it( 'should be an array', () =>
            {
                expect( Array.isArray( instance.props.tabs ) ).toBeTruthy();
            } );
        } );
    } );
} );
