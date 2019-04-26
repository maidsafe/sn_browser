import React from 'react';
import { shallow } from 'enzyme';
import { Button } from 'antd';

import { ButtonsLHS as AddressBarButtonsLHS } from '$Components/AddressBar/ButtonsLHS';

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

jest.mock( '$Utils/extendComponent' );

describe( 'AddressBarButtonsLHS', () => {
    let wrapper;
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
            TabForwards: jest.fn(),
            onBlur: jest.fn(),
            onSelect: jest.fn(),
            onFocus: jest.fn(),
            activeTab: { isLoading: false }
        };
    } );

    describe( 'constructor( props )', () => {
        beforeEach( () => {
            store = mockStore( props );

            wrapper = shallow(
                <Provider store={store}>
                    <AddressBarButtonsLHS {...props} />
                </Provider>
            ).dive();
        } );

        it( 'should render 3 buttons', () => {
            expect( wrapper.find( Button ).length ).toBe( 3 );
        } );
    } );
} );
