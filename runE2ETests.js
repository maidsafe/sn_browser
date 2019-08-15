const spawn = require( 'cross-spawn' );
const path = require( 'path' );

const { platform } = process;
const WINDOWS = 'win32';

const s = `\\${path.sep}`;
let pattern;
const arg = process.argv[2];
const argsArray = ['--notify'];

if ( process.argv.includes( '--watch' ) ) {
    argsArray.push( '--watch' );
}

let testCommand = path.normalize( './node_modules/.bin/jest' );

if ( process.platform === 'win32' ) {
    testCommand = path.normalize( './node_modules/jest/bin/jest.js' );
}

switch ( arg ) {
    case 'e2e': {
        pattern = `__e2e__${s}.+\\.spec\\.ts`;
        argsArray.push( '--bail' );
        argsArray.push( '--runInBand' );
        break;
    }
    case 'exts-e2e': {
        pattern = `app${s}extensions${s}[^${s}].+e2e${s}.+\\.spec\\.ts$`;

        argsArray.push( '--bail' );
        argsArray.push( '--runInBand' );
        argsArray.push( '--testPathIgnorePatterns=network' );

        break;
    }
    case 'exts-e2e-network': {
        // These tests involve actual log in/out of the netowrk and saving data.
        // eventually to be rolled against the live net (if that makes sense).
        // Separated out for now to avoid runnin in prod against prod (only against mock in a packaged app version)
        console.info(
            'Running network specific tests (those that must be on mock)'
        );
        pattern = `app${s}extensions${s}[^${s}].+e2e${s}.+\\.network\\.spec\\.ts$`;

        argsArray.push( '--bail' );
        argsArray.push( '--runInBand' );

        break;
    }
    default: {
        pattern = `__e2e__${s}.+\\.spec\\.ts`;
        argsArray.push( '--bail' );
        argsArray.push( '--runInBand' );

        break;
    }
}
// should be first
argsArray.unshift( pattern );

// eslint-disable-next-line no-console
console.info( 'Running tests via:', testCommand, argsArray );

const result = spawn.sync( testCommand, argsArray, { stdio: 'inherit' } );

// eslint-disable-next-line unicorn/no-process-exit
process.exit( result.status );
