import React from 'react';
import { shallow, mount } from 'enzyme';

import Bookmarks from 'components/PerusePages/Bookmarks';
import UrlList from 'components/UrlList';
import { CLASSES } from 'appConstants';

describe( 'Bookmarks', () =>
{
    let wrapper;
    let instance;
    let props;

    beforeEach( () =>
    {
        props = {
            bookmarks : []
        };

        wrapper = shallow( <Bookmarks { ...props } /> );
        instance = wrapper.instance();
    } );

    describe( 'constructor( props )', () =>
    {
        it( 'should have name Bookmarks', () =>
        {
            expect( instance.constructor.name ).toBe( 'Bookmarks' );
        } );
    } );

    describe( 'render() with one tab', () =>
    {
        beforeEach( () =>
        {
            props = { ...props, bookmarks: [{ url: 'hello', isActiveTab: true }] };
            wrapper = shallow( <Bookmarks { ...props } /> );
        } );

        it( 'should have a peruse__page class', () =>
        {
            expect( wrapper.find( `.${CLASSES.PERUSE_PAGE}` ).length ).toBe( 1 );
        } );

        it( 'should have one url list', () =>
        {
            expect( wrapper.find( UrlList ).length ).toBe( 1 );
        } );

        it( 'should have one link', () =>
        {
            wrapper = mount( <Bookmarks { ...props } /> );
            expect( wrapper.find( 'a' ).length ).toBe( 1 );
        } );

    } );


    describe( 'props', () =>
    {
        describe( 'tabs', () =>
        {
            it( 'tabs length should be "0" by default', () =>
            {
                expect( instance.props.bookmarks.length ).toBe( 0 );
            } );
        } );
    } );
} );
