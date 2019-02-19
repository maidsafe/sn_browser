import * as CONSTANTS from '@Constants';

describe( 'CONSTANTS', async () =>
{
    it( 'should exist', async () =>
    {
        expect( CONSTANTS ).not.toBeNull();
    } );

    it( 'should contain PROTOCOLS', async () =>
    {
        expect( CONSTANTS.PROTOCOLS ).not.toBeNull();
    } );
} );
