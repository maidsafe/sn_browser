import React from 'react';
import { mount, shallow } from 'enzyme';

import AddressBarButtonsLHS from 'components/AddressBar/ButtonsLHS';

import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

const mockStore = configureStore();

jest.mock( 'extensions/safe/actions/SafeBrowserApplication_actions' );


describe( 'AddressBarButtonsLHS', () =>
{
    let wrapper;
    let instance;
    let props;
    let store;

    beforeEach( () =>
    {
        props = {
            windowId           : 1,
            address            : 'about:blank',
            isSelected         : false,
            isBookmarked       : false,
            addBookmark        : jest.fn(),
            removeBookmark     : jest.fn(),
            activeTabBackwards : jest.fn(),
            activeTabForwards  : jest.fn(),
            updateActiveTab    : jest.fn(),
            onBlur             : jest.fn(),
            onSelect           : jest.fn(),
            onFocus            : jest.fn(),
            reloadPage         : jest.fn(),
            activeTab          : { isLoading: false }
        };
    } );

    describe( 'constructor( props )', () =>
    {
        beforeEach( () =>
        {
            store = mockStore( props );

            wrapper = shallow(
                <Provider store={ store } >
                    <AddressBarButtonsLHS { ...props } />
                </Provider> ).dive();
            instance = wrapper.instance(); instance = wrapper.instance();
        } );

        it( 'should have name AddressBarButtonsLHS', () =>
        {
            expect( instance.constructor.name ).toMatch( 'ButtonsLHS' );
        } );
    } );
} );
