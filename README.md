# safe_browser

A browser designed to open `safe://` websites on the SAFE Network.

**Maintainer:** Krishna Kumar (krishna.kumar@maidsafe.net)

## Development

### Prerequisites

  * Node.js 6.5.0 (we recommend installing it via [nvm](https://github.com/creationix/nvm))
  * [Git](https://git-scm.com/)
  * [Yarn](https://yarnpkg.com) (as a replacement for `npm`).

1. Clone this GitHub repository.

    ```bash
    git clone https://github.com/maidsafe/safe_browser.git
    ```

2. Install the dependencies.

    ``` bash
    cd safe_browser
    yarn
    ```

    If you are working on a development environment, you can run `NODE_ENV=dev yarn` instead in order to get the `safe_client` libraries which use the `MockVault` file rather than connecting to the SAFE Network.

3. Build SAFE Browser and open it.

    ```bash
    yarn run build
    yarn start
    ```

    If you're doing development, `yarn run watch` to have assets build automatically.

6. Package SAFE Browser.

    ```bash
    yarn run package
    ```

    The packed SAFE Browser will be found inside `dist` folder.

### Updating

If you pull latest from the repo and get weird module errors, do:

```bash
yarn run burnthemall
```

This will remove your node_modules, and do the full install, rebuild, build SAFE Authenticator and package processes for you. `yarn start` should work afterwards.

## License

SAFE Browser is a lightly modified fork of the [Beaker Browser](https://www.beakerbrowser.com/).

Modified MIT as per the [BeakerLicense](https://github.com/maidsafe/safe_browser/blob/master/BEAKER_LICENSE.md)
