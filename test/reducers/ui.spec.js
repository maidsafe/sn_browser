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

    describe( 'FOCUS_ADDRESS_BAR', () =>
    {
        it( 'should handle setting address bar focus', () =>
        {
            expect(
                ui( {}, {
                    type    : TYPES.FOCUS_ADDRESS_BAR
                } )
            ).toEqual( { addressBarIsFocussed: true } );
        } );
    })

    describe( 'BLUR_ADDRESS_BAR', () =>
    {
        it( 'should handle blurring address bar focus', () =>
        {
            expect(
                ui( {}, {
                    type    : TYPES.BLUR_ADDRESS_BAR
                } )
            ).toEqual( { addressBarIsFocussed: false } );
        } );
    })

})
