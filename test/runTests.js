const spawn = require( 'cross-spawn' );
const path = require( 'path' );

const s = `\\${path.sep}`;
let pattern;
const arg = process.argv[2];

const argsArray = [ ...process.argv.slice( 2 ), '--notify'];
let testCommand = path.normalize( './node_modules/.bin/electron' );

switch ( process.argv[2] )
{
    case ( 'e2e' ) :
    {
        pattern = `test${s}e2e${s}.+\\.spec\\.js`;
        testCommand = path.normalize( './node_modules/.bin/jest' );
        break;
    }
    case ( 'exts' ) :
    {
        pattern = `app${s}extensions${s}(?!e2e${s})[^${s}]+${s}.+\\.spec\\.js$`;
        argsArray.unshift(path.normalize( './node_modules/.bin/jest' ))
        break;
    }
    default :
    {
        pattern = `test${s}(?!e2e${s})[^${s}]+${s}.+\\.spec\\.js$`;
        argsArray.unshift(path.normalize( './node_modules/.bin/jest' ))
    }
}

argsArray.push( `--testPathPattern=${pattern}`);

console.log('test spawinging withh: ', testCommand, argsArray)
// path.normalize( './node_modules/.bin/jest' )

const result = spawn.sync(
    testCommand,
    argsArray,
    { stdio: 'inherit' }
);


process.exit( result.status );
