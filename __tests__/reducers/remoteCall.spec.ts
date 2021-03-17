/* eslint-disable func-names */
import { remoteCalls } from '$Reducers/remoteCalls';
import { TYPES } from '$Actions/remoteCall_actions';
import { initialAppState } from '$Reducers/initialAppState';

describe( 'notification reducer', () => {
    let aCall;
    beforeEach( () => {
        aCall = { id: 'A', args: [] };
    } );

    it( 'should return the initial state', () => {
        expect( remoteCalls( undefined, {} ) ).toEqual( initialAppState.remoteCalls );
    } );

    describe( 'ADD_REMOTE_CALL', () => {
        it( 'should handle adding a remote call', () => {
            expect(
                remoteCalls( [], {
                    type: TYPES.ADD_REMOTE_CALL,
                    payload: aCall,
                } )
            ).toEqual( [aCall] );
        } );
    } );

    describe( 'REMOVE_REMOTE_CALL', () => {
        it( 'should handle removing a remote call', () => {
            expect(
                remoteCalls( [{ id: 'unimportant' }, aCall], {
                    type: TYPES.REMOVE_REMOTE_CALL,
                    payload: aCall,
                } )
            ).toEqual( [{ id: 'unimportant' }] );
        } );
    } );

    describe( 'UPDATE_REMOTE_CALL', () => {
        it( 'should handle updating a call', () => {
            expect(
                remoteCalls( [aCall], {
                    type: TYPES.UPDATE_REMOTE_CALL,
                    payload: {
                        id: 'A',
                        data: ['hi'],
                    },
                } )
            ).toEqual( [
                {
                    ...aCall,
                    data: ['hi'],
                },
            ] );
        } );
    } );
} );
