const { spawn } = require( 'child_process' );
const path = require( 'path' );

let appResources = 'safe-browser/resources';

// override all tests
const targetTests = process.argv[2] || './__testcafe__/*.spec.ts';

const { platform } = process;
const MAC_OS = 'darwin';
const LINUX = 'linux';
const WINDOWS = 'win32';

let PLATFORM_NAME;

if ( platform === MAC_OS ) {
    PLATFORM_NAME = 'mac';
    appResources = 'SAFE Browser.app/Contents/Resources';
}

if ( platform === LINUX ) {
    PLATFORM_NAME = 'linux-unpacked';
}

if ( platform === WINDOWS ) {
    PLATFORM_NAME = 'win-unpacked';
}

const testCommand = `yarn`;

const argsArray = ['testcafe', 'electron:.', targetTests];

// eslint-disable-next-line no-console
console.info( 'Running tests via:', testCommand, argsArray );

const result = spawn( testCommand, argsArray, {
    env: {
        ...process.env,
        LIB_PATH: `${__dirname}/release/${PLATFORM_NAME}/${appResources}`,
        NODE_ENV: 'test',
        TEST_CAFE: true
    }
} );

result.stdout.on( 'data', ( data ) => {
    // eslint-disable-next-line no-console
    console.log( `stdout: ${data}` );
} );

result.stderr.on( 'data', ( data ) => {
    // eslint-disable-next-line no-console
    console.error( `stderr: ${data}` );
} );

result.on( 'close', ( code ) => {
    // eslint-disable-next-line no-console
    console.log( `child process exited with code ${code}` );
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit( result.status );
} );
