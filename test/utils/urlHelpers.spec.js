import {
    addTrailingSlashIfNeeded,
    makeValidAddressBarUrl
} from 'utils/urlHelpers';

describe( 'makeValidAddressBarUrl', () =>
{
    it( 'should exist', () =>
    {
        expect( makeValidAddressBarUrl ).not.toBeNull();
    } );

    it( 'should convert a url w/o protocol to safe://', () =>
    {
        expect( makeValidAddressBarUrl( 'hiThereTester' ) ).toBe( 'safe://hiThereTester' );
        expect( makeValidAddressBarUrl( 'hello.world' ) ).toBe( 'safe://hello.world' );
        expect( makeValidAddressBarUrl( 'hello.world/lalalala' ) ).toBe( 'safe://hello.world/lalalala' );
    } );

    it( 'should convert localhost http://localhost:port', () =>
    {
        expect( makeValidAddressBarUrl( 'localhost:3003' ) ).toBe( 'http://localhost:3003' );
    } );

    it( 'should NOT convert a url with a valid protocol to safe://', () =>
    {
        expect( makeValidAddressBarUrl( 'safe-auth://hello' ) ).toBe( 'safe-auth://hello' );
    } );

    it( 'should NOT convert a url with a protocol to safe://', () =>
    {
        expect( makeValidAddressBarUrl( 'http://hello' ) ).toBe( 'http://hello' );
        expect( makeValidAddressBarUrl( 'file://hello' ) ).toBe( 'file://hello' );
        expect( makeValidAddressBarUrl( 'file:hello' ) ).toBe( 'file:hello' );
    } );

    it( 'should strip the final slash', () =>
    {
        expect( makeValidAddressBarUrl( 'hello.world/lalalala/' ) ).toBe( 'safe://hello.world/lalalala' );
    } );

    it( 'should strip the index.html', () =>
    {
        expect( makeValidAddressBarUrl( 'hello.world/boom/index.html' ) ).toBe( 'safe://hello.world/boom' );
    } );

    test.skip( 'should clean up url spaces etc', () =>
    {
        expect( makeValidAddressBarUrl( 'hello world/boom/index.html' ) ).toBe( 'safe://hello%20world/boom' );
    } );
} );


describe( 'addTrailingSlashIfNeeded', () =>
{
    it( 'should add trailing slash to a basic url path', () =>
    {
        expect( addTrailingSlashIfNeeded( 'safe://hello.world/boom' ) ).toBe( 'safe://hello.world/boom/' );
    } );

    it( 'should not add trailing slash to a basic url path that ends in a slash', () =>
    {
        expect( addTrailingSlashIfNeeded( 'safe://hello.world/boom/' ) ).not.toBe( 'safe://hello.world/boom//' );
    } );

    it( 'should not add trailing slash to a url path for a file', () =>
    {
        expect( addTrailingSlashIfNeeded( 'safe://hello.world/boom.jpg' ) ).not.toBe( 'safe://hello.world/boom.jpg/' );
        expect( addTrailingSlashIfNeeded( 'safe://hello.world/boom.jpg' ) ).toBe( 'safe://hello.world/boom.jpg' );
        expect( addTrailingSlashIfNeeded( 'safe://hello.world/boom/another.jpg' ) ).toBe( 'safe://hello.world/boom/another.jpg' );
    } );

    it( 'should not add trailing slash to a url with a hash', () =>
    {
        expect( addTrailingSlashIfNeeded( 'safe://hello.world/boom#/yes' ) ).not.toBe( 'safe://hello.world/boom#yes/' );
        expect( addTrailingSlashIfNeeded( 'safe://hello.world/boom#yes' ) ).toBe( 'safe://hello.world/boom#yes' );
        expect( addTrailingSlashIfNeeded( 'safe://hello.world/boom/#/yes' ) ).toBe( 'safe://hello.world/boom/#/yes' );
    } );
} );
