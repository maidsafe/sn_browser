
import path from 'path';
import { shell } from 'electron';

const parseUrl = url => (
    ( url.indexOf( 'safe-auth://' ) === -1 ) ? url.replace( 'safe-auth:', 'safe-auth://' ) : url
);

export const openExternal = url => {
    shell.openExternal( parseUrl( url ) )
};

export const parseNetworkPath = ( nwPath ) =>
{
    const result = {
        dir  : undefined,
        file : undefined,
    };
    if ( nwPath )
    {
        const splitPath = nwPath.split( '/' );
        result.dir = splitPath.slice( 0, 3 ).join( '/' );
        result.file = splitPath.slice( 3 ).join( '/' ) || path.basename( nwPath );
    }
    return result;
};
