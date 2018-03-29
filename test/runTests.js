const spawn = require( 'cross-spawn' );
const path = require( 'path' );

const s = `\\${path.sep}`;
let pattern;
const arg = process.argv[2];

const argsArray = [ ...process.argv.slice( 2 ), '--notify'];
let testCommand = path.normalize( './node_modules/.bin/electron' );
let jestBinPath = './node_modules/.bin/jest';
if (process.platform === 'win32') {
    jestBinPath = './node_modules/jest/bin/jest.js';
}

switch ( process.argv[2] )
{
    case ( 'e2e' ) :
    {
        pattern = `test${s}e2e${s}.+\\.spec\\.js`;
        testCommand = path.normalize( jestBinPath );
        break;
    }
    case ( 'exts' ) :
    {
        pattern = `app${s}extensions${s}(?!e2e${s})[^${s}]+${s}.+\\.spec\\.js$`;
        argsArray.unshift( path.normalize( jestBinPath ) );
        break;
    }
    default :
    {
        pattern = `test${s}(?!e2e${s})[^${s}]+${s}.+\\.spec\\.js$`;
        argsArray.unshift( path.normalize( jestBinPath ) );
    }
}

argsArray.push( `--testPathPattern=${pattern}`);

console.log('test spawinging withh: ', testCommand, argsArray)

const result = spawn.sync(
    testCommand,
    argsArray,
    { stdio: 'inherit' }
);


process.exit( result.status );
