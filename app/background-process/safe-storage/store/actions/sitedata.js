
export const UPDATE_SITE_DATA = 'UPDATE_SITE_DATA'; //to store // only on success of to network
import { saveStore } from '../safe-store';

// set to store (not network)
export function updateSiteData( siteData ) {
  return {
    type: UPDATE_SITE_DATA,
    payload: siteData
  };
}
