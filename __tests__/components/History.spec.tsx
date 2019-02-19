import React from 'react';
import { shallow, mount } from 'enzyme';

import History from 'components/PerusePages/History';
import UrlList from 'components/UrlList';
import { CLASSES } from '@Constants';

jest.mock( 'extensions', () => ( {
    urlIsValid : () => true
} ) );

describe( 'History Component', () =>
{
    let wrapper;
    let instance;
    let props;

    beforeEach( () =>
    {
        props = {
            tabs   : [],
            addTab : jest.fn()
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
            props = {
                ...props,
                history : [
                    {
                        url         : 'safe://hello',
                        isActiveTab : true,
                        windowId    : 1,
                        history     : [ 'safe://hello' ]
                    }
                ]
            };
            wrapper = shallow( <History { ...props } /> );
        } );

        it( 'should have a safeBrowser__page class', () =>
        {
            expect( wrapper.find( `.${ CLASSES.SAFE_BROWSER_PAGE }` ).length ).toBe(
                1
            );
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

    describe( 'History should filter excluded protocols', () =>
    {
        beforeEach( () =>
        {
            props = {
                ...props,
                history : [
                    {
                        url         : 'safe-auth://lalala',
                        isActiveTab : true,
                        windowId    : 1,
                        history     : [
                            'safe-auth://lalala',
                            'safe://somethingreal',
                            'about:blank',
                            'safe-browser://history',
                            'safe-browser://bookmarks'
                        ]
                    }
                ]
            };
            wrapper = shallow( <History { ...props } /> );
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

        it( 'should have one link with text', () =>
        {
            wrapper = mount( <History { ...props } /> );
            expect( wrapper.find( 'a' ).text() ).toBe( 'safe://somethingreal' );
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
