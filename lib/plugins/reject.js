var Promise = require('bluebird'),
    logger = require('winston'),
    Rule = require('../Rule'),

    Reject = new Rule('reject', function (req, res, options) {
        'use strict';
        var statusCode = options.statusCode || 500,
            responseBody = options.body || '<html><head><title>Lazlow Generated Error</title></head><body>Lazlow is configured to return error for this page</body></html>',
            headers = options.headers || {};
        logger.debug('rejecting request');

        res.statusCode = statusCode;
        Object.keys(headers).forEach(function (key) {
            res.setHeader(key, headers[key]);
        });
        res.end(responseBody);
        return Promise.resolve({});
    });

module.exports = Reject;
