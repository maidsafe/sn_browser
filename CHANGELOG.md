# SAFE Browser Changelog

## [Unreleased]
### Changed
- Upgrade beaker-plugin-safe-app to v0.4.5
- Upgrade beaker-plugin-safe-authenticator to v0.4.3

### Added
- Support for exposing objects declared in plugins as constants in the DOM API
- Expose `safe-node-app` helper constants in DOM API at `window.safeApp.CONSTANTS`
- Support providing additional options to `webFetch` function, e.g. range of bytes

### Fixed
- Generate a handle for each sign key returned by the `listPermissionSets` DOM API function

### SAFE libraries Dependencies
#### Direct Dependencies
- beaker-plugin-safe-app: v0.4.5
- beaker-plugin-safe-authenticator: v0.4.3

#### Indirect Dependencies
- @maidsafe/safe-node-app: v0.7.0
- safe_app: v0.5.0
- safe_authenticator: v0.5.0
- system_uri: v0.4.0

## [0.8.1] - 20-12-2017
### Changed
- Upgrade beaker-plugin-safe-app to v0.4.4
- Upgrade beaker-plugin-safe-authenticator to v0.4.2

### Fixed
- Fix the safeMutableDataEntries.forEach function which was incorrectly returning the 'key' as an object
- Allow MutableData handles to be removed from the safe-app plugin's Map thru a 'free' function
- Minor fix in DOM API documentation example for safeCryptoSignKeyPair.getSecSignKey function

### SAFE libraries Dependencies
#### Direct Dependencies
- beaker-plugin-safe-app: v0.4.4
- beaker-plugin-safe-authenticator: v0.4.2

#### Indirect Dependencies
- @maidsafe/safe-node-app: v0.6.0
- safe_app: v0.5.0
- safe_authenticator: v0.5.0
- system_uri: v0.3.0

# 0.8.0

- Upgrade authenticator plugin to v0.4.1.
- Upgrade safe-app plugin to v0.4.3 with change in DOM API as per safe_client_libs API changes.
- Support for providing crust config path with SAFE_CONFIG_PATH env var.
- Issue related to revocation of apps fixed thanks to safe_authenticator upgrade.
- Some additional automated tests created.

# 0.7.0

- Fix the issue with favicons which are now loaded and displayed for safe:// sites.
- Warn the user upon a network disconnection event in the browser, not only from the Authenticator page but in any open tab, and attempt to automatically reconnect every 30 secs if the user doesn’t explicitly do it.
- Assure that when reconnecting to the network, not only the Authenticator connection is re-established but also the ones for the safe_app plugin and the browser app so the browser state can be saved on the network afterwards.
- Functionality to run tests on the DOM API functions within the browser, and creation of a checklist document for manual testing.
- Fix URI scheme registration for dev mode so the browser can receive authorisation requests even when launched with yarn start.
- Minor enhancement to README for Windows build instructions.
- Fix minor issues when fetching sites with a relative path.
- Uses authenticator plugin v0.3.1.
- Uses safe-app plugin v0.3.1.

# 0.6.0

- Storing history and bookmarks to network
- UI improvements
- uses authenticator plugin v0.3.0
- uses safe-app plugin v0.3.0
