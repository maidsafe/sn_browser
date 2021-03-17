// import { onNetworkStateChange } from '$Extensions/safe/safeBrowserApplication/init/networkStateChange';
import { TYPES as PERUSE_TYPES } from '$Extensions/safe/actions/safeBrowserApplication_actions';
import { TYPES } from '$Actions/notification_actions';
import { SAFE } from '$Extensions/safe/constants';

// Some mocks to negate FFI and native libs we dont care about
const onNetworkStateChange = jest.fn();
//

describe( 'Network callback', () => {
    it( 'network callback dispatches action on Connected', () => {
        const initialState = {
            safeBrowserApp: {
                networkStatus: null,
            },
        };
        const mockStore = {
            getState: () => initialState,
            dispatch: jest.fn(),
        };
        const networkCallback = onNetworkStateChange( mockStore );
        networkCallback( 'Connected' );
        const dispatchArgument = mockStore.dispatch.mock.calls[0][0];

        expect( mockStore.dispatch.mock.calls.length ).toBe( 1 );
        expect( dispatchArgument.type ).toBe( PERUSE_TYPES.SET_NETWORK_STATUS );
        expect( dispatchArgument.payload ).toBe( SAFE.NETWORK_STATE.CONNECTED );
    } );

    it( 'network callback dispatches actions on Disconnected', () => {
        const initialState = {
            safeBrowserApp: {
                networkStatus: null,
            },
        };
        const mockStore = {
            getState: () => initialState,
            dispatch: jest.fn(),
        };
        const networkCallback = onNetworkStateChange( mockStore );
        networkCallback( 'Disconnected' );
        const dispatchArgumentOne = mockStore.dispatch.mock.calls[0][0];
        const dispatchArgumentTwo = mockStore.dispatch.mock.calls[1][0];

        expect( mockStore.dispatch.mock.calls.length ).toBe( 2 );

        expect( dispatchArgumentOne.type ).toBe( PERUSE_TYPES.SET_NETWORK_STATUS );
        expect( dispatchArgumentOne.payload ).toBe( SAFE.NETWORK_STATE.DISCONNECTED );

        expect( dispatchArgumentTwo.type ).toBe( TYPES.ADD_NOTIFICATION );
        expect( dispatchArgumentTwo.payload.title ).toBe(
            'Network state: Disconnected'
        );
        expect( dispatchArgumentTwo.payload.body ).toBe( 'Reconnecting...' );
    } );

    it( 'network callback invokes operation to begin reconnection attempts upon Disconnect event', () => {
        const initialState = {
            safeBrowserApp: {
                networkStatus: null,
            },
        };
        const mockStore = {
            getState: () => initialState,
            dispatch: jest.fn(),
        };
        const mockAttemptReconnect = jest.fn();
        const networkCallback = onNetworkStateChange(
            mockStore,
            mockAttemptReconnect
        );
        networkCallback( 'Disconnected' );
        expect( mockAttemptReconnect.mock.calls.length ).toBe( 1 );
    } );
} );
