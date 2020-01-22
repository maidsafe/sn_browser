import React from 'react';
import { mount } from 'enzyme';
import { Table, TableRow } from 'nessie-ui';

import { UrlList } from '$Components/UrlList';

describe( 'UrlList', () => {
    let wrapper;
    let instance;
    let props;

    beforeEach( () => {
        props = {
            list: []
        };

        wrapper = mount( <UrlList {...props} /> );
    } );

    describe( 'constructor( props )', () => {
        it( 'should have name UrlList', () => {
            expect( UrlList.name ).toBe( 'UrlList' );
        } );
    } );

    describe( 'render() with one tab', () => {
        it( 'should have one link', () => {
            props = { ...props, list: ['hello'] };
            wrapper = mount( <UrlList {...props} /> );
            expect( wrapper.find( 'a' ).length ).toBe( 1 );
        } );

        it( 'should have one Table', () => {
            expect( wrapper.find( Table ).length ).toBe( 1 );
        } );
        it( 'should have one TableRow', () => {
            expect( wrapper.find( TableRow ).length ).toBe( 1 );
        } );
    } );

    describe( 'props', () => {
        describe( 'list', () => {
            it( 'list length should be "0" by default', () => {
                expect( wrapper.props().list.length ).toBe( 0 );
            } );
        } );
    } );
} );
