# Peruse Change Log
All notable changes to this project will be documented in this file.

## [Unreleased]
### Fixed
- Removing bookmarks removes correct index.
- Remove trailing slash for history. Add trailing slash for webview loads.

### Added

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
