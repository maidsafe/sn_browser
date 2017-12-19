import React from 'react';
import { shallow, mount } from 'enzyme';

import History from 'components/PerusePages/History';
import UrlList from 'components/UrlList';
import { CLASSES } from 'appConstants';

describe( 'History', () =>
{
    let wrapper;
    let instance;
    let props;

    beforeEach( () =>
    {
        props = {
            tabs : []
        };

        wrapper = shallow( <History { ...props } /> );
        instance = wrapper.instance();
    } );

    describe( 'constructor( props )', () =>
    {
        it( 'should have name History', () =>
        {
            expect( instance.constructor.name ).toBe( 'History' );
        } );
    } );

    describe( 'render() with one tab', () =>
    {
        beforeEach( () =>
        {
            props = { ...props, tabs: [{ url: 'hello', isActiveTab: true, windowId: 1, history: [ 'hello' ] }] };
            wrapper = shallow( <History { ...props } /> );
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
            wrapper = mount( <History { ...props } /> );
            expect( wrapper.find( 'a' ).length ).toBe( 1 );
        } );

    } );


    describe( 'props', () =>
    {
        describe( 'tabs', () =>
        {
            it( 'tabs length should be "0" by default', () =>
            {
                expect( instance.props.tabs.length ).toBe( 0 );
            } );
        } );
    } );
} );
