var Promise = require('bluebird'),
    logger = require('winston'),
    Rule = require('../Rule'),

    Delay = new Rule('delay', function (req, res, options) {
        'use strict';
        var delay = typeof options.delay !== 'undefined' ? options.delay: 10000;
        logger.debug('delaying url for', delay, 'ms');
    
        return Promise
            .delay(delay)
            .then(function () {
                logger.debug('delaying url for', delay, 'ms: done');
            })
            .return({request: req, response: res});
    });

module.exports = Delay;
