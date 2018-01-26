# Peruse

## About
An electron web browser. Built to be a basis. Extendable by design.

## Development

- `git clone git@github.com:joshuef/peruse.git`
- `cd peruse`
- `yarn`
- `yarn rebuild`

And to run dev mode, ensure you run `yarn` with `NODE_ENV=dev` set:
- `yarn dev`

Want to run 'production' variables, but with hot reloading? Ensure you run the initial `yarn` with `NODE_ENV=` set, then:
- `yarn live-dev`
Note, you'll need a crust.config set for the application. [Helper commands are available on osx/linux](https://github.com/joshuef/peruse/blob/master/package.json#L43-L44) (not windows yet, sorry! this is only temporary.)

And to package:
- `yarn package`

The resulting packages are contained within the `releases` folder.

#### Build commands

There are a few build commands for various situations:

- `yarn dev` will run a peruse developer version of the application using `MockVault`
- `yarn live-dev` will run a peruse developer version of the application using the live network.
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
- `yarn test e2e` runs spectron integration tests (not yet stable).
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
