import { app, ipcMain } from 'electron'
import url from 'url'
import zerr from 'zerr'
import rpc from 'pauls-electron-rpc'
import manifest from '../../api-manifests/history'

import store from '../store'
import { createAction, createActions } from 'redux-actions'

import ACTION_TYPES from '../actions/action_types';

const BadParam = zerr('BadParam', '% must be a %')
const InvalidCmd = zerr('InvalidCommand', '% is not a valid command')


const initialHistoryState = [
  {
    url: 'https://safenetforum.org/',
    title : "Safenet Forum",
    visits: [],
    last_visit: new Date()

  }
]

export const { updateSite, deleteSite, deleteAll } =
    createActions( ACTION_TYPES.UPDATE_SITE, ACTION_TYPES.DELETE_SITE, ACTION_TYPES.DELETE_ALL );

export default function history(state = initialHistoryState, action) {
  let payload = action.payload;

  if( action.error )
  {
    return state;
  }

  switch (action.type) {
    case ACTION_TYPES.GET_CONFIG:
    {
      if( payload && payload.history )
      {
        const newHistory = payload.history;

        //here we should probably combine the visits
        return _.uniqBy( [ ...state , ...newHistory ], 'url' ) ;

      }
      return state;
    }
    case ACTION_TYPES.UPDATE_SITE :
    {
      let newState = [ ...state ];

      let index = state.findIndex( site => {
          return site.url === payload.url
        })

      if( index > -1 )
      {
        let siteToMerge = state[ index ];
        let updatedSite = { ...siteToMerge, ...payload }
        let lastVisit   = payload.last_visit;

        if( lastVisit && ! updatedSite.visits.includes( lastVisit ) )
        {
          updatedSite.visits.push( lastVisit )
        }

        updatedSite.last_visit = payload.last_visit;

        newState[ index ] = updatedSite;

        return newState;

      }

      payload.visits = [ payload.last_visit ];

      newState.push( payload )
      return newState;
    }
    case ACTION_TYPES.DELETE_SITE:
    {
      let index = state.findIndex( site => site.url === payload.url )

      let newState = [ ...state ];

      newState.splice( index )
      return newState;
    }

    case ACTION_TYPES.DELETE_ALL:
    {
      return []
    }
    default:
      return state
  }


}







export function setup () {
  // wire up RPC
  rpc.exportAPI('beakerHistory', manifest, { addVisit, getVisitHistory, getMostVisited, search, removeVisit, removeAllVisits })
}

export function addVisit ( {url, title } ) {
  // each visit has a timestamp
  return new Promise( (resolve, reject ) =>
    {
        if( url === 'about:blank')
        {
            return;
        }
        let site = { url, title, last_visit: new Date() }
        return store.dispatch( updateSite( site ) )
    })
}

export function getVisitHistory ({ offset, limit }) {

    return new Promise( (resolve, reject ) =>
    {
        let history = store.getState()[ 'history' ]

        let filteredHistory = history.filter( (value, key) =>
        {
            return ( key >= offset && key <= limit  )
        } )

  if( filteredHistory )
  {
    resolve( filteredHistory )
  }
  else {
    resolve( undefined )
  }
})
}

export function getMostVisited ({ offset, limit }) {

  offset  = offset || 0
  limit   = limit || 50

  return getVisitHistory( { offset, limit } )
      .then( unsortedHistory =>
    {
      unsortedHistory.sort(function(a, b) {
      return b.visits.length - a.visits.length //high->low ??
    })

  return unsortedHistory
})
}

export function search (q)
{
  let history = store.getState()[ 'history' ]

  let filteredHistory = history.filter( (value, key) =>
    {
      return ( value.url.includes( q ) || value.title.includes( q ) )
} )

  //sort mby most should be a helper function.
  filteredHistory = filteredHistory.sort(function(a, b) {
    if( !a.visits || !b.visits )
    {
      return 1
    }
    else
    {
      return b.visits.length - a.visits.length //high->low ??
    }
  })

  return new Promise( (resolve, reject ) =>
    {
      resolve( filteredHistory )
    })
}

export function removeVisit (url) {
  return new Promise( (resolve, reject) =>
    {
      let site = { url }

      return store.dispatch( deleteSite( site ) )
    } )
}

export function removeAllVisits () {


  return new Promise( (resolve, reject) =>
    {
      return store.dispatch( deleteAll() )
    } )
}
