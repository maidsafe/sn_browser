import { remote, ipcRenderer } from 'electron'
import * as pages from '../pages'
import * as zoom from '../pages/zoom'
import * as yo from 'yo-yo'
import emitStream from 'emit-stream'
import { UpdatesNavbarBtn } from './navbar/updates'
import { DownloadsNavbarBtn } from './navbar/downloads'
import { SitePermsNavbarBtn } from './navbar/site-perms'

const KEYCODE_DOWN = 40
const KEYCODE_UP = 38
const KEYCODE_ESC = 27
const KEYCODE_ENTER = 13
const KEYCODE_N = 78
const KEYCODE_P = 80

const CLIENT_TYPES = {
  DESKTOP: 'DESKTOP',
  WEB: 'WEB'
};

const REQ_TYPES = {
  AUTH: 'AUTH',
  CONTAINER: 'CONTAINER',
  MDATA: 'MDATA'
};

// globals
// =

var toolbarNavDiv = document.getElementById('toolbar-nav')
var updatesNavbarBtn = null
var downloadsNavbarBtn = null
var sitePermsNavbarBtn = null

// autocomplete data
var autocompleteCurrentValue = null
var autocompleteCurrentSelection = 0
var autocompleteResults = null // if set to an array, will render dropdown

var isSafeAppAuthenticating = false
var safeAuthNetworkState = -1
var safeAuthData = null
var safeAuthPopupDiv = yo`<div></div>`

// safe app plugin
ipcRenderer.send('registerSafeApp');

ipcRenderer.on('webClientAuthReq', function(event, req) {
  handleSafeAuthAuthentication(req, CLIENT_TYPES.WEB);
})


// safe authenticator plugin
ipcRenderer.send('registerSafeNetworkListener');
ipcRenderer.send('registerOnAuthReq');
ipcRenderer.send('registerOnContainerReq');
ipcRenderer.send('registerOnSharedMDataReq');
ipcRenderer.send('registerOnReqError');

ipcRenderer.on('onNetworkStatus', function(event, status) {
  safeAuthNetworkState = status
  if (status === -1) {
    hideSafeAuthPopup();
  }
  update()
})

ipcRenderer.on('onAuthReq', function(event, data) {
  if (data) {
    safeAuthData = data
    showSafeAuthPopup(REQ_TYPES.AUTH)
  }
});

ipcRenderer.on('onContainerReq', function(event, data) {
  if (data) {
    safeAuthData = data
    showSafeAuthPopup(REQ_TYPES.CONTAINER)
  }
});

ipcRenderer.on('onSharedMDataReq', function(event, data) {
  if (data) {
    safeAuthData = data
    showSafeAuthPopup(REQ_TYPES.MDATA)
  }
});

ipcRenderer.on('onAuthDecisionRes', function(event, res) {
  isSafeAppAuthenticating = false
  if (res.type === CLIENT_TYPES.WEB) {
    ipcRenderer.send('webClientAuthRes', res);
  }
  update()
});

ipcRenderer.on('onContDecisionRes', function(event, res) {
  isSafeAppAuthenticating = false
  if (res.type === CLIENT_TYPES.WEB) {
    ipcRenderer.send('webClientContainerRes', res);
  }
  update()
});

ipcRenderer.on('onUnAuthDecisionRes', function (event, res) {
  if (res.type === CLIENT_TYPES.WEB) {
    ipcRenderer.send('webClientAuthRes', res);
  }
});

ipcRenderer.on('onSharedMDataRes', function(event, res) {
  isSafeAppAuthenticating = false
  if (res.type === CLIENT_TYPES.WEB) {
    ipcRenderer.send('webClientSharedMDataRes', res);
  }
  update()
});

ipcRenderer.on('onAuthResError', function(event, res) {
  isSafeAppAuthenticating = false
  if (res && res.error && (res.error.toLowerCase() === 'unauthorised')) {
    onClickOpenSafeAuthHome()
  }
  if (res.type === CLIENT_TYPES.WEB) {
    ipcRenderer.send('webClientErrorRes', res);
  }
  update()
});

ipcRenderer.on('onUnAuthResError', function (event, res) {
  if (res.type === CLIENT_TYPES.WEB) {
    ipcRenderer.send('webClientErrorRes', res);
  }
});

// exported functions
// =

export function setup () {
  // create the button managers
  updatesNavbarBtn = new UpdatesNavbarBtn()
  downloadsNavbarBtn = new DownloadsNavbarBtn()
  sitePermsNavbarBtn = new SitePermsNavbarBtn()
}

export function createEl (id) {
  // render
  var el = render(id, null)
  toolbarNavDiv.appendChild(el)
  return el
}

export function focusLocation (page) {
  var el = page.navbarEl.querySelector('.nav-location-input')
  el.focus()
}

export function showInpageFind (page) {
  // show control and highlight text
  page.isInpageFinding = true
  update(page)
  var el = page.navbarEl.querySelector('.nav-find-input')
  el.focus()
  el.select()

  // init search if there's a value leftover
  // FIXME
  // this behavior got lost in the switch over to using yo-yo
  // do we want it back?
  // -prf
  // if (el.value)
  // page.findInPage(el.value)
}

export function hideInpageFind (page) {
  page.stopFindInPage('clearSelection')
  page.isInpageFinding = false
  update(page)
}

export function clearAutocomplete () {
  if (autocompleteResults) {
    autocompleteCurrentValue = null
    autocompleteCurrentSelection = 0
    autocompleteResults = null
    update()
  }
}

export function update (page) {
  // fetch current page, if not given
  page = pages.getActive()

  // render
  yo.update(page.navbarEl, render(page.id, page))
}

export function updateLocation (page) {
  // fetch current page, if not given
  page = page || pages.getActive()

  // update location
  var addrEl = page.navbarEl.querySelector('.nav-location-input')
  var isAddrElFocused = addrEl.matches(':focus')
  if (!isAddrElFocused || !addrEl.value) { // only update if not focused or empty, so we dont mess up what the user is doing
    addrEl.value = page.getIntendedURL()
    if (isAddrElFocused) // if was focused, then select what we put in
      addrEl.select()
  }
}

export function handleSafeAuthAuthentication(req, type) {
  ipcRenderer.send('decryptRequest', req, type || CLIENT_TYPES.DESKTOP)
  clearAutocomplete()
  // FIXME change to constant instand of -1
  // if (safeAuthNetworkState === -1) {
  //   onClickOpenSafeAuthHome()
  // }
}

function authDecision(isAllowed, reqType) {
  isSafeAppAuthenticating = true
  update()
  if (reqType === REQ_TYPES.AUTH) {
    return ipcRenderer.send('registerAuthDecision', safeAuthData, isAllowed);
  } else if (reqType === REQ_TYPES.CONTAINER) {
    return ipcRenderer.send('registerContainerDecision', safeAuthData, isAllowed);
  }
  ipcRenderer.send('registerSharedMDataDecision', safeAuthData, isAllowed);
}

function onClickAllowBtn(e) {
  hideSafeAuthPopup()
  authDecision(true, e.target.dataset.type)
}

function onClickDenyBtn(e) {
  hideSafeAuthPopup()
  authDecision(false, e.target.dataset.type)
}

function onClickSkipBtn(e) {
  hideSafeAuthPopup()
  ipcRenderer.send('skipAuthRequest', true);
}

function hideSafeAuthPopup() {
  yo.update(safeAuthPopupDiv, yo`<div></div>`)
}

function showSafeAuthPopup(reqType) {
  var capitalizeName = function(name) {
    return name[0].toUpperCase() + name.substr(1)
  }
  var parseName = function(name) {
    return capitalizeName(name.replace(/-|_/g, ' '));
  }
  var arrToYo = function(arr) {
    var getPermissionPhrase = function(perm) {
      switch (perm) {
        case 'read':
          return yo`<span><b>Read</b> data</span>`;
        case 'insert':
          return yo`<span><b>Store</b> data</span>`;
        case 'update':
          return yo`<span><b>Update</b> existing data</span>`;
        case 'delete':
          return yo`<span><b>Delete</b> data</span>`;
        case 'managepermissions':
          return yo`<span><b>Manage Permissions</b></span>`;
        default:
          return yo`<span>${parseName(perm)}</span>`;
      }
    };

    return Object.keys(arr).map(function(item) {
      if (!arr[item]) {
        return;
      }
      return yo`<li>${getPermissionPhrase(item.toLowerCase())}</li>`;
    })
  }

  const getCont = function(contName) {
    const obj = {};
    switch (contName) {
      case '_documents':
        obj['name'] = 'Document container'
        obj['desc'] = 'Container for storing general documents'
        obj['style'] = 'document'
        break;
      case '_downloads':
        obj['name'] = 'Download container'
        obj['desc'] = 'Container for downloaded files'
        obj['style'] = 'download'
        break;
      case '_music':
        obj['name'] = 'Music container'
        obj['desc'] = 'Container for storing music files'
        obj['style'] = 'music'
        break;
      case '_pictures':
        obj['name'] = 'Pictures container'
        obj['desc'] = 'Container for storing picture files'
        obj['style'] = 'pictures'
        break;
      case '_videos':
        obj['name'] = 'Videos container'
        obj['desc'] = 'Container for storing video files'
        obj['style'] = 'videos'
        break;
      case '_public':
        obj['name'] = 'Public container'
        obj['desc'] = 'Container for storing unencrypted data'
        obj['style'] = 'public'
        break;
      case '_publicNames':
        obj['name'] = 'Public names container'
        obj['desc'] = 'Container for storing public profile related information. Public names and associated services are stored in this container'
        obj['style'] = 'publicNames'
        break;
      default:
        obj['name'] = contName
        obj['desc'] = ''
        obj['style'] = 'default'
        break;
    }
    return obj;
  }

  var reqKey = 'authReq';
  if (reqType === REQ_TYPES.CONTAINER) {
    reqKey = 'contReq'
  } else if (reqType === REQ_TYPES.MDATA) {
    reqKey = 'mDataReq'
  }

  var contOrPermLen = (reqType === REQ_TYPES.MDATA) ? safeAuthData[reqKey].mdata.length : safeAuthData[reqKey].containers.length;
  var allowBtn = yo`<button class="allow-btn" onclick=${onClickAllowBtn} data-type="${reqType}">Allow</button>`
  var denyBtn = yo`<button class="deny-btn" onclick=${onClickDenyBtn} data-type="${reqType}">Deny</button>`
  var contPara = (contOrPermLen === 0) ? 'is requesting for authorisation.' : 'is requesting access for the following containers';
  if (reqType === REQ_TYPES.MDATA) {
    contPara = contPara.replace('containers', 'Mutable Data');
  }
  var skipBtn = yo`<button type="button" onclick=${onClickSkipBtn}>Skip</button>`
  
  var listCont = null;
  var isAuthorised = (safeAuthData.hasOwnProperty('isAuthorized') && safeAuthData.isAuthorized);
  var noContainerDesc = 'Application is requesting for reading public unencrypted data on your behalf.';
  var isAuthorisedDesc = 'This app is one that you have previously authorised. Please note it is not requesting any new permissions, it requires re-authorisation as it is starting a new SAFE Network session.';
  var ownContainerInfo = {
    name: 'App\'s own container',
    desc: 'Container used by the application to store application specific information such as config files etc',
    access: {'Read': true, 'Insert': true, 'Update': true, 'Delete': true, 'ManagePermissions': true}
  }
  var ownContainer = (safeAuthData[reqKey].app_container && !isAuthorised) ? yo`<div class="list-i" onclick=${togglePermissions}>
      <h3 class="default" title=${ownContainerInfo.name}><span class="icon"></span>${ownContainerInfo.name}</h3>
      <div class="list-i-b">
        <p>${ownContainerInfo.desc}</p>
        <ul>${arrToYo(ownContainerInfo.access)}</ul>
      </div>
    </div>`: null;

  if (reqType !== REQ_TYPES.MDATA) {
    if (isAuthorised) {
      listCont = yo`<div class="list-i default">${isAuthorisedDesc}</div>`
    } else if (!safeAuthData[reqKey].app_container && (safeAuthData[reqKey].containers.length === 0)) {
      listCont = yo`<div class="list-i default">${noContainerDesc}</div>`
    } else {
      listCont = yo`${
        safeAuthData[reqKey].containers.map(function(container) {
          if (typeof container.access === 'object') {
            const contObj = getCont(container.cont_name);
            return yo`<div class="list-i">
              <h3 class=${contObj.style} title=${contObj.name} onclick=${togglePermissions}><span class="icon"></span>${contObj.name}</h3>
              <div class="list-i-b">
                <p>${contObj.desc}</p>
                <ul>${arrToYo(container.access)}</ul>
              </div>
            </div>`;
          }
          return yo`<div class="list-i"><h3>${container.cont_name}</h3></div>`;
        })
        }`;
    }
  } else {
    var getPerms = (data) => {
      var perms = [];
      Object.keys(data).map(function (key) {
        if (data[key]) {
          perms.push(key);
        }
      });
      return perms;
    }
    var metaArr = safeAuthData['metaData'] || [];
    var appAccessArr = safeAuthData['appAccess'] || [];
    var toggleAppBtn = yo`<button onclick=${toggleApp}></button>`
    listCont = yo`${
      safeAuthData[reqKey].mdata.map(function (mdata, i) {
        var perms = getPerms(mdata.perms);
        var appAccess = appAccessArr[i]
        var meta = metaArr[i]
        var name = meta.name || mdata.name
        return yo`<div class="list-i">
            <h3 class="default" title=${name} onclick=${togglePermissions}><span class="icon"></span>${name}</h3>
            <div class="list-i-b">
              <p>${meta.description}</p>
              <ul class="perms">${
                perms.map(function (p) {
                  return yo`<li><span>${capitalizeName(p)}</span></li>`;
                })
              }</ul>
              <ul class="apps">${
                appAccess.map(function(acc) {
                  return yo`<li><span>${parseName(acc.app_name)}</span></li>`;
                })
              }</ul>
              <div class="app-toggle">${toggleAppBtn}</div>
            </div>
          </div>`;
      })
      }`;
  }
  var mdataWarn = (reqType === REQ_TYPES.MDATA) ? yo`<div class="mdata-warn">Note: Authenticator does not guarantee that the Mutable Data requested is the same as mentioned in the description. Grant the permission only if you trust the application</div>` : null;

  var popupBase = yo`<div class="popup">
      <div class="popup-base">
        <div class="popup-i">
          <div class="popup-cnt">
            <div class="popup-skip">${skipBtn}</div>
            <div class="popup-cnt-main">
              <h3>${safeAuthData[reqKey].app.name.slice(0, 2)}</h3>
              <h4><b>${safeAuthData[reqKey].app.name}</b> by <b>${safeAuthData[reqKey].app.vendor}</b></h4>
              <h4>${contPara}</h4>
              <h5>${safeAuthData[reqKey].app.id}</h5>
            </div>
            ${mdataWarn}
            <div class="popup-cnt-ls">
              <span class="list">
                ${ownContainer}
                ${listCont}
              </span>
            </div>
          </div>
          <div class="popup-foot">
            ${denyBtn}
            ${allowBtn}
          </div>
        </div>
      </div>
  </div>`

  yo.update(safeAuthPopupDiv, popupBase)
  setAuthPopupAsScrollable()
}

// internal helpers
// =

function render (id, page) {
  var isLoading = page && page.isLoading()

  var webContents = remote.getCurrentWindow().webContents;

  // var isSafe = webContents.isSafe;

  // if( typeof isSafe === 'undefined' )
  // {
  //     isSafe = true;
  // }

  // back/forward should be disabled if its not possible go back/forward
  var backDisabled = (page && page.canGoBack()) ? '' : 'disabled'
  var forwardDisabled = (page && page.canGoForward()) ? '' : 'disabled'

  // render reload/cancel btn
  var reloadBtn = (isLoading)
    ? yo`<button class="toolbar-btn nav-cancel-btn" onclick=${onClickCancel}>
        <span class="icon icon-cancel"></span>
      </button>`
    : yo`<button class="toolbar-btn nav-reload-btn" onclick=${onClickReload}>
        <span class="icon icon-ccw"></span>
      </button>`

  var safeNetworkStatusBtn = (isSafeAppAuthenticating)
    ? yo`<button class="toolbar-btn connecting" onclick=${onClickOpenSafeAuthHome}>
        <span class="icon"></span>
      </button>`
    : yo`<button class="toolbar-btn ${(function() {
      if (safeAuthNetworkState === 0) {
        return 'connected'
      } else if (safeAuthNetworkState === -1) {
        return 'terminated'
      }
    })()}" onclick=${onClickOpenSafeAuthHome}>
        <span class="icon"></span>
      </button>`

  // render safe btn
  var safeBtn = yo`<span class="safe-btn-safe">
      ${safeNetworkStatusBtn}
      ${safeAuthPopupDiv}
      </span>`

  // `page` is null on initial render
  // and the toolbar should be hidden on initial render
  // and it should be hidden if the page isnt active
  var toolbarHidden = (!page || !page.isActive) ? ' hidden' : ''

  // preserve the current finder value and focus
  var findEl = page && page.navbarEl.querySelector('.nav-find-input')
  var findValue = findEl ? findEl.value : ''

  // inpage finder ctrl
  var inpageFinder = (page && page.isInpageFinding)
    ? yo`<input
            type="text"
            class="nav-find-input"
            placeholder="Find in page..."
            oninput=${onInputFind}
            onkeydown=${onKeydownFind}
            value=${findValue} />`
    : ''


  // bookmark toggle state
  var bookmarkClass = 'nav-bookmark-btn'+((page && !!page.bookmark) ? ' active' : '')

  // view dat
  var viewDatBtn
  if (page && page.protocolDescription && page.protocolDescription.scheme == 'dat') {
    viewDatBtn = yo`<button class="nav-view-files-btn" onclick=${onClickViewFiles}>
      <span class="icon icon-docs"></span> <small>View Site Files</small>
    </button>`
  }

  // zoom btn should only show if zoom is not the default setting
  var zoomBtn = ''
  if (page && page.zoom != 0) {
    // I dont know what that formula is, so I solved this problem like any good programmer would, by stealing the values from chrome
    var zoomPct = ({
      '-0.5': 90, '-1': 75, '-1.5': 67, '-2': 50, '-2.5': 33, '-3': 25,
      '0': 100,
      '0.5': 110, '1': 125, '1.5': 150, '2': 175, '2.5': 200, '3': 250, '3.5': 300, '4': 400, '4.5': 500
    })[page.zoom]
    zoomBtn = yo`<button onclick=${onClickZoom}><span class="icon icon-search"></span> <small>${zoomPct}%</small></button>`
  }

  // autocomplete dropdown
  var autocompleteDropdown = ''
  if (autocompleteResults) {
    autocompleteDropdown = yo`
      <div class="autocomplete-dropdown" onclick=${onClickAutocompleteDropdown}>
        ${autocompleteResults.map((r, i) => {
      // content
      var iconCls = 'icon icon-' + ((r.search) ? 'search' : 'window')
      var contentColumn
      if (r.search)
        contentColumn = yo`<span class="result-search">${r.search}</span>`
      else {
        contentColumn = yo`<span class="result-url"></span>`
        if (r.urlDecorated)
          contentColumn.innerHTML = r.urlDecorated // use innerHTML so our decoration can show
        else
          contentColumn.textContent = r.url
      }
      var titleColumn = yo`<span class="result-title"></span>`
      if (r.titleDecorated)
        titleColumn.innerHTML = r.titleDecorated // use innerHTML so our decoration can show
      else
        titleColumn.textContent = r.title
      // selection
      var rowCls = 'result'
      if (i == autocompleteCurrentSelection)
        rowCls += ' selected'
      // result row
      return yo`<div class=${rowCls} data-result-index=${i}>
            <span class=${iconCls}></span>
            ${contentColumn}
            ${titleColumn}
          </div>`
    })}
      </div>
    `
  }

  // preserve the current address value
  var addrEl = page && page.navbarEl.querySelector('.nav-location-input')
  var addrValue = addrEl ? addrEl.value : ''

  // setup site-perms dropdown
  sitePermsNavbarBtn.protocolDescription = (page && page.protocolDescription)

  // render
  return yo`<div data-id=${id} class="toolbar-actions${toolbarHidden}">
    <div class="toolbar-group">
      <button class="toolbar-btn nav-back-btn" ${backDisabled} onclick=${onClickBack}>
        <span class="icon icon-left-open-big"></span>
      </button>
      <button class="toolbar-btn nav-forward-btn" ${forwardDisabled} onclick=${onClickForward}>
        <span class="icon icon-right-open-big"></span>
      </button>
      ${reloadBtn}
      ${safeBtn}
    </div>
    <div class="toolbar-input-group">
      ${sitePermsNavbarBtn.render()}
      <input
        type="text"
        class="nav-location-input"
        onfocus=${onFocusLocation}
        onblur=${onBlurLocation}
        onkeydown=${onKeydownLocation}
        oninput=${onInputLocation}
        value=${addrValue} />
      ${inpageFinder}
      ${viewDatBtn}
      ${zoomBtn}
      <button class=${bookmarkClass} onclick=${onClickBookmark}><span class="icon icon-star"></span></button>
      ${autocompleteDropdown}
    </div>
    <div class="toolbar-group">
      ${downloadsNavbarBtn.render()}
      ${updatesNavbarBtn.render()}
    </div>
  </div>`
}

var isHashRegex = /^[a-z0-9]{64}/i
function handleAutocompleteSearch (results) {
  var v = autocompleteCurrentValue

  // decorate result with bolded regions
  // explicitly replace special characters to match sqlite fts tokenization
  var searchTerms = v.replace(/[:^*-\.]/g, ' ').split(' ').filter(Boolean)
  results.forEach(r => decorateResultMatches(searchTerms, r))

  // does the value look like a url?
  var isProbablyUrl = true;
  var vWithProtocol = v
  var isGuessingTheScheme = false
  if (isProbablyUrl && !v.includes('://') && !(v.startsWith('beaker:') || v.startsWith('ipfs:/'))) {
    if (isHashRegex.test(v))
      vWithProtocol = 'dat://'+v
    else if (!remote.getGlobal('browserStatus').safeModeOn) {
      vWithProtocol = 'http://' + v
      isGuessingTheScheme = true
    } else {
      vWithProtocol = 'safe://'+v
      isGuessingTheScheme = true // note that we're guessing so that, if this fails, we can try http://
    }
  }

  // set the top results accordingly
  var gotoResult = { url: vWithProtocol, title: 'Go to '+v, isGuessingTheScheme }
  var searchResult = {
    search: v,
    title: 'DuckDuckGo Search',
    url: 'https://duckduckgo.com/?q=' + v.split(' ').join('+')
  }
  if (isProbablyUrl) autocompleteResults = [gotoResult, searchResult]
  else               autocompleteResults = [searchResult]

  // add search results
  if (results)
    autocompleteResults = autocompleteResults.concat(results)

  // render
  update()
}

function getAutocompleteSelection (i) {
  if (typeof i !== 'number')
    i = autocompleteCurrentSelection
  if (autocompleteResults && autocompleteResults[i])
    return autocompleteResults[i]

  // fallback to the current value in the navbar
  var addrEl = pages.getActive().navbarEl.querySelector('.nav-location-input')
  return { url: addrEl.value }
}

function getAutocompleteSelectionUrl (i) {
  return getAutocompleteSelection(i).url
}

// helper for autocomplete
// - takes in the current search (tokenized) and a result object
// - mutates `result` so that matching text is bold
var offsetsRegex = /([\d]+ [\d]+ [\d]+ [\d]+)/g
function decorateResultMatches (searchTerms, result) {
  // extract offsets
  var tuples = (result.offsets || '').match(offsetsRegex)
  if (!tuples)
    return

  // iterate all match tuples, and break the values into segments
  let lastTuple
  let segments = { url: [], title: [] }
  let lastOffset = { url: 0, title: 0 }
  for (let tuple of tuples) {
    tuple = tuple.split(' ').map(i => +i) // the map() coerces to the proper type
    let [ columnIndex, termIndex, offset, matchLen ] = tuple
    let columnName = ['url', 'title'][columnIndex]

    // sometimes multiple terms can hit at the same point
    // that breaks the algorithm, so skip that condition
    if (lastTuple && lastTuple[0] === columnIndex && lastTuple[2] === offset)
      continue
    lastTuple = tuple

    // use the length of the search term
    // (sqlite FTS gives the length of the full matching token, which isnt as helpful)
    let searchTerm = searchTerms[termIndex]
    let len = searchTerm.length

    // extract segments
    segments[columnName].push(result[columnName].slice(lastOffset[columnName], offset))
    segments[columnName].push(result[columnName].slice(offset, offset+len))
    lastOffset[columnName] = offset + len
  }

  // add the remaining text
  segments.url.push(result.url.slice(lastOffset.url))
  segments.title.push(result.title.slice(lastOffset.title))

  // join the segments with <strong> tags
  result.urlDecorated = joinSegments(segments.url)
  result.titleDecorated = joinSegments(segments.title)
}

// helper for decorateResultMatches()
// - takes an array of string segments (extracted from the result columns)
// - outputs a single escaped string with every other element wrapped in <strong>
var ltRegex = /</g
var gtRegex = />/g
function joinSegments (segments) {
  var str = ''
  var isBold = false
  for (var segment of segments) {
    // escape for safety
    segment = segment.replace(ltRegex, '&lt;').replace(gtRegex, '&gt;')

    // decorate with the strong tag
    if (isBold) str += '<strong>' + segment + '</strong>'
    else        str += segment
    isBold = !isBold
  }
  return str
}

function setAuthPopupAsScrollable() {
  var popupBase = document.querySelector('.popup .popup-base .popup-i')
  var popupContMain = document.querySelector('.popup .popup-base .popup-i .popup-cnt .popup-cnt-main')
  var popupContMainHeight = popupContMain ? popupContMain.offsetHeight : 0
  var popupContLs = document.querySelector('.popup .popup-base .popup-i .popup-cnt .popup-cnt-ls')
  var popupContLsheight = popupContLs ? popupContLs.offsetHeight : 0
  var popupMdataWarn = document.querySelector('.popup .popup-base .popup-i .popup-cnt .mdata-warn')
  var popupMdataWarnHeight = popupMdataWarn ? popupMdataWarn.offsetHeight : 0

  var popupListMarginTop = 40
  var footerHeight = 140
  var popupCntAddedSpace = 30
  var popupContainerHeight = popupContMainHeight + popupMdataWarnHeight + popupContLsheight + popupListMarginTop + popupCntAddedSpace + footerHeight;


  if ( popupBase && popupBase.offsetHeight < popupContainerHeight) {
    popupBase.classList.add('scroll')
  } else if( popupBase ) {
    popupBase.classList.remove('scroll')
  }
}

window.addEventListener('resize', function() { setAuthPopupAsScrollable(); });

function countMatches (str, regex) {
  var matches = str.match(regex)
  return (matches) ? matches.length : 0
}

// ui event handlers
// =

function getEventPage (e) {
  for (var i=0; i < e.path.length; i++)
    if (e.path[i].dataset && e.path[i].dataset.id)
      return pages.getById(e.path[i].dataset.id)
}

function onClickBack (e) {
  var page = getEventPage(e)
  if (page && page.canGoBack())
    page.goBack()
}

function onClickForward (e) {
  var page = getEventPage(e)
  if (page && page.canGoForward())
    page.goForward()
}

function onClickReload (e) {
  var page = getEventPage(e)
  if (page)
    page.reload()
}

function togglePermissions(e) {
  e.preventDefault();
  var targetNode = e.target.tagName === 'H3' ? e.target : null;
  if (!targetNode && e.target.parentElement.tagName === 'H3') {
    targetNode = e.target.parentElement
  }
  if (!targetNode) {
    return;
  }
  var list = targetNode.parentElement
  if (list.classList.contains('show')) {
    list.classList.remove('show');
  } else {
    list.classList.add('show');
  }
  setAuthPopupAsScrollable()
}

function toggleApp(e) {
  e.preventDefault();
  var btn = e.target.tagName === 'BUTTON' ? e.target : null;
  if (!btn) {
    return;
  }
  var appToggleEle = btn.parentElement;
  var listBase = appToggleEle.parentElement;
  if (!listBase.classList.contains('list-i-b')) {
    return;
  }
  if (listBase.classList.contains('show-apps')) {
    appToggleEle.classList.remove('app');
    listBase.classList.remove('show-apps');
  } else {
    appToggleEle.classList.add('app');
    listBase.classList.add('show-apps');
  }
}

// export function onClickToggleSafe ( e )
// {
//     pages.toggleSafe();
// }

function onClickOpenSafeAuthHome(e) {
  pages.setActive(pages.create(pages.SAFE_AUTH_DEFAULT_URL))
}

function onClickCancel (e) {
  var page = getEventPage(e)
  if (page)
    page.stop()
}

function onClickBookmark (e) {
  var page = getEventPage(e)
  if (page)
    page.toggleBookmark()
}

function onClickViewFiles (e) {
  var page = getEventPage(e)
  if (page) {
    if (e.metaKey || e.ctrlKey) // popup
      pages.setActive(pages.create('view-'+page.getURL()))
    else
      page.loadURL('view-'+page.getURL()) // goto
  }
}

function onClickZoom (e) {
  const { Menu, MenuItem } = remote
  var menu = Menu.buildFromTemplate([
    { label: 'Reset Zoom', click: () => zoom.zoomReset(pages.getActive()) },
    { label: 'Zoom In', click: () => zoom.zoomIn(pages.getActive()) },
    { label: 'Zoom Out', click: () => zoom.zoomOut(pages.getActive()) }
  ])
  menu.popup(remote.getCurrentWindow())
}

function onFocusLocation (e) {
  var page = getEventPage(e)
  if (page)
    page.navbarEl.querySelector('.nav-location-input').select()
}

function onBlurLocation () {
  // HACK
  // blur gets called right before the click event for onClickAutocompleteDropdown
  // so, wait a bit before clearing the autocomplete, so the click has a chance to fire
  // -prf
  setTimeout(clearAutocomplete, 150)
}

function onInputLocation (e) {
  var value = e.target.value

  // run autocomplete
  // TODO debounce
  var autocompleteValue = value.trim()
  if (autocompleteValue && autocompleteCurrentValue != autocompleteValue) {
    autocompleteCurrentValue = autocompleteValue // update the current value
    autocompleteCurrentSelection = 0 // reset the selection
    beakerHistory.search(value).then(handleAutocompleteSearch) // update the suggetsions
  } else if (!autocompleteValue)
    clearAutocomplete() // no value, cancel out
}

function onKeydownLocation (e) {
  // on enter
  if (e.keyCode == KEYCODE_ENTER) {
    e.preventDefault()

    var page = getEventPage(e)
    if (page) {
      var selection = getAutocompleteSelection()
      // load safeauth page
      if (new URL(selection.url).protocol === pages.SAFE_AUTH_SCHEME) {
        if (pages.handleSafeAuthScheme(selection.url)) {
          e.target.blur()
          return
        }
      }

      var selectionUrl = selection.url

      page.loadURL(selectionUrl, { isGuessingTheScheme: selection.isGuessingTheScheme })
      e.target.blur()
    }
    return
  }

  // on escape
  if (e.keyCode == KEYCODE_ESC) {
    var page = getEventPage(e)
    page.navbarEl.querySelector('.nav-location-input').value = page.getURL()
    e.target.blur()
    return
  }

  // on keycode navigations
  var up   = (e.keyCode == KEYCODE_UP || (e.ctrlKey && e.keyCode == KEYCODE_P))
  var down = (e.keyCode == KEYCODE_DOWN || (e.ctrlKey && e.keyCode == KEYCODE_N))
  if (autocompleteResults && (up || down)) {
    e.preventDefault()
    if (up && autocompleteCurrentSelection > 0)
      autocompleteCurrentSelection--
    if (down && autocompleteCurrentSelection < autocompleteResults.length - 1)
      autocompleteCurrentSelection++

    // re-render and update the url
    var page = getEventPage(e)
    var newValue = getAutocompleteSelectionUrl(autocompleteCurrentSelection)
    page.navbarEl.querySelector('.nav-location-input').value = newValue
    update(page)
    return
  }
}

function onClickAutocompleteDropdown (e) {
  // get the result index
  for (var i=0; i < e.path.length; i++) {
    if (e.path[i].dataset && e.path[i].classList.contains('result')) {
      // follow result url
      var resultIndex = +e.path[i].dataset.resultIndex
      pages.getActive().loadURL(getAutocompleteSelectionUrl(resultIndex))
      return
    }
  }
}

function onInputFind (e) {
  var str = e.target.value
  var page = getEventPage(e)
  if (page) {
    if (str) page.findInPage(str)
    else     page.stopFindInPage('clearSelection')
  }
}

function onKeydownFind (e) {
  // on escape
  if (e.keyCode == KEYCODE_ESC) {
    let page = getEventPage(e)
    if (page)
      hideInpageFind(page)
  }

  // on enter
  if (e.keyCode == KEYCODE_ENTER) {
    let str = e.target.value
    let backwards = e.shiftKey // search backwords on shift+enter
    let page = getEventPage(e)
    if (page) {
      if (str) page.findInPage(str, { findNext: true, forward: !backwards })
      else     page.stopFindInPage('clearSelection')
    }
  }
}
