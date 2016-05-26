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
            default: 3030,
            type: 'number'
        },
        'l': {
            alias: 'log',
            description: 'logging level',
            default: 'info',
            choices: ['error', 'info', 'debug']
        },
        'i': {
            alias: 'ignore-cert-errors',
            description: 'ignore ssl cert errors from given host, or \'*\' to ignore on all domains (not recommended)',
            type: 'list'
        }
    })
    .help('help')
    .argv;

if (!argv.i) {
    argv.i = [];
}

if (!Array.isArray(argv.i)) {
    argv.i = [argv.i];
}

module.exports = argv;