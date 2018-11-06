import React from 'react';
import { shallow, mount } from 'enzyme';
import Error from 'components/PerusePages/Error';

describe( 'Error Component', () =>
{
    let wrapper;
    let instance;
    let props = {
        error : {
            header    : '',
            subHeader : ''
        }
    };

    describe( 'constructor( props )', () =>
    {
        it( 'should have name Error', () =>
        {
            wrapper = shallow( <Error { ...props } /> );
            instance = wrapper.instance();
            expect( instance.constructor.name ).toBe( 'Error' );
        } );
    } );

    describe( 'render()', () =>
    {
        beforeEach( () =>
        {
            props = { ...props, error: { header: 'Error Header' } }
        } );

        it( 'renders a required h3 header', () =>
        {
            wrapper = mount( <Error { ...props } /> );
            expect( wrapper.find('h3').length ).toBe( 1 );
            expect( wrapper.find('h3').text() ).toBe( props.error.header );
        } );

        it( 'optionally renders a subheader', () =>
        {
            props = { ...props, error: { subHeader: 'Error subheader' } };
            wrapper = mount( <Error { ...props } /> );
            expect( wrapper.find('h3').length ).toBe( 1 );
            expect( wrapper.find('h4').length ).toBe( 1 );
            expect( wrapper.find('h4').text() ).toBe( props.error.subHeader );
        } );
    } );
} );
