import express from 'express';
import { CONFIG } from '$Constants';
import { logger } from '$Logger';

const app = express();

export const setupServer = () => {
    app.listen( CONFIG.PORT, () =>
        logger.info( `Peruse internal server listening on port ${CONFIG.PORT}!` )
    );

    return app;
};
