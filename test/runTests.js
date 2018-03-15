const spawn = require( 'cross-spawn' );
const path = require( 'path' );

const s = `\\${path.sep}`;
let pattern;
const arg = process.argv[2];

switch ( process.argv[2] )
{
    case ( 'e2e' ) :
    {
        pattern = `test${s}e2e${s}.+\\.spec\\.js`;
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
    }
}

const result = spawn.sync(
    path.normalize( './node_modules/.bin/electron' ),
    [path.normalize( './node_modules/.bin/jest' ), `--testPathPattern=${pattern}`, ...process.argv.slice( 2 ), '--notify'],
    { stdio: 'inherit' }
);


process.exit( result.status );
