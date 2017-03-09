const exec = require('child_process').exec;
const os = require('os');

let cmd = '';

if (os.platform() === 'win32') {
  cmd = 'npm run pack-authenticator:windows';
} else {
  cmd = 'npm run pack-authenticator:unix';
}

exec(cmd, (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.warn(stdout);
  if (stderr) {
    console.warn(`Error: ${stderr}`);
  }
});
