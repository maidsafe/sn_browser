import * as remoteCall from '$Actions/remoteCall_actions';

describe( 'remote call actions', () => {
    const payload = { id: 1, data: [] };
    it( 'should have types', () => {
        expect( remoteCall.TYPES ).toBeDefined();
    } );

    it( 'should add a remote call', () => {
        const expectedAction = {
            type: remoteCall.TYPES.ADD_REMOTE_CALL,
            payload,
        };
        expect( remoteCall.addRemoteCall( payload ) ).toEqual( expectedAction );
    } );

    it( 'should remove a remote call', () => {
        const expectedAction = {
            type: remoteCall.TYPES.REMOVE_REMOTE_CALL,
            payload,
        };
        expect( remoteCall.removeRemoteCall( payload ) ).toEqual( expectedAction );
    } );

    it( 'should update a remote call', () => {
        const expectedAction = {
            type: remoteCall.TYPES.UPDATE_REMOTE_CALL,
            payload,
        };
        expect( remoteCall.updateRemoteCall( payload ) ).toEqual( expectedAction );
    } );
} );
