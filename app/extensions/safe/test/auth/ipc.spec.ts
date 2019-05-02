import { onSharedMDataDecision } from '../../ffi/ipc';

// Some mocks to negate FFI and native libs we dont care about
jest.mock( 'extensions/safe/ffi/refs/types', () => ( {} ) );
jest.mock( 'extensions/safe/ffi/refs/constructors', () => ( {} ) );
jest.mock( 'extensions/safe/ffi/refs/parsers', () => ( {} ) );

jest.mock( 'ref-array', () => jest.fn() );
//
jest.mock( 'ffi', () => jest.fn() );

jest.mock( '@maidsafe/safe-node-app', () => jest.fn() );

jest.mock( 'i18n', () => {
    const fakei18nMessage = 'hello Fake message';
    return {
        __: () => fakei18nMessage
    };
} );

jest.mock( 'extensions/safe/ffi/authenticator', () => ( {
    encodeMDataResp: jest.fn( ( data, isAllowed ) => {
        if ( isAllowed ) {
            return Promise.resolve( 'Resolving encodeMDataResp via mock' );
        }
        if ( !isAllowed ) {
            // eslint-disable-next-line prefer-promise-reject-errors
            return Promise.reject( 'Rejecting encodeMDataResp via mock' );
        }
    } )
} ) );

describe( 'shared MD auth decision', () => {
    test( 'exists', () => {
        expect.assertions( 1 );
        expect( onSharedMDataDecision ).not.toBeUndefined();
    } );

    test( 'throws error on no data', async () => {
        expect.assertions( 2 );
        try {
            await onSharedMDataDecision( '_', '_' );
        } catch ( error ) {
            expect( error ).toEqual( new Error( 'hello Fake message' ) );
            expect( error.message ).not.toBeUndefined();
        }
    } );
    test( 'on success calls queue.next()', async () => {
        expect.assertions( 2 );
        const authCallBack = {};
        const queue = {
            req: {},
            next: jest.fn()
        };

        await onSharedMDataDecision( {}, true, queue, authCallBack );
        expect( queue.req.res ).toMatch( 'Resolving encodeMDataResp' );
        expect( await queue.next ).toHaveBeenCalled();
    } );

    test( 'if callback exists on success calls and cleans up the callback', async () => {
        expect.assertions( 5 );
        const request = {
            id: 'sample ID'
        };
        const queue = {
            req: request,
            next: jest.fn()
        };
        const key = queue.req.id;

        const authCallback = jest.fn( () => Promise.resolve() );

        const authCallBacks = {};

        authCallBacks[key] = {
            resolve: authCallback
        };

        expect( authCallBacks[key] ).not.toBeUndefined();
        await onSharedMDataDecision( {}, true, queue, authCallBacks );
        expect( queue.req.res ).toMatch( 'Resolving encodeMDataResp' );
        expect( authCallBacks[key] ).toBeUndefined();
        expect( authCallback ).toHaveBeenCalled();
        expect( queue.next ).toHaveBeenCalled();
    } );

    test( 'on success calls opens external URI', async () => {
        expect.assertions( 3 );

        const queue = {
            req: {},
            next: jest.fn(),
            openExternal: jest.fn()
        };
        const authCallBack = {};

        await onSharedMDataDecision( {}, true, queue, authCallBack );
        expect( queue.req.res ).toMatch( 'Resolving encodeMDataResp' );
        expect( queue.openExternal ).toHaveBeenCalled();
        expect( queue.next ).toHaveBeenCalled();
    } );

    test( 'on Failure check if queue.next is called', async () => {
        expect.assertions( 3 );
        const authCallBack = {};
        const queue = {
            req: {},
            next: jest.fn()
        };
        await onSharedMDataDecision( {}, false, queue, authCallBack );

        expect( await queue.next ).toHaveBeenCalled();
        expect( queue.req.error ).not.toBeUndefined();
        expect( queue.req.error ).toMatch( 'Rejecting encodeMDataResp' );
    } );

    test( 'if callback exists on failure calls and cleans up the callback', async () => {
        expect.assertions( 4 );
        const request = {
            id: 'sampleRequest'
        };
        const queue = {
            req: request,
            next: jest.fn()
        };
        const key = queue.req.id;
        const authCallback = jest.fn( () => Promise.reject() );

        const authCallBacks = {};

        authCallBacks[key] = {
            reject: authCallback
        };

        expect( authCallBacks[key] ).not.toBeUndefined();
        await onSharedMDataDecision( {}, false, queue, authCallBacks );
        expect( await authCallback ).toHaveBeenCalled();
        expect( await queue.next ).toHaveBeenCalled();
        expect( authCallBacks[key] ).toBeUndefined();
    } );
} );
