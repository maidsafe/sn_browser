# Application Design Overview

The Safe Browser is built using [electronjs](https://electronjs.org/) to provide a simple cross platform solution for accessing the Safe Network. (It is built on top of a simple clearnet browser called [Peruse](https://github.com/joshuef/peruse).)

The browser uses [React](https://reactjs.org/) and [Redux](https://redux.js.org/) to build the application user interface and manage its internal state.

The browser is in the process of being converted to use type checking in the javascript code, with [Typescript](https://www.typescriptlang.org/).

Read on to get a deeper look into the application structure...

## Table of contents

1. [Processes](#processes)
   - [The Main Process](#the-main-process)
   - [The Background Process](#the-background-process)
   - [The Browser Application](#the-browser-application)
1. [Data Flow](#data-flow)
1. [The Codebase Structure](#the-codebase-structure)
1. [Building with Webpack](#building-with-webpack)
   - [Aliases](#aliases)
   - [DLL](#dll)
1. [Safe Specifics](#safe-specifics)

---

Inside the app folder, we have three main processes which run (or more, depending on window count):

## Processes

### The Main Process

This is the main electron process, it initialises the app, triggers initial lifecycle hooks (for extensions... we'll get onto that), and opens an application window for a) The Browser UI, and b) the Background process...

### The Background Process

A hidden window, the Background Process is where all 'blocking' functionality is handled. If there are processes to be done, which may take a long time, they should be asynchronously triggered in this process via an action/alias.

Doing this keeps the main process free, which prevents electron IPC blockages which could stall the browser UI (even though _that's_ in a different process too. That can happen!)

### The Browser Application

The window that you _see_ for the browser, is an electron window running a React application which forms the basis of the browser UI.

For anyone not familiar with electron, this is essentially a website, which has special hooks to interact with the system / nodejs etc. (That's electron in a nut shell TBH).

There can be _many_ browser windows, each running it's own application instance. There will always only be _one_ main process and _one_ background process.

## Data flow

The application uses Redux for managing the browser state. Thus there are many `actions` which trigger `reducers` which update the `store`. The `store` is kept in sync across the many application processes via some magic and `electron-redux`. This provides helpers to keep stores in sync in a non-blocking fashion. It also provides what we call _aliases_, which are `actions` that trigger a function in only one process (the `background` process! :tada:).

## The Codebase Structure

An overview of the code. Extensions is probably the most interesting part here, as this is how we hook into the Peruse browser base and extend it to provide Safe functionality.

> NOTE: The Safe functionality is not alllll in the extensions/safe folder, but _most of it is_. There's still some legacy code hanging around various parts of the main browser functionality which need to be moved into extensions via adding browser lifecycle hooks.

### `./app`

The browser `actions` and `reducers` etc are in the `app` folder... as is all the application code for main/bg and renderer processes.

#### `webPreload`

Electron provides a `webview` component which is used for the rendering of tabs. This can be given a js file to be executed in a controlled fashion in a tab _before_ the content is loaded. This is how we inject Safe APIs into the dom, eg. This all happens in `webPreload`.

It also sets up a more generic reducer, `remoteCalls`, which is used by Safe or other browser APIs to register promises which can be executed in another process (`background`, eg) and then fulfilled via the redux store (responing to `remoteCall` actions!).

#### `background.process`

The background process, which is where the magic (largely) happens!

#### `index`

This is the react application which forms the browser UI.

#### `main.dev`

The main process!

### `./app/extensions`

The browser behaviour can be extended via extensions! Via a variety of hooks throughout the application lifecycle (`onInit`... etc) functionality is triggered in a separate folder within the extensions.

This is designed in such a way as we _should_ be able to easily remove / add different extensions and still hook into various parts of the browser.

It's important to note that these 'extensions' are not plugins/extensions as we know of in Chrome/Firefox etc. They are simply a way
to add custom behaviour to [Peruse](https://github.com/joshuef/peruse) at build time. They can not be applied/installed after packaging the application.

### `./app/components` / `./app/containers`

The react components for the browser UI.

### `./app/actions`

The standard browser actions.

### `./app/reducers` / `./app/store`

The redux reducers and store setup for the browser.

### `./app/server`

An express server is set up to provide proper HTTP header handling for any extension which may wish to hijack this normal behaviour (_cough_ Safe _cough_).

### `./app/utils`

Unspecified helper things.

## Building with Webpack

[Webpack](https://webpack.js.org/) is run to compile each of the various processes. [Babeljs](https://babeljs.io/en/setup) is used to transpile the typescript code to javascript.

There's a dev server and hot-reloading is theoretically possible, but it takes ages, so it's practically useless :|

Typescript is _not_ used in the build process at all. It's used only verify the type safety of the code.

`configs/webpack.config.base` contains loaders used across all webpack configs.

There is a prod, config. Alongside renderer configs.

There are 'dev' mode configs for running against the NODE_ENV=development setup.
There are 'live-dev' configs for running against NODE_ENV=production but without needing to package.

### Aliases

`./aliases.js` defined code resolution aliases that babel.js uses for locating application code. This helps prevent ugly/easy to break relative urls such as `../../../something/somewhere`;

### DLL

The webpack setup has a `dll` config which is used to compile the static dependencies (all your node modules that rarely change), into a separate JS file for development (this isn't used in prod). The aim of this is to reduce compile time, as these deps dont change.

It may work. It doesn't help much though.

Babel.js is also used for transpiling for getting the latest, coolest JS trendy functionality (and making dev life, much cleaner, lets be honest).

## Safe Specifics

The main / only extension at the time of writing. This provides Safe network functionality. Initiating applications to perform `webfetch`, hooking into various browser events to manage this in the background process, or update other portions of the browser (with extra UI elements eg).

#### `auth-web-app`

Everyone's favourite portal to Safe, this is a webapp, which is served on the `safe-auth://home` url from with the browser. It's a separate webapp, with its own config / build process etc, and those compiled files are served via the inbuilt express server

- APIs are located in `app/extensions/safe/api`;
- APIs are located in `app/extensions/safe/auth-api`;

#### `components` / `containers`

Extend the browser here!

#### More redux (`actions` / `reducers`)

The Safe extension has more `actions` and `reducers`, which, via the handy dandy extension hooks, are pulled into the main application store and passed around the application with it.

There's actions for the authenticator, the SafeBrowser application (more on this confusing name shortly) and web_fetch (though this is ready to be deprecated).

#### `FFI`

The js code to hook up the authentication FFI to the native auth libs.

This handles receiving / decoding / authorising requests etc.

#### `safeBrowserApplication`

What do you call a Safe application, within the Safe browser that performs `webfetch` and/or saves the Safe Browser Application state to the network?

This all happens in here. Setting up of the nodejs safe app, authentication trigger, registering of URIs, handling save/read of states. ALL OF IT.

#### `server-routes`

These are routes that are passed to the `express` server, which we use for hijacking `safe:` and `safe-auth:` requests from the webviews. Those requests are passed on to the local server run in the browser, which can then be picked up here to be handled, via safe_app or the authenticator...

#### `utils`

Some helpers for Safe functionality
