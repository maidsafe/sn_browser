# Peruse

## About
An electron web browser. Built to be a basis. Extendable by design.

## WebApp Development 

Safe uses the RDF compliant WebId system for easily enabling user account management.

You can retrieve the current webId via `window.currentWebId`;

You can listen for changes via the event emitter, `window.webIdEventEmitter`, eg:

```js
webIdEventEmitter.on('update', ( webId ) => {
  console.log('an updateId occurred!', webId);
});

```


## Development

There are `dev-` prefixed releases of Peruse available. These come with both live network and mock network libs, bundled.

By default, opening the app will open Peruse for the mock network (when you're running in a `NODE_ENV=dev` environment).

Otherwise, there is the option to pass a `--live` flag to the browser. This will start the browser in a `live` network mode.

eg, on OSX:

`NODE_ENV=dev open Peruse.app --args --live`

### Debugging

A `--debug` flag is also available to get extra logs and devtool windows when working with a packaged application.

Additionally, the `--preload` flag can be passed in order to get the following features preloaded in `mock` network mode:

- an [interactive tool](https://github.com/maidsafe/safe_examples/tree/master/safe_web_api_playground) to learn about the browser's SAFE network API, located at `safe://api.playground`
- Account login credentials, both secret and password being `mocksafenetworkdeveloper`

`NODE_ENV=dev open Peruse.app --args --mock --preload`

### Compiling

Make sure you have both git and [yarn](https://yarnpkg.com/en/docs/install) installed.


- `git clone https://github.com/joshuef/peruse.git`
- `cd peruse`
- `NODE_ENV=dev yarn` (`NODE_ENV` is needed to install mock libs and to tun `yarn mock-dev`).
- `yarn rebuild`

And to run dev mode:
- `yarn mock-dev`

Want to run 'production' variables, but with hot reloading?
- `yarn prod-dev`

Note, you'll need a crust.config set for the application. [Helper commands are available on osx/linux](https://github.com/joshuef/peruse/blob/master/package.json#L43-L44) (not windows yet, sorry! this is only temporary.)

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
