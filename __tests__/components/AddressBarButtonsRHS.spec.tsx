import React from 'react';
import { shallow } from 'enzyme';

import configureStore from 'redux-mock-store';
import { ButtonsRHS as AddressBarButtonsRHS } from '$Components/AddressBar/ButtonsRHS';

const mockStore = configureStore();
jest.mock( '$Logger' );

// Some mocks to negate FFI and native libs we dont care about

//

jest.mock( 'extensions/safe/actions/safeBrowserApplication_actions' );

jest.mock( '$Utils/extendComponent' );

describe( 'AddressBarButtonsRHS', () => {
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
            store = mockStore( props );

            wrapper = shallow( <AddressBarButtonsRHS {...props} /> );
            instance = wrapper.instance();
        } );

        it( 'should have name AddressBarButtonsRHS', () => {
            expect( instance.constructor.name ).toMatch( 'ButtonsRHS' );
        } );
    } );
} );
