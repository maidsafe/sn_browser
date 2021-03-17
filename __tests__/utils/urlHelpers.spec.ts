import {
    addTrailingSlashIfNeeded,
    makeValidAddressBarUrl,
    urlHasChanged,
} from '$Utils/urlHelpers';

describe( 'makeValidAddressBarUrl', () => {
    it( 'should exist', () => {
        expect( makeValidAddressBarUrl ).not.toBeNull();
    } );

    it( 'should convert a url w/o protocol to safe://', () => {
        expect( makeValidAddressBarUrl( 'hiThereTester' ) ).toBe(
            'safe://hiThereTester'
        );
        expect( makeValidAddressBarUrl( 'hello.world' ) ).toBe( 'safe://hello.world' );
        expect( makeValidAddressBarUrl( 'hello.world/lalalala' ) ).toBe(
            'safe://hello.world/lalalala'
        );
    } );

    it( 'should convert localhost http://localhost:port', () => {
        expect( makeValidAddressBarUrl( 'localhost:3003' ) ).toBe(
            'http://localhost:3003'
        );
    } );

    it( 'should NOT convert a url with a protocol to safe://', () => {
        expect( makeValidAddressBarUrl( 'http://hello' ) ).toBe( 'http://hello' );
        expect( makeValidAddressBarUrl( 'file://hello' ) ).toBe( 'file://hello' );
        expect( makeValidAddressBarUrl( 'file:hello' ) ).toBe( 'file:hello' );
    } );

    it( 'should strip the final slash', () => {
        expect( makeValidAddressBarUrl( 'hello.world/lalalala/' ) ).toBe(
            'safe://hello.world/lalalala'
        );
    } );

    it( 'should not strip the query params', () => {
        expect( makeValidAddressBarUrl( 'hello.world/lalalala?v=2' ) ).toBe(
            'safe://hello.world/lalalala?v=2'
        );
        expect( makeValidAddressBarUrl( 'hello.world/?v=2' ) ).toBe(
            'safe://hello.world/?v=2'
        );
        expect( makeValidAddressBarUrl( 'hello.world?v=2' ) ).toBe(
            'safe://hello.world?v=2'
        );
        expect( makeValidAddressBarUrl( 'hello.world/index.md?v=2' ) ).toBe(
            'safe://hello.world/index.md?v=2'
        );
    } );

    it( 'should not strip the index.html', () => {
        expect( makeValidAddressBarUrl( 'hello.world/boom/index.html' ) ).toBe(
            'safe://hello.world/boom/index.html'
        );
    } );

    /* test.skip( 'should clean up url spaces etc', () =>
    {
        expect( makeValidAddressBarUrl( 'hello world/boom/index.html' ) ).toBe( 'safe://hello%20world/boom/index.html' );
    } ); */
} );

describe( 'addTrailingSlashIfNeeded', () => {
    it( 'should add trailing slash to a basic url path', () => {
        expect( addTrailingSlashIfNeeded( 'safe://hello.world/boom' ) ).toBe(
            'safe://hello.world/boom/'
        );
    } );

    it( 'should not add trailing slash to a basic url path that ends in a slash', () => {
        expect( addTrailingSlashIfNeeded( 'safe://hello.world/boom/' ) ).not.toBe(
            'safe://hello.world/boom//'
        );
    } );

    it( 'should not add trailing slash to a url path for a file', () => {
        expect( addTrailingSlashIfNeeded( 'safe://hello.world/boom.jpg' ) ).not.toBe(
            'safe://hello.world/boom.jpg/'
        );
        expect( addTrailingSlashIfNeeded( 'safe://hello.world/boom.jpg' ) ).toBe(
            'safe://hello.world/boom.jpg'
        );
        expect(
            addTrailingSlashIfNeeded( 'safe://hello.world/boom/another.jpg' )
        ).toBe( 'safe://hello.world/boom/another.jpg' );
    } );

    it( 'should not add trailing slash to a url with a hash', () => {
        expect( addTrailingSlashIfNeeded( 'safe://hello.world/boom#/yes' ) ).not.toBe(
            'safe://hello.world/boom#yes/'
        );
        expect( addTrailingSlashIfNeeded( 'safe://hello.world/boom#yes' ) ).toBe(
            'safe://hello.world/boom#yes'
        );
        expect( addTrailingSlashIfNeeded( 'safe://hello.world/boom/#/yes' ) ).toBe(
            'safe://hello.world/boom/#/yes'
        );
    } );
} );

describe( 'urlHasChanged', () => {
    it( 'should return true for new protocol', () => {
        expect(
            urlHasChanged( 'safe://hello.world/boom', 'safe-auth://hello.world/boom' )
        ).toBeTruthy();
    } );
    it( 'should return true for new host', () => {
        expect(
            urlHasChanged( 'safe://hello.world/boom', 'safe://helloyou.world/boom' )
        ).toBeTruthy();
    } );
    it( 'should return true for new path', () => {
        expect(
            urlHasChanged( 'safe://hello.world/boom', 'safe://helloyou.world/boom/new' )
        ).toBeTruthy();
    } );

    it( 'should return false for the same url', () => {
        expect(
            urlHasChanged( 'safe://hello.world/boom', 'safe://hello.world/boom' )
        ).toBeFalsy();
    } );

    it( 'should return false for the same url with a slash', () => {
        expect(
            urlHasChanged( 'safe://hello.world/boom', 'safe://hello.world/boom/' )
        ).toBeFalsy();
    } );

    it( 'should return false for the same url without a slash', () => {
        expect(
            urlHasChanged( 'safe://hello.world/boom/', 'safe://hello.world/boom' )
        ).toBeFalsy();
    } );

    it( 'should return false for the same url with trailing hash', () => {
        expect(
            urlHasChanged( 'safe://hello.world/boom/', 'safe://hello.world/boom#' )
        ).toBeFalsy();
    } );

    it( 'should return false for the same url with a trailing hash', () => {
        expect(
            urlHasChanged( 'safe://hello.world/boom/', 'safe://hello.world/boom/#' )
        ).toBeFalsy();
    } );

    it( 'should return false for the same url with a trailing slash', () => {
        expect( urlHasChanged( 'safe-auth://home', 'safe-auth://home/' ) ).toBeFalsy();
    } );

    it( 'should return true for the same url with a complex hash', () => {
        expect(
            urlHasChanged(
                'safe://hello.world/boom/',
                'safe://hello.world/boom/#/hereyouare'
            )
        ).toBeTruthy();
    } );

    it( 'should return true for the same url with a hash change', () => {
        expect(
            urlHasChanged(
                'safe://hello.world/boom/#/somewhereElse',
                'safe://hello.world/boom/#/hereyouare'
            )
        ).toBeTruthy();
    } );

    it( 'should return true for a different url with a complex hash', () => {
        expect(
            urlHasChanged(
                'safe://hello.world/boom/',
                'safe://ciao.world/boom/#/hereyouare'
            )
        ).toBeTruthy();
    } );

    it( 'should return false for a same url with a hash and slash', () => {
        expect(
            urlHasChanged(
                'safe://hello.world/hashtest/',
                'safe://hello.world/hashtest/#me'
            )
        ).toBeTruthy();
        expect(
            urlHasChanged(
                'safe://hello.world/hashtest/',
                'safe://hello.world/hashtest/#/me'
            )
        ).toBeTruthy();
        expect(
            urlHasChanged(
                'safe://hello.world/hashtest/#me',
                'safe://hello.world/hashtest/#/me'
            )
        ).toBeFalsy();
    } );
} );
