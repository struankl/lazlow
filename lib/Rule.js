Promise = require('bluebird');

module.exports = function(name, ruleBody) {
    'use strict';

    var everythingRegex = /.*/;

    return function NewRule(options) {

        options = options || {};
        
        var urlRegex = !options.url || options.url === '*' ? everythingRegex : new RegExp(options.url),
            hostRegex = !options.host || options.host === '*' ? everythingRegex : new RegExp(options.host),
            methodRegex = !options.method || options.method === '*' ? everythingRegex: new RegExp(options.method);
        return {
            runRule: function (req, res) {
                if (urlRegex.test(req.url) &&
                    hostRegex.test(req.headers.host.split(':')[0]) &&
                    methodRegex.test(req.method)) {
                    return ruleBody(req, res, options);
                }

                return  Promise.resolve({request: req, response: res});
            },

            name: name
        }
    }
}
