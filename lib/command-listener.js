var express = require('express'),
    bodyParser = require('body-parser'),
    logger = require('winston'),
    argv = require('./arguments'),
    path =require('path'),
    fs = require('fs');


var app = express(),
    rules = [],
    plugins = {},
    pluginFiles = fs.readdirSync(path.resolve(__dirname, 'plugins'));

pluginFiles.forEach(function (f) {
   var plug = new require('./plugins/' + f),
       name = plug.name;
   plugins[f.replace('.js', '')] = plug;
});

logger.info('Available plugins:', Object.keys(plugins));

app.use(bodyParser.json());

app.get('/', function (req, res) {
   res.send('hello world');
});

app.get('/rules', function (req, res) {
   res.type('application/json');
   res.send(rules);
});

app.post('/reset', function(req, res) {
   rules.length = 0;
   res.statusCode = 204;
});

app.put('/rule', function (req, res) {
   var name = req.body.rule.name;
   logger.debug('added new rule:', name, 'with options', req.body.rule.options);
   rules.push(new plugins[name](req.body.rule.options));
   res.type('application/json').status(201).send(rules);
});

app.listen(argv.c, function () {
   logger.info('listening for commands on port:', argv.c);
});

module.exports = {
    rules: rules
};