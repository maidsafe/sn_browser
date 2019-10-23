import React from 'react';
import { shallow } from 'enzyme';
import { Button } from 'antd';

import configureStore from 'redux-mock-store';
import { ButtonsLHS as AddressBarButtonsLHS } from '$Components/AddressBar/ButtonsLHS';

const mockStore = configureStore();

// Some mocks to negate FFI and native libs we dont care about

//

jest.mock( 'extensions/safe/actions/safeBrowserApplication_actions' );

jest.mock( '$Utils/extendComponent' );
jest.mock( '$Logger' );

describe( 'AddressBarButtonsLHS', () => {
    let wrapper;
    let props;
    let instance;
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

            wrapper = shallow( <AddressBarButtonsLHS {...props} /> );
            instance = wrapper.instance();
        } );

        it( 'should render 3 buttons', () => {
            expect( wrapper.find( Button ).length ).toBe( 3 );
        } );
    } );
} );
