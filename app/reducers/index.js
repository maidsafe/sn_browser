// @flow
import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import address from './address';
import tabs from './tabs';


console.log( 'address'  , address );
const rootReducer = combineReducers( {
    address,
    tabs,
    routing
} );

export default rootReducer;
