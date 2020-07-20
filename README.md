# SAFE Browser

## Status.

The Safe Browser is actively being developed against various iterations of The Safe Network. Both of which are still considered alpha software, so please be prepared to encounter and [report bugs](https://github.com/maidsafe/safe-browser/issues/new)!

You currently (need the `Safe Authenticator` to be installed.)[https://github.com/maidsafe/safe-api#the-authenticator-daemon].

|                                                           Linux/macOS                                                            |
| :------------------------------------------------------------------------------------------------------------------------------: |
|  [![Build Status](https://travis-ci.com/maidsafe/safe_browser.svg?branch=master)](https://travis-ci.com/maidsafe/safe_browser)   | [![Build status] |
| [![Build](https://github.com/maidsafe/safe_browser/workflows/Build/badge.svg)](https://github.com/maidsafe/safe_browser/actions) | [![Build status] |

## Table of contents

1. [About](#about)
2. [Web App Development](#web-app-development)
3. [Installation](#installation)
4. [Design](#design)
   - [Build](#Build)
     - [Prerequisites](#prerequisites)
     - [Build steps](#build-steps)
     - [Development Commands](#development-commands)
   - [Release](#Release)
   - [Testing](#Testing)
   - [Linting](#Linting)
   - [Logging](#Logging)
5. [Further help](#further-help)
6. [License](#license)
7. [Contributing](#contributing)

## About

Built upon [peruse](https://github.com/joshuef/peruse), but using its baked in extensibility to add [SAFE Network](https://safenetwork.tech) functionality.

## Web App Development

Looking for more information about developing websites/web apps _for_ the SAFE Network? [Take a look at the Web App Overview](https://github.com/maidsafe/safe_browser/blob/master/docs/web-app-development/SAFE-Web-App-Overview.md).

## Installation

For normal SAFE Network browsing, you should download the latest version of the browser from [The SAFE Browser releases](https://github.com/maidsafe/safe_browser/releases/latest) page.

Application developers should use the same link, but choose the `-dev` postfixed version for their platform. This version uses a `mock` network to allow local development (without the need to pay PUT costs on a live SAFE Network).

We use a `dev` branch for development. And we keep `master` as a stable reference updated with each release.

## Design

To find out more about the structure of Peruse and the SAFE functionality extending it, [read the Browser Application Design Overview](https://github.com/maidsafe/safe_browser/blob/master/docs/browser-development/Application-Design-Overview.md).

### Build

#### Prerequisites

- [Node.js](https://nodejs.org) ^8.0.0 (we recommend installing it via [nvm](https://github.com/creationix/nvm))
- [Git](https://git-scm.com/)
- [Yarn](https://yarnpkg.com) (as a replacement for `npm`).
- Windows-specific:
  - Yarn attempts to build modules concurrently with multiple child processes, which causes intermittent timing issues on Windows. Users need to run `yarn config set child-concurrency 1` just once to effect local yarn settings.
  - In order to be able to build native Node modules for this library, run `npm install --global --production windows-build-tools` which installs Python 2.x, Visual Studio 2015 build tools, and Visual C++ build tools.
- If you are using Ubuntu, Mint, or Debian 9 as OS, `libgconf-2-4` and/or `build-essential` dependencies might be missing. Please install them as needed with Synaptic Package Mgr., or with `apt` from a shell console: `$ sudo apt-get install libgconf-2-4 build-essential`

#### Build steps

- `git clone https://github.com/maidsafe/safe_browser.git`
- `git checkout master` (`master` is the stable branch. `dev` is current working branch)
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

##### linux

On Linux, the packaged application gets generated as a `Shared Library` file and hence cannot be run by double-clicking the executable. This is due to an issue with `electron-builder`( https://github.com/electron-userland/electron-builder/issues/3950 ). But the application can be run through the terminal. You can run the browser by running `./safe-browser`.

##### macOS

On macOS, the application should be located in the 'Applications' for [security reasons](https://github.com/potionfactory/LetsMove/issues/56). By default the packaged application will prompt to move the application. To override this, you can pass `--ignoreAppLocation`:

`open release/safe-browser-<version>-mac-x64/SAFE\ Browser.app --args --ignoreAppLocation`

#### Development commands

There are a few build commands for various situations:

- `yarn prod-dev` will run a developer version of the application using the live network.
- `yarn build` compiles all code, but you shouldn't need to use this
- `yarn build-preload` will need to be run whenever you change the `preload.js` file for changes to show up in the browser.

### Release

Pushes to master will be automatically released, with changelog generated from conventional commits (enforced at commit time, and checked at CI), and the version bumped autmomatically.

#### Alpha/Beta Channels

To release alpha/beta versions of the browser, simply push to the `alpha` or `beta` channel branches and the release process will be done for that channel, as per master, but generating a `-<channel> post-fixed release and relevant electron-updater files.

### Testing

- `yarn test` runs jest (you have the optional `yarn test-watch`, too).
- `yarn test-e2e` runs spectron integration tests (not yet stable).

### Linting

- `yarn lint` runs the linter and throws all of the lint errors
- `yarn lint-fix` runs the linter, Automatically fix problems that it can & throws the remaining lint errors

### Logging

Via electron-log: `import { logger } from '$Logger'`, and you can `logger.info('things')`.

Logs are printed to both render console and stdout. Logs are also written to a log file per system.

`yarn log-osx` will tail the file. Similar commands (as yet untested) exist for linux/windows.

`electron-log`is used under the hood, and ouputs logs to:

- on Linux: ~/.config/safe-browser/logs/{process type}.log
- on macOS: ~/Library/Logs/Safe Browser/{process type}.log
- on Windows: %USERPROFILE%\AppData\Roaming\Safe Browser\logs\{process type}.log

## Further Help

You can discuss development-related questions on the [SAFE Dev Forum](https://forum.safedev.org/).
If you are just starting to develop an application for the SAFE Network, it's very advisable to visit the [SAFE Network Dev Hub](https://hub.safedev.org) where you will find a lot of relevant information, including a [tutorial to create an example SAFE web application](https://hub.safedev.org/platform/web/) which makes use of the API exposed by the SAFE Browser.

## License

This SAFE Network library is dual-licensed under the Modified BSD ([LICENSE-BSD](LICENSE-BSD) https://opensource.org/licenses/BSD-3-Clause) or the MIT license ([LICENSE-MIT](LICENSE-MIT) https://opensource.org/licenses/MIT) at your option.

## Contributing

Want to contribute? Great :tada:

There are many ways to give back to the project, whether it be writing new code, fixing bugs, or just reporting errors. All forms of contributions are encouraged!

For instructions on how to contribute, see our [Guide to contributing](https://github.com/maidsafe/QA/blob/master/CONTRIBUTING.md).
