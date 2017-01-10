import { app, ipcMain } from 'electron'
import url from 'url'
import rpc from 'pauls-electron-rpc'
import manifest from '../api-manifests/sitedata'
import log from '../../log'

import store from './store'
import { createActions } from 'redux-actions'
import { List, Map, fromJS } from 'immutable'




const UPDATE_SITE_DATA = 'UPDATE_SITE_DATA'

export const { updateSiteData } = createActions( UPDATE_SITE_DATA )

const initialState = List([
    Map( {
        id: 'https:duckduckgo.com',
        data : Map( {
            favicon : `data:image/pngbase64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACkklEQVQ4T22SXUiTURjH/+ds2jTNPiTbXC1jbtAYaAh97cKBYlpWk+gDFhQUeOFFYBdCXqwQirqT6KKiDzTqIjIZpKG4YQsligLN3FzYcCWDPtaG7vuceN+Xzb3mA+fiff7P//c8530OwRoRtOn7QIhdJnHerx3wn11dTvITC7ZqJzjXcgIHAW4DRCvpPMiBDsLhACHB7QNzrVlfDhA4pl8E5yegUHpUpjokpt+tNRw4YxYQ8lw36FcLBSIg0FrtpDTVw1AwGdfXQFVvg6axDZSlETxT+x+IIrWPsYJunXOulbjqoawq1U9wQuuESra5ArsejstMIccFxD6+keUIZ+/no/795OsRwwAl5BEHfylUFN8bx8jbn7C3mURDdCmJ7z8iWNd5UA4AOc44PycAOMDDANkoVBTddSOFIiSTaeh15aKp/eoLdPlugkX+5EEkD/EfFgArEXE8gbl2D8KRGMo3rc8JoesnodKOoaRmGQs3NMj8VYga8a0ChOpPwXL5mrS8TBhsRpODhMdL8XtIHDQXxNsiv0KivBLmx2MSIBUCm63CvKMSLE6h2pkQT9i9QVClK3xprnZSsH4OxbMs1vjKm+vgbTGiUJ1EiSmGxGIhlj4XSaMjc5qB2sU1VqgMLgJYsq6yB26o1eI7gddWCx5flo0tTgd4QnGfVXxIM01GF2XozlB4xNV13cFgQR/OmzqRmv6ED8O9mDhQho7eBRGkYLAwip7dr70SQIipRmOUAIdA4AnvbcJT6zfEUnFQutL80q2A0NrCgWHziLdUukpeTDUYXcJncpvu/uyVo/0NO2zYWqxBdNKVDnRftIMo2wXdPOq1Zm0ygJAU/skWpWGIgzTI1gU++ivta7a6kc7P/wNyZ/k5PvUO0QAAAABJRU5ErkJggg==`
        })
    })
]) 





export default function sitedata(state = initialState, action) 
{
    let payload = fromJS(  action.payload )
    
    switch (action.type) {
        case UPDATE_SITE_DATA :
        {            
            let index = state.findIndex( site => {
                
                return site.get('id') === payload.get( 'id' )
                
            })
            
            if( index > -1 )
            {
                let siteToMerge = state.get( index )
                let updatedSite = siteToMerge.mergeDeep( payload )
                
                return state.set( index, updatedSite )
            }
            
            return state.push( payload )
        }
        return
        default:
        return state
    }
}











export function setup () {    
    // wire up RPC
    rpc.exportAPI('beakerSitedata', manifest, { get, set })
}

export function set (url, key, value)
{
    let origin = extractOrigin(url)    
    let sitedata = { id: origin, data: {} }
    
    sitedata.data[ key ] = value
        
    return new Promise( ( resolve, reject) =>
    {
        return store.dispatch( updateSiteData( sitedata ) )
        
    })
    
    
}

export function get (url, key) {
    var origin = extractOrigin(url)
    let sitedata = { id: origin, key: key }
    
    return new Promise( ( resolve, reject) =>
    {
        let site = store.getState()[ 'sitedata' ].find( site => site.get('id') === origin ) 
        
        if( site )
        {
            let datum = site.get( 'data' ).get( key )
            resolve( datum )
        }
        else {
            resolve( undefined )
        }
        
        
    })
}

function extractOrigin (originURL) {
    var urlp = url.parse(originURL)
    if (!urlp || !urlp.host || !urlp.protocol)
    return
    return (urlp.protocol + urlp.host + (urlp.port || ''))
}

