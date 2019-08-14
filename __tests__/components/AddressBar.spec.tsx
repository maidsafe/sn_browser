import React from 'react';
import { shallow } from 'enzyme';

import configureStore from 'redux-mock-store';
import { AddressBar } from '$Components/AddressBar';

const mockStore = configureStore();

// Some mocks to negate FFI and native libs we dont care about
jest.mock( 'extensions/safe/ffi/refs/types', () => ( {} ) );
jest.mock( 'extensions/safe/ffi/refs/constructors', () => ( {} ) );
jest.mock( 'extensions/safe/ffi/refs/parsers', () => ( {} ) );
jest.mock( '$Logger' );

jest.mock( 'ref-array', () => jest.fn() );
//
jest.mock( 'ffi', () => jest.fn() );
jest.mock( 'extensions/safe/ffi/authenticator', () => jest.fn() );

jest.mock( '@maidsafe/safe-node-app', () => jest.fn() );
jest.mock( 'extensions/safe/actions/safeBrowserApplication_actions' );

describe( 'AddressBar', () => {
    let wrapper;
    let instance;
    let props;
    let store;

    beforeEach( () => {
        props = {
            windowId: 1,
            address: 'about:blank',
            isSelected: false,
            isBookmarked: false,
            experimentsEnabled: false,
            addBookmark: jest.fn(),
            removeBookmark: jest.fn(),
            tabBackwards: jest.fn(),
            tabForwards: jest.fn(),
            onBlur: jest.fn(),
            onSelect: jest.fn(),
            onFocus: jest.fn(),
            activeTab: {
                isLoading: false,
                historyIndex: 1,
                history: ['a', 'b']
            }
        };
    } );

    describe( 'constructor( props )', () => {
        beforeEach( () => {
            store = mockStore( props );

            wrapper = shallow( <AddressBar {...props} /> );

            instance = wrapper.instance();
        } );
        it( 'should have name AddressBar', () => {
            expect( instance.constructor.name ).toBe( 'AddressBar' );
        } );
    } );
} );
