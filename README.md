# safe_browser

> SAFE Browser is a browser designed to open safe:// websites on the SAFE Network. It is a fork of the [beaker browser](https://github.com/pfrazee/beaker/).

## Development

1. Make sure you have the latest version of Node.js.

  ```shell
  node --version
  ```

  There are many ways to install Node.js. See [nodejs.org](https://nodejs.org/en/download/) for more info.

2. Clone this GitHub repository.

  ```shell
  git clone https://github.com/maidsafe/safe_browser.git
  ```

  If you don't have Git installed, you can download it from [git-scm.com](https://git-scm.com/downloads).

3. Install the dependencies.

  ``` shell
  $ cd safe_browser
  $ npm install
  ```

4. Build the SAFE Authenticator plugin as explained [here](https://github.com/maidsafe/beaker-plugin-safe-authenticator).

5. Build SAFE Browser and open it.

  ```
  $ npm run rebuild
  $ npm start
  ```

Any time you want to run SAFE Browser again, all you have to do is open a terminal and type this:

``` shell
$ cd safe_browser
$ npm start
```

### Updating

If you pull latest from the repo and get weird module errors, do:

```shell
$ npm run burnthemall
```

This invokes [the mad king](http://nerdist.com/wp-content/uploads/2016/05/the-mad-king-game-of-thrones.jpg), who will torch your npm_modules, and do the full install/rebuild process for you. `npm start` should work afterwards.

If you're doing development, `npm run watch` to have assets build automatically.

## License

SAFE Browser is a lightly modified fork of the [beaker browser](https://www.beakerbrowser.com/).

Modified MIT as per the [BeakerLicense](https://github.com/joshuef/beaker/blob/master/BEAKER_LICENSE.md)
