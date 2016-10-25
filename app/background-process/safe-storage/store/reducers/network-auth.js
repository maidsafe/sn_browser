import { List, Map, fromJS } from 'immutable';
import { SET_NETWORK_AUTH } from '../actions/network-auth';

const initialState = Map( {
	    authMessage: 'The browser has not attempted to log in yet.',
        authToken: null
    });

export default function networkAuth( state = initialState, action) {
  switch (action.type) {
    case SET_NETWORK_AUTH :
    {
    	let payload = fromJS(  action.payload );
        return state.mergeDeep( payload );
    }
      return
    default:
      return state
  }
}
