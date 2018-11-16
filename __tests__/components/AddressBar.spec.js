import React from 'react';
import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';

import AddressBar from 'components/AddressBar';
import configureStore from 'redux-mock-store';

const mockStore = configureStore();


describe( 'AddressBar', () =>
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
                    <AddressBar { ...props } />
                </Provider > ).dive();

            instance = wrapper.instance();
        } );
        it( 'should have name AddressBar', () =>
        {
            expect( instance.constructor.name ).toBe( 'AddressBar' );
        } );
    } );
} );
