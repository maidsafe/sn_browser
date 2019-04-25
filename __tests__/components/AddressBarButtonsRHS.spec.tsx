import React from 'react';
import { shallow } from 'enzyme';

import AddressBarButtonsRHS from '$Components/AddressBar/ButtonsRHS';

import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

const mockStore = configureStore();

// Some mocks to negate FFI and native libs we dont care about
jest.mock( 'extensions/safe/ffi/refs/types', () => ( {} ) );
jest.mock( 'extensions/safe/ffi/refs/constructors', () => ( {} ) );
jest.mock( 'extensions/safe/ffi/refs/parsers', () => ( {} ) );

jest.mock( 'ref-array', () => jest.fn() );
//
jest.mock( 'ffi-napi', () => jest.fn() );
jest.mock( 'extensions/safe/ffi/authenticator', () => jest.fn() );

jest.mock( '@maidsafe/safe-node-app', () => jest.fn() );
jest.mock( 'extensions/safe/actions/safeBrowserApplication_actions' );

jest.mock( '$Utils/extendComponent' );

describe( 'AddressBarButtonsRHS', () => {
    let wrapper;
    let instance;
    let properties;
    let store;

    beforeEach( () => {
        properties = {
            windowId: 1,
            address: 'about:blank',
            isSelected: false,
            isBookmarked: false,
            addBookmark: jest.fn(),
            removeBookmark: jest.fn(),
            tabBackwards: jest.fn(),
            tabForwards: jest.fn(),
            onBlur: jest.fn(),
            onSelect: jest.fn(),
            onFocus: jest.fn(),
            activeTab: { isLoading: false }
        };
    } );

    describe( 'constructor( props )', () => {
        beforeEach( () => {
            store = mockStore( properties );

            wrapper = shallow(
                <Provider store={store}>
                    <AddressBarButtonsRHS {...properties} />
                </Provider>
            ).dive();
            instance = wrapper.instance();
        } );

        it( 'should have name AddressBarButtonsRHS', () => {
            expect( instance.constructor.name ).toMatch( 'ButtonsRHS' );
        } );
    } );
} );
