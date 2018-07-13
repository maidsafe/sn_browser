# Peruse Change Log
All notable changes to this project will be documented in this file.

#### [Unreleased]
### Added
- Notification on network disconnect event with automatic reconnect upon network resolve
- Browser executed with no network connection shows notification upon loginFromUri attempt and autmotically connects user upon network resolve

### SAFE libraries Dependencies
- @maidsafe/safe-node-app: `fe5dc54aa9c8a1c5dd71809b616f4a2353b598e8`

#### [0.6.0]
### Changed
- safeNetwork reducer becomes peruseSafeApp
- specific domAPI implementations removed
- new DOM API based upon safe-app-nodejs(@e818f8ace834caf891cd57f4fb9186ae19541f5e)
- release naming updated.
- Much of SAFE specific functionality moved to extension
- Removes window frame and increases draggable area, with exception to Windows
- Passes full auth info to Notifier

### Fixed
- `eval` has been disabled.
- domAPI handles removed
- Functioning share MD request
- Electron close app process on window close

### Added
- background process
- remoteCalls actions/reducers for passing around remote calls (in place of pauls-RPC)
- peruseSafeApp moved to background process
- authenticator redux store and actions.
- authenticator moved to background process
- uses safe-node-app directly for DOM APIs
- Preloaded MockVault
- Logic to copy MockVault into TEMPDIR, if executable flag is passed
- UI indication of webview loading

#### [0.5.3]
### Changed 
- Electron to 1.8.4

#### [0.5.2]
### Fixed 
- Add missing `errConst` in ff/ipc.js
### Changed
- Change default port for webpack-dev-server

#### [0.5.1]
### Fixed 
- Reopen closed tab works.
- `mock` store update initing before loginForTest to ensure UI is up to date even when not in a `NODE_ENV=dev` env.
- Appveyor build process names `dev-` files correctly.

### Added 
- Safe extension only installs dev libs in a dev env.

#### [0.5.0]
### Changed
- Upgrade @maidsafe/safe-node-app package to v0.8.0
- Upgrade safe_authenticator library to v0.6.0
- Upgrade pauls-electron-rpc fork to 1.2.0

### Added
- Allows client to receive error if non-standard container is requested during authorisation
- Creates central constants for SAFE API
- Uses latest safe-node-app to enable either prod or dev use from a `NODE_ENV=DEV` install. (Can build a package and enable `mock` use via a flag.)
- Expose `window.safeApp.readGrantedPermissions` function in DOM API to read granted containers permissions from an auth URI without the need to connect
- Expose `window.safeApp.getOwnContainerName` function in DOM API to get the app's own container name

### SAFE libraries Dependencies
- @maidsafe/safe-node-app: v0.8.0
- system_uri: v0.4.0
- safe_authenticator: v0.6.0

## [0.4.1]
### Fixed
- Removing bookmarks removes correct index.
- Remove trailing slash for history. Add trailing slash for webview loads.
- Improve 'Unexpected logic error' message with a note to point to invite.maidsafe.net
- Scrollable history/bookmarks pages.
- URL change check improved

### Added
- Tests for url change abstraction. Improved Tab.jsx tests;
- Tests for adding/removing slashes

### SAFE libraries Dependencies
- @maidsafe/safe-node-app: v0.7.0
- system_uri: v0.4.0
- safe_authenticator: v0.5.0

## [0.4.0]
### Fixed
- Menu.js simplified
- CLI Arg order fixed, enabling dev mode URI handling
- Handling of blob Urls
- Crashes from partial content requests.
- exec path can now contain whitespaces.

### Added
- Save/Retrieve Peruse Browser state from the network.
- Tests for save/retrieve redux flow.
- Notifications now have error type
- Logout clears browser stateToSave
- Partial Content can now be handled in a limited fashion (no multipart reqs)
- React 16, Electron, Webpack and React-ecosystem deps updated
- API Constants added to the DOM.
- Support for `options` in `webFetch` to enable fetching specific byte ranges.
- Logout clears tab history / bookmark data etc (including open tabs).

### SAFE libraries Dependencies
- @maidsafe/safe-node-app: v0.7.0
- system_uri: v0.4.0
- safe_authenticator: v0.5.0
