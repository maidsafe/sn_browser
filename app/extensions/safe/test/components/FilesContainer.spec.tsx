import React from 'react';
import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';

// import configureStore from 'redux-mock-store';
import { FilesContainer } from '$Extensions/safe/components/FilesContainer';

// const mockStore = configureStore();

jest.mock( '$Logger' );

describe( 'FilesContainer', () => {
    let wrapper;
    let instance;
    let props;
    // let store;

    beforeEach( () => {
        props = {
            filesMap: {
                '/testfolder/file': {
                    link: 'safe://lalalalalala',
                },
                '/testfolder/subfolder/subfile': {
                    link: 'safe://lalalalalala',
                },
                '/testfolder/subfolder/subfile2': {
                    link: 'safe://lalalalalala',
                },
                '/testfolder/subfolder/subsub/subsubfile': {
                    link: 'safe://lalalalalala',
                },
                '/anotherfolder/somefile': {
                    link: 'safe://lalalalalala',
                },
            },
            currentLocation: 'safe://newstart',
        };

        wrapper = shallow( <FilesContainer {...props} /> );
        instance = wrapper.instance();
    } );

    describe( 'constructor( props )', () => {
        beforeEach( () => {
            // store = mockStore( props );
        } );

        it( 'should have name FilesContainer', () => {
            expect( instance.constructor.name ).toMatch( 'FilesContainer' );
        } );
    } );

    describe( 'files subfolder display', () => {
        it( 'should display only one list', () => {
            expect( wrapper.find( 'ul' ).length ).toBe( 1 );
        } );

        it( 'should display only next level folders / files once', () => {
            expect( wrapper.find( 'li' ).length ).toBe( 2 );
            expect( wrapper.find( 'a' ).first().props() ).toMatchObject( {
                children: '/testfolder',
                href: '/testfolder',
            } );
            expect( wrapper.find( 'a' ).last().props() ).toMatchObject( {
                children: '/anotherfolder',
                href: '/anotherfolder',
            } );
        } );

        it( 'should display only next level folders / files, when already at a location', () => {
            const newProperties = {
                filesMap: {
                    'subfolder/subfile': {
                        link: 'safe://lalalalalala',
                    },
                    'subfolder/subfile2': {
                        link: 'safe://lalalalalala',
                    },
                    'subfolder2/subsub/subsubfile': {
                        link: 'safe://lalalalalala',
                    },
                    'subfolder2/subsub/subsubfile2': {
                        link: 'safe://lalalalalala',
                    },
                },
                currentLocation: 'safe://start/testfolder',
            };
            wrapper = shallow( <FilesContainer {...newProperties} /> );

            expect( wrapper.find( 'li' ).length ).toBe( 2 );
            expect( wrapper.find( 'a' ).first().props() ).toMatchObject( {
                href: 'subfolder',
            } );
            expect( wrapper.find( 'a' ).last().props() ).toMatchObject( {
                href: 'subfolder2',
            } );
        } );
    } );
} );
