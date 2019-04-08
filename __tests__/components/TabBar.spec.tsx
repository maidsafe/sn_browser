import React from 'react';
import { mount, shallow } from 'enzyme';
import TabBar from '$Components/TabBar';
import { Icon } from 'antd';
import { CLASSES } from '$Constants';

describe( 'TabBar', () => {
    let wrapper;
    let instance;
    let props;

    beforeEach( () => {
        props = {
            addTab: jest.fn(),
            closeTab: jest.fn(),
            selectAddressBar: jest.fn(),
            setActiveTab: jest.fn()
        };

        wrapper = mount( <TabBar {...props} setActiveTab={jest.fn()} /> );
        instance = wrapper.instance();
    } );

    describe( 'constructor( props )', () => {
        it( 'should have name TabBar', () => {
            expect( instance.constructor.name ).toBe( 'TabBar' );
        } );
    } );

    describe( 'render() with one tab', () => {
        beforeEach( () => {
            props = {
                ...props,
                tabs: [
                    {
                        url: 'hello',
                        isActiveTab: true,
                        windowId: 1,
                        favicon: '../../resources/favicon.ico'
                    }
                ]
            };
            wrapper = shallow( <TabBar {...props} /> );
        } );

        it( 'should have exactly 1 tab', () => {
            expect( wrapper.find( `.${CLASSES.ACTIVE_TAB}` ).length ).toBe( 1 );
            expect( wrapper.find( `.${CLASSES.TAB}` ).length ).toBe( 1 );
        } );

        it( 'should have exactly 1 favicon', () => {
            expect( wrapper.find( '#favicon-img' ).length ).toBe( 1 );
        } );

        it( 'should have exactly 2 Button components', () => {
            // add and close
            expect( wrapper.find( Icon ).length ).toBe( 2 );
        } );
    } );

    describe( 'render() with one loading tab', () => {
        beforeEach( () => {
            props = {
                ...props,
                tabs: [
                    {
                        url: 'hello',
                        isActiveTab: true,
                        windowId: 1,
                        isLoading: true
                    }
                ]
            };
            wrapper = shallow( <TabBar {...props} /> );
        } );

        it( 'should have exactly 1 tab with loading indicator', () => {
            expect( wrapper.find( Icon ).length ).toBe( 3 );
        } );
    } );

    // describe( 'render() with many tabs', () =>
    // {
    //     beforeEach( () =>
    //     {
    //         props = { ...props,
    //             tabs : [
    //                 { url: 'hello', isActiveTab: true, windowId: 1 },
    //                 { url: 'helloo', isActiveTab: false, windowId: 1 },
    //                 { url: 'helloo', isActiveTab: false, windowId: 1 }
    //             ] };
    //         wrapper = shallow( <TabBar { ...props } /> );
    //     } );
    //
    //     it( 'should have exactly 3 tabs, with one active tab', () =>
    //     {
    //         expect( wrapper.find( `.${CLASSES.ACTIVE_TAB}` ).length ).toBe( 1 );
    //         expect( wrapper.find( `.${CLASSES.TAB}` ).length ).toBe( 3 );
    //     } );
    //
    //     it( 'should have exactly 1 MdAdd component', () =>
    //     {
    //         expect( wrapper.find( MdAdd ).length ).toBe( 1 );
    //     } );
    //
    //     it( 'should have exactly 3 MdClose component', () =>
    //     {
    //         expect( wrapper.find( MdClose ).length ).toBe( 3 );
    //     } );
    // } );

    // describe( 'functionality', ()=>
    // {
    //
    //     it( 'should call addTab when clicking addTab', () =>
    //     {
    //         let x = wrapper.find( `.${ CLASSES.ADD_TAB}` );
    //         console.info('x', x);
    //         expect( props.addTab ).toBeCalled();
    //     })
    // })

    describe( 'props', () => {
        describe( 'tabInFocus', () => {
            it( 'tabInFocus should be "0" by default', () => {
                expect( instance.props.tabInFocus ).toBe( 0 );
            } );
        } );
    } );
} );
