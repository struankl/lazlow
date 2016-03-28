var logger = require('winston'),
    argv = require ('./arguments');

logger.level = argv.log;

logger.handleExceptions(new logger.transports.Console({ colorize: true, json: true }));
logger.exitOnError = false;


require('./command-listener');
require('./proxy-listener');
