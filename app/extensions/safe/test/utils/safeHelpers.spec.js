import { urlIsAllowedBySafe,
    generateBoundaryStr,
    generateResponseStr,
    rangeStringToArray
} from 'extensions/safe/utils/safeHelpers';

describe( 'Safe Extension', () =>
{
    describe( 'URL is allowed', () =>
    {
        test( 'it exists', () =>
        {
            expect( urlIsAllowedBySafe ).not.toBeNull();
        } );

        test( 'it does not allow non-local urls', () =>
        {
            const goog = 'http://google.com';
            const googs = 'https://google.com';
            const lala = 'lala://google.com';
            const ws = 'ws://google.com';
            const wsLegal = 'ws://127.0.0.1';

            // actul devctools url
            const devtools = 'chrome-devtools://devtools/bundled/inspector.html?remoteBase=https://chrome-devtools-frontend.appspot.com/serve_file/@691bdb490962d4e6ae7f25c6ab1fdd0faaf19cd0/&can_dock=&toolbarColor=rgba(223,223,223,1)&textColor=rgba(0,0,0,1)&experiments=true';
            const localhost = 'http://localhost/';
            const home = 'http://127.0.0.1/';
            const homeBad = 'http://127.0.0.1.com/';

            expect( urlIsAllowedBySafe( goog ) ).toBeFalsy();
            expect( urlIsAllowedBySafe( googs ) ).toBeFalsy();
            expect( urlIsAllowedBySafe( lala ) ).toBeFalsy();
            expect( urlIsAllowedBySafe( ws ) ).toBeFalsy();
            expect( urlIsAllowedBySafe( homeBad ) ).toBeFalsy();

            expect( urlIsAllowedBySafe( wsLegal ) ).toBeTruthy();
            expect( urlIsAllowedBySafe( devtools ) ).toBeTruthy();
            expect( urlIsAllowedBySafe( localhost ) ).toBeTruthy();
            expect( urlIsAllowedBySafe( home ) ).toBeTruthy();
        } );
    } );

    describe( 'Generate boundary string for multirange server response header', () =>
    {
        test( 'it exists', () =>
        {
            expect( generateBoundaryStr ).not.toBeNull();
        } );

        test( 'it generates 13 character string', () =>
        {
            const testValue = generateBoundaryStr();
            expect( testValue.length ).toBe( 13 );
            expect( typeof testValue ).toBe( 'string' );
        } );
    } );

    describe( 'Generate response string for multirange server response', () =>
    {
        test( 'it exists', () =>
        {
            expect( generateResponseStr ).not.toBeNull();
        } );

        test( 'returns response string', () =>
        {
            const fileData = Buffer.from( 'Lorem ipsum dolor sit amet, consectetur adipiscing elit' );
            const parts =
            [
                {
                    body    : fileData.slice( 3, 9 ),
                    headers : {
                        'Content-Type'  : 'text/plain',
                        'Content-Range' : `bytes 3-8/${ fileData.length }`
                    }
                },
                {
                    body    : fileData.slice( 11, 14 ),
                    headers : {
                        'Content-Type'  : 'text/plain',
                        'Content-Range' : `bytes 11-13/${ fileData.length }`
                    }
                },
                {
                    body    : fileData.slice( 17, 19 ),
                    headers : {
                        'Content-Type'  : 'text/plain',
                        'Content-Range' : `bytes 17-18/${ fileData.length }`
                    }
                }
            ];
            const data =
            {
                headers :
              {
                  'Content-Type'   : 'multipart/byteranges',
                  'Content-Length' : JSON.stringify( parts ).length
              },
                parts
            };
            const testValue = generateResponseStr( data );
            expect( typeof testValue ).toBe( 'string' );
        } );
    } );

    describe( 'Parse range request string as array of range objects', () =>
    {
        test( 'it exists', () =>
        {
            expect( rangeStringToArray ).not.toBeNull();
        } );

        test( 'returns array of range objects', () =>
        {
            const rangeString = 'bytes=4-6,14-20,40-53';
            const testValue = rangeStringToArray( rangeString );
            const expectedValue =
            [
                { start: 4, end: 6 },
                { start: 14, end: 20 },
                { start: 40, end: 53 }
            ];
            expect( testValue ).toEqual( expectedValue );
        } );
    } );
} );
