import React from 'react';
import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import { Browser } from '$Components/Browser';
import { AddressBar } from '$Components/AddressBar';
import { TabBar } from '$Components/TabBar';
import { TabContents } from '$Components/TabContents';
import { handleNotifications } from '$Utils/handleNotificiations';

jest.mock( '$Utils/extendComponent' );
jest.mock( '$Utils/handleNotificiations' );

jest.mock( '$Logger' );

// create any initial state needed
const initialState = {
    ui: { windows: [] },
    tabs: {},
    windows: {
        openWindows: {},
        closedWindows: {}
    },
    notifications: [],
    windowId: 1,
    addTab: jest.fn(),
    updateTabUrl: jest.fn(),
    updateTabWebId: jest.fn(),
    toggleDevTools: jest.fn(),
    tabShouldReload: jest.fn(),
    updateTabTitle: jest.fn(),
    updateTabFavicon: jest.fn(),
    tabLoad: jest.fn(),
    closeTab: jest.fn(),
    setActiveTab: jest.fn(),
    reopenTab: jest.fn(),
    addBookmark: jest.fn(),
    removeBookmark: jest.fn(),
    selectAddressBar: jest.fn(),
    deselectAddressBar: jest.fn(),
    blurAddressBar: jest.fn(),
    addNotification: jest.fn(),
    clearNotification: jest.fn(),
    updateNotification: jest.fn(),
    addLocalNotification: jest.fn()
};

// here it is possible to pass in any middleware if needed into //configureStore
const mockStore = configureStore();
let store;

describe( 'Browser', () => {
    let wrapper;
    let instance;
    let newState;
    const windowId = 1;
    const tabId = Math.random().toString( 36 );

    describe( 'constructor( )', () => {
        store = mockStore( initialState );

        wrapper = mount( <Browser {...initialState} /> );
        instance = wrapper.instance();

        it( 'should have name Browser', () => {
            expect( instance.constructor.name ).toMatch( 'Browser' );
        } );
    } );

    describe( 'mount() with one tab', () => {
        newState = {
            ...initialState,
            tabs: {
                [tabId]: {
                    url: 'hello',
                    historyIndex: 1,
                    history: ['a', 'hello'],
                    tabId,
                    ui: {
                        addressBarIsSelected: false,
                        pageIsLoading: false,
                        shouldFocusWebview: false,
                        shouldToggleDevTools: false
                    }
                }
            },
            windows: {
                openWindows: {
                    [windowId]: {
                        activeTab: tabId,
                        ui: {
                            settingsMenuIsVisible: false
                        },
                        tabs: [tabId]
                    }
                },
                closedWindows: {
                    [windowId]: {
                        closedtabs: [],
                        lastActiveTabs: []
                    }
                }
            }
        };

        store = mockStore( newState );

        wrapper = mount(
            <Provider store={store}>
                <Browser {...newState} />
            </Provider>
        );

        it( 'should have exactly 1 AddressBar component', () => {
            expect( wrapper.find( AddressBar ).length ).toBe( 1 );
        } );

        it( 'should have exactly 1 TabBar component', () => {
            expect( wrapper.find( TabBar ).length ).toBe( 1 );
        } );

        it( 'should have exactly 1 TabContents component', () => {
            expect( wrapper.find( TabContents ).length ).toBe( 1 );
        } );

        it( 'handles notifications on componentDidUpdate', () => {
            wrapper = mount( <Browser {...newState} /> );
            wrapper.setProps( { notifications: [{ id: '0.j1m6f62qm8' }] } );
            expect( handleNotifications ).toHaveBeenCalled();
        } );
    } );

    describe( 'props', () => {
        beforeEach( () => {
            newState = {
                ...initialState,
                tabs: {},
                windows: { openWindows: {}, closedWindows: {} }
            };
            store = mockStore( newState );

            wrapper = shallow(
                <Provider store={store}>
                    <Browser {...newState} />
                </Provider>
            ).dive();
            instance = wrapper.instance();
        } );

        describe( 'addressBarIsSelected', () => {
            it( 'addressBarIsSelected should be "false" by default', () => {
                expect( wrapper.addressBarIsSelected ).toBeFalsy();
            } );
        } );

        describe( 'tabs', () => {
            it( 'should exist', () => {
                expect( wrapper.props() ).not.toBeUndefined();
            } );
            it( 'should be empty by default', () => {
                expect( Object.keys( wrapper.props().tabs ).length ).toBe( 0 );
            } );

            it( 'should be an array', () => {
                expect( typeof wrapper.props().tabs === 'object' ).toBeTruthy();
            } );
        } );
    } );
} );
