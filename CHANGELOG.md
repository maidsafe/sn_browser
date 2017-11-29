# SAFE Browser Changelog

# 0.8.0

- Upgrade authenticator plugin to v0.4.1.
- Upgrade safe-app plugin to v0.4.1 with change in DOM API as per safe_client_libs API changes.
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
