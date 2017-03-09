# safe_browser

> SAFE Browser is a browser designed to open safe:// websites on the SAFE Network. It is a fork of the [beaker browser](https://github.com/pfrazee/beaker/).

## Development

1. Make sure you have Node.js `v6.5.0`.

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

4. Build the SAFE Authenticator plugin.

    **Linux and macOS**
    
    ```
    $ npm run pack-authenticator
    ```
    
    **Windows** 
    
    ```
    $ npm run pack-authenticator-win
    ```

5. Build SAFE Browser and open it.
  
    **Linux and macOS**
    
    ```
    $ npm run rebuild
    ```
    
    **Windows** 
    
    ```
    $ npm run rebuild:only
    $ npm run build
    ```
    Finally,
    
    ```
    $ npm start
    ```

    Any time you want to run SAFE Browser again, all you have to do is open a terminal and run this:

    ``` shell
    $ cd safe_browser
    $ npm start
    ```

6. Package SAFE Browser.
 
    **macOs**
   ```
   $ npm run release:mac
   ```
   
   **Linux**
   ```
   $ npm run release:linux
   ```
   
   **Windows**
   ```
   $ npm run release:windows
   ```
   
    The packed SAFE Browser will be found inside `dist` folder.
### Updating

If you pull latest from the repo and get weird module errors, do:

```shell
$ npm run burnthemall
```

This will remove your npm_modules, and do the full install/rebuild process for you. `npm start` should work afterwards.

If you're doing development, `npm run watch` to have assets build automatically.

## License

SAFE Browser is a lightly modified fork of the [beaker browser](https://www.beakerbrowser.com/).

Modified MIT as per the [BeakerLicense](https://github.com/joshuef/beaker/blob/master/BEAKER_LICENSE.md)
