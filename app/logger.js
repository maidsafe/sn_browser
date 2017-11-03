import { createLogger, format, transports } from 'winston';
// const { createLogger, format, transports } = require('winston');
const { combine, label, timestamp, colorize, simple } = format;

const levels = {
    error   : 0,
    warn    : 1,
    data    : 2,
    info    : 3,
    help    : 4,
    verbose : 5,
    debug   : 6,
    silly   : 7,
    trace   : 8
};

// TODO: provide override for logging
const logger = createLogger( {
    level      : 'info',
    levels,
    transports : [
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    //
        new transports.File( { filename: 'error.log', level: 'error' } ),
        new transports.File( {
            filename : 'combined.log',
            format   : combine(
                timestamp(),
                label(),
                simple()
            ) } )
    ],
    exceptionHandlers : [
        new transports.File( {
            filename : 'combined.log',
            format   : combine(
                timestamp(),
                label(),
                simple()
            ) } )
    ]
} );

// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
if ( process.env.NODE_ENV !== 'production' )
{
    //TODO add exception h
    logger.add( new transports.Console( {
        format : combine(
            colorize(),
            simple()
        )
    } ) );

    logger.exceptions.handle(
        new transports.Console( {
            format : combine(
                colorize(),
                simple()
            )
        }
    ) );
}


export default logger;
