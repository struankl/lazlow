var express = require('express'),
    bodyParser = require('body-parser'),
    logger = require('winston'),
    argv = require('./arguments'),
    fs = require('fs');


var app = express(),
    rules = [],
    plugins = {},
    pluginFiles = fs.readdirSync('./lib/plugins');

pluginFiles.forEach((f) => {
   var plug = new require('./plugins/' + f),
       name = plug.name;
   logger.info('found plugin:', plug, plug.prototype, name + 'hello');
   plugins[name] = './plugins/'+ f;
});

logger.info('plugins:', plugins);

app.use(bodyParser.json());

app.get('/', (req, res) => {
   res.send('hello world');
});

app.get('/rules', (req, res) => {
   res.type('application/json');
   res.send(rules);
});

app.put('/rule', (req, res) => {
   var rule = req.body.rule.name;
   rules.push(rule);
   res.type('application/json').status(201).send({ruleId: Math.floor(Math.random() * 100000)});
});

app.listen(argv.c, () => {
   logger.info('listening for commands on port:', argv.c);
});

module.exports = {
    rules: rules
};