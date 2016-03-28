var MITMServer = require('mitm-server'),
    http = require('http'),
    https = require('https'),
    url = require('url'),
    logger = require('winston'),
    path =require('path'),
    rules = require('./command-listener').rules,
    argv = require('./arguments'),

    proxy,
    options = {
        certDir: path.resolve(__dirname,'../ca/cert-cache'),
        caCertPath: path.resolve(__dirname, '../ca/cacert.pem'),
        caKeyPath: path.resolve(__dirname, '../ca/cakey.pem')
    }
    reqNo = 0;

proxy = new MITMServer(options, function (req, res) {
    'use strict';
    var requestNumber = reqNo++;
    logger.debug(++requestNumber, 'got', req.connection.encrypted ? 'secure' : 'unsecure', req.method, 'request for', req.headers.host, req.url);

    function runRule(i, req, res) {
        var stopRunning = false,
            ruleRunner = {
                next: runRule.bind(null, i + 1),
                break: function () {
                    stopRunning = true;
                }
            }
        if (i < rules.length) {
            logger.debug(requestNumber, 'about to run', rules[i].name);
            return rules[i].runRule(req, res).then(function (reqRes) {
                reqRes = reqRes || {};
                var nextReq = reqRes.request,
                    nextRes = reqRes.response;
                
                logger.debug(requestNumber, 'rule completed:', rules[i].name);
                if (!nextReq) {
                    logger.debug(requestNumber, 'rule prevents continuation:', rules[i].name);
                    return;
                }

                runRule(i + 1, nextReq, nextRes);
            });
        } else {
            var secure = req.connection.encrypted;
            logger.debug(requestNumber, 'Sending', secure ? 'secure' : 'unsecure', req.method, 'request to', req.headers.host, req.url);
            try {

                var module = secure ? https : http,
                    port = req.headers.host.split(':')[1],
                    reqOptions = {
                    method: req.method,
                    port: port ? parseInt(port, 10) : secure ? 443 : 80,
                    hostname: req.headers.host.split(':')[0],
                    headers: req.headers,
                    path: url.parse(req.url).path
                }

                return req.pipe(module.request(reqOptions, function (response) {
                    logger.debug(requestNumber, 'Got response');
                    res.writeHead(response.statusCode, response.headers);
                    response.pipe(res);
                }));
            } catch (e) {
                logger.error(requestNumber, e);
            }
        }
    }

    runRule(0, req, res);

});

proxy.listen(argv.p, function () {
    logger.info('proxy started on port:', argv.p);
});

