var Promise = require('bluebird'),
    logger = require('winston'),
    Rule = require('../Rule'),

    Respond = new Rule('respond', function (req, res, options) {
        'use strict';
        var statusCode = options.statusCode || 500,
            responseBody = '<html><head><title>Lazlow Generated Error</title></head><body>Lazlow is configured to return error for this page</body></html>',
            headers = options.headers || {};
        
        if (!!options.body) {
            responseBody = typeof options.body !== 'string' ? JSON.parse(options.body) : options.body;            
        }
        logger.debug('responding to request');

        res.statusCode = statusCode;
        Object.keys(headers).forEach(function (key) {
            res.setHeader(key, headers[key]);
        });
        res.end(responseBody);
        return Promise.resolve(false);
    });

module.exports = Respond;
