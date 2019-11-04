# SAFE Browser

|                                                          Linux/macOS                                                          |
| :---------------------------------------------------------------------------------------------------------------------------: |
| [![Build Status](https://travis-ci.com/maidsafe/safe_browser.svg?branch=master)](https://travis-ci.com/maidsafe/safe_browser) | [![Build status] |

## Table of contents

1. [About](#about)
1. [Web App Development](#web-app-development)
1. [Installation](#installation)
1. [Design](#design)
   - [Build](#Build)
     - [Prerequisites](#prerequisites)
     - [Build steps](#build-steps)
     - [Development Commands](#development-commands)
   - [Release](#Release)
   - [Testing](#Testing)
   - [Linting](#Linting)
   - [Logging](#Logging)
1. [Contributing](#contributing)
   - [Project board](#project-board)
   - [Issues](#issues)
   - [Commits and Pull Requests](#commits-and-pull-requests)
   - [Releases and Changelog](#releases-and-changelog)
   - [Copyrights](#copyrights)
1. [License](#license)

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

Via electron-log: `import { logger } from '$Logger'`, and you can `logger.info('things')`.

Logs are printed to both render console and stdout. Logs are also written to a log file per system.

`yarn log-osx` will tail the file. Similar commands (as yet untested) exist for linux/windows.

## Contributing

As an open source project we're excited to accept contributions to the code from outside of MaidSafe, and are striving to make that as easy and clean as possible.

With enforced linting and commit style clearly layed out, as well as a list of more accessible issues for any project labeled with `Help Wanted`.

This project adheres to the [Contributor Covenant](https://www.contributor-covenant.org/). By participating, you are expected to honor this code.

### Project board

GitHub project boards are used by the maintainers of this repository to keep track and organise development priorities.

There could be one or more active project boards for a repository. One main project will be used to manage all tasks corresponding to the main development stream (`master` branch). E.g. https://github.com/maidsafe/safe_browser/projects/1. A separate project may be used to manage each PoC and/or prototyping development, and each of them will track a dedicated development branch.

New features which imply big number of changes will be developed in a separate branch but tracked in the same main project board, re-basing it with `master` branch regularly, and fully testing the feature on its branch before it's merged onto the master branch after it was fully approved.

The main project contains the following Kanban columns to track the status of each development task:

- `Needs Triage`: new issues which need to be reviewed and evaluated to decide priority
- `Low Priority`: not required for the very next milestone
- `High Priority`: required for the very next milestone, or a subsequent one according to circumstances
- `In Progress`: task is assigned to a person and it's in progress
- `Needs Review`: a Pull Request which completes the task has been sent and it needs to be reviewed
- `Approved by Reviewer`: the PR sent was approved by reviewer/s and it's ready for merge
- `Closed`: PR associated to the issue was merged (or task was completed by any other means)

### Issues

Issues should clearly lay out the problem, platforms experienced on, as well as steps to reproduce the issue.

This aids in fixing the issues but also quality assurance, to check that the issue has indeed been fixed.

Issues are labeled in the following way depending on its type:

- `bug`: the issue is a bug in the product
- `feature`: the issue is a new and inexistent feature to be implemented in the product
- `enhancement`: the issue is an enhancement to either an existing feature in the product, or to the infrastructure around the development process of the product
- `blocked`: the issue cannot be resolved as it depends on a fix in any of its dependencies
- `good first issue`: an issue considered more accessible for any developer trying to start contributing

### Commits and Pull Requests

We use [Conventional Commit](https://www.conventionalcommits.org/en/v1.0.0-beta.3/) style messages. (More usually [with a scope](https://www.conventionalcommits.org/en/v1.0.0-beta.3/#commit-message-with-scope)) for commits.

Commits should therefore strive to tackle one issue/feature, and code should be pre-linted before commit.

PRs should clearly link to an issue to be tracked on the project board. A PR that implements/fixes an issue is linked using one of the [GitHub keywords](https://help.github.com/articles/closing-issues-using-keywords). Although these type of PRs will not be added themselves to a project board (just to avoid redundancy with the linked issue). However, PRs which were sent spontaneously and not linked to any existing issue will be added to the project and should go through the same process as any other tasks/issues.

Where appropriate, commits should _always_ contain tests for the code in question.

### Releases and Changelog

The change log is currently maintained manually, each PR sent is expected to have the corresponding modification in the [CHANGELOG](CHANGELOG.MD) file, under the ['Unreleased' section](CHANGELOG.MD#unreleased). We are planning to start using [standard-version](https://www.npmjs.com/package/standard-version) shortly for maintaining the changelog.

The release process is triggered by the maintainers of the package, by bumping the package version according to the [SemVer](https://semver.org/) spec, and pushing a tag to have our Travis CI scripts to automatically create the new version of `@maidsafe/safe-node-app` package and publish it at [https://www.npmjs.com/package/@maidsafe/safe-node-app](https://www.npmjs.com/package/@maidsafe/safe-node-app)

### Copyrights

Copyrights in the SAFE Network are retained by their contributors. No copyright assignment is required to contribute to this project.

## Further Help

You can discuss development-related questions on the [SAFE Dev Forum](https://forum.safedev.org/).
If you are just starting to develop an application for the SAFE Network, it's very advisable to visit the [SAFE Network Dev Hub](https://hub.safedev.org) where you will find a lot of relevant information, including a [tutorial to create an example SAFE web application](https://hub.safedev.org/platform/web/) which makes use of the API exposed by the SAFE Browser.

## License

This SAFE Network library is dual-licensed under the Modified BSD ([LICENSE-BSD](LICENSE-BSD) https://opensource.org/licenses/BSD-3-Clause) or the MIT license ([LICENSE-MIT](LICENSE-MIT) https://opensource.org/licenses/MIT) at your option.
