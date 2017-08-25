import { protocol, shell } from 'electron'
import path from 'path'

export function setup () {
  protocol.registerFileProtocol('beaker', (request, cb) => {
    // FIXME
    // if-casing every possible asset is pretty dumb
    // generalize this
    // -prf

    // browser ui
    if (request.url == 'beaker:shell-window')
  return cb(path.join(__dirname, 'shell-window.html'))
  if (request.url == 'beaker:shell-window.js')
    return cb(path.join(__dirname, 'shell-window.build.js'))
  if (request.url == 'beaker:shell-window.css')
    return cb(path.join(__dirname, 'stylesheets/shell-window.css'))

  // builtin pages
  for (let slug of ['start', 'favourites', 'archives', 'history', 'downloads', 'settings']) {
    if (request.url == `beaker:${slug}`)
      return cb(path.join(__dirname, 'builtin-pages.html'))
  }
  if (request.url.startsWith('beaker:site/'))
    return cb(path.join(__dirname, 'builtin-pages.html'))
  if (request.url == 'beaker:builtin-pages.js')
    return cb(path.join(__dirname, 'builtin-pages.build.js'))
  if (request.url == 'beaker:builtin-pages.css')
    return cb(path.join(__dirname, 'stylesheets/builtin-pages.css'))

  // common assets
  if (request.url == 'beaker:font')
    return cb(path.join(__dirname, 'fonts/photon-entypo.woff'))
  if (request.url.startsWith('beaker:logo'))
    return cb(path.join(__dirname, 'img/logo.png'))
  if (request.url.startsWith('beaker:safe-auth-logo'))
    return cb(path.join(__dirname, 'img/safe_auth_logo.svg'))
  if (request.url.startsWith('beaker:safe-auth-nav-logo-dark'))
    return cb(path.join(__dirname, 'img/authenticator-logo-dark.svg'))
  if (request.url.startsWith('beaker:auth-popup-documents-icon'))
    return cb(path.join(__dirname, 'img/documents.svg'))
  if (request.url.startsWith('beaker:auth-popup-downloads-icon'))
    return cb(path.join(__dirname, 'img/downloads.svg'))
  if (request.url.startsWith('beaker:auth-popup-music-icon'))
    return cb(path.join(__dirname, 'img/music.svg'))
  if (request.url.startsWith('beaker:auth-popup-photos-icon'))
    return cb(path.join(__dirname, 'img/photos.svg'))
  if (request.url.startsWith('beaker:auth-popup-public-icon'))
    return cb(path.join(__dirname, 'img/public.svg'))
  if (request.url.startsWith('beaker:auth-popup-publicnames-icon'))
    return cb(path.join(__dirname, 'img/publicnames.svg'))
  if (request.url.startsWith('beaker:auth-popup-videos-icon'))
    return cb(path.join(__dirname, 'img/videos.svg'))
  if (request.url.startsWith('beaker:auth-popup-default-icon'))
    return cb(path.join(__dirname, 'img/default-container.svg'))
  if (request.url.startsWith('beaker:auth-popup-expand-arrow'))
    return cb(path.join(__dirname, 'img/expand_arrow.svg'))
  if (request.url.startsWith('beaker:auth-popup-toggle-info'))
    return cb(path.join(__dirname, 'img/toggle_info.svg'))
  if (request.url.startsWith('beaker:auth-popup-toggle-app'))
    return cb(path.join(__dirname, 'img/toggle_app.svg'))

  if (request.url.startsWith('beaker:safe-auth-nav-logo'))
    return cb(path.join(__dirname, 'img/authenticator-logo.svg'))
  if (request.url.startsWith('beaker:safe-auth-home'))
    return cb(shell.openExternal('safe-auth://home/'))

  return cb(-6)
}, e => {
    if (e)
      console.error('Failed to register beaker protocol', e)
  });
}
