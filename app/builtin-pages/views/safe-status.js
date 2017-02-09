/*
This uses the beakerBookmarks APIs, which is exposed by webview-preload to all sites loaded over the beaker: protocol
*/

import * as yo from 'yo-yo'
import co from 'co'

// safeStatus, cached in memory
var safeStatus = {}
var reAuthMessage = 'Reauthorise with SAFE Launcher'
var authSuccess = false
export function setup () {


}

export function show () {
  document.title = 'SAFE Network'


    co(function*() {

      authSuccess = authSuccess || false
      authSuccess = yield beakerBrowser.getSetting( 'authSuccess' )

      render()
    })


  co(function*() {

    safeStatus = safeStatus || {}
    safeStatus = yield beakerBrowser.getSetting( 'authMessage' )

    render()
  })
}

export function hide () {
}

// rendering
// =

function render () {

  // optional help text
  var statusEl = ''
  var reAuthEl = ''

  if ( ! authSuccess ) {
      reAuthEl = yo`<div class="ll-help" onclick=${onClickReAuth()} style="cursor: pointer">
      <span class="icon icon-rocket"></span> ${reAuthMessage}
      </div>`
  }

  if (safeStatus && safeStatus.length > 0 ) {
    statusEl = yo`<div class="ll-help">
      <span class="icon icon-info-circled"></span> Manage Applications Using Authenticator
    </div>`
  }

  // render the top 9 big, the rest small
  yo.update(document.querySelector('#el-content'), yo`<div class="pane" id="el-content">
    <div class="safe-status links-list">
      <div class="ll-heading">
	SAFE Network
      </div>
      ${statusEl}
      <div class="ll-help" onclick=${onClickReAuth()} style="cursor: pointer">
        Click <span class="icon icon-rocket"></span> to open Authenticator</a>
      </div>
    </div>
  </div>`)
}

// event handlers
// =

function onClickReAuth (i) {
  return e => {
    e.preventDefault()
    e.stopPropagation()

    let check = beakerBrowser.reauthenticateSAFE( )

    check.then( r => console.log( r ) )
        .catch( e => console.log( 'errors', e ))
  }
}
