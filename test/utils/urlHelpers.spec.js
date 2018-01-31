import { makeValidUrl } from 'utils/urlHelpers';

describe.only( 'makeValidUrl', () =>
{
    it( 'should exist', () =>
    {
        expect( makeValidUrl ).not.toBeNull();
    } );

    test( 'should convert a url w/o protocol to safe://', () =>
    {
        expect( makeValidUrl('hiThereTester') ).toBe( 'safe://hiThereTester');
        expect( makeValidUrl('hello.world') ).toBe( 'safe://hello.world');
        expect( makeValidUrl('hello.world/lalalala') ).toBe( 'safe://hello.world/lalalala');
    } );

    test.only( 'should convert localhost http://localhost:port', () =>
    {
        expect( makeValidUrl('localhost:3003') ).toBe( 'http://localhost:3003/');

    } );

    it( 'should NOT convert a url with a valid protocol to safe://', () =>
    {
        expect( makeValidUrl('safe-auth://hello') ).toBe( 'safe-auth://hello');
    } );

    it( 'should NOT convert a url with a protocol to safe://', () =>
    {
        expect( makeValidUrl('http://hello') ).toBe( 'http://hello');
        expect( makeValidUrl('file://hello') ).toBe( 'file://hello');
        expect( makeValidUrl('file:hello') ).toBe( 'file:hello');
    } );

    it( 'should strip the final slash', () =>
    {
        expect( makeValidUrl('hello.world/lalalala/') ).toBe( 'safe://hello.world/lalalala');
    } );

    it( 'should strip the index.html', () =>
    {
        expect( makeValidUrl('hello.world/boom/index.html') ).toBe( 'safe://hello.world/boom');
    } );

    test.skip( 'should clean up url spaces etc', () =>
    {
        expect( makeValidUrl('hello world/boom/index.html') ).toBe( 'safe://hello%20world/boom');
    } );
} );
