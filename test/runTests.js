const spawn = require( 'cross-spawn' );
const path = require( 'path' );


const platform = process.platform;
const OSX = 'darwin';
const LINUX = 'linux';
const WINDOWS = 'win32';

const s = `\\${path.sep}`;
let pattern;
const arg = process.argv[2];

const argsArray = [ '--notify'];
let testCommand = path.normalize( './node_modules/.bin/jest' );

if (process.platform === 'win32') {
    testCommand = path.normalize( './node_modules/jest/bin/jest.js' );
}

switch ( arg )
{
    case ( 'e2e' ) :
    {
        pattern = `test${s}e2e${s}.+\\.spec\\.js`;
        argsArray.push( `--bail`);
        argsArray.push( `--runInBand`);

        //exclude weakref tests for now.
        if ( platform === WINDOWS )
        {
            pattern = `test${s}e2e${s}(?!safe).+\\.spec\\.js`;
        }

        break;
    }
    case ( 'exts' ) :
    {
        pattern = `app${s}extensions${s}(?!e2e${s})[^${s}]+${s}.+\\.spec\\.js$`;
        break;
    }
    default :
    {
        pattern = `test${s}(?!e2e${s})[^${s}]+${s}.+\\.spec\\.js$`;

        if ( platform === WINDOWS )
        {
            //exclude weakref tests for now.
            pattern = `test${s}(?!e2e${s})[^${s}]+${s}(?!setupPreloadAPIs).+\\.spec\\.js$`;
        }
    }
}
// should be first
argsArray.unshift( pattern );

console.log('Running tests via: ', testCommand, argsArray );

const result = spawn.sync(
    testCommand,
    argsArray,
    { stdio: 'inherit' }
);


process.exit( result.status );
