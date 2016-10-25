
export const GET_SITE_DATA = 'GET_SITE_DATA';
export const SET_SITE_DATA = 'SET_SITE_DATA'; //to store // only on success of to network
export const SAVE_SITE_DATA = 'SAVE_SITE_DATA'; //to network
import { saveStore } from '../safe-store';

// set to store (not network)
export function setSiteData( siteData ) {
  return {
    type: SET_SITE_DATA,
    payload: siteData
  };
}

// save to network and then save to store
export function saveSiteData( siteData) {
    return ( dispatch, getState ) => {
        
        dispatch( setSiteData( siteData ) );
        saveStore().then( successBool => 
        {
            if ( successBool )
            {
                dispatch( setSiteData() );
            }
            else {
                // should dispatch an error message. "Cannot save etc." pass through error codes...
            }
        })
        .catch( err => console.log( 'Problems saving site data', err ) )
      
    };
}