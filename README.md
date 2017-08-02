# safe_browser

> SAFE Browser is a browser designed to open safe:// websites on the SAFE Network.

**Maintainer:** Krishna Kumar (krishna.kumar@maidsafe.net)

## Development

### Prerequisites

  * Node.js 6.5.0 (we recommend installing it via [nvm](https://github.com/creationix/nvm))
  * Rust stable (we recommend installing it from [rust-lang.org](https://www.rust-lang.org/en-US/))
  * [Git](https://git-scm.com/)

1. Clone this GitHub repository.

    ```bash
    $ git clone https://github.com/maidsafe/safe_browser.git
    ```

2. Install the dependencies.

    ``` bash
    $ cd safe_browser
    $ npm install
    ```

    If you are working on a development environment, you can run `NODE_ENV=dev npm install` instead in order to get the `safe_client` libraries which use the `MockVault` file rather than connecting to the SAFE Network.

3. Rebuild native modules

    ```bash
    $ npm run rebuild
    ```

    If you are working on a development environment and want to use the `MockVault`, you need to run `NODE_ENV=dev npm run rebuild` instead.

4. Build SAFE Browser and open it.

    ```
    $ npm run build
    $ npm start
    ```

    If you're doing development, `npm run watch` to have assets build automatically.

6. Package SAFE Browser.

   ```
   $ npm run package
   ```

    The packed SAFE Browser will be found inside `dist` folder.

### Updating

If you pull latest from the repo and get weird module errors, do:

```bash
$ npm run burnthemall
```

This will remove your npm_modules, and do the full install, rebuild, build SAFE Authenticator and package  processes for you. `npm start` should work afterwards.

## License

SAFE Browser is a lightly modified fork of the [beaker browser](https://www.beakerbrowser.com/).

Modified MIT as per the [BeakerLicense](https://github.com/joshuef/beaker/blob/master/BEAKER_LICENSE.md)
