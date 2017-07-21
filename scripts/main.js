const path = require('path');
const spawn = require('child_process').spawn;
const os = require('os');
const fs = require('fs-extra');
const pkg = require('../app/package.json');

const osPlatform = os.platform();
const OSName = {
  darwin: 'osx',
  linux: 'linux',
  win32: 'win'
};

const releaseFolderNameForPlatforms = {
  darwin: 'mac',
  linux: 'linux-unpacked',
  win32: 'windows-unpacked'
};

const packageDistDir = path.resolve(__dirname, '..', 'dist');

const runSpawn = (title, cmdStr) => {
  return new Promise((resolve) => {
    const whiteListCmds = [ 'git' ];
    cmdStr = cmdStr.split(' ');
    if ((osPlatform === 'win32') && (whiteListCmds.indexOf(cmdStr[0]) === -1)) {
      cmdStr[0] += '.cmd';
    }
    const build = spawn(cmdStr[0], cmdStr.slice(1));

    build.stdout.on('data', (data) => {
      console.warn(data.toString());
    });

    build.stderr.on('data', (data) => {
      console.error(data.toString());
    });

    build.on('close', (code) => {
      console.warn(`${title} exited with code ${code}`);
      if (code !== 0) {
        process.exit(code);
        return;
      }
      resolve();
    });
  });
};

const targetScript = process.argv[2];

const packAuthenticator = () => {
  try {
    runSpawn('Update git submodule', 'git submodule update --init --recursive')
      .then(() => {
        const authenticatorPkg = require('../authenticator/package.json');
        delete authenticatorPkg.scripts.postinstall;
        fs.outputFileSync('./authenticator/_package.json', JSON.stringify(authenticatorPkg), {
          spaces: 2
        });
        const toClean = (process.argv.indexOf('--clean') !== -1);
        const cmd = `npm run pack-authenticator:${(osPlatform === 'win32') ? 'windows' : 'unix'} ${(toClean ? 'clean' : '')}`;
        return runSpawn('Pack Authenticator', cmd);
      })
  } catch (e) {
    console.error(`Error while creating package.json :: ${e.message}`);
  }
};

const postPackage = () => {
  const releaseFolderName = `${pkg.name}-v${pkg.version}-${OSName[osPlatform]}-${os.arch()}`;

  const removeLicenseFiles = () => {
    try {
      const files = ['LICENSE', 'LICENSES.chromium.html'];
      const releaseFolder = path.resolve(packageDistDir, releaseFolderName);
      for (let i = 0; i < files.length; i++) {
        const filePath = path.resolve(releaseFolder, files[i]);
        fs.removeSync(filePath);
      }
    } catch (err) {
      console.error('Remove License files error ::', err);
    }
  };

  const addVersionFile = () => {
    try {
      const file = path.resolve(packageDistDir, releaseFolderName, 'version');
      fs.outputFileSync(file, pkg.version);
    } catch (err) {
      console.error('Adding version file error ::', err);
    }
  };

  const renameReleaseFolder = () => {
    try {
      const srcDir = path.resolve(packageDistDir, releaseFolderNameForPlatforms[osPlatform]);
      const resourceDir = path.resolve(packageDistDir, releaseFolderName);
      fs.moveSync(srcDir, resourceDir, { overwrite: true });
    } catch (err) {
      console.warn('Rename release folder error ::', err);
    }
  };
  return new Promise((resolve) => {
    renameReleaseFolder();
    addVersionFile();
    removeLicenseFiles();
    resolve();
  });
};

const package = () => {
  fs.emptydirSync(packageDistDir);
  let cmd = '';
  switch (osPlatform) {
    case 'darwin':
      cmd = 'build -m -p never';
      break;
    case 'linux':
      cmd = 'build -l -p never --x64';
      break;
    case 'win32':
      cmd = 'build -w -p never --x64';
      break;
    default:
      throw new Error('Safe Browser is not supported to this platform.');
      break;
  }
  runSpawn('Release Safe Browser', cmd).then(() => postPackage());
};

switch (targetScript) {
  case '--authenticator': {
    return packAuthenticator();
  }
  case '--package': {
    return package();
  }
  default:
    throw new Error('Unknown script');
}
