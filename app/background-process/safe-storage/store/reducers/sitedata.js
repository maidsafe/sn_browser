import { List, Map, fromJS } from 'immutable';
import { GET_SITE_DATA, SET_SITE_DATA } from '../actions/sitedata';

const initialState = List([
    // favicon : `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACkklEQVQ4T22SXUiTURjH/+ds2jTNPiTbXC1jbtAYaAh97cKBYlpWk+gDFhQUeOFFYBdCXqwQirqT6KKiDzTqIjIZpKG4YQsligLN3FzYcCWDPtaG7vuceN+Xzb3mA+fiff7P//c8530OwRoRtOn7QIhdJnHerx3wn11dTvITC7ZqJzjXcgIHAW4DRCvpPMiBDsLhACHB7QNzrVlfDhA4pl8E5yegUHpUpjokpt+tNRw4YxYQ8lw36FcLBSIg0FrtpDTVw1AwGdfXQFVvg6axDZSlETxT+x+IIrWPsYJunXOulbjqoawq1U9wQuuESra5ArsejstMIccFxD6+keUIZ+/no/795OsRwwAl5BEHfylUFN8bx8jbn7C3mURDdCmJ7z8iWNd5UA4AOc44PycAOMDDANkoVBTddSOFIiSTaeh15aKp/eoLdPlugkX+5EEkD/EfFgArEXE8gbl2D8KRGMo3rc8JoesnodKOoaRmGQs3NMj8VYga8a0ChOpPwXL5mrS8TBhsRpODhMdL8XtIHDQXxNsiv0KivBLmx2MSIBUCm63CvKMSLE6h2pkQT9i9QVClK3xprnZSsH4OxbMs1vjKm+vgbTGiUJ1EiSmGxGIhlj4XSaMjc5qB2sU1VqgMLgJYsq6yB26o1eI7gddWCx5flo0tTgd4QnGfVXxIM01GF2XozlB4xNV13cFgQR/OmzqRmv6ED8O9mDhQho7eBRGkYLAwip7dr70SQIipRmOUAIdA4AnvbcJT6zfEUnFQutL80q2A0NrCgWHziLdUukpeTDUYXcJncpvu/uyVo/0NO2zYWqxBdNKVDnRftIMo2wXdPOq1Zm0ygJAU/skWpWGIgzTI1gU++ivta7a6kc7P/wNyZ/k5PvUO0QAAAABJRU5ErkJggg==`
    Map( {
	    id: 'https:duckduckgo.com',
	    data : Map( {
	    })
    })
]) ;

export default function sitedata(state = initialState, action) {
  switch (action.type) {
    case SET_SITE_DATA :
    {
    	let payload = fromJS(  action.payload );

    	let index = state.findIndex( site => {

    	    return site.get('id') === payload.get( 'id' );
            
    	    // return site.get('id') === payload.get( 'id' );
    	});

    	if( index > -1 )
    	{
    	    let siteToMerge = state.get( index );
    	    let updatedSite = siteToMerge.mergeDeep( payload );

            //only return after firing save TODO: whack this in a thunk
    	    return state.set( index, updatedSite );
    	    // return state.set( index, updatedSite );
    	}
        // state.push( payload );
        
        

	// return state;
	return state.push( payload );
    }
      return
    default:
      return state
  }
}
