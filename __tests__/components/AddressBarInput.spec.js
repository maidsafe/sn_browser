import React from 'react';
import { mount, shallow } from 'enzyme';

import AddressBarInput from 'components/AddressBar/Input';

import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
const mockStore = configureStore();


describe( 'AddressBarInput', () =>
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
                    <AddressBarInput { ...props } />
                </Provider > ).dive();
            instance = wrapper.instance();
        } );

        it( 'should have name AddressBarInput', () =>
        {
            expect( instance.constructor.name ).toMatch( 'Input' );
        } );
    } );
} );
