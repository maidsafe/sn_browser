const spawn = require('child_process').spawn;
const osPlatform = require('os').platform();

const runSpawn = (title, cmdStr) => {
  return new Promise((resolve) => {
    cmdStr = cmdStr.split(' ');
    if (osPlatform === 'win32') {
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
  const toClean = (process.argv.indexOf('--clean') !== -1);
  const cmd = `npm run pack-authenticator:${(osPlatform === 'win32') ? 'windows' : 'unix'} ${(toClean ? 'clean' : '')}`;
  runSpawn('Pack Authenticator', cmd);
};

const package = () => {
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
  runSpawn('Release Safe Browser', cmd);
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
