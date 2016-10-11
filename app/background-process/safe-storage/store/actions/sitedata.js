
export const GET_SITE_DATA = 'GET_SITE_DATA';
export const SET_SITE_DATA = 'SET_SITE_DATA';

export function setSiteData( siteData ) {

    // console.log( "OOOH YEH SETTING SITE DATA", siteData );
  return {
    type: SET_SITE_DATA,
    payload: siteData
  };
}

// export function getSiteData( siteData ) {
//   return {
//     type: GET_SITE_DATA,
//     payload: siteData
//   };
// }
