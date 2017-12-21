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
  win32: 'win-unpacked'
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

const postPackage = () => {
  let releaseFolderName = `${pkg.name}-v${pkg.version}-${OSName[osPlatform]}-${os.arch()}`;
  if (process.env.NODE_ENV === 'dev') {
    releaseFolderName = `${pkg.name}-mock-v${pkg.version}-${OSName[osPlatform]}-${os.arch()}`;
  }

  const removeLicenseAndLogFiles = () => {
    try {
      const releaseFolder = path.resolve(packageDistDir, releaseFolderName);
      const files = fs.readdirSync(path.resolve(releaseFolder));
      for (let i = 0; i < files.length; i++) {
        if(/LICENSE/.test(files[i]) || /.log/.test(files[i])) {
          const filePath = path.resolve(releaseFolder, files[i]);
          fs.removeSync(filePath);
	}
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
    removeLicenseAndLogFiles();
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
  runSpawn('Release Safe Browser', cmd)
    .then(() => postPackage());
};

const build = () => {
  return runSpawn('Build Safe Browser', 'gulp build');
};

switch (targetScript) {
  case '--package': {
    return package();
  }
  case '--build': {
    return build();
  }
  default:
    throw new Error('Unknown script');
}
