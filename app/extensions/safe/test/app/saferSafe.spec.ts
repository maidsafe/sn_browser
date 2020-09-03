import { SaferSafe } from '$App/extensions/safe/webviewProcess/saferSafe';

// jest.mock('sn_nodejs');

describe( 'Filesystem safe SAFE', () => {
    let safe;
    beforeEach( () => {
        safe = new SaferSafe();
    } );

    test( 'a SAFE object has needed methods', async () => {
        expect( typeof safe.files_container_create ).toBe( 'function' );
        expect( typeof safe.files_container_add ).toBe( 'function' );
        expect( typeof safe.files_container_sync ).toBe( 'function' );

        // not strictly needed, but lets check it exists on our new class
        expect( typeof safe.files_container_add_from_raw ).toBe( 'function' );
    } );

    test( 'attempting to use location fails', async () => {
        expect( () => {
            safe.files_container_create( 'some_location', '', true, true, true );
        } ).toThrow( /"location"/ );
        expect( () => {
            safe.files_container_sync( 'some_location', '', true, true, true );
        } ).toThrow( /"location"/ );
        expect( () => {
            safe.files_container_add( 'some_none_safe_location', '', true, true, true );
        } ).toThrow( /"location".+safe:/ );
    } );

    test( 'attempting to use safe container add with a safe: url does not fail', async () => {
    // it will still fail as args not correct and we're not mocking safe here.
        expect( () => {
            safe.files_container_add(
                'safe://some_safe_location',
                '',
                true,
                true,
                true
            );
        } ).not.toThrow( /"location".+safe:/ );
    } );

    test( 'attempting to use safe container create should fail when a string is passed', async () => {
        expect( () => {
            safe.files_container_create( 's', '', true, true, true );
        } ).toThrow( /File object/ );
    } );

    test( 'attempting to use safe container create with locaton object should fail', async () => {
        const x = {};

        expect( () => {
            safe.files_container_create( x, '', true, true, true );
        } ).toThrow( /File object/ );
    } );

    test( 'attempting to use safe container create with File object should throw temp error', async () => {
        const x = new File( [], 'test' );
        expect( () => {
            safe.files_container_create( x, '', true, true, true );
        } ).toThrow( /location" argument cannot be used/ );
    } );
} );
