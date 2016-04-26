var winston = require('winston');

winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, { level: 'info', colorize: true, timestamp: true });
winston.add(winston.transports.File, { filename: 'somefile.log' });
winston.add(winston.transports.Http, { host: 'localhost', port: 83});

winston.log('info', 'Hello distributed log files!');
winston.info('Hello again distributed logs');

winston.level = 'debug';
winston.log('debug', 'Now my debug messages are written to console!');

winston.level = 'error';
winston.error('Only errors should be printed from now on');
winston.log('error', 'This error should be printed from now on');
winston.log('debug', 'Not to be printed log');
winston.info('info', 'Not to be printed info');
