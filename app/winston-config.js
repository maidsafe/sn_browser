// This is the configuration module for logging with winston and winston-daily-rotate-file
// https://www.npmjs.com/package/winston
// https://www.npmjs.com/package/winston-daily-rotate-file

'use strict';
let winstonModule = require('winston');
let fs = require('fs');
let env = process.env.NODE_ENV || 'development';
let logDir = 'winston-logs';

let timeStampFormat = () => (new Date()).toUTCString();

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// winston log levels
// { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }

let winston = new (winstonModule.Logger)({
  transports: [
    new (winstonModule.transports.Console)({
      colorize: true,
      timestamp: timeStampFormat,
      level: 'silly'
    }),
    new (require('winston-daily-rotate-file'))({
      filename: `${logDir}/-safe-browser.log`,
      timestamp: timeStampFormat,
      // The most specific part of the date pattern determines the frequency of file creationg
      // For example, if datePattern is 'dd-MM-yyyy-mm',a new -safe-browser.log file will be generated each new minute
      datePattern: 'dd-MM-yyyy',
      prepend: true,
      level: env === 'dev' ? 'silly' : 'warn',
      handleExceptions: true,
      humanReadableUnhandledException: true,
      json: true
    })
  ],
  exitOnError: false
});

export default winston
