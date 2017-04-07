const spawn = require('child_process').spawn;
const os = require('os');

let cmd = '';

if (os.platform() === 'win32') {
  cmd = 'pack-authenticator:windows';
} else {
  cmd = 'pack-authenticator:unix';
}

const build = spawn('npm', ['run', cmd]);

build.stdout.on('data', (data) => {
  console.log(data.toString());
});

build.stderr.on('data', (data) => {
  console.log(data.toString());
});

build.on('exit', (code) => {
  console.log(`Pack Authenticator exited with code ${code}`);
});
