[![Build Status](https://travis-ci.org/maidsafe/safe_browser.svg)](https://travis-ci.org/maidsafe/safe_browser)
[![Build status](https://ci.appveyor.com/api/projects/status/9w7b9mvqm3gdig3o/branch/master?svg=true)](https://ci.appveyor.com/project/MaidSafe-QA/safe-browser/branch/master)

# safe_browser

A browser designed to open `safe://` websites on the SAFE Network.

**Maintainer:** Krishna Kumar (krishna.kumar@maidsafe.net)

## Development

1. Prerequisites:

    * Node.js ^8.0.0 (we recommend installing it via [nvm](https://github.com/creationix/nvm))
    * [Git](https://git-scm.com/)
    * [Yarn](https://yarnpkg.com) (as a replacement for `npm`).

2. Clone this GitHub repository:

    ```bash
    git clone https://github.com/maidsafe/safe_browser.git
    ```

3. Install the dependencies:

    ``` bash
    cd safe_browser
    yarn
    ```

    If you're actively developing, you can run `yarn mock` instead of `yarn` in order to get the `safe_client` libraries which use the `MockVault` file rather than connecting to the SAFE Network.

    ###### Windows-specific notes:
    - `yarn` will attempt to use multiple processes to speed up installation, which will cause errors on Windows. So, before running `yarn` or `yarn mock`, run `yarn config set child-concurrency 1`.  


4. Build the SAFE Browser and open it:

    ```bash
    yarn run build
    yarn start
    ```

    If you're actively developing, you can use `yarn run watch` to have assets built automatically when they change.

5. Package the SAFE Browser for production:

    ```bash
    yarn run package
    ```

    The packed SAFE Browser will be found inside `dist` folder.

### Troubleshooting

If you pull the latest from the repo and get weird module errors, try:

```bash
yarn run burnthemall
```

This will remove your `node_modules` and do the full install, rebuild, build SAFE Authenticator, and package processes for you. After this, `yarn start` should work again.

## Further Help

You can discuss development-related questions on the [SAFE Dev Forum](https://forum.safedev.org/).
Here's a good post to get started: [How to develop for the SAFE Network](https://forum.safedev.org/t/how-to-develop-for-the-safe-network-draft/843).

## License

SAFE Browser is a lightly modified fork of the [Beaker Browser](https://www.beakerbrowser.com/).

Modified MIT as per the [BeakerLicense](https://github.com/maidsafe/safe_browser/blob/master/BEAKER_LICENSE.md)
