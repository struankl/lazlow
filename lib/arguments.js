var argv = require('yargs')
    .usage('Laslow - the lazy & slow proxy')
    .options({
        'c': {
            alias: 'command-port',
            description: 'port to listen for commands',
            default: 3000,
            type: 'number'
        },
        'p': {
            alias: 'proxy-port',
            description: 'port to listen for proxy requests',
            default: '3030',
            type: 'number'
        }
    })
    .help('help')
    .argv;

module.exports = argv;