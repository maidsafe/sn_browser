/* eslint-disable func-names */
import ui from 'reducers/ui';
import { TYPES } from 'actions/ui_actions';
import initialState from 'reducers/initialAppState';

describe( 'notification reducer', () =>
{
    it( 'should return the initial state', () =>
    {
        expect( ui( undefined, {} ) ).toEqual( initialState.ui );
    } );

    describe( 'SHOW_SETTINGS_MENU', () =>
    {
        it( 'should handle showing the settings menu', () =>
        {
            expect(
                ui(
                    {},
                    {
                        type : TYPES.SHOW_SETTINGS_MENU
                    }
                )
            ).toEqual( { settingsMenuIsVisible: true } );
        } );
    } );

    describe( 'HIDE_SETTINGS_MENU', () =>
    {
        it( 'should handle showing the settings menu', () =>
        {
            expect(
                ui(
                    {},
                    {
                        type : TYPES.HIDE_SETTINGS_MENU
                    }
                )
            ).toEqual( { settingsMenuIsVisible: false } );
        } );
    } );

    describe( 'SELECT_ADDRESS_BAR', () =>
    {
        it( 'should handle setting address bar focus', () =>
        {
            expect(
                ui(
                    {},
                    {
                        type : TYPES.SELECT_ADDRESS_BAR
                    }
                )
            ).toEqual( { addressBarIsSelected: true } );
        } );
    } );

    describe( 'BLUR_ADDRESS_BAR', () =>
    {
        it( 'should handle blurring address bar focus', () =>
        {
            expect(
                ui(
                    {},
                    {
                        type : TYPES.BLUR_ADDRESS_BAR
                    }
                )
            ).toEqual( { addressBarIsSelected: false } );
        } );
    } );
} );
