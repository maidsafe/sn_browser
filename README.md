# Peruse

## About 
An electron web browser. Built to be a basis. Extendable by design.

## Development

- `git clone git@github.com:joshuef/peruse.git`
- `cd peruse`
- `yarn`
- `yarn rebuild`

And to run dev mode:
- `yarn dev`

Want to run 'production' variables, but with hot reloading?:
- `yarn live-dev` Will work _soon_. Right now it's hinging upon registering the 
url scheme for opening the app, which won't work until we've gotten all schemes going.

And to package:
- `yarn package`

The resulting packages are contained within the `releases` folder.

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
- `yarn test e2e` runs spectron integration tests.
- `yarn lint` ...lints...



## SAFE Network

The `safe` code is contained within the `app/extensions` folder. This includes
a simple http server with is used to provide the http like functionalities of the safe network.

Currently you need to authenticate against the SAFE Browser to get network access.
