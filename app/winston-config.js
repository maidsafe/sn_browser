// This is the configuration module for logging with winston and winston-daily-rotate-file
// https://www.npmjs.com/package/winston
// https://www.npmjs.com/package/winston-daily-rotate-file

// The architecture of electron doesn't allow for this singleton module to be shared between renderer and main
// winston is set on global object in main, global.winston = winston
// Any renderer that wants to call winston can use: let winston = remote.getGlobal('winston');

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
      level: env === 'dev' ? 'silly': 'info'
    }),
    new (require('winston-daily-rotate-file'))({
      filename: `${logDir}/-safe-browser.log`,
      timestamp: timeStampFormat,
      // The most specific part of the date pattern determines the frequency of file creationg
      // For example, if datePattern is 'dd-MM-yyyy-mm',a new -safe-browser.log file will be generated each new minute
      datePattern: 'dd-MM-yyyy',
      prepend: true,
      level: env === 'dev' ? 'silly' : 'info',
      handleExceptions: true,
      humanReadableUnhandledException: true,
      json: true
    })
  ],
  exitOnError: false
});

export default winston
