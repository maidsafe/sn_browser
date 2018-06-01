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

if( process.argv.includes( '--watch' ))
{
    argsArray.push('--watch')
}

let testCommand = path.normalize( './node_modules/.bin/jest' );

if (process.platform === 'win32') {
    testCommand = path.normalize( './node_modules/jest/bin/jest.js' );
}

switch ( arg )
{
    case ( 'e2e' ) :
    {
        pattern = `__e2e__${s}.+\\.spec\\.js`;
        argsArray.push( `--bail`);
        argsArray.push( `--runInBand`);

        //exclude weakref tests for now.
        if ( platform === WINDOWS )
        {
            pattern = `__tests__${s}e2e${s}(?!safe).+\\.spec\\.js`;
        }

        break;
    }
    case ( 'exts-e2e' ) :
    {
        pattern = `app${s}extensions${s}[^${s}].+e2e${s}.+\\.spec\\.js$`;

        argsArray.push( `--bail`);
        argsArray.push( `--runInBand`);

        //exclude weakref tests for now.
        if ( platform === WINDOWS )
        {
            pattern = `app${s}extensions${s}[^${s}].+e2e${s}(?!safe).+\\.spec\\.js$`;
        }

        break;
    }
    case ( 'peruse' ) :
    {
        pattern = `__tests__${s}[^${s}]+${s}.+\\.spec\\.js$`;

        if ( platform === WINDOWS )
        {
            //exclude weakref tests for now.
            pattern = `__tests__${s}[^${s}]+${s}(?!setupPreloadAPIs).+\\.spec\\.js$`;
        }

        break;
    }
    case ( 'exts' ) :
    {
        pattern = `app${s}extensions${s}[^${s}]+${s}((?!e2e).)*\\w+\\.spec\\.js$`;
        break;
    }
    case ( 'safe' ) :
    {
        pattern = `app${s}extensions${s}safe${s}test${s}(?!e2e)(?!auth)[^${s}]+${s}?\\w+\\.spec\\.js$`;
        break;
    }
    case ( 'safe-auth' ) :
    {
        pattern = `app${s}extensions${s}safe${s}test${s}auth${s}\\w+\\.spec\\.js$`;
        break;
    }
    default :
    {
        pattern = `_*tests?_*${s}(?!e2e${s})[^${s}]+${s}\\w+\\.spec\\.js$`;

        if ( platform === WINDOWS )
        {
            //exclude weakref tests for now.
            pattern = `_*tests?_*${s}(?!e2e${s})[^${s}]+${s}(?!setupPreloadAPIs)\\w+\\.spec\\.js$`;
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
