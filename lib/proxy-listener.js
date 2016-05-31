var MITMProxy = require('http-mitm-proxy'),
    http = require('http'),
    https = require('https'),
    url = require('url'),
    logger = require('winston'),
    path =require('path'),
    rules = require('./command-listener').rules,
    argv = require('./arguments'),

    proxy,
    options = {
        // sslCaDir: path.resolve(__dirname,'../ca'),
        port: argv.p
    }
    reqNo = 0;

function shouldIgnoreCertErrors(host) {
    return argv.i.indexOf('*') >= 0 || argv.i.some(function(domain) {
        return domain === host || (domain.startsWith('*.') && host.endsWith(domain.substr(2)));
    });    
}

proxy = new MITMProxy();

proxy.onRequest(function (ctx, callback) {
    'use strict';
    var requestNumber = reqNo++;

    var req = ctx.clientToProxyRequest,
        res = ctx.proxyToClientResponse,
        host = req.headers.host.split(':')[0];
    if (shouldIgnoreCertErrors(host)) {
        logger.debug(requestNumber,'ignore cert errors for this request');
        req.rejectUnauthorized = false;
        ctx.proxyToServerRequestOptions.rejectUnauthorized = false;
    }
    
    logger.debug(requestNumber, 'got', ctx.isSSL ? 'secure' : 'unsecure', req.method, 'request for', req.headers.host, req.url);
    
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
            return rules[i].runRule(req, res).then(function (cont) {
                                
                logger.debug(requestNumber, 'rule completed:', rules[i].name);
                if (cont === false) {
                    logger.debug(requestNumber, 'rule prevents continuation:', rules[i].name);
                    return;
                }

                runRule(i + 1, req, res);
            });
        } else {
            callback();
        }
    }

    runRule(0, req, res);

});

proxy.onWebSocketConnection(function(ctx, callback) {
    var requestNumber = reqNo++;
    var req = ctx.clientToProxyWebSocket.upgradeReq,  
        host = req.headers.host.split(':')[0];
    if (shouldIgnoreCertErrors(host)) {
        logger.debug('Websocket', requestNumber,'ignore cert errors for this websocket request');
        ctx.proxyToServerWebSocketOptions.rejectUnauthorized = false;
    }
    return callback();
});

proxy.listen(options, function () {
    logger.info('proxy started on port:', options.port);
    logger.info('ignoring certificate errors on following domains:', argv.i, Array.isArray(argv.i));
});

