import Hapi from 'hapi';
import { CONFIG, startedRunningProduction } from 'appConstants';
import inert from 'inert';
import logger from 'logger';

export const setupServerVars = () =>
{
    const server = new Hapi.Server();
    server.connection( { port: CONFIG.PORT, host: 'localhost' } );
    server.register( inert );
    return server;
};

export const startServer = async ( server ) =>
{
    server.start( ( err ) =>
    {
        if ( err )
        {
            logger.error( 'Problems starting internal peruse server' );
            logger.error( err );
            throw err;
        }
        logger.info( `HAPI Server running at: ${server.info.uri}` );
    } );
};

export default startServer;
