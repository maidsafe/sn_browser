# Peruse Change Log
All notable changes to this project will be documented in this file.

#### [Unreleased]
##### Added
- Allows client to receive error if non-standard container is requested during authorisation
- Creates central constants for SAFE API 

## [0.4.1]
### Fixed
- Removing bookmarks removes correct index.
- Remove trailing slash for history. Add trailing slash for webview loads.
- Improve 'Unexpected logic error' message with a note to point to invite.maidsafe.net
- Scrollable history/bookmarks pages.
- URL change check improved

#### [v0.2.0](https://github.com/joshuef/peruse/compare/v0.10.0-1...v0.2.0)
> 19 December 2017
- hmmm something borked [`c686b0c`](https://github.com/joshuef/peruse/commit/c686b0ca3942d400d843aff2682f5d7026e441ac)
- feat/ui: Add UI reducer and setup actions for focussing addressbar [`6269df7`](https://github.com/joshuef/peruse/commit/6269df7c0d54a1eab22d22b934ffa981c41ba1fb)
- add bookmarks reducer and actions [`bc334b8`](https://github.com/joshuef/peruse/commit/bc334b88c1e0b4b6e9c65f921b37489a26c91b3d)
- init of TabSpec [`603bad9`](https://github.com/joshuef/peruse/commit/603bad97299377f88b0cdecf798e8e8629a6a470)
- init of history [`4d0f95c`](https://github.com/joshuef/peruse/commit/4d0f95c29a8348ebdd92e5e03ceb9d6467f66ebf)
- add bookmark list page [`1441166`](https://github.com/joshuef/peruse/commit/1441166ccc316f4f4242655f260e61a81466f42b)
- browser tests [`e87a9f0`](https://github.com/joshuef/peruse/commit/e87a9f06a9838523eaa2a7ee19d5c54758b9aa4a)
- fix/dom-auth: Fix domAuth after window/redux state refactor. [`49fb642`](https://github.com/joshuef/peruse/commit/49fb64219da53854eb36e87dff8c81a08ff560c0)
- add bookmarks to address bar [`953568f`](https://github.com/joshuef/peruse/commit/953568fe716db2e8d764ea85e62e961aca2d551b)
- basic history [`c26b18f`](https://github.com/joshuef/peruse/commit/c26b18fde18993d94c969623c7a4fe94f9d37972)
- mo brows [`e0df9ba`](https://github.com/joshuef/peruse/commit/e0df9bac4b70d985d933cbdeb6df374d701822d3)
- feat/locahost: Add localhost to http:localhost urlhelper [`0ebe723`](https://github.com/joshuef/peruse/commit/0ebe7235271a9171b25c280d4be6a8e0cc45e5a5)
- fix/auth-req: Fix auth request response handling. [`652e208`](https://github.com/joshuef/peruse/commit/652e208e99928d5a9de7fdde84c815c33a7ed34d)
- mo brows [`b16cb05`](https://github.com/joshuef/peruse/commit/b16cb050cf0dc6c4a59c2166efe908307663a901)
- fix/dev: Manually install app deps to get any applied NODE_ENV [`3c6bf8b`](https://github.com/joshuef/peruse/commit/3c6bf8bb2bc60b5fbc20ea38798b9d1d71afe3c7)
### Added
- Tests for url change abstraction. Improved Tab.jsx tests;
- Tests for adding/removing slashes

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
