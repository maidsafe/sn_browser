# SAFEr Browser

SAFEr is a browser designed to open safe:// websites on The SAFE Network. It is a fork of the [beaker browser](https://github.com/pfrazee/beaker/).

For more information about The SAFE Network please visit the following links.

https://safenetwork.org/
https://safenetforum.org/
https://safenetforum.org/t/safer-browser-s-proposal-donation-address-in-op/10336/247
http://maidsafe.net/

SAFE Beaker Browser uses [safe-js](https://github.com/joshuef/safe-js) to interact with the safe launcher.

You have three main APIs available to SAFE sites:

- `window.safeAuth`;
- `window.safeNFS`;
- `window.safeDNS`;

Each of these is a mapping to safejs functions, which (currently limited) documentation, you can find (here)[https://github.com/joshuef/safe-js)];


## Development Install Instructions:

 1. Install Git https://help.ubuntu.com/lts/serverguide/git.html

 2. Sign up for https://github.com/

 3. https://help.github.com/articles/set-up-git/#platform-linux

 4. https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/#platform-linux

 5. https://help.github.com/articles/adding-a-new-ssh-key-to-your-github-account/#platform-linux

 6. Install node js requires the latest version of node js Check to see what the latest version is here https://nodejs.org/en/download/

 Use option one make sure to install the latest version http://www.hostingadvice.com/how-to/install-nodejs-ubuntu-14-04/#node-version-manager

 7. Open Terminal

 ```
 $ git clone https://github.com/joshuef/beaker.git
 $ cd beaker
 $ git checkout SafePOC
 $ npm install
 $ npm run rebuild
 $ npm start
 ```

 8. Any time you want to run the browser again all you have to do is open terminal

 ```
 $ cd beaker
 $ npm start

 ```

 Note 01: If you want to do a fresh install. Delete the beaker folder and start at Step 07:

 Note 02: Do not worry about any errors that appear.

### Updating
 If you pull latest from the repo and get weird module errors, do:

 ```
 npm run burnthemall
 ```

 This invokes [the mad king](http://nerdist.com/wp-content/uploads/2016/05/the-mad-king-game-of-thrones.jpg), who will torch your npm_modules, and do the full install/rebuild process for you.
 `npm start` should work afterwards.

 If you're doing development, `npm run watch` to have assets build automatically.


## License

SAFE Beaker Browser is a lightly modified fork of the [decentralized beaker browser](https://www.beakerbrowser.net/).

Modified MIT as per the (BeakerLicense)(https://github.com/joshuef/beaker/blob/master/BEAKER_LICENSE.md)