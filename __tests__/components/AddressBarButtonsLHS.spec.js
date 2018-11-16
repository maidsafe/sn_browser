import React from 'react';
import { mount, shallow } from 'enzyme';

import AddressBarButtonsLHS from 'components/AddressBar/ButtonsLHS';

describe( 'AddressBarButtonsLHS', () =>
{
    let wrapper;
    let instance;
    let props;

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
            wrapper = mount( <AddressBarButtonsLHS { ...props } /> );
            instance = wrapper.instance();
        } );

        it( 'should have name AddressBarButtonsLHS', () =>
        {
            expect( instance.constructor.name ).toMatch( 'ButtonsLHS' );
        } );
    } );
} );
