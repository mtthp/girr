var winston = require('winston');
var path = require('path');
winston.emitErrs = true;

var logger = new winston.Logger({
    levels: {
        trace: 0,
        debug: 1,
        info: 2,
        warn: 3,
        error: 4,
        critical: 5
    },
    transports: [
        new winston.transports.File({
            name: 'info-file',
            level: 'info',
            filename: path.resolve('logs/info.log'),
            handleExceptions: true,
            json: false,
            maxsize: 5242880, //5MB
            maxFiles: 5,
            colorize: false
        }),
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true
        }),
        new winston.transports.File({
            name: 'error-file',
            level: 'error',
            filename: path.resolve('logs/error.log'),
            handleExceptions: true,
            json: false,
            colorize: false
        }),
    ],
    exitOnError: false
});

module.exports = logger;
// module.exports.stream = {
//     write: function(message, encoding){
//         logger.info(message);
//     }
// }
