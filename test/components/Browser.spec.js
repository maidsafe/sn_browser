// jest.mock('electron-log', () => ({ info: jest.fn() }));


import React from 'react';
import { mount, render, shallow } from 'enzyme';

import Browser from 'components/Browser';
import AddressBar from 'components/AddressBar';

describe( 'Browser', () =>
{
    let wrapper;
    let instance;
    let props = {
        bookmarks         :[],
        addBookmark       : () => {},
        removeBookmark    : () => {},
        focusAddressBar   : () => {},
        blurAddressBar    : () => {},
        addTab            : () => {},
        closeTab          : () => {},
        closeActiveTab    : () => {},
        reopenTab         : () => {},
        addNotification   : () => {},
        clearNotification : () => {},
        ui                : {}
    }

    beforeEach( () =>
    {

        wrapper = shallow( <Browser /> );
        instance = wrapper.instance();
    } );

    // describe( 'constructor( props )', () =>
    // {
    //     it( 'should have name Browser', () =>
    //     {
    //         console.log( '>>>>>>>>>>>>', instance );
    //         expect( instance.constructor.name ).to.equal( 'Button' );
    //     } );
    // } );

    describe( 'render()', () =>
    {
        it( 'should implement the AddressBar component', () =>
        {
            expect( wrapper.find( AddressBar ) ).to.have.length( 1 );
        } );

        // it( 'should contain exactly one <button>', () =>
        // {
        //     expect( wrapper.find( 'button' ) ).to.have.length( 1 );
        // } );
        //
        // it( 'should have a exactly one Icon when configured', () =>
        // {
        //     wrapper.setProps( { iconType: 'add' } );
        //     expect( wrapper.find( Icon ) ).to.have.length( 1 );
        // } );
        //
        // it( 'should have a exactly one Spinner when loading', () =>
        // {
        //     wrapper.setProps( { isLoading: true } );
        //     expect( wrapper.find( Spinner ) ).to.have.length( 1 );
        // } );
    } );
} );
