import React from 'react';
import { mount, shallow } from 'enzyme';

import AddressBar from 'components/AddressBar';

describe( 'AddressBar', () =>
{
    let wrapper;
    let instance;
    let props;

    beforeEach( () =>
    {
        props = {
          address        : 'about:blank',
          isSelected     : false,
          isBookmarked   : false,
          addBookmark    : jest.fn(),
          removeBookmark : jest.fn(),
          onBlur         : jest.fn(),
          onSelect       : jest.fn(),
          onFocus        : jest.fn(),
          reloadPage     : jest.fn(),
          activeTab      : { isLoading: false }
        };
    } );

    describe( 'constructor( props )', () =>
    {
        beforeEach( () =>
        {
            wrapper = mount( <AddressBar { ...props } /> );
            instance = wrapper.instance();
        } );
        it( 'should have name AddressBar', () =>
        {
            expect( instance.constructor.name ).toBe( 'AddressBar' );
        } );
    } );
} );
