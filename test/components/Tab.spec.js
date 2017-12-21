import React from 'react';
import { mount, render, shallow } from 'enzyme';

import Tab from 'components/Tab';
import { CLASSES } from 'appConstants';

describe( 'Tab', () =>
{
    let wrapper;
    let instance;
    let props;

    beforeEach( () =>
    {
        props = {
            url: '',
            index: 1,
            updateTab : jest.fn(),
            addTab : jest.fn()
        };

        wrapper = mount( <Tab { ...props } setActiveTab={ jest.fn()} /> );
        instance = wrapper.instance();
    } );

    describe( 'constructor( props )', () =>
    {
        it( 'should have name Tab', () =>
        {
            expect( instance.constructor.name ).toBe( 'Tab' );
        } );
    } );

    describe( 'componentWillReceiveProps( nextProps )', () =>
    {
        it( 'should not call loadUrl with the same url without a slash', () =>
        {
            instance.webview = { src: 'hello/'};
            instance.loadURL = jest.fn();
            instance.state = {
                browserState : { mountedAndReady: true }
            }

            instance.componentWillReceiveProps( { url: 'hello' } )
            expect( instance.loadURL.mock.calls.length ).toBe( 0 )

        } );

        it( 'should call loadUrl with a different url ', () =>
        {
            instance.webview = { src: 'hello/'};
            instance.loadURL = jest.fn();
            instance.state = {
                browserState : { mountedAndReady: true }
            }

            instance.componentWillReceiveProps( { url: 'hello' } );
            expect( instance.loadURL.mock.calls.length ).toBe( 0 )
            instance.componentWillReceiveProps( { url: 'helllllllo' } );
            expect( instance.loadURL.mock.calls.length ).toBe( 1 )
        } );
    } );

} );
