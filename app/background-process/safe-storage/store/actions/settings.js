export const SET_SETTING = 'SET_SETTING'; //to store // only on success of to network
export const SAVE_SETTING = 'SAVE_SETTING'; //to network
import { saveStore } from '../safe-store';



// So if we only SAVE from here. And update. The only get would be on start?
// And we invalidate if anything fails. Therefore it should be in sync.
export function setSetting( key, value ) {

  return {
    type: SET_SETTING,
    key: key,
    value: value
  };
}


export function saveSetting( key, value ) {

    return ( dispatch, getState ) => {
        
        dispatch( setSetting( key, value  ) );
        saveStore().then( successBool => 
        {
            if ( successBool )
            {
                dispatch( setSetting() );
            }
            else {
                // should dispatch an error message. "Cannot save etc." pass through error codes...
            }
        }) //as above pass to error message lark.
        .catch( err => console.log( 'errror in action of saving', err ) )
      
    };
}
