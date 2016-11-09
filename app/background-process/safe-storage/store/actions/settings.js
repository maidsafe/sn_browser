export const UPDATE_SETTING = 'UPDATE_SETTING'; //to store // only on success of to network
import { saveStore } from '../safe-store';



// So if we only SAVE from here. And update. The only get would be on start?
// And we invalidate if anything fails. Therefore it should be in sync.
export function updateSetting( key, value ) {

  return {
    type: UPDATE_SETTING,
    key: key,
    value: value
  };
}
