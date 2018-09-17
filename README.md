# SAFE Browser

## About

Built upon [peruse](https://github.com/joshuef/peruse), but using its baked in extensibility to add [SAFE Network](https://safenetwork.tech) functionality.

## Installation

For normal SAFE Network browsing, you should download the latest version of the browser from [The SAFE Browser releases](https://github.com/maidsafe/safe_browser/releases) page.

Application developers should use the same link, but choose the `-dev` postfixed version for their platform. This version uses a `mock` network to allow local development (without the need to pay PUT costs on a live SAFE Network).


## WebApp Development

There are `-dev` postfixed releases of Peruse available. These come with both live network and mock network libs, bundled.

By default, opening the app will open Peruse for the mock network.

Otherwise, there is the option to pass a `--live` flag to the browser. This will start the browser in a `live` network mode.

eg, on OSX:

```bash
open Peruse.app --args --live
```

### SAFE Network API

Peruse exposes a set of APIs in the DOM which webapps can make use to connect to the SAFE Network, as well as fetch and store data on it.

A webapp has direct access to this set of APIs through the DOM at `window.safe`.

The SAFE Network client API exposed by Peruse is a simple wrapper on top of the API provided by the `@maidsafe/safe-node-app` package (with a few minor exceptions explained below), therefore the documentation available for the `safe-node-app` API is valid and is the main reference for any developer wanting to create a webapp for The SAFE Network.

This API documentation can be found at the following URL: https://docs.maidsafe.net/safe_app_nodejs

As an example, if a webapp is trying to make use of the [initialiseApp](https://docs.maidsafe.net/safe_app_nodejs/#initialiseapp) function, it simply needs to prefix the function name with `window.safe`, i.e. it shall simply call `window.safe.initialiseApp` and provide the parameters as described in that documentation. Note that it's not needed to import/require the `safe-app-node` package with `require('@maidsafe/safe-node-app')` from a webapp.

You will find some example code snippets in the [API documentation](https://docs.maidsafe.net/safe_app_nodejs) as well, that you can use to learn, and also look at the [Debugging section](#debugging) below for the interactive tool to try out the API.

As mentioned above, there are only a few functions related to the initialisation and app authorisation request process that are exposed by Peruse and which slightly differ from the `safe-app-node` API:
* There are no [initialisation options](https://docs.maidsafe.net/safe_app_nodejs/#initoptions) supported by the [initialiseApp](https://docs.maidsafe.net/safe_app_nodejs/#initialiseapp) function exposed in the DOM API
* There are no [initialisation options](https://docs.maidsafe.net/safe_app_nodejs/#initoptions) supported by the [fromAuthUri](https://docs.maidsafe.net/safe_app_nodejs/#fromauthuri) function exposed in the DOM API
* [openUri](https://docs.maidsafe.net/safe_app_nodejs/#authinterfaceopenuri) is not available in the DOM API. A webapp shall instead call the `window.safe.authorise` function to send an authorisation request to the Authenticator. E.g.:
    ```js
    const appInfo = {
        name: 'Hello SAFE Network',
        id: 'net.maidsafe.tutorials.web-app',
        version: '1.0.0',
        vendor: 'MaidSafe.net Ltd.'
    };

    async function authoriseAndConnect() {
      console.log('Initialising a SAFE app client instance...');
      const safeApp = await window.safe.initialiseApp(appInfo);

      console.log('Authorising the application...');
      const authReqUri = await safeApp.auth.genAuthUri();
      const authUri = await window.safe.authorise(authReqUri);
      console.log('SAFE application authorised by user');

      await safeApp.auth.loginFromUri(authUri);
      console.log("Application connected to the network");
    };

    ```

### Experimental APIs

You are free to use any of the experimental APIs exposed, to explore the features and APIs that are being actively developed.

Although you should be aware of the fact that all/any of the experimental APIs may be moved behind a feature flag, changed, deprecated, or even removed in the future, and without much anticipated notification by the core developers.

The reason they are exposed is to just allow developers to experiment and start learning about the APIs at an early stage.

#### SAFE WebId

SAFE uses the RDF compliant WebId system for easily enabling user account management.

You can retrieve the current WebId via `window.currentWebId`.

Additionally, you can listen for changes via the event emitter, `window.webIdEventEmitter`, eg:

```js
webIdEventEmitter.on('update', ( webId ) => {
  console.log('an update to current WebID occurred!', webId);
});
```

There is a set of very experimental APIs available on a `SAFEApp` instance (the object you obtain from calling `window.safe.initialiseApp`) which are utilities to manipulate WebIDs and public names. Since they are in their very early stage there is no documentation available just yet, but in case you want to explore them, this is an example how you can access them:

```js
const safeApp = await window.safe.initialiseApp( appInfo );
await safeApp.web.createPublicName( ... );
```

#### RDF utilities

Another set of utilities in their early stage of development can be found in the RDF and WebID emulations. As you probably know our MutableData API supports emulations to be implemented on top of them, e.g. our NFS emulation allows apps to access the MutableData data as if it was a files directory.

In an analogous way to the NFS emulation, the RDF and WebID emulations can be applied on top of any MutableData object, e.g.:

```js
const safeApp = await window.safe.initialiseApp( appInfo );
// authorise and connect to the network...
...
const md = await safeapp.mutableData.newRandomPublic( 15001 );
await md.quickSetup();
const rdfEmulation = await md.emulateAs( 'rdf' );
```

### Debugging

A `--debug` flag is also available to get extra logs and devtool windows when working with a packaged application.

Additionally, the `--preload` flag can be passed in order to get the following features preloaded in `mock` network mode:

- An [interactive tool](https://github.com/maidsafe/safe_examples/tree/master/safe_web_api_playground) to learn about the browser's SAFE network API, located at `safe://api.playground`
- Account login credentials, both secret and password being `mocksafenetworkdeveloper`

`open Peruse.app --args --mock --preload`


## Browser Development

### Compiling

Make sure you have both git and [yarn](https://yarnpkg.com/en/docs/install) installed.

You need to use node.js version `8.x` to build the browser currently.

- `git clone https://github.com/maidsafe/safe_browser.git`
- `cd safe_browser`
- `NODE_ENV=dev yarn` (`NODE_ENV` is needed to install mock libs and to run `yarn mock-dev`).
- `yarn rebuild`

And to run dev mode:
- `yarn mock-dev`

Want to run 'production' variables, but with hot reloading?
- `yarn put-live-net-files-for-<windows|osx|linux>`
- `yarn prod-dev`

Note, you'll need a crust.config set for the application. [Helper commands for osx/linux/windows](https://github.com/maidsafe/safe_browser/blob/master/package.json#L53-L55)

And to package:
- `yarn package`

The resulting packages are contained within the `releases` folder.

A packaged application, built in a `NODE_ENV=dev`, can access either `prod` or `dev` networks. `prod` is the default, or alternatively you can open the application and pass a `--mock` flag to open and use a mock network.

#### Build commands

There are a few build commands for various situations:

- `yarn mock-dev` will run a peruse developer version of the application using `MockVault`
- `yarn prod-dev` will run a peruse developer version of the application using the live network.
- `yarn build` compiles all code, but you shouldn't need to use this
- `yarn build-preload` will need to be run whenever you change the `preload.js` file for changes to show up in the browser.

### Redux

The core is built around redux for simple state management allowing for easy
extensibility.

### React

The interface is built in react for simple data flow and clear componentisation.


### Webpack

`webpack.config.base` contains loaders and alias' used across all webpack configs.

There is a prod, config. Alongside renderer configs.

When developing against hot reloading, the `vendor` setup is used to speed up build times etc.

There are 'dev' mode configs for running against the NODE_ENV=develeopment setup.
There are 'live-dev' configs for running against NODE_ENV=production but without needing to package.

### Testing

- `yarn test` runs jest (you have the optional `yarn test-watch`, too).
- `yarn test-e2e` runs spectron integration tests (not yet stable).
- `yarn lint` ...lints...

### Logging

Via electron-log: `import logger from 'logger'`, and you can `logger.info('things')`.

Logs are printed to both render console and stdout. Logs are also written to a log file per system.

`yarn log-osx` will tail the file. Similar commands (as yet untested) exist for linux/windows.


## SAFE Network

The `safe` code is contained within the `app/extensions` folder. This includes
a simple http server with is used to provide the http like functionalities of the safe network.

Currently you need to authenticate against the SAFE Browser to get network access.

### Authenticator

Currently, we're using a `temp_dist` version of the authenticator webapp, prebuilt from the 'beaker-plugin-safe-authenticator'.

- APIs are located in `app/extensions/safe/api`;
- APIs are located in `app/extensions/safe/auth-api`;

## Further Help

You can discuss development-related questions on the [SAFE Dev Forum](https://forum.safedev.org/).
If you are just starting to develop an application for the SAFE Network, it's very advisable to visit the [SAFE Network Dev Hub](https://hub.safedev.org) where you will find a lot of relevant information, including tutorials.

## License

SAFE Browser is a lightly modified fork of the [Peruse Browser](https://github.com/joshuef/peruse).

This SAFE Network application is dual-licensed under the Modified BSD ([LICENSE-BSD](LICENSE-BSD) https://opensource.org/licenses/BSD-3-Clause) or the MIT license ([LICENSE-MIT](LICENSE-MIT) https://opensource.org/licenses/MIT) at your option.
