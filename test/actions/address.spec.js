import * as actions from 'actions/address_actions';

describe( 'address actions', () =>
{
    it( 'should have types', () =>
    {
        expect( actions.TYPES ).toBeDefined();
    } );

    it( 'should create an action to update the address', () =>
    {
        const payload = { url: 'hi' };
        const expectedAction = {
            type : actions.TYPES.UPDATE_ADDRESS,
            payload
        };
        expect( actions.updateAddress( payload ) ).toEqual( expectedAction );
    } );

} );
