import {urlIsAllowed} from 'extensions/safe/utils/safeHelpers';

describe( 'Safe Extension', () =>
{

    describe( 'URL is allowed', () =>
    {
        test( 'it exists', () =>
        {
            expect( urlIsAllowed ).not.toBeNull();
        } );

        test( 'it does not allow non-local urls', () =>
        {
            const goog = 'http://google.com';
            const googs = 'https://google.com';
            const lala = 'lala://google.com';
            const ws = 'ws://google.com';
            const wsLegal = 'ws://127.0.0.1';

            const localhost = 'http://localhost/';
            const home = 'http://127.0.0.1/';
            const homeBad = 'http://127.0.0.1.com/';

            expect( urlIsAllowed( goog ) ).toBeFalsy();
            expect( urlIsAllowed( googs ) ).toBeFalsy();
            expect( urlIsAllowed( lala ) ).toBeFalsy();
            expect( urlIsAllowed( ws ) ).toBeFalsy();
            expect( urlIsAllowed( homeBad ) ).toBeFalsy();

            expect( urlIsAllowed( wsLegal ) ).toBeTruthy();
            expect( urlIsAllowed( localhost ) ).toBeTruthy();
            expect( urlIsAllowed( home ) ).toBeTruthy();
        } );
    });
} );
