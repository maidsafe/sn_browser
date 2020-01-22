import React from 'react';
import { mount } from 'enzyme';

import { Error } from '$Components/PerusePages/Error';

describe( 'Error Component', () => {
    let wrapper;
    let props = {
        address: 'safe://ups',
        type: 'CONNECTION_FAILED'
    };

    describe( 'render()', () => {
        beforeEach( () => {
            props = { ...props, error: { header: 'Error Header' } };
        } );

        it( 'renders a required h1 header', () => {
            wrapper = mount( <Error {...props} /> );
            expect( wrapper.find( 'h1' ).length ).toBe( 1 );
            expect( wrapper.find( 'h1' ).text() ).toBe(
                'Could not connect to the network'
            );
        } );

        it( 'renders a bad request error', () => {
            props.type = 'BAD_REQUEST';
            wrapper = mount( <Error {...props} /> );
            expect( wrapper.find( 'h1' ).length ).toBe( 1 );
            expect( wrapper.find( 'h1' ).text() ).toBe( 'Invalid address' );
        } );

        it( 'renders a INVALID_VERSION error', () => {
            props.type = 'INVALID_VERSION';
            wrapper = mount( <Error {...props} /> );
            expect( wrapper.find( 'h1' ).length ).toBe( 1 );
            expect( wrapper.find( 'h1' ).text() ).toBe(
                'This page version does not exist'
            );
        } );

        it( 'renders a NO_CONTENT_FOUND error', () => {
            props.type = 'NO_CONTENT_FOUND';
            wrapper = mount( <Error {...props} /> );
            expect( wrapper.find( 'h1' ).length ).toBe( 1 );
            expect( wrapper.find( 'h1' ).text() ).toBe( 'Not Found' );
        } );

        it( 'renders a UNKNOWN_NAME error', () => {
            props.type = 'UNKNOWN_NAME';
            wrapper = mount( <Error {...props} /> );
            expect( wrapper.find( 'h1' ).length ).toBe( 1 );
            expect( wrapper.find( 'h1' ).text() ).toBe( 'Nobody owns this address yet' );
            expect( wrapper.find( 'p' ).text() ).toBe(
                'safe://ups has not been registered yet.'
            );
            expect( wrapper.find( 'a' ).text() ).toBe( 'Register safe://ups' );
        } );

        it( 'optionally renders a subheader', () => {
            props = { ...props, error: { subHeader: 'Error subheader' } };
            wrapper = mount( <Error {...props} /> );
            expect( wrapper.find( 'p' ).length ).toBe( 1 );
        } );
    } );
} );
