/* eslint-disable func-names */
import { ui } from '$Reducers/ui';
import { TYPES } from '$Actions/ui_actions';
import { initialAppState } from '$Reducers/initialAppState';

describe( 'notification reducer', () => {
    const uiInitialState = {
        windows: []
    };
    const uiStateShow = {
        windows: [{ windowId: 1, settingsMenuIsVisible: true }]
    };
    const uiStateHide = {
        windows: [{ windowId: 1, settingsMenuIsVisible: false }]
    };
    it( 'should return the initial state', () => {
        expect( ui( undefined, {} ) ).toEqual( initialAppState.ui );
    } );
    describe( 'UI_ADD_WINDOW', () => {
        it( 'should handle add window to ui store', () => {
            expect(
                ui(
                    { windows: [] },
                    {
                        type: TYPES.UI_ADD_WINDOW,
                        payload: { windowId: 1 }
                    }
                )
            ).toEqual( uiStateHide );
        } );
    } );
    describe( 'SHOW_SETTINGS_MENU', () => {
        it( 'should handle showing the settings menu', () => {
            expect(
                ui(
                    { windows: [{ windowId: 1, settingsMenuIsVisible: false }] },
                    {
                        type: TYPES.SHOW_SETTINGS_MENU,
                        payload: { windowId: 1 }
                    }
                )
            ).toEqual( uiStateShow );
        } );
    } );

    describe( 'HIDE_SETTINGS_MENU', () => {
        it( 'should handle showing the settings menu', () => {
            expect(
                ui(
                    { windows: [{ windowId: 1, settingsMenuIsVisible: true }] },
                    {
                        type: TYPES.HIDE_SETTINGS_MENU,
                        payload: { windowId: 1 }
                    }
                )
            ).toEqual( uiStateHide );
        } );
    } );
    describe( 'UI_REMOVE_WINDOW', () => {
        it( 'should handle remove window from ui store', () => {
            expect(
                ui(
                    { windows: [{ windowId: 1, settingsMenuIsVisible: false }] },
                    {
                        type: TYPES.UI_REMOVE_WINDOW,
                        payload: { windowId: 1 }
                    }
                )
            ).toEqual( uiInitialState );
        } );
    } );
    describe( 'SELECT_ADDRESS_BAR', () => {
        it( 'should handle setting address bar focus', () => {
            expect(
                ui(
                    {},
                    {
                        type: TYPES.SELECT_ADDRESS_BAR
                    }
                )
            ).toEqual( { addressBarIsSelected: true } );
        } );
    } );

    describe( 'BLUR_ADDRESS_BAR', () => {
        it( 'should handle blurring address bar focus', () => {
            expect(
                ui(
                    {},
                    {
                        type: TYPES.BLUR_ADDRESS_BAR
                    }
                )
            ).toEqual( { addressBarIsSelected: false } );
        } );
    } );
} );
