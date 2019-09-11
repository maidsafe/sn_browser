import React from 'react';
import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { Input as AddressBarInput } from '$Components/AddressBar/Input';

const mockStore = configureStore();

jest.mock( '$Logger' );
// jest.mock('/Users/josh/Projects/safe/forks/browser/node_modules/safe_nodejs/native/index.node');
jest.mock( 'extensions/safe/actions/safeBrowserApplication_actions' );

describe( 'AddressBarInput', () => {
    let wrapper;
    let instance;
    let props;
    let store;
    const tabId = Math.random().toString( 36 );

    beforeEach( () => {
        props = {
            windowId: 1,
            address: 'about:blank',
            isSelected: false,
            tabId,
            isBookmarked: false,
            experimentsEnabled: false,
            updateTabUrl: jest.fn(),
            addBookmark: jest.fn(),
            removeBookmark: jest.fn(),
            tabBackwards: jest.fn(),
            tabForwards: jest.fn(),
            onBlur: jest.fn(),
            onSelect: jest.fn(),
            onFocus: jest.fn(),
            activeTab: { isLoading: false },
            updateTab: jest.fn(),
            safeBrowserApp: {
                isMock: false,
                experimentsEnabled: false
            },
            pWeb: {
                versionedUrls: {},
                availableNrsUrls: []
            }
        };
    } );

    describe( 'constructor( props )', () => {
        beforeEach( () => {
            store = mockStore( props );

            wrapper = shallow( <AddressBarInput {...props} /> );
        } );

        it( 'should have name AddressBarInput', () => {
            instance = wrapper.instance();

            expect( instance.constructor.name ).toMatch( 'Input' );
        } );
    } );

    describe( 'events', () => {
        beforeEach( () => {
            store = mockStore( props );

            wrapper = mount(
                <Provider store={store}>
                    <AddressBarInput {...props} />
                </Provider>
            );
        } );

        afterEach( () => {
            wrapper.unmount();
        } );

        it( 'check on onBlur,handleBlur is called', () => {
            const handleBlur = jest.fn();
            wrapper = mount(
                <Provider store={store}>
                    <AddressBarInput {...props} onBlur={handleBlur} />
                </Provider>
            );

            const input = wrapper.find( 'Input' );
            input.simulate( 'blur' );
            expect( handleBlur ).toHaveBeenCalled();
        } );

        it( 'check on onBlur,onBlur() is called', () => {
            const input = wrapper.find( 'Input' );
            input.simulate( 'blur' );
            expect( props.onBlur ).toHaveBeenCalled();
        } );

        it( 'check on onFocus,handleFocus is called', () => {
            const handleFocus = jest.fn();
            wrapper = mount(
                <Provider store={store}>
                    <AddressBarInput {...props} onFocus={handleFocus} />
                </Provider>
            );
            const input = wrapper.find( 'Input' );
            input.simulate( 'focus' );
            expect( handleFocus ).toHaveBeenCalled();
        } );

        it( 'check on onFocus,onFocus() is called', () => {
            wrapper = mount(
                <Provider store={store}>
                    <AddressBarInput {...props} />
                </Provider>
            );
            const input = wrapper.find( 'Input' );
            input.simulate( 'focus' );
            expect( props.onFocus ).toHaveBeenCalled();
        } );

        it( 'check on onKeyPress if updateTab is called', () => {
            const input = wrapper.find( 'Input' );

            input.simulate( 'keyPress', { key: 'Enter', keyCode: 13, which: 13 } );
            expect( props.updateTabUrl ).toHaveBeenCalled();
        } );

        it( 'check on onKeyPress if updateTab is called with params', () => {
            const input = wrapper.find( 'Input' );
            input.simulate( 'keyPress', { key: 'Enter', keyCode: 13, which: 13 } );
            expect( props.updateTabUrl ).toHaveBeenCalledWith(
                expect.objectContaining( {
                    url: 'about:blank',
                    tabId
                } )
            );
        } );

        it( 'check on onChange, if onSelect() is called', () => {
            const input = wrapper.find( 'Input' );
            input.value = '123456';
            input.simulate( 'change' );
            expect( props.onSelect ).toHaveBeenCalled();
        } );
    } );
} );
