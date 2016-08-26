# SAFEr Browser

SAFEr is a browser designed to open safe:// websites on The SAFE Network. It is a fork of the [beaker browser](https://github.com/pfrazee/beaker/).

For more information about The SAFE Network please visit the following links.

https://safenetwork.org/
https://safenetforum.org/
https://safenetforum.org/t/safer-browser-s-proposal-donation-address-in-op/10336/247
http://maidsafe.net/


# Linux/Ubuntu Install Instructions:

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

## Beaker Browser

### [Demo video](https://www.youtube.com/watch?v=nKHJ4rLN9mo)

[![screenshot.png](doc/ipfs-browser.gif)](https://www.youtube.com/watch?v=nKHJ4rLN9mo)

## Binaries

### [OSX 64-bit](https://download.beakerbrowser.net/download/0.2.0/osx_64/Beaker%20Browser-0.2.0.dmg)


## Updating
If you pull latest from the repo and get weird module errors, do:

```
npm run burnthemall
```

This invokes [the mad king](http://nerdist.com/wp-content/uploads/2016/05/the-mad-king-game-of-thrones.jpg), who will torch your npm_modules, and do the full install/rebuild process for you.
`npm start` should work afterwards.

If you're doing development, `npm run watch` to have assets build automatically.

## Documentation

 - [Using IPFS](./doc/using-ipfs.md)
 - [Using Dat](./doc/using-dat.md)
 - [Dat vs. IPFS: What's the difference?](./doc/dat-vs-ipfs-comparison.md)
 - Howto: [Authoring Protocol Plugins](./doc/authoring-plugins.md)
 - [Codebase & build notes](./build-notes.md)

## Beaker License

Modified MIT License (MIT)

Copyright (c) 2016 Paul Frazee

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

 1. Any project using the Software will include a link to the Beaker project page,
along with a statement of credit. (eg "Forked from Beaker")

 2. The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
