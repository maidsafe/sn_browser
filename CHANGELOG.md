# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.15.2](https://github.com/maidsafe/safe_browser/compare/v0.15.1...v0.15.2) (2019-10-23)

### Bug Fixes

- notarize permissions for mac ([b9c12b5](https://github.com/maidsafe/safe_browser/commit/b9c12b5))
- **mimetypes:** Add in mimtypes for ImmutaData from xorurls ([7df5b11](https://github.com/maidsafe/safe_browser/commit/7df5b11)), closes [#1012](https://github.com/maidsafe/safe_browser/issues/1012)
- **pWeb:** Block non versioned external site requests. ([6a1c5cb](https://github.com/maidsafe/safe_browser/commit/6a1c5cb)), closes [#1029](https://github.com/maidsafe/safe_browser/issues/1029)
- **pWeb:** Versioned sites now request relative resources from same version. ([1889365](https://github.com/maidsafe/safe_browser/commit/1889365)), closes [#1010](https://github.com/maidsafe/safe_browser/issues/1010)
- **react:** Update lifecycle methods for upgrading react ([aec5b18](https://github.com/maidsafe/safe_browser/commit/aec5b18))
- **resolution:** External NRS resolution fix. ([0e1f691](https://github.com/maidsafe/safe_browser/commit/0e1f691)), closes [#1052](https://github.com/maidsafe/safe_browser/issues/1052)
- **resolution:** Tweak to parse version of req url direct ([796d99e](https://github.com/maidsafe/safe_browser/commit/796d99e)), closes [#1052](https://github.com/maidsafe/safe_browser/issues/1052) [#1050](https://github.com/maidsafe/safe_browser/issues/1050)
- **versioning:** Hitting versioned url now reports proper latest v ([006502d](https://github.com/maidsafe/safe_browser/commit/006502d))

### Features

- **deps:** Update electron to 6.1.0 ([ef77f59](https://github.com/maidsafe/safe_browser/commit/ef77f59))
- **safe:** Update safe-nodejs to 0.3.1 ([bd13d86](https://github.com/maidsafe/safe_browser/commit/bd13d86))
- **XorUrl:** Expose XorUrlEncoder functionlaity. ([b21fe2f](https://github.com/maidsafe/safe_browser/commit/b21fe2f)), closes [#1022](https://github.com/maidsafe/safe_browser/issues/1022)

### [0.15.1](https://github.com/maidsafe/safe_browser/compare/v0.15.0...v0.15.1) (2019-10-03)

### Bug Fixes

- **mimetypes:** fix(mimetypes): Add in mimtypes for ImmutaData from xorurls ([7df5b11](https://github.com/maidsafe/safe_browser/commit/7df5b11))
- **mysites:** prevent from iterating through mysites list if the content was not found ([2a03264](https://github.com/maidsafe/safe_browser/commit/2a03264))
- **Windows MySites:** Dont write until mysites has been read. ([03ebb8c](https://github.com/maidsafe/safe_browser/commit/03ebb8c)), closes [#1008](https://github.com/maidsafe/safe_browser/issues/1008)

### [0.14.1](https://github.com/maidsafe/safe_browser/compare/v0.14.0...v0.14.1) (2019-07-10)

### Bug Fixes

- **logs:** fix logging on windows ([9f794de](https://github.com/maidsafe/safe_browser/commit/9f794de))
- **tab:** Open new tab next to current tab ([3e9a9f7](https://github.com/maidsafe/safe_browser/commit/3e9a9f7))
- **test:** add testcafe tests for addTabNext ([0b74d25](https://github.com/maidsafe/safe_browser/commit/0b74d25))

## [0.14.0](https://github.com/maidsafe/safe_browser/compare/v0.13.0...v0.14.0) (2019-06-27)

### Bug Fixes

- **Addressbar:** Removes focus() overkill to allow addressbar selection ([f81ca8e](https://github.com/maidsafe/safe_browser/commit/f81ca8e))
- **bookmarks:** Bookmarks should reset on logout ([2df5f5c](https://github.com/maidsafe/safe_browser/commit/2df5f5c))
- **CI:** Update travis xvfb invocation ([99deea8](https://github.com/maidsafe/safe_browser/commit/99deea8))
- **ConnectedRouter:** Previously Connected-react-router was listed a dev dep. Adds this as a standard dep ([ad0a631](https://github.com/maidsafe/safe_browser/commit/ad0a631))
- **DevTools:** Fix Toggle DevTools Shortcut ([bf7a8d0](https://github.com/maidsafe/safe_browser/commit/bf7a8d0))
- **history:** Minor fixes ([824747b](https://github.com/maidsafe/safe_browser/commit/824747b))
- **history/tabs:** Seperate history from tabs history / Add more tab actions ([da06a00](https://github.com/maidsafe/safe_browser/commit/da06a00))
- **Invite:** Invite page not notified as blocked when opening in clearnet browser ([#699](https://github.com/maidsafe/safe_browser/issues/699)) ([9b38a18](https://github.com/maidsafe/safe_browser/commit/9b38a18))
- **Menu:** fix minor issues with right click Menu ([3106567](https://github.com/maidsafe/safe_browser/commit/3106567))
- **Menu:** Inspect Element Fix ([329ba26](https://github.com/maidsafe/safe_browser/commit/329ba26))
- **Opening Links:** Adds a `wasLastInFocus` state to windows. ([c085abb](https://github.com/maidsafe/safe_browser/commit/c085abb))
- **openWindow:** use did-finish-load event for window open. ([952f83c](https://github.com/maidsafe/safe_browser/commit/952f83c))
- **reducers:** windows immutability fixes in reducer ([c477def](https://github.com/maidsafe/safe_browser/commit/c477def))
- **resetStore:** fix resetStore Action ([d8c4166](https://github.com/maidsafe/safe_browser/commit/d8c4166))
- **store:** Update History on read state from Network ([a288b29](https://github.com/maidsafe/safe_browser/commit/a288b29))
- **TabBar:** Prevents long tabtext overflow ([7b7715c](https://github.com/maidsafe/safe_browser/commit/7b7715c))
- **tabs:** Generate Unique Ids for individual tabs ([f201531](https://github.com/maidsafe/safe_browser/commit/f201531))
- **timeStamps:** Display local TimeStamps ([0aee7e6](https://github.com/maidsafe/safe_browser/commit/0aee7e6))
- **webId:** fix minor issues with WebIdDropDown ([4cc2971](https://github.com/maidsafe/safe_browser/commit/4cc2971))
- **webId:** fix webId dropdown error ([edab748](https://github.com/maidsafe/safe_browser/commit/edab748))
- **webIdDropDown:** Fix Error shown on opening a new Window ([b8530b8](https://github.com/maidsafe/safe_browser/commit/b8530b8))
- **webView:** Minor fixes for WebView Preload ([69c054e](https://github.com/maidsafe/safe_browser/commit/69c054e))
- **windows:** fix addTab End setting ActiveTab to null ([6421206](https://github.com/maidsafe/safe_browser/commit/6421206))

### Features

- ** electron :** Update to electron v 4.x ([4f453f6](https://github.com/maidsafe/safe_browser/commit/4f453f6))
- **context:** Add more context menus. ([87741c5](https://github.com/maidsafe/safe_browser/commit/87741c5)), closes [#597](https://github.com/maidsafe/safe_browser/issues/597)
- **Logging:** Minor tweaks and improved internal logging ([005b767](https://github.com/maidsafe/safe_browser/commit/005b767))
- **macOS:** Prompt to move app by default to 'Applications' ([5f6ae4a](https://github.com/maidsafe/safe_browser/commit/5f6ae4a))
- **redux-devtools:** Trace actions calls ([7d4edea](https://github.com/maidsafe/safe_browser/commit/7d4edea))
- **reload:** F5 for reload ([0e0a07b](https://github.com/maidsafe/safe_browser/commit/0e0a07b))

# [0.13.0](https://github.com/maidsafe/safe_browser/compare/v0.12.0...v0.13.0) (2019-04-26)

### Bug Fixes

- **auth-app:** adds necessary keys to resolve error message ([0261449](https://github.com/maidsafe/safe_browser/commit/0261449))
- **blocking:** Url blocking canGoBack check added. ([afa7c77](https://github.com/maidsafe/safe_browser/commit/afa7c77)), closes [#689](https://github.com/maidsafe/safe_browser/issues/689)
- **Fullscreen:** Fixes fullscreening when triggering on a second browser window ([90b954c](https://github.com/maidsafe/safe_browser/commit/90b954c))
- **icon:** Upon clicking experimental icon, experimental mode is turned off ([413d667](https://github.com/maidsafe/safe_browser/commit/413d667))
- **Links:** Opening a link will only open in focussed browser window now ([fc6f90c](https://github.com/maidsafe/safe_browser/commit/fc6f90c))
- **Menu:** Test menu now only shown during testcafe tests ([5aabb1a](https://github.com/maidsafe/safe_browser/commit/5aabb1a))
- **ui:** Adds antd spinner when waiting for webid's are fetching ([9803d41](https://github.com/maidsafe/safe_browser/commit/9803d41))
- **webId:** Dropdown positioning fixed ([a00a4ad](https://github.com/maidsafe/safe_browser/commit/a00a4ad))

### Features

- **Testing:** Add testcafe for alternative e2e testing ([6ef3bea](https://github.com/maidsafe/safe_browser/commit/6ef3bea))

# [0.12.0](https://github.com/maidsafe/safe_browser/compare/v0.11.2...v0.12.0) (2019-03-25)

### Bug Fixes

- **auth:** proper values returned on auth_decode_ipc_msg errors ([ce9c2fa](https://github.com/maidsafe/safe_browser/commit/ce9c2fa))
- **Chromium:** Update electron to 2.0.18 ([5cc6947](https://github.com/maidsafe/safe_browser/commit/5cc6947))
- **internal-pages:** Disable refresh button for Bookmarks and History pages as they are not webview instances ([d1c21f2](https://github.com/maidsafe/safe_browser/commit/d1c21f2))
- **linting:** Update eslint parser ([c78772f](https://github.com/maidsafe/safe_browser/commit/c78772f))
- **linting:** Update linting ([216616c](https://github.com/maidsafe/safe_browser/commit/216616c))
- **merge:** Add missing windowId in addressbar ([8f51254](https://github.com/maidsafe/safe_browser/commit/8f51254))
- **tests:** Post-TS fixes for test running. ([68c692b](https://github.com/maidsafe/safe_browser/commit/68c692b))
- **Tests:** Improves component wrapper tests with mocks. ([45381e6](https://github.com/maidsafe/safe_browser/commit/45381e6))
- **webId:** Calls to get webIds fixed. ([bd5fa7c](https://github.com/maidsafe/safe_browser/commit/bd5fa7c))

### Features

- **typescript:** Initial conversion of base structure to ts. ([9b36ec9](https://github.com/maidsafe/safe_browser/commit/9b36ec9))

## [0.11.2](https://github.com/maidsafe/safe_browser/compare/v0.11.1...v0.11.2) (2019-02-26)

### Bug Fixes

- **Changelog:** Readd accidentally removed bump command ([cee8e8d](https://github.com/maidsafe/safe_browser/commit/cee8e8d))
- **CI:** Add missing WAIT for some auth CI drivers ([f506a02](https://github.com/maidsafe/safe_browser/commit/f506a02)), closes [#565](https://github.com/maidsafe/safe_browser/issues/565)
- **CI:** Travis release sha256 naming fixed ([61a5bb7](https://github.com/maidsafe/safe_browser/commit/61a5bb7))
- **Deps:** upgrade lodash to >=4.17.11 to remediate security vulnerability ([#580](https://github.com/maidsafe/safe_browser/issues/580)) ([1acc846](https://github.com/maidsafe/safe_browser/commit/1acc846))
- **Devtools:** BG Process devtools no longer opens when running packaged/mock ([56f3af0](https://github.com/maidsafe/safe_browser/commit/56f3af0))
- **dom:** creates link_revealer div just once when browser mounts ([dfddafe](https://github.com/maidsafe/safe_browser/commit/dfddafe))
- **http:** Open blank tab when closing a new tab from http: req ([d214d74](https://github.com/maidsafe/safe_browser/commit/d214d74))
- **linting:** Fix eslint setup to run properly ([d1d0274](https://github.com/maidsafe/safe_browser/commit/d1d0274))
- **loading-logic:** able to move backwards to about:blank or reload about:blank ([b1e8a66](https://github.com/maidsafe/safe_browser/commit/b1e8a66))
- **package:** remove duplicate crust.config file in Windows package ([28b85e2](https://github.com/maidsafe/safe_browser/commit/28b85e2))
- **packaging:** remove unlinkSync for container folder ([e2737c7](https://github.com/maidsafe/safe_browser/commit/e2737c7))
- **Packaging:** Update startAsMock file location for dev builds. ([6b00fa5](https://github.com/maidsafe/safe_browser/commit/6b00fa5)), closes [#590](https://github.com/maidsafe/safe_browser/issues/590)
- **tabs:** reloads tabs independent of window ([df28e09](https://github.com/maidsafe/safe_browser/commit/df28e09))
- **tabs:** updates tab with URL when navigating via anchor link ([6517d22](https://github.com/maidsafe/safe_browser/commit/6517d22))
- **tabs:** Working tab context menu option: 'Open Link in New Tab' ([4367b1d](https://github.com/maidsafe/safe_browser/commit/4367b1d))
- **tests:** TDD - resolves failing tests ([27fe093](https://github.com/maidsafe/safe_browser/commit/27fe093))

<a name="0.11.1"></a>

## [0.11.1](https://github.com/maidsafe/safe_browser/compare/v0.7.0-rc.3...v0.11.1) (2019-01-24)

### Bug Fixes

- **Blocked URL Handling:** Blocked urls will now only send a tab back… ([#540](https://github.com/maidsafe/safe_browser/issues/540)) ([af377c3](https://github.com/maidsafe/safe_browser/commit/af377c3)), closes [#539](https://github.com/maidsafe/safe_browser/issues/539)
- **browserWindow:** Resizable on Windows by removing `thickFrame` option ([69cf411](https://github.com/maidsafe/safe_browser/commit/69cf411))
- **menu:** functioning Window menu items ([42dede2](https://github.com/maidsafe/safe_browser/commit/42dede2))
- **auth-ui:** adds missing padding and fixes grammar ([7e7e2d5](https://github.com/maidsafe/safe_browser/commit/7e7e2d5))
- **Deps:** Webpack dev server updated above 3.1.11 ([#511](https://github.com/maidsafe/safe_browser/issues/511)) ([6997b70](https://github.com/maidsafe/safe_browser/commit/6997b70))
- **electron-app:** only calls setAsDefaultProtocolClient if non-packed && !win32 ([0ae5930](https://github.com/maidsafe/safe_browser/commit/0ae5930))
- **http-handling:** changes behavior to go back to last URL instead of closing tab ([46102b7](https://github.com/maidsafe/safe_browser/commit/46102b7))
- **menu:** Save/Read browser state menu options ([472878a](https://github.com/maidsafe/safe_browser/commit/472878a))
- **tabs:** focuses reopened last tab ([6f0281f](https://github.com/maidsafe/safe_browser/commit/6f0281f))
- **tabs:** windowId is no longer undefined ([b084574](https://github.com/maidsafe/safe_browser/commit/b084574))
- **ui:** removes MacOS-specific menu column ([999fc5a](https://github.com/maidsafe/safe_browser/commit/999fc5a))
- **UI:** use right quotation mark for apostrophe ([#499](https://github.com/maidsafe/safe_browser/issues/499)) ([3b43db6](https://github.com/maidsafe/safe_browser/commit/3b43db6))
- **webview:** loads expected error after multiple subsequent invalid URI errors and localhost resource errors ([e9e22c6](https://github.com/maidsafe/safe_browser/commit/e9e22c6))

### Features

- **ui:** enhances accessibility and i18n ([0c8eedb](https://github.com/maidsafe/safe_browser/commit/0c8eedb))

<a name="0.11.0"></a>

## [0.11.0](https://github.com/maidsafe/safe_browser/compare/0.7.0...0.11.0) (2018-12-17)

### Bug Fixes

- Update author to be Maidsafe for (c) notice in about menu ([#464](https://github.com/maidsafe/safe_browser/issues/464)) ([c31a84c](https://github.com/maidsafe/safe_browser/commit/c31a84c))
- **TabHandling:** Opening a link with a completely new window crash fixed. ([0e35b01](https://github.com/maidsafe/safe_browser/commit/0e35b01))
- **URL Handling:** Cold opening safe/safe-auth: URL errors fixed. ([f6f5433](https://github.com/maidsafe/safe_browser/commit/f6f5433)), closes [#471](https://github.com/maidsafe/safe_browser/issues/471)
- **Address bar url handling:** No longer strip index/.html from urls ([#340](https://github.com/maidsafe/safe_browser/issues/340)) ([eb32eea](https://github.com/maidsafe/safe_browser/commit/eb32eea))
- **AddressBar:** changing import of dependency for case sensitive systems like linux ([420939c](https://github.com/maidsafe/safe_browser/commit/420939c))
- **AddressBar:** Various fixes to address bar buttons / actions ([e51d9e2](https://github.com/maidsafe/safe_browser/commit/e51d9e2))
- **auth:** DOM unauthed connection now resolves. ([8dec25c](https://github.com/maidsafe/safe_browser/commit/8dec25c))
- **auth:** Post refactor anon connection now registered for prod builds ([d3fd71b](https://github.com/maidsafe/safe_browser/commit/d3fd71b))
- **browser state:** wipes bookmarks and history upon logout ([3e169c4](https://github.com/maidsafe/safe_browser/commit/3e169c4)), closes [#325](https://github.com/maidsafe/safe_browser/issues/325)
- **browser-window:** adds frame to browser window options ([#366](https://github.com/maidsafe/safe_browser/issues/366)) ([7ed5bd8](https://github.com/maidsafe/safe_browser/commit/7ed5bd8)), closes [#362](https://github.com/maidsafe/safe_browser/issues/362)
- **Express server:** Small fix to auth file serving. ([3fd593b](https://github.com/maidsafe/safe_browser/commit/3fd593b))
- **install:** do a full build on 'yarn' ([3a04fca](https://github.com/maidsafe/safe_browser/commit/3a04fca))
- **lint:** Add in extension eslintrc ([5dc3d69](https://github.com/maidsafe/safe_browser/commit/5dc3d69))
- **logs:** Fix tab error log on crash ([eff813f](https://github.com/maidsafe/safe_browser/commit/eff813f))
- **memory:** mocks safeBrowserApplication_actions to prevent call stack size error ([be0a4df](https://github.com/maidsafe/safe_browser/commit/be0a4df))
- **package:** crust.config matches executable on Windows ([d83d34f](https://github.com/maidsafe/safe_browser/commit/d83d34f))
- **SafeApp init:** Only overwrite safeBrowserAppObject used for fetch upon successful auth. ([fabc8e3](https://github.com/maidsafe/safe_browser/commit/fabc8e3)), closes [#433](https://github.com/maidsafe/safe_browser/issues/433)
- **test:** adds delays ([6051db4](https://github.com/maidsafe/safe_browser/commit/6051db4))
- **test:** Fix address bar tests w/mock for native libs ([984dfd2](https://github.com/maidsafe/safe_browser/commit/984dfd2))
- **test:** update auth URIs with base32 encoded ones supported by safe_auth lib v0.9.0 ([f6e36a4](https://github.com/maidsafe/safe_browser/commit/f6e36a4))
- **tests:** Add in more mocks to prevent FFI / rangeReq error. ([30a92bb](https://github.com/maidsafe/safe_browser/commit/30a92bb))
- **tests:** further mocking to prevent FFI errors in jest ([0248373](https://github.com/maidsafe/safe_browser/commit/0248373))
- **tests:** OSX and Linux e2e tweaks ([bb1fced](https://github.com/maidsafe/safe_browser/commit/bb1fced))
- **typo:** missing comma ([a7654f5](https://github.com/maidsafe/safe_browser/commit/a7654f5))
- **ui:** adjusts spectron area styles to fix broken test ([d0cf556](https://github.com/maidsafe/safe_browser/commit/d0cf556))
- **UI:** adds action to props to dropdown web ID's ([0e47a13](https://github.com/maidsafe/safe_browser/commit/0e47a13))
- **UI:** when the app name is just - or \_ characters render them in the authenticator as they are ([a7c43e1](https://github.com/maidsafe/safe_browser/commit/a7c43e1))
- **webID:** WebId retrieval readded. ([e98a87c](https://github.com/maidsafe/safe_browser/commit/e98a87c))
- show app devtools in --debug mode after pack ([9c91a5d](https://github.com/maidsafe/safe_browser/commit/9c91a5d))
- **webview:** Update safe_app version to prevent webview crash. ([#453](https://github.com/maidsafe/safe_browser/issues/453)) ([045dad3](https://github.com/maidsafe/safe_browser/commit/045dad3))
- add icon to browserWindowConfig to display icon ([c121e40](https://github.com/maidsafe/safe_browser/commit/c121e40))
- show Auth popup after denying/ignoring an shared MD auth request ([9c4a8de](https://github.com/maidsafe/safe_browser/commit/9c4a8de))
- show Auth popup after denying/ignoring an shared MD auth request ([8dc9cf1](https://github.com/maidsafe/safe_browser/commit/8dc9cf1))

### Features

- **Experiments:** Add reducers and basic UI for experiments ([0a5ffb0](https://github.com/maidsafe/safe_browser/commit/0a5ffb0))
- **Expermients:** Enable passing options to app init ([a84f88f](https://github.com/maidsafe/safe_browser/commit/a84f88f))
- **safe-app:** Update safe app. ([d6e3799](https://github.com/maidsafe/safe_browser/commit/d6e3799))
- **safe-app:** Update safe app. (Also clean up some crazy logs) ([418696f](https://github.com/maidsafe/safe_browser/commit/418696f))
- **safe-app:** Updated safe-app-nodejs 0.10.0 ([1bb49ee](https://github.com/maidsafe/safe_browser/commit/1bb49ee))
- **tests:** add tests for shared MD auth request ([d9f6d87](https://github.com/maidsafe/safe_browser/commit/d9f6d87))
- **Tests:** Add tests to check login/logout behaviour. ([18386b3](https://github.com/maidsafe/safe_browser/commit/18386b3))
- **UI:** loads favicons in tab bar ([0a1be22](https://github.com/maidsafe/safe_browser/commit/0a1be22))
- **UI:** renders errors with React component ([10cbcd6](https://github.com/maidsafe/safe_browser/commit/10cbcd6))
- **ux:** link revealed upon mouse over link ([#392](https://github.com/maidsafe/safe_browser/issues/392)) ([29e091c](https://github.com/maidsafe/safe_browser/commit/29e091c))
- **UX:** key bindings to cycle tabs forwards and backwards ([c6717fa](https://github.com/maidsafe/safe_browser/commit/c6717fa))

## [0.7.0]

### Added

- Notification on network disconnect event with automatic reconnect upon network resolve
- Browser executed with no network connection shows notification upon `loginFromUri` attempt and automatically connects client upon network resolve
- POC for WebID handling in the browser.
- WebId DOM variables and event emitter added.
- Loading indicators
- Error pages
- UI view on failed-to-load webview event

### Fixed

- Able to paste value into create_account input fields via context menu option and value be analyzed for password strength
- Functioning share MD request
- Electron close app process on window close
- Link to invite.maidsafe.net no longer opens multiple external tabs
- Closing a tab to the left of the active tab results in rendering of correct webview
- Properly handles http links when triggering did-fail-load events to prevent external tab spamming and to close respective tab in Peruse
- E2E tests stabilised.
- Browser window gets focused when auth requests come in.
- App auth revocation.
- Window / tab handling.
- Functioning share MD request
- Electron close app process on window close
- Link to invite.maidsafe.net no longer opens multiple external tabs
- Closing a tab to the left of the active tab results in rendering of correct webview
- Properly handles http links when triggering did-fail-load events to prevent external tab spamming and to close respective tab in Peruse
- Network state poperly propagates to auth-web-app
- isAuthorised state properly propagates to auth-web-app to produce expected UI when reloading logged out safe-auth://home
- Able to successfully auth when logging in on mock-dev on Windows
- No longer hanging when logging in on Linux
- Auths external apps on mock-dev and mock-prod

### Changed

- Electron to 2.0.8
- Deps updated in general.
- Jest tests run in electron env.
- CI deployment credentials
- Testing only packaged app in CI

### SAFE libraries Dependencies

- @maidsafe/safe-node-app: `338ec368e25eb2e258d2447413006d74ecc23a15`

## [0.6.0]

### Changed

- safeNetwork reducer becomes peruseSafeApp
- specific domAPI implementations removed
- new DOM API based upon safe-app-nodejs(@e818f8ace834caf891cd57f4fb9186ae19541f5e)
- release naming updated.
- Much of SAFE specific functionality moved to extension
- Removes window frame and increases draggable area, with exception to Windows
- Passes full auth info to Notifier
- Authenticator web app upgraded for react-router v4 and is buildable with webpack

### Fixed

- `eval` has been disabled.
- domAPI handles removed

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

## [0.5.3]

### Changed

- Electron to 1.8.4

## [0.5.2]

### Fixed

- Add missing `errConst` in ff/ipc.js

### Changed

- Change default port for webpack-dev-server

## [0.5.1]

### Fixed

- Reopen closed tab works.
- `mock` store update initing before loginForTest to ensure UI is up to date even when not in a `NODE_ENV=dev` env.
- Appveyor build process names `dev-` files correctly.

### Added

- Safe extension only installs dev libs in a dev env.

## [0.5.0]

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
