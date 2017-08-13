import { Logger, transports } from 'winston';
import { initializeApp } from 'safe-app';

const LOG_FILE_NAME = 'safe-browser-ui.log';

class WinstonLogger {
	
	// TODO krishna - use async await after upgrading dependencies to node 7.10.1 or above
	constructor() {
		try {
			const options = {
				registerScheme: false
			}
			this.logLevel = 'verbose';
			this.logFormatter = (log) => {
				const date = new Date();
				const timeStamp = `${this.pad(date.getHours())}:${this.pad(date.getMinutes())}:${this.pad(date.getSeconds())}.${date.getMilliseconds()}`;
				return `${log.level.toUpperCase()} ${timeStamp}  ${log.message}`;
			};
			
			initializeApp({
				id: 'browser.logger', 
				name: 'winston logger browser', 
				version: '0.1.0', 
				scope: null
			}, null, options)
        	.then(app => app.logPath(LOG_FILE_NAME))
        	.then(logPath => {
        		this.winston = new (Logger)({
        			transports: [
        				new (transports.File)({
					        filename: logPath,
					        json: false,
					        options: {
					          flags: 'w'
					        },
					        level: this.logLevel,
					        formatter: this.logFormatter
		      			}),
		      			new (transports.Console)({
		      				level: this.logLevel,
					        handleExceptions: true,
					        formatter: this.logFormatter
				      	}),
        			]
        		});
        		console.log('Logger initialised', logPath);
        	})
        	.catch(err => {
        		console.log('Failed to initilaise logger', err);
        	});
		} catch(e) {
			console.log('Error', e);
		}
	}

	pad(value) {
		return (`0${value}`).slice(-2);
	}

	debug(msg) {
		try {
	      this.winston.debug(msg);
	    } catch (e) {
	      console.error(e);
	    }
	}

	info(msg) {
		try {
	      this.winston.info(msg);
	    } catch (e) {
	      console.error(e);
	    }
	}

	warn(msg) {
		try {
	      this.winston.warn(msg);
	    } catch (e) {
	      console.error(e);
	    }
	}

	error(msg) {
		try {
	      this.winston.error(msg);
	    } catch (e) {
	      console.error(e);
	    }
	}

	verbose(msg) {
		try {
	      this.winston.verbose(msg);
	    } catch (e) {
	      console.error(e);
	    }
	}

}

const logger = new WinstonLogger();

export default logger; 
