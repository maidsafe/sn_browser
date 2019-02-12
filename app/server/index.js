import express from 'express';
import { CONFIG, startedRunningProduction } from '@Constants';
import logger from 'logger';

const app = express();

const setupServer = () =>
{
    app.listen( CONFIG.PORT, () =>
        logger.info( `Peruse internal server listening on port ${ CONFIG.PORT }!` ) );

    return app;
};

export default setupServer;
