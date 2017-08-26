# SAFE Network Browser Specifics

## Safe Status Page

The status page is built as part of the `app/builtin-pages`, which are individual webpages loaded into a tab and accessing browser data via [beaker apis](https://github.com/maidsafe/safe_browser/tree/master/app/background-process/api-manifests).

## Beaker API/Database overrides. Aka: SafeSync

Beaker normally runs a set of sqlLite databases for storage of things like settings, history etc. These (in the [dbs](https://github.com/maidsafe/safe_browser/tree/master/app/background-process/dbs) folder, are simply replaced via a [redux store](https://github.com/maidsafe/safe_browser/tree/master/app/background-process/safe-storage) which syncs its data to the safe network.

The [sync occurs on store updates](https://github.com/maidsafe/safe_browser/blob/master/app/shell-window/pages.js#L213-L226), and is debounced to prevent mutation errors at this stage. All 'beaker' pages are reloaded to update any store changes. This is triggered via a [`command handler`](https://github.com/maidsafe/safe_browser/blob/master/app/shell-window/command-handlers.js#L7-L11) to allow easy inter process comms.

### Saving the store

[The store is saved as a JSON file on the network via safe-js.](https://github.com/maidsafe/safe_browser/blob/master/app/background-process/safe-storage/store.js#L73-L93)

### Auth and retrieving the store

This takes place on application initialisation, in []`background-process`](https://github.com/maidsafe/safe_browser/blob/master/app/background-process.js#L57-L85). An attempt is made to read the store. If a file is found, it is read and restored to the app. If no file is found, a file is created.

'restoring'.. ahem. The store, is done [via triggering actions to update the store once more](https://github.com/maidsafe/safe_browser/blob/master/app/background-process/safe-storage/store.js#L100-L128).

## App customisations

### Build

Build info is largely done via the main app [package.json](https://github.com/maidsafe/safe_browser/blob/master/package.json#L27-L94).
Icons are stored in `build/icons`.
