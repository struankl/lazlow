var Promise = require('bluebird'),

Delay = function (options) {
    'use strict';

    var everythingRegex = /.*/,
        urlRegex = !options.url || options.url === '*' ? everythingRegex : new RegExp(options.url),
        hostRegex = !options.host || options.host === '*' ? everythingRegex : new RegExp(options.host),
        methodRegex = !options.method || options.method === '*' ? everythingRegex: new RegExp(options.method),
        delay = typeof options.delay !== 'undefined' ? options.delay: 10000;
    return {
        runRule: (req, res) => {
            let deferred = new Promise(),
                thisDelay = (urlRegex.test(req.url) &&
                hostRegex.test(req.headers.host.split(':')[0]) &&
                methodRegex.test(req.method)) ? delay : 0;

            setTimeout(() => {
                deferred.resolve(req, res);
            }, thisDelay);

            return deferred.promise;
        }
    }
}

Delay.name = 'delay';

module.exports = {delay: Delay, name: 'delay'};
