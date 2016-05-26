var logger = require('winston'),
    argv = require ('./arguments');

logger.level = argv.log;

logger.handleExceptions(new logger.transports.Console({ colorize: true, json: true }));
logger.exitOnError = false;

if (argv.f) {
    logger.add(logger.transports.File, { filename: argv.f });
}

require('./command-listener');
require('./proxy-listener');
