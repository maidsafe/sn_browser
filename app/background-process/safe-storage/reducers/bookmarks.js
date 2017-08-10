import { app } from 'electron'
import url from 'url'
import rpc from 'pauls-electron-rpc'
import manifest from '../../api-manifests/bookmarks'
import logInRenderer from '../../logInRenderer';

import ACTION_TYPES from '../actions/action_types';


import store from '../store'
import { createActions } from 'redux-actions'

const initialBookmarkState = [
   {
    url: 'https://safenetforum.org/',
    title : "Safenet Forum",
    num_visits : 0
  },
   {
    url: 'safe://dir.yvette/',
    title : "SAFE Network Directory",
    num_visits : 0
  }
];



export const { updateBookmark, deleteBookmark } =
  createActions( ACTION_TYPES.UPDATE_BOOKMARK, ACTION_TYPES.DELETE_BOOKMARK )

export default function bookmarks(state = initialBookmarkState, action) {
  let payload =  action.payload

  if( action.error )
  {
    return state
  }

  switch (action.type) {
    case ACTION_TYPES.GET_CONFIG:
    {
      if( payload && payload.bookmarks )
      {
        const newBookmarks = payload.bookmarks;
        return _.uniqBy( [ ...state , ...newBookmarks ], 'url' ) ;

      }
      return state;
    }
    case ACTION_TYPES.UPDATE_BOOKMARK :
    {
      let newState = [ ...state ];

      let index = state.findIndex( site => {
          return site.url === payload.url
        })

      if( index > -1 )
      {
        let siteToMerge = state[ index ];
        let updatedSite = { ...siteToMerge, ...payload };

        if( payload.newUrl )
        {
          updatedSite.url = payload.newUrl
        }

        if( payload.num_visits )
        {
          let newVisitCount = siteToMerge.num_visits || 0
          newVisitCount++
          updatedSite.num_visits = newVisitCount
        }
        newState[ index ] = updateSite;

        return  newState;

      }

      if( payload.num_visits )
      {
        //what case is this?
        return newState
      }

      newState.push( { ...payload } )
      return newState;
    }
    case ACTION_TYPES.DELETE_BOOKMARK:
    {
      let index = state.findIndex( site => site.url === payload.url )

      let newState = [ ...state ];

      newState.splice( index, 1 )
      return newState;
    }
    default:
      return state
  }
}










export function setup () {
  // wire up RPC
  rpc.exportAPI('beakerBookmarks', manifest, { add, changeTitle, changeUrl, addVisit, remove, get, list })
}

export function add (url, title) {
  return new Promise( (resolve, reject) =>
    {
      let bookmark = { url, title }
      return store.dispatch( updateBookmark( bookmark ) )
    } )

}

export function changeTitle (url, title) {

  return new Promise( (resolve, reject) =>
    {
      let bookmark = { url, title }

      return store.dispatch( updateBookmark( bookmark ) )
    } )
}

export function changeUrl (oldUrl, newUrl) {

  return new Promise( (resolve, reject) =>
    {
      let bookmark = {
        url: oldUrl,
        newUrl : newUrl }

      return store.dispatch( updateBookmark( bookmark ) )
    } )

}

export function addVisit (url) {

  let site = store.getState()[ 'bookmarks' ].find( site => site.url === url )
  if( site )
  {
    return new Promise( (resolve, reject) =>
      {
        let bookmark = { url, num_visits : 1 }

        return store.dispatch( updateBookmark( bookmark ) )
      } )

  }
  else {
    return Promise.reject('bookmark does not exist')
  }


}

export function remove (url) {

  return new Promise( (resolve, reject) =>
    {
      let bookmark = { url }

      return store.dispatch( deleteBookmark( bookmark ) )
    } )
}

export function get (url) {
  return new Promise( ( resolve, reject) =>
  {
    let bookmarks = store.getState().bookmarks;
    let bookmarkedSite = bookmarks.find( site => site.url === url )
    if( bookmarkedSite )
    {
      let datum = bookmarkedSite.data.key
      resolve( datum )
    }
    else {
      resolve( undefined )
    }
  })

}

export function list () {

  let sites = store.getState()[ 'bookmarks' ]
  return new Promise( (resolve, reject ) => resolve( sites ))

}
