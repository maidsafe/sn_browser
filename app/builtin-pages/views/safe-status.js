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
  document.title = 'SAFE Network Status'


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
    statusEl = yo`<div class="safe-auth-desc">
      <span class="icon icon-info-circled"></span> Manage Applications Using <a href="safe-auth://home/" target="_blank">Authenticator</a>
    </div>`
  }

  // render the top 9 big, the rest small
  yo.update(document.querySelector('#el-content'), yo`<div class="pane" id="el-content">
    <div class="safe-status">
      <div class="safe-status-b">
        <div class="heading">SAFE Network</div>
        <h4 class="desc"><span>Privacy</span><span>Security</span><span>Freedom</span></h4>
        <p class="desc-2">
          The SAFE Network and Browser are still in test phases and may only work if you are using the latest version.
        </p>
        <div class="desc-lnk">
          <p>Here are few <a href="https://github.com/maidsafe/safe_examples">example</a> applications to start with.</p>
          <p>You can join the discussion on the <a href="https://safenetforum.org/">Community forum</a></p>
          <p>If you'd like to contribute to the code or have found any issues, you can find us on <a href="https://github.com/maidsafe/safe_browser/issues">GitHub</a></p>
        </div>
        <div class="safe-status-f">
          <p><span class="icon icon-info-circled"></span> Manage Applications Using <a href="safe-auth://home/" target="_blank">Authenticator</a></p>
        </div>
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
