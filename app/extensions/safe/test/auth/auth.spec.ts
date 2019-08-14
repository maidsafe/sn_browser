/* eslint-disable func-names, no-underscore-dangle */
import path from 'path';
import i18n from 'i18n';
import crypto from 'crypto';
import toBeType from 'jest-tobetype';
import ffiLoader from '$Extensions/safe/ffi/lib';
import client from '$Extensions/safe/ffi/authenticator';

import { CONSTANTS as CONST } from '$Extensions/safe/auth-constants';
import * as helper from './helper';

expect.extend( toBeType );

jest.mock( '$Logger' );

let randomCredentials = null;
const encodedAuthUri =
  'safe-auth:bAAAAAAFBMHKYWAAAAAABWAAAAAAAAAAANZSXILTNMFUWI43BM' +
  'ZSS45DFON2C453FMJQXA4BONFSAACYAAAAAAAAAABLWKYSBOBYCAVDFON2A2AAAAAAAAAAAJVQWSZCTMFTG' +
  'KICMORSC4AACAAAAAAAAAAAAUAAAAAAAAAAAL5SG6Y3VNVSW45DTAEAAAAAAAAAAAAIAAAAAOAAAAAAAAAA' +
  'AL5YHKYTMNFRQCAAAAAAAAAAAAAAAAAAB';
/* const encodedUnRegisterAuthUri = 'safe-auth:bAAAAAADKLNT46AQAAAABWAAAAAAAAAAANZSXILT' +
'NMFUWI43BMZSS45DFON2C453FMJQXA4BONFSAC'; */
const encodedContUri =
  'safe-auth:bAAAAAAHQQQ2XQAIAAAABWAAAAAAAAAAANZSXILTNMFUWI43BM' +
  'ZSS45DFON2C453FMJQXA4BONFSAACYAAAAAAAAAABLWKYSBOBYCAVDFON2A2AAAAAAAAAAAJVQWSZCTMFTG' +
  'KICMORSC4AIAAAAAAAAAAADQAAAAAAAAAAC7OB2WE3DJMMAQAAAAAAAAAAABAAAAAAI';

const encodedNonExistentShareMDataReq =
  'safe-auth:bAAAAAAA7BILOYAYAAAACOAAAAAAAAAAANZSXILTNMFUWI43BMZSS4YLQNFPXA3DBPFTXE33VNZSC453FMJRWY2LFNZ2C4OIAC4AAAAAAAAAAAU2BIZCSA53FMIQECUCJEBYGYYLZM5ZG65LOMQGQAAAAAAAAAACNMFUWIU3BMZSSATDUMQXACAAAAAAAAAAATE5AAAAAAAAAAXYWSFBJN6MFV5OY6TCN3SYOIESF3L7TDFYE2IEQC6WHASMCZEUPAEAQAAAAAE';

const authReqWithoutMockBit =
  'safe-auth:bAAAAAAEKDQ7DAAAAAAACOAAAAAAAAAAANZSXILTNMFUWI43BMZSS4YLQNFPXA3DBPFTXE33VNZSC453FMJRWY2LFNZ2C4OIAC4AAAAAAAAAAAU2BIZCSA53FMIQECUCJEBYGYYLZM5ZG65LOMQGQAAAAAAAAAACNMFUWIU3BMZSSATDUMQXACAQAAAAAAAAAAADQAAAAAAAAAAC7OB2WE3DJMMCAAAAAAAAAAAAAAAAAAAIAAAAAEAAAAABQAAAABQAAAAAAAAAAAX3QOVRGY2LDJZQW2ZLTAQAAAAAAAAAAAAAAAAAACAAAAABAAAAAAMAAAAAA';

const sixtyFourBitReq =
  'safe-auth:AAAAAIdLdL0AAAAAJwAAAAAAAABuZXQubWFpZHNhZmUuYXBpX3BsYXlncm91bmQud2ViY2xpZW50LjkAFwAAAAAAAABTQUZFIHdlYiBBUEkgcGxheWdyb3VuZA0AAAAAAAAATWFpZFNhZmUgTHRkLgECAAAAAAAAAAcAAAAAAAAAX3B1YmxpYwQAAAAAAAAAAAAAAAEAAAACAAAAAwAAAAwAAAAAAAAAX3B1YmxpY05hbWVzBAAAAAAAAAAAAAAAAQAAAAIAAAADAAAA';

const decodedReqForRandomClient = ( uri ) =>
    helper.createRandomAccount().then( () => client.decodeRequest( uri ) );

const init = async () => {
    i18n.configure( {
        locales: ['en'],
        directory: path.resolve( __dirname, '../', 'locales' ),
        objectNotation: true
    } );

    i18n.setLocale( 'en' );

    await ffiLoader.load().catch( console.error );
};

describe( 'Authenticator functions', () => {
    beforeAll( async () => {
        init();
    } );

    describe( 'Unregistered client', () => {
    /* xit( 'gets back encoded response', () => (
            new Promise( resolve =>
            {
                client.decodeRequest( encodedUnRegisterAuthUri )
                    .then( res =>
                    {
                        should( res ).be.String();
                        should( res.indexOf( 'safe-' ) ).be.not.equal( -1 );
                        return resolve();
                    } );
            } )
        ) ); */
    } );

    it( 'should return the initial state', () => {
        expect( 1 ).toEqual( 1 );
    } );

    describe( 'create Account', () => {
        it( 'should throw an error when account locator is empty', async () => {
            expect.assertions( 3 );

            try {
                await client.createAccount();
            } catch ( e ) {
                expect( e ).toBeInstanceOf( Error );
                expect( e ).not.toBeUndefined();
                expect( e.message ).toEqual(
                    i18n.__( 'messages.should_not_be_empty', i18n.__( 'Locator' ) )
                );
            }
        } );

        it( 'should throw an error when account secret is empty', async () => {
            expect.assertions( 3 );

            try {
                await client.createAccount( 'test' );
            } catch ( e ) {
                expect( e ).not.toBeUndefined();
                expect( e ).toBeInstanceOf( Error );
                expect( e.message ).toEqual(
                    i18n.__( 'messages.should_not_be_empty', i18n.__( 'Secret' ) )
                );
            }

            await helper.clearAccount();
        } );

        it( 'should throw an error when account locator is not a string', async () => {
            expect.assertions( 3 );

            try {
                await client.createAccount( 1111, 111 );
            } catch ( e ) {
                expect( e ).toBeInstanceOf( Error );
                expect( e ).not.toBeUndefined();
                expect( e.message ).toEqual(
                    i18n.__( 'messages.must_be_string', i18n.__( 'Locator' ) )
                );
            }
            await helper.clearAccount();
        } );

        it( 'should throw an error when account secret is not a string', async () => {
            expect.assertions( 3 );

            try {
                await client.createAccount( 'test', 111 );
            } catch ( e ) {
                expect( e ).toBeInstanceOf( Error );
                expect( e ).not.toBeUndefined();
                expect( e.message ).toEqual(
                    i18n.__( 'messages.must_be_string', i18n.__( 'Secret' ) )
                );
            }

            await helper.clearAccount();
        } );

        it( 'should throw an error when account locator is an empty string', async () => {
            expect.assertions( 3 );

            try {
                await client.createAccount( ' ', 'test' );
            } catch ( e ) {
                expect( e ).toBeInstanceOf( Error );
                expect( e ).not.toBeUndefined();
                expect( e.message ).toEqual(
                    i18n.__( 'messages.should_not_be_empty', i18n.__( 'Locator' ) )
                );
            }

            await helper.clearAccount();
        } );

        it( 'should throw an error when account secret is an empty string', async () => {
            expect.assertions( 3 );

            try {
                await client.createAccount( 'test', ' ' );
            } catch ( e ) {
                expect( e ).toBeInstanceOf( Error );
                expect( e ).not.toBeUndefined();
                expect( e.message ).toEqual(
                    i18n.__( 'messages.should_not_be_empty', i18n.__( 'Secret' ) )
                );
            }

            await helper.clearAccount();
        } );

        it( 'sets authenticator handle when account creation is successful', async () => {
            expect.assertions( 5 );

            randomCredentials = helper.getRandomCredentials();

            await expect(
                client.createAccount(
                    randomCredentials.locator,
                    randomCredentials.secret,
                    randomCredentials.invite
                )
            ).resolves.toBeUndefined();

            expect( client.registeredClientHandle ).not.toBe( '' );
            expect( client.registeredClientHandle ).not.toBeNull();
            expect( client.registeredClientHandle ).not.toBeUndefined();
            expect( client.registeredClientHandle ).toBeInstanceOf( Buffer );

            await helper.clearAccount();
        } );

        it( 'emits network state as connected when account creation is successful', () =>
            new Promise( ( resolve ) => {
                expect.assertions( 3 );
                const nwListener = client.setListener(
                    CONST.LISTENER_TYPES.NW_STATE_CHANGE,
                    async ( err, state ) => {
                        expect( err ).toBeNull();
                        expect( state ).not.toBeUndefined();
                        expect( state ).toEqual( CONST.NETWORK_STATUS.CONNECTED );
                        client.removeListener(
                            CONST.LISTENER_TYPES.NW_STATE_CHANGE,
                            nwListener
                        );

                        await helper.clearAccount();

                        return resolve();
                    }
                );
                helper.createRandomAccount();
            } ) );
    } );

    // Login
    describe( 'Login', () => {
        beforeAll( () =>
            helper.createRandomAccount().then( ( credential ) => {
                randomCredentials = credential;
                return credential;
            } )
        );

        it( 'should throw an error when account locator is empty', async () => {
            expect.assertions( 3 );

            try {
                await client.login();
            } catch ( e ) {
                expect( e ).toBeInstanceOf( Error );
                expect( e ).not.toBeUndefined();
                expect( e.message ).toEqual(
                    i18n.__( 'messages.should_not_be_empty', i18n.__( 'Locator' ) )
                );
            }

            await helper.clearAccount();
        } );

        it( 'should throw an error when account secret is empty', async () => {
            expect.assertions( 3 );

            try {
                await client.login( 'test' );
            } catch ( e ) {
                expect( e ).not.toBeUndefined();
                expect( e ).toBeInstanceOf( Error );
                expect( e.message ).toEqual(
                    i18n.__( 'messages.should_not_be_empty', i18n.__( 'Secret' ) )
                );
            }

            await helper.clearAccount();
        } );

        it( 'should throw an error when account locator is not a string', async () => {
            expect.assertions( 3 );

            try {
                await client.login( 1111, 111 );
            } catch ( e ) {
                expect( e ).toBeInstanceOf( Error );
                expect( e ).not.toBeUndefined();
                expect( e.message ).toEqual(
                    i18n.__( 'messages.must_be_string', i18n.__( 'Locator' ) )
                );
            }

            await helper.clearAccount();
        } );

        it( 'should throw an error when account secret is not a string', async () => {
            expect.assertions( 3 );

            try {
                await client.login( 'test', 111 );
            } catch ( e ) {
                expect( e ).toBeInstanceOf( Error );
                expect( e ).not.toBeUndefined();
                expect( e.message ).toEqual(
                    i18n.__( 'messages.must_be_string', i18n.__( 'Secret' ) )
                );
            }

            await helper.clearAccount();
        } );

        it( 'should throw an error when account locator is an empty string', async () => {
            expect.assertions( 3 );

            try {
                await client.login( ' ', 'test' );
            } catch ( e ) {
                expect( e ).toBeInstanceOf( Error );
                expect( e ).not.toBeUndefined();
                expect( e.message ).toEqual(
                    i18n.__( 'messages.should_not_be_empty', i18n.__( 'Locator' ) )
                );
            }

            await helper.clearAccount();
        } );

        it( 'should throw an error when account secret is an empty string', async () => {
            expect.assertions( 3 );

            try {
                await client.login( 'test', ' ' );
            } catch ( e ) {
                expect( e ).toBeInstanceOf( Error );
                expect( e ).not.toBeUndefined();
                expect( e.message ).toEqual(
                    i18n.__( 'messages.should_not_be_empty', i18n.__( 'Secret' ) )
                );
            }

            await helper.clearAccount();
        } );

        it( 'should set authenticator handle when account login is successful', async () => {
            expect.assertions( 5 );

            await expect(
                client.login( randomCredentials.locator, randomCredentials.secret )
            ).resolves.toBeUndefined();
            expect( client.registeredClientHandle ).not.toBe( '' );
            expect( client.registeredClientHandle ).not.toBeNull();
            expect( client.registeredClientHandle ).not.toBeUndefined();
            expect( client.registeredClientHandle ).toBeInstanceOf( Buffer );

            await helper.clearAccount();
        } );

        it( 'emits network state as connected when account login is successful', () =>
            new Promise( ( resolve ) => {
                expect.assertions( 3 );
                const nwListener = client.setListener(
                    CONST.LISTENER_TYPES.NW_STATE_CHANGE,
                    async ( err, state ) => {
                        expect( err ).toBeNull();
                        expect( state ).not.toBeUndefined();
                        expect( state ).toEqual( CONST.NETWORK_STATUS.CONNECTED );
                        client.removeListener(
                            CONST.LISTENER_TYPES.NW_STATE_CHANGE,
                            nwListener
                        );

                        await helper.clearAccount();

                        return resolve();
                    }
                );
                helper.createRandomAccount();
            } ) );
    } );

    // DECRYPT
    describe( 'Decrypt request', () => {
        it( 'throws an error when encoded URI is empty', async () => {
            await helper.createRandomAccount().catch( console.log );

            await expect( client.decodeRequest() ).rejects.toBeInstanceOf( Error );
            await helper.clearAccount();
        } );

        it( 'throws an error for container request of unknown app', async () => {
            await helper.createRandomAccount().catch( console.log );

            try {
                await client.decodeRequest( encodedContUri );
            } catch ( e ) {
                expect( e ).not.toBeNull();

                // TODO: This should be 'message', 'code' to be consistent.
                expect( e.description ).toBe( 'IPC error: UnknownApp' );
                expect( e.error_code ).toBe( -204 );
                await helper.clearAccount();
            }
        } );

        it( 'throws error when encoded auth request generated in live environment, however decoding for mock routing', async () => {
            try {
                await decodedReqForRandomClient( authReqWithoutMockBit );
            } catch ( e ) {
                expect( e.error_code ).toBe( -208 );
                expect( e.description ).toBe( 'IPC error: IncompatibleMockStatus' );
                await helper.clearAccount();
            }
        } );

        it( 'throws error when decoding share MData request for non-exsistent MData', async () => {
            try {
                await decodedReqForRandomClient( encodedNonExistentShareMDataReq );
            } catch ( e ) {
                expect( e.error_code ).toBe( -103 );
                expect( e.description ).toBe(
                    'Core error: Routing client error -> Requested data not found'
                );
                await helper.clearAccount();
            }
        } );

        it( 'throws error when decoding 64-bit auth request', async () => {
            try {
                await decodedReqForRandomClient( sixtyFourBitReq );
            } catch ( e ) {
                expect( e.error_code ).toBe( -1 );
                expect( e.description ).toBe( 'IPC error: EncodeDecodeError' );
                await helper.clearAccount();
            }
        } );

        it( 'throws an error for invalid URI', async () => {
            await helper.createRandomAccount().catch( console.log );

            try {
                await client.decodeRequest(
                    `safe-auth:${crypto.randomBytes( 32 ).toString( 'base64' )}`
                );
            } catch ( e ) {
                expect( e ).not.toBeNull();
                await helper.clearAccount();
            }
        } );

        it( 'returns a decoded request for encoded Auth request', async () => {
            expect.assertions( 23 );

            await helper.createRandomAccount().catch( console.log );
            const response = await client.decodeRequest( encodedAuthUri );

            expect( response ).toBeDefined();
            expect( response.reqId ).toBeDefined();
            expect( response.reqId ).toBeType( 'number' );

            expect( response.authReq ).toBeType( 'object' );
            expect( response.authReq ).toHaveProperty( 'app' );
            expect( response.authReq ).toHaveProperty( 'app_container' );
            expect( response.authReq ).toHaveProperty( 'containers' );
            expect( response.authReq ).toHaveProperty( 'containers_len' );
            expect( response.authReq ).toHaveProperty( 'containers_cap' );

            expect( response.authReq.app_container ).toBeDefined();
            expect( response.authReq.app_container ).toBeType( 'boolean' );

            expect( response.authReq.containers ).toBeDefined();
            expect( response.authReq.containers ).toBeType( 'array' );

            expect( response.authReq.containers_len ).toBeDefined();
            expect( response.authReq.containers_len ).toBeType( 'number' );

            expect( response.authReq.containers_cap ).toBeDefined();
            expect( response.authReq.containers_cap ).toBeType( 'number' );

            const container0 = response.authReq.containers[0];

            expect( container0 ).toBeDefined();
            expect( container0 ).toBeType( 'object' );
            expect( container0 ).toHaveProperty( 'cont_name' );
            expect( container0 ).toHaveProperty( 'access' );
            expect( container0.cont_name ).toBeType( 'string' );
            expect( container0.access ).toBeType( 'object' );

            // lifecycle async not valid in jest yet.
            // https://github.com/facebook/jest/pull/5673
            await helper.clearAccount();
        } );

        it( 'returns a decoded request for encoded Auth request, with app Object', async () => {
            expect.assertions( 16 );
            await helper.createRandomAccount().catch( console.log );
            const response = await client.decodeRequest( encodedAuthUri );

            expect( response.authReq.app ).toBeType( 'object' );
            expect( response.authReq.app ).toHaveProperty( 'scope' );

            expect( response.authReq.app ).toHaveProperty( 'id' );
            expect( response.authReq.app.id ).toBeDefined();
            expect( response.authReq.app.id ).toBeType( 'string' );
            expect( response.authReq.app.id.length ).toBeGreaterThan( 0 );

            expect( response.authReq.app ).toHaveProperty( 'name' );
            expect( response.authReq.app.name ).toBeDefined();
            expect( response.authReq.app.name ).toBeType( 'string' );
            expect( response.authReq.app.name.length ).toBeGreaterThan( 0 );

            expect( response.authReq.app ).toHaveProperty( 'vendor' );
            expect( response.authReq.app.vendor ).toBeDefined();
            expect( response.authReq.app.vendor ).toBeType( 'string' );
            expect( response.authReq.app.vendor.length ).toBeGreaterThan( 0 );

            expect( response.authReq.app_container ).toBeDefined();
            expect( response.authReq.app_container ).toBeType( 'boolean' );

            // lifecycle async not valid in jest yet.
            // https://github.com/facebook/jest/pull/5673
            await helper.clearAccount();
        } );

        it( 'returns a decoded request for encoded Auth request without safe-auth: scheme', async () => {
            await helper.createRandomAccount().catch( console.log );

            const response = await client.decodeRequest(
                encodedAuthUri.replace( 'safe-auth:', '' )
            );
            expect( response ).not.toBeNull();
            expect( response ).toBeDefined();
            expect( response ).toBeType( 'object' );

            // lifecycle async not valid in jest yet.
            // https://github.com/facebook/jest/pull/5673
            await helper.clearAccount();
        } );

        it( 'returns a decoded request for encoded Container request', async () => {
            expect.assertions( 33 );
            await helper.createRandomAccount().catch( console.log );
            const response = await client.decodeRequest( encodedAuthUri );
            await client.encodeAuthResp( response, true );
            const containerResponse = await client.decodeRequest( encodedContUri );

            expect( containerResponse ).toBeDefined();
            expect( containerResponse.reqId ).toBeDefined();
            expect( containerResponse.reqId ).toBeType( 'number' );

            expect( containerResponse.contReq.app ).toHaveProperty( 'scope' );

            expect( containerResponse.contReq.app ).toHaveProperty( 'id' );
            expect( containerResponse.contReq.app.id ).toBeDefined();
            expect( containerResponse.contReq.app.id ).toBeType( 'string' );
            expect( containerResponse.contReq.app.id.length ).toBeGreaterThan( 0 );

            expect( containerResponse.contReq.app ).toHaveProperty( 'name' );
            expect( containerResponse.contReq.app.name ).toBeDefined();
            expect( containerResponse.contReq.app.name ).toBeType( 'string' );
            expect( containerResponse.contReq.app.name.length ).toBeGreaterThan( 0 );

            expect( containerResponse.contReq.app ).toHaveProperty( 'vendor' );
            expect( containerResponse.contReq.app.vendor ).toBeDefined();
            expect( containerResponse.contReq.app.vendor ).toBeType( 'string' );
            expect( containerResponse.contReq.app.vendor.length ).toBeGreaterThan( 0 );

            expect( containerResponse.contReq ).toBeType( 'object' );
            expect( containerResponse.contReq ).toHaveProperty( 'app' );
            expect( containerResponse.contReq ).toHaveProperty( 'containers' );
            expect( containerResponse.contReq ).toHaveProperty( 'containers_len' );
            expect( containerResponse.contReq ).toHaveProperty( 'containers_cap' );

            expect( containerResponse.contReq.containers ).toBeDefined();
            expect( containerResponse.contReq.containers ).toBeType( 'array' );

            expect( containerResponse.contReq.containers_len ).toBeDefined();
            expect( containerResponse.contReq.containers_len ).toBeType( 'number' );

            expect( containerResponse.contReq.containers_cap ).toBeDefined();
            expect( containerResponse.contReq.containers_cap ).toBeType( 'number' );

            const container0 = containerResponse.contReq.containers[0];

            expect( container0 ).toBeDefined();
            expect( container0 ).toBeType( 'object' );
            expect( container0 ).toHaveProperty( 'cont_name' );
            expect( container0 ).toHaveProperty( 'access' );
            expect( container0.cont_name ).toBeType( 'string' );
            expect( container0.access ).toBeType( 'object' );

            await helper.clearAccount();
        } );

        it( 'returns a decoded request for encoded Container request without safe-auth: scheme', async () => {
            await helper.createRandomAccount().catch( console.log );
            const req = await client.decodeRequest( encodedAuthUri );
            await client.encodeAuthResp( req, true );
            const response = await client.decodeRequest(
                encodedContUri.replace( 'safe-auth:', '' )
            );

            expect( response ).not.toBeNull();
            expect( response ).toBeDefined();
            expect( response ).toBeType( 'object' );

            await helper.clearAccount();
        } );
    } );

    describe( 'Encode auth response', () => {
        it( 'throws an error if request is undefined', async () => {
            expect.assertions( 2 );
            await decodedReqForRandomClient( encodedAuthUri );

            try {
                await client.encodeAuthResp();
            } catch ( e ) {
                expect( e ).toBeInstanceOf( Error );
                expect( e.message ).toBe( i18n.__( 'messages.invalid_params' ) );
            }

            await helper.clearAccount();
        } );

        it( 'throws an error if decision is not boolean type', async () => {
            expect.assertions( 5 );
            await decodedReqForRandomClient( encodedAuthUri );

            await expect( client.encodeAuthResp( {}, 123 ) ).rejects.toBeInstanceOf(
                Error
            );
            await expect( client.encodeAuthResp( {}, 123 ) ).rejects.toHaveProperty(
                'message',
                i18n.__( 'messages.invalid_params' )
            );
            await expect( client.encodeAuthResp( {}, 'string' ) ).rejects.toHaveProperty(
                'message',
                i18n.__( 'messages.invalid_params' )
            );
            await expect( client.encodeAuthResp( {}, { a: 1 } ) ).rejects.toHaveProperty(
                'message',
                i18n.__( 'messages.invalid_params' )
            );
            await expect( client.encodeAuthResp( {}, [1, 2, 3] ) ).rejects.toHaveProperty(
                'message',
                i18n.__( 'messages.invalid_params' )
            );

            await helper.clearAccount();
        } );

        it( "throws an error if request doesn't have request ID(reqId)", async () => {
            expect.assertions( 2 );
            await decodedReqForRandomClient( encodedAuthUri );

            await expect( client.encodeAuthResp( {}, true ) ).rejects.toBeInstanceOf(
                Error
            );
            await expect( client.encodeAuthResp( {}, true ) ).rejects.toHaveProperty(
                'message',
                i18n.__( 'messages.invalid_req' )
            );

            await helper.clearAccount();
        } );

        it( 'throws an error when invalid request is passed', async () => {
            expect.assertions( 2 );
            const decodedReq = await decodedReqForRandomClient( encodedAuthUri );

            await expect(
                client.encodeAuthResp(
                    Object.assign( {}, decodedReq, { reqId: 123 } ),
                    true
                )
            ).rejects.toBeInstanceOf( Error );
            await expect(
                client.encodeAuthResp(
                    Object.assign( {}, decodedReq, { reqId: 123 } ),
                    true
                )
            ).rejects.toHaveProperty( 'message', i18n.__( 'messages.invalid_req' ) );

            await helper.clearAccount();
        } );

        it( 'returns encoded response URI on deny request', async () => {
            expect.assertions( 2 );
            const decodedReq = await decodedReqForRandomClient( encodedAuthUri );

            const response = await client.encodeAuthResp( decodedReq, false );

            await expect( response ).toBeType( 'string' );
            await expect( response ).toBeDefined();

            await helper.clearAccount();
        } );

        it( 'returns encoded response URI on allow request', async () => {
            expect.assertions( 2 );
            const decodedReq = await decodedReqForRandomClient( encodedAuthUri );

            const response = await client.encodeAuthResp( decodedReq, true );

            await expect( response ).toBeType( 'string' );
            await expect( response ).toBeDefined();

            await helper.clearAccount();
        } );
    } );

    describe( 'Encode container response', () => {
        const getDecodedReq = async () => {
            const req = await decodedReqForRandomClient( encodedAuthUri );
            await client.encodeAuthResp( req, true );
            const decodedReq = await client.decodeRequest( encodedContUri );
            return decodedReq;
        };

        it( 'throws an error if request undefined', async () => {
            expect.assertions( 2 );
            await getDecodedReq();

            await expect( client.encodeContainersResp() ).rejects.toBeInstanceOf( Error );
            await expect( client.encodeContainersResp() ).rejects.toHaveProperty(
                'message',
                i18n.__( 'messages.invalid_params' )
            );

            await helper.clearAccount();
        } );

        it( 'throws an error if decision is not boolean type', async () => {
            expect.assertions( 5 );
            await getDecodedReq();

            await expect( client.encodeContainersResp( {}, 123 ) ).rejects.toBeInstanceOf(
                Error
            );
            await expect( client.encodeContainersResp( {}, 123 ) ).rejects.toHaveProperty(
                'message',
                i18n.__( 'messages.invalid_params' )
            );
            await expect(
                client.encodeContainersResp( {}, 'string' )
            ).rejects.toHaveProperty( 'message', i18n.__( 'messages.invalid_params' ) );
            await expect(
                client.encodeContainersResp( {}, { a: 1 } )
            ).rejects.toHaveProperty( 'message', i18n.__( 'messages.invalid_params' ) );
            await expect(
                client.encodeContainersResp( {}, [1, 2, 3] )
            ).rejects.toHaveProperty( 'message', i18n.__( 'messages.invalid_params' ) );

            await helper.clearAccount();
        } );

        it( "throws an error if request doesn't have request ID(reqId)", async () => {
            expect.assertions( 2 );
            await getDecodedReq();

            await expect(
                client.encodeContainersResp( {}, true )
            ).rejects.toBeInstanceOf( Error );
            await expect(
                client.encodeContainersResp( {}, true )
            ).rejects.toHaveProperty( 'message', i18n.__( 'messages.invalid_req' ) );

            await helper.clearAccount();
        } );

        it( 'throws an error when invalid request is passed', async () => {
            expect.assertions( 2 );
            const decodedReq = await getDecodedReq();

            await expect(
                client.encodeContainersResp(
                    Object.assign( {}, decodedReq, { reqId: 123 } ),
                    true
                )
            ).rejects.toBeInstanceOf( Error );
            await expect(
                client.encodeContainersResp(
                    Object.assign( {}, decodedReq, { reqId: 123 } ),
                    true
                )
            ).rejects.toHaveProperty( 'message', i18n.__( 'messages.invalid_req' ) );

            await helper.clearAccount();
        } );

        it( 'returns encoded response URI on deny request', async () => {
            expect.assertions( 2 );

            // const req = await decodedReqForRandomClient( encodedAuthUri );
            // await client.encodeAuthResp( req, true );
            const decodedReq = await getDecodedReq();

            const response = await client.encodeContainersResp( decodedReq, false );

            await expect( response ).toBeType( 'string' );
            await expect( response ).toBeDefined();

            await helper.clearAccount();
        } );
    } );

    describe( 'Get authorised apps', () => {
        it( 'return empty array before registering any app', async () => {
            await helper.createRandomAccount();

            const apps = await client.getRegisteredApps();

            expect( apps ).toBeType( 'array' );
            expect( apps ).toHaveLength( 0 );

            await helper.clearAccount();
        } );

        it( 'return apps list after registering apps', async () => {
            await helper.createRandomAccount();
            const req = await client.decodeRequest( encodedAuthUri );
            await client.encodeAuthResp( req, true );
            const apps = await client.getRegisteredApps();

            expect( apps ).toBeType( 'array' );
            expect( apps.length ).toBeGreaterThan( 0 );

            await helper.clearAccount();
        } );
    } );

    describe( 'Revoke app', () => {
        let appId = null;
        const setup = async () => {
            const req = await decodedReqForRandomClient( encodedAuthUri );
            appId = req.authReq.app.id;
            await client.encodeAuthResp( req, true );
        };

        it( 'throws an error when appId is undefined', async () => {
            expect.assertions( 1 );
            await setup();
            await expect( client.revokeApp() ).rejects.toHaveProperty(
                'message',
                i18n.__( 'messages.should_not_be_empty', i18n.__( 'AppId' ) )
            );
            helper.clearAccount();
        } );

        it( 'throws an error when appId is not of String type', async () => {
            expect.assertions( 4 );
            await setup();

            await expect( client.revokeApp( 123 ) ).rejects.toHaveProperty(
                'message',
                i18n.__( 'messages.must_be_string', i18n.__( 'AppId' ) )
            );
            await expect( client.revokeApp( true ) ).rejects.toHaveProperty(
                'message',
                i18n.__( 'messages.must_be_string', i18n.__( 'AppId' ) )
            );
            await expect( client.revokeApp( { a: 1 } ) ).rejects.toHaveProperty(
                'message',
                i18n.__( 'messages.must_be_string', i18n.__( 'AppId' ) )
            );
            await expect( client.revokeApp( [1, 2, 3] ) ).rejects.toHaveProperty(
                'message',
                i18n.__( 'messages.must_be_string', i18n.__( 'AppId' ) )
            );
            await helper.clearAccount();
        } );

        it( 'throws an error when appId is empty string', async () => {
            expect.assertions( 1 );

            await setup();
            await expect( client.revokeApp( ' ' ) ).rejects.toHaveProperty(
                'message',
                i18n.__( 'messages.should_not_be_empty', i18n.__( 'AppId' ) )
            );

            await helper.clearAccount();
        } );

        it( 'removes app from registered app list', async () => {
            await setup();
            await client.revokeApp( appId );
            const apps = await client.getRegisteredApps();
            expect( apps ).toBeType( 'array' );
            expect( apps ).toHaveLength( 0 );

            await helper.clearAccount();
        } );
    } );

    describe( 'After revoking', () => {
        it( 'The same app can be registered again', async () => {
            const initReq = await decodedReqForRandomClient( encodedAuthUri );
            const appId = initReq.authReq.app.id;
            await client.encodeAuthResp( initReq, true );
            await client.revokeApp( appId );

            const req = await client.decodeRequest( encodedAuthUri );
            await client.encodeAuthResp( req, true );
            const apps = await client.getRegisteredApps();

            expect( apps ).toBeDefined();
            expect( apps ).toHaveLength( 1 );

            helper.clearAccount();
        } );
    } );

    describe( 'Re-authorising', () => {
        it( "doesn't throw error", async () => {
            const req = await decodedReqForRandomClient( encodedAuthUri );
            await client.encodeAuthResp( req, true );

            const ourReq = await client.decodeRequest( encodedAuthUri );
            const response = await client.encodeAuthResp( ourReq, true );
            expect( response ).toBeType( 'string' );

            helper.clearAccount();
        } );
    } );

    describe( 'account information', () => {
        it( 'are retrievable', async () => {
            const req = await decodedReqForRandomClient( encodedAuthUri );
            await client.encodeAuthResp( req, true );

            const account = await client.getAccountInfo();

            expect( account ).toBeType( 'object' );
            expect( account ).toHaveProperty( 'done' );
            expect( account ).toHaveProperty( 'available' );
            expect( account.done ).toBeDefined();
            expect( account.done ).toBeType( 'number' );
            expect( account.available ).toBeType( 'number' );
            expect( account.available ).toBeDefined();

            await helper.clearAccount();
        } );
    } );
} );
