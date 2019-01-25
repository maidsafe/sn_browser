import authenticator from '../ffi/authenticator';
import sysUri from '../ffi/sys_uri';
import CONSTANTS from '../auth-constants';

export const setNetworkListener = cb =>
    authenticator.setListener( CONSTANTS.LISTENER_TYPES.NW_STATE_CHANGE, cb );

export const setAppListUpdateListener = cb =>
    authenticator.setListener( CONSTANTS.LISTENER_TYPES.APP_LIST_UPDATE, cb );

export const setIsAuthorisedListener = cb =>
    authenticator.setListener( CONSTANTS.LISTENER_TYPES.IS_AUTHORISED, cb );

export const getNetworkState = () => ( { state: authenticator.networkState } );

export const getAuthenticatorHandle = () => ( authenticator.registeredClientHandle );

export const reconnect = () => authenticator.reconnect();

export const logout = () => authenticator.logout();

export const login = ( secret, password ) => authenticator.login( secret, password );

export const createAccount = ( secret, password, invitation ) =>
    authenticator.createAccount( secret, password, invitation );

export const getAuthorisedApps = () => authenticator.getRegisteredApps();

export const getAccountInfo = () => authenticator.getAccountInfo();

export const authDecision = ( authData, isAllowed ) =>
    authenticator.encodeAuthResp( authData, isAllowed );

export const revokeApp = appId => authenticator.revokeApp( appId );

export const containerDecision = ( contData, isAllowed ) =>
    authenticator.encodeContainersResp( contData, isAllowed );

export const setReAuthoriseState = state => authenticator.setReAuthoriseState( state );

export const getLibStatus = () => ( ( authenticator.getLibStatus() && sysUri.isLibLoaded ) );
