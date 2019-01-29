import React from 'react';
import { mount } from 'enzyme';
import Error from 'components/PerusePages/Error';

describe( 'Error Component', () =>
{
    let wrapper;
    let props = {
        error : {
            header    : '',
            subHeader : ''
        }
    };

    describe( 'render()', () =>
    {
        beforeEach( () =>
        {
            props = { ...props, error: { header: 'Error Header' } };
        } );

        it( 'renders a required h3 header', () =>
        {
            wrapper = mount( <Error { ...props } /> );
            expect( wrapper.find( 'h3' ).length ).toBe( 1 );
            expect( wrapper.find( 'h3' ).text() ).toBe( props.error.header );
        } );

        it( 'optionally renders a subheader', () =>
        {
            props = { ...props, error: { subHeader: 'Error subheader' } };
            wrapper = mount( <Error { ...props } /> );
            expect( wrapper.find( 'h3' ).length ).toBe( 1 );
            expect( wrapper.find( 'h4' ).length ).toBe( 1 );
            expect( wrapper.find( 'h4' ).text() ).toBe( props.error.subHeader );
        } );
    } );
} );
