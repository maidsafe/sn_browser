# SAFE Browser

## About

Built upon [peruse](https://github.com/joshuef/peruse), but using its baked in extensibility to add [SAFE Network](https://safenetwork.tech) functionality.

## Web App Development

Looking for more information about developing websites/web apps _for_ the SAFE Network? [Take a look at the Web App Overview](https://github.com/maidsafe/safe_browser/blob/master/docs/web-app-development/SAFE-Web-App-Overview.md).

## Installation

For normal SAFE Network browsing, you should download the latest version of the browser from [The SAFE Browser releases](https://github.com/maidsafe/safe_browser/releases/latest) page.

Application developers should use the same link, but choose the `-dev` postfixed version for their platform. This version uses a `mock` network to allow local development (without the need to pay PUT costs on a live SAFE Network).

## Design

To find out more about the structure of Peruse and the SAFE functionality extending it, [read the Browser Application Design Overview](https://github.com/maidsafe/safe_browser/blob/master/docs/browser-development/Application-Design-Overview.md).

### Compiling

#### Prerequisites

- [Node.js](https://nodejs.org) ^8.0.0 (we recommend installing it via [nvm](https://github.com/creationix/nvm))
- [Git](https://git-scm.com/)
- [Yarn](https://yarnpkg.com) (as a replacement for `npm`).
- Windows-specific:
  - Yarn attempts to build modules concurrently with multiple child processes, which causes intermittent timing issues on Windows. Users need to run `yarn config set child-concurrency 1` just once to effect local yarn settings.
  - In order to be able to build native Node modules for this library, run `npm install --global --production windows-build-tools` which installs Python 2.x, Visual Studio 2015 build tools, and Visual C++ build tools.
- If you are using Ubuntu, Mint, or Debian 9 as OS, `libgconf-2-4` and/or `build-essential` dependencies might be missing. Please install them as needed with Synaptic Package Mgr., or with `apt` from a shell console: `$ sudo apt-get install libgconf-2-4 build-essential`

#### Building the Browser

- `git clone https://github.com/maidsafe/safe_browser.git`
- `cd safe_browser`
- `NODE_ENV=dev yarn` (`NODE_ENV` is needed to install mock libs and to run `yarn mock-dev`).
- `yarn rebuild`

And to run dev mode:

- `yarn mock-dev`

Want to run 'production' variables, but with hot reloading?

- `yarn put-live-net-files-for-<windows|osx|linux>`
- `yarn prod-dev`

Note, you'll need a crust.config set for the application. [Helper commands for osx/linux/windows](https://github.com/maidsafe/safe_browser/blob/master/package.json#L55-L58)

And to package:

- `yarn package`

The resulting packages are contained within the `releases` folder.

A packaged application, built in a `NODE_ENV=dev`, can access either `prod` or `dev` networks. `prod` is the default, or alternatively you can open the application and pass a `--mock` flag to open and use a mock network.

#### Build commands

There are a few build commands for various situations:

- `yarn mock-dev` will run a developer version of the application using `MockVault`
- `yarn prod-dev` will run a developer version of the application using the live network.
- `yarn build` compiles all code, but you shouldn't need to use this
- `yarn build-preload` will need to be run whenever you change the `preload.js` file for changes to show up in the browser.

### Release

`yarn bump` is available for automatically updating versions and generating a changelog update based upon conventional-commits.

### Testing

- `yarn test` runs jest (you have the optional `yarn test-watch`, too).
- `yarn test-e2e` runs spectron integration tests (not yet stable).

### Linting

- `yarn lint` runs the linter and throws all of the lint errors
- `yarn lint-fix` runs the linter, Automatically fix problems that it can & throws the remaining lint errors

### Logging

Via electron-log: `import logger from 'logger'`, and you can `logger.info('things')`.

Logs are printed to both render console and stdout. Logs are also written to a log file per system.

`yarn log-osx` will tail the file. Similar commands (as yet untested) exist for linux/windows.

## Further Help

You can discuss development-related questions on the [SAFE Dev Forum](https://forum.safedev.org/).
If you are just starting to develop an application for the SAFE Network, it's very advisable to visit the [SAFE Network Dev Hub](https://hub.safedev.org) where you will find a lot of relevant information, including tutorials.

## License

SAFE Browser is a lightly modified fork of the [Peruse Browser](https://github.com/joshuef/peruse).

This SAFE Network application is dual-licensed under the Modified BSD ([LICENSE-BSD](LICENSE-BSD) https://opensource.org/licenses/BSD-3-Clause) or the MIT license ([LICENSE-MIT](LICENSE-MIT) https://opensource.org/licenses/MIT) at your option.
