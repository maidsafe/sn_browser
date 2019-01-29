import React from 'react';
import { shallow } from 'enzyme';

import UrlList from 'components/UrlList';
import { Table, TableRow } from 'nessie-ui';

describe( 'UrlList', () =>
{
    let wrapper;
    let instance;
    let props;

    beforeEach( () =>
    {
        props = {
            list : []
        };

        wrapper = shallow( <UrlList { ...props } /> );
        instance = wrapper.instance();
    } );

    describe( 'constructor( props )', () =>
    {
        it( 'should have name UrlList', () =>
        {
            expect( instance.constructor.name ).toBe( 'UrlList' );
        } );
    } );

    describe( 'render() with one tab', () =>
    {
        beforeEach( () =>
        {
            props = { ...props, list: ['hello'] };
            wrapper = shallow( <UrlList { ...props } /> );
        } );

        it( 'should have one link', () =>
        {
            wrapper = shallow( <UrlList { ...props } /> );
            expect( wrapper.find( 'a' ).length ).toBe( 1 );
        } );

        it( 'should have one Table', () =>
        {
            expect( wrapper.find( Table ).length ).toBe( 1 );
        } );
        it( 'should have one TableRow', () =>
        {
            expect( wrapper.find( TableRow ).length ).toBe( 1 );
        } );
    } );


    describe( 'props', () =>
    {
        describe( 'list', () =>
        {
            it( 'list length should be "0" by default', () =>
            {
                expect( instance.props.list.length ).toBe( 0 );
            } );
        } );
    } );
} );
