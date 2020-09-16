import React from 'react';
import { shallow, mount } from 'enzyme';

import { History } from '$Components/PerusePages/History';
import { CLASSES } from '$Constants';

const date = new Date().toLocaleDateString();

jest.mock( 'extensions', () => ( {
    urlIsValid: () => true
} ) );

describe( 'History Component', () => {
    let wrapper;
    let instance;
    let props;

    beforeEach( () => {
        props = {
            tabs: {},
            addTab: jest.fn(),
            addTabEnd: jest.fn()
        };

        wrapper = shallow( <History {...props} /> );
        instance = wrapper.instance();
    } );

    describe( 'constructor( props )', () => {
        it( 'should have name History', () => {
            expect( instance.constructor.name ).toBe( 'History' );
        } );
    } );

    describe( 'render() with one tab', () => {
        beforeEach( () => {
            props = {
                ...props,
                history: {
                    [date]: [
                        {
                            url: 'safe://hello',
                            timeStamp: new Date().toLocaleTimeString()
                        }
                    ]
                }
            };
            wrapper = shallow( <History {...props} /> );
        } );

        it( 'should have one link', () => {
            wrapper = mount( <History {...props} /> );
            expect( wrapper.find( 'a' ).length ).toBe( 1 );
        } );
    } );

    describe( 'History should filter excluded protocols', () => {
        beforeEach( () => {
            props = {
                ...props,
                history: {
                    [date]: [
                        {
                            url: 'safe://somethingreal',
                            timeStamp: new Date().toLocaleTimeString()
                        },
                        {
                            url: 'about:blank',
                            timeStamp: new Date().toLocaleTimeString()
                        },
                        {
                            url: 'sn_browser://history',
                            timeStamp: new Date().toLocaleTimeString()
                        },
                        {
                            url: 'sn_browser://bookmarks',
                            timeStamp: new Date().toLocaleTimeString()
                        }
                    ]
                }
            };
            wrapper = shallow( <History {...props} /> );
        } );
        wrapper = mount( <History {...props} /> );
        it( 'should have one link', () => {
            expect( wrapper.find( 'a' ).length ).toBe( 1 );
        } );

        it( 'should have one link with text', () => {
            expect( wrapper.find( 'a' ).text() ).toBe( 'safe://somethingreal' );
        } );
    } );
} );
