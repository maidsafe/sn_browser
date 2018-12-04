import onNetworkStateChange from 'extensions/safe/safeBrowserApplication/init/networkStateChange';
import { TYPES as PERUSE_TYPES } from 'extensions/safe/actions/safeBrowserApplication_actions';
import { TYPES } from 'actions/notification_actions';
import { SAFE } from 'extensions/safe/constants';

// jest.mock('extensions/safe/safeBrowserApplication', () =>
// {
//     return {
//         getWebIds : () => []
//     }
// });


describe( 'Network callback', () =>
{
    it( 'network callback dispatches action on Connected', () =>
    {
        const initialState = {
            safeBrowserApp : {
                networkStatus : null
            }
        };
        const mockStore = {
            getState : () => initialState,
            dispatch : ( jest.fn() )
        };
        const networkCb = onNetworkStateChange( mockStore );
        networkCb( 'Connected' );
        const dispatchArg = mockStore.dispatch.mock.calls[0][0];

        expect( mockStore.dispatch.mock.calls.length ).toBe( 1 );
        expect( dispatchArg.type ).toBe( PERUSE_TYPES.SET_NETWORK_STATUS );
        expect( dispatchArg.payload ).toBe( SAFE.NETWORK_STATE.CONNECTED );
    } );

    it( 'network callback dispatches actions on Disconnected', () =>
    {
        const initialState = {
            safeBrowserApp : {
                networkStatus : null
            }
        };
        const mockStore = {
            getState : () => initialState,
            dispatch : ( jest.fn() )
        };
        const networkCb = onNetworkStateChange( mockStore );
        networkCb( 'Disconnected' );
        const dispatchArgOne = mockStore.dispatch.mock.calls[0][0];
        const dispatchArgTwo = mockStore.dispatch.mock.calls[1][0];

        expect( mockStore.dispatch.mock.calls.length ).toBe( 2 );

        expect( dispatchArgOne.type ).toBe( PERUSE_TYPES.SET_NETWORK_STATUS );
        expect( dispatchArgOne.payload ).toBe( SAFE.NETWORK_STATE.DISCONNECTED );

        expect( dispatchArgTwo.type ).toBe( TYPES.ADD_NOTIFICATION );
        expect( dispatchArgTwo.payload.text ).toBe( 'Network state: Disconnected. Reconnecting...' );
    } );

    it( 'network callback invokes operation to begin reconnection attempts upon Disconnect event', () =>
    {
        const initialState = {
            safeBrowserApp : {
                networkStatus : null
            }
        };
        const mockStore = {
            getState : () => initialState,
            dispatch : ( jest.fn() )
        };
        const mockAttemptReconnect = jest.fn();
        const networkCb = onNetworkStateChange( mockStore, mockAttemptReconnect );
        networkCb( 'Disconnected' );
        expect( mockAttemptReconnect.mock.calls.length ).toBe( 1 );
    } );
} );
