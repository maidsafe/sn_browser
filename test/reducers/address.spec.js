/* eslint-disable func-names */
import address from 'reducers/address';
import { TYPES } from 'actions/address_actions';
import initialState from 'reducers/initialAppState.json';

describe( 'address reducer', () =>
{
    it( 'should return the initial state', () =>
    {
        expect( address( undefined, {} ) ).toEqual( initialState.address );
    } );

    describe( 'ADD_TAB', () =>
    {
        it( 'should handle updating the address bar', () =>
        {
            expect(
                address( '', {
                    type    : TYPES.UPDATE_ADDRESS,
                    payload : 'hellohello'
                } )
            ).toEqual( 'hellohello' );
        } );
    })

})
